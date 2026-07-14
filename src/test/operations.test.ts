import { describe, it, expect } from 'vitest';
import { buildAiPrompt, truncateText } from '../utils/operations';

describe('AI prompt helpers', () => {
  it('truncates oversized prompts while preserving useful context', () => {
    const longPrompt = 'A'.repeat(1200);
    const prompt = buildAiPrompt(longPrompt, { stadiumOccupancy: 82000, incidentSeverity: 'critical' });

    expect(prompt).toContain('stadiumOccupancy');
    expect(prompt).toContain('incidentSeverity');
    expect(prompt.length).toBeLessThan(1400);
  });

  it('keeps short prompts unchanged', () => {
    const prompt = truncateText('Short request', 50);
    expect(prompt).toBe('Short request');
  });
});
