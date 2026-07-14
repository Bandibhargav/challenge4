import '@testing-library/jest-dom';
import { beforeAll, afterEach, vi } from 'vitest';

beforeAll(() => {
  // Mock SpeechSynthesis
  const mockSpeechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn().mockReturnValue([]),
    onvoiceschanged: null,
    paused: false,
    pending: false,
    speaking: false,
  };
  Object.defineProperty(window, 'speechSynthesis', {
    value: mockSpeechSynthesis,
    writable: true,
  });

  // Mock SpeechSynthesisUtterance
  class MockSpeechSynthesisUtterance {
    text: string = '';
    lang: string = '';
    rate: number = 1.0;
    pitch: number = 1.0;
    volume: number = 1.0;
    voice: any = null;
    onend: any = null;
    onerror: any = null;
    constructor(text?: string) {
      this.text = text || '';
    }
  }
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    value: MockSpeechSynthesisUtterance,
    writable: true,
  });

  // Mock ResizeObserver
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  Object.defineProperty(window, 'ResizeObserver', {
    value: MockResizeObserver,
    writable: true,
  });

  // Mock scrollTo
  Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});
