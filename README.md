# AURA Operations Hub

AURA is an AI-assisted smart stadium operations command center designed for tournament venues, crowd safety, and rapid incident response. It combines live telemetry, crisis management workflows, multilingual support, transit tracking, and accessibility-first controls in a single dashboard.

## What this app does
- Live stadium occupancy and sector health monitoring
- Incident creation and status updates for crisis response
- AI-generated response checklists using Gemini-backed intelligence
- Multilingual assistant support for operators and guests
- Accessibility features including high contrast, screen-reader support, and voice-command simulation

## Tech stack
- React + TypeScript
- Vite
- Express backend
- Gemini API integration
- Tailwind CSS

## Run locally

Prerequisites:
- Node.js 18+

Steps:
1. Install dependencies:
   `npm install`
2. Create a `.env.local` file and set your Gemini API key:
   `GEMINI_API_KEY=your_key_here`
3. Start the app:
   `npm run dev`
4. Open the local URL shown in the terminal.

## Project structure
- `src/App.tsx` — main dashboard experience
- `src/components/` — modular control panels for operations, transit, accessibility, and AI assistance
- `src/utils/` — formatting helpers and fallback logic
- `server.ts` — Express server with Gemini proxy endpoint

## Notes
- If the API key is not configured, the app uses offline fallback responses so the experience remains usable.
