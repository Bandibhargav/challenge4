import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 1MB limit for safety
app.use(express.json({ limit: '1mb' }));

// Lazy initializer for GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY environment variable is not configured in Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Endpoint for secure Gemini content generation
app.post('/api/gemini/generate', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { prompt, context } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'A valid text prompt is required.' });
      return;
    }

    const ai = getGeminiClient();
    const systemInstruction = `
      You are AURA AI (Intelligent Stadium Operations Assistant for FIFA World Cup 2026).
      Your role is to assist venue commanders, staff, and safety leads with smart, structured, and action-oriented intelligence.
      Be precise, highly professional, and adhere to official stadium operations protocols.
      Provide answers in clear Markdown format, emphasizing checklists, safety steps, or translation options where appropriate.
    `;

    const contents = context 
      ? `Operational Context: ${JSON.stringify(context)}\n\nQuery: ${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || 'Unable to generate response.';
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Grounding Source',
      uri: chunk.web?.uri || '',
    })) || [];

    res.status(200).json({ text, sources });
  } catch (error: any) {
    console.error('Gemini Generation Error:', error);
    // Secure error handling - do not leak stack trace
    res.status(500).json({ 
      error: 'An operational intelligence service error occurred.', 
      details: error.message || 'Unknown error'
    });
  }
});

// Mount Vite in dev, static assets in production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting in development mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Starting in production mode...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURA Operations Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to initialize server:', err);
});
