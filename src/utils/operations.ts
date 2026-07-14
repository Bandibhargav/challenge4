import { OFFLINE_AI_ANSWERS } from './stadiumData';

export const sanitizeText = (value: string): string => value.replace(/[<>]/g, '').trim();

export const normalizeChecklist = (value: string): string[] =>
  value
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s+/, '').trim())
    .filter((line) => line.length > 0 && !line.startsWith('#') && !line.startsWith('*'));

export const formatTimeLabel = (date: Date = new Date()): string =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const truncateText = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
};

export const buildAiPrompt = (userPrompt: string, context: Record<string, unknown> = {}): string => {
  const normalizedPrompt = sanitizeText(userPrompt);
  const contextLines = Object.entries(context)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join('\n');

  const promptSections = [
    'You are an operations copilot for a smart stadium.',
    'Use the provided context to tailor your response.',
    contextLines ? `Context:\n${contextLines}` : '',
    `User request:\n${truncateText(normalizedPrompt, 900)}`,
  ].filter(Boolean);

  return truncateText(promptSections.join('\n\n'), 1300);
};

export const getIncidentFallbackChecklist = (title: string, location: string): string[] => {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('crowd') || titleLower.includes('gate')) {
    return normalizeChecklist(OFFLINE_AI_ANSWERS['crowd management checklist']);
  }

  if (titleLower.includes('medical') || titleLower.includes('heat')) {
    return [
      `Clear stretcher pathway to the patient's seat at ${location}.`,
      'Administer immediate cooling wraps, rehydration minerals, and perform primary assessment.',
      'Form escort detail to clear emergency egress doors.',
      'Prepare ambulance transport at Gate South.'
    ];
  }

  return [
    'Establish security perimeter around active sector entry doors.',
    'Redirect non-ticketed incoming streams toward secondary transit plazas.',
    'Inform general command center and standby medical groups.',
    'Broadcast digital stadium guidance updates.'
  ];
};

export const getAiFallbackResponse = (text: string): string => {
  const queryLower = text.toLowerCase();

  if (queryLower.includes('crowd') || queryLower.includes('gate') || queryLower.includes('checklist')) {
    return OFFLINE_AI_ANSWERS['crowd management checklist'];
  }

  if (queryLower.includes('translate') || queryLower.includes('update') || queryLower.includes('spanish')) {
    return OFFLINE_AI_ANSWERS['translate operational update'];
  }

  if (queryLower.includes('evacuate') || queryLower.includes('evacuation') || queryLower.includes('sec-e2')) {
    return OFFLINE_AI_ANSWERS['evacuation protocol'];
  }

  if (queryLower.includes('transit') || queryLower.includes('shuttle') || queryLower.includes('delay')) {
    return OFFLINE_AI_ANSWERS['transit rerouting'];
  }

  return `Command Core AI Fallback: I received your request for "${text}". The server-side Gemini API is currently in safe offline mode.\n\nTry commands containing "crowd", "translate", "evacuation", or "transit" to preview specific system intelligence answers.`;
};
