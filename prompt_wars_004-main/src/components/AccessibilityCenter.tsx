/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, Type, Volume2, Mic, CheckCircle, VolumeX } from 'lucide-react';

interface AccessibilityCenterProps {
  fontSize: 'normal' | 'large' | 'huge';
  setFontSize: (size: 'normal' | 'large' | 'huge') => void;
  highContrast: boolean;
  setHighContrast: (active: boolean) => void;
  screenReaderActive: boolean;
  setScreenReaderActive: (active: boolean) => void;
  onVoiceCommandReceived: (command: string) => void;
}

export const AccessibilityCenter: React.FC<AccessibilityCenterProps> = ({
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  screenReaderActive,
  setScreenReaderActive,
  onVoiceCommandReceived,
}) => {
  const [speechActive, setSpeechActive] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [ttsActive, setTtsActive] = useState(false);

  // Text-To-Speech reader
  const handleReadScreen = () => {
    if ('speechSynthesis' in window) {
      if (ttsActive) {
        window.speechSynthesis.cancel();
        setTtsActive(false);
        return;
      }

      const textToRead = `AURA Operations Hub Dashboard Overview. Font size is ${fontSize}. High contrast mode is ${
        highContrast ? 'Active' : 'Inactive'
      }. The stadium comprises multiple sectors. East Sector Grandstand has critical gate flow occupancy. Screen reader mode is ${
        screenReaderActive ? 'Active' : 'Inactive'
      }.`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setTtsActive(false);
      utterance.onerror = () => setTtsActive(false);
      
      setTtsActive(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Simulated Voice Command Speech-To-Text (safe, offline-ready fallback)
  const handleSimulateVoiceInput = () => {
    setSpeechActive(true);
    const commands = [
      'Show east gate crowding checklist',
      'Check azteca metro station delays',
      'Evacuation protocol for sector E2',
      'Translate operational update'
    ];
    const randomCommand = commands[Math.floor(Math.random() * commands.length)];
    
    setTimeout(() => {
      setVoiceText(randomCommand);
    }, 1200);

    setTimeout(() => {
      onVoiceCommandReceived(randomCommand);
      setSpeechActive(false);
      setVoiceText('');
    }, 2800);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="aura-accessibility-hub">
      <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-3">
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-sans">
            Universal Accessibility & Inclusivity Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure system rendering preferences and assistive operational technologies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Visual Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <Type className="w-4 h-4 text-emerald-400" />
            Visual & Text Sizing
          </h3>

          <div className="space-y-3">
            <div>
              <span className="block text-xs font-medium text-slate-300 mb-1.5">Text Scale Factor</span>
              <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['normal', 'large', 'huge'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFontSize(size)}
                    className={`py-1 text-xs font-semibold rounded transition duration-150 capitalize cursor-pointer ${
                      fontSize === size ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    aria-label={`Set text scale to ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label htmlFor="chk-high-contrast" className="text-xs font-medium text-slate-300">
                Stark High Contrast Mode
              </label>
              <input
                type="checkbox"
                id="chk-high-contrast"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <label htmlFor="chk-screen-reader" className="text-xs font-medium text-slate-300">
                Text-Only Screen Reader View
              </label>
              <input
                type="checkbox"
                id="chk-screen-reader"
                checked={screenReaderActive}
                onChange={(e) => setScreenReaderActive(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Audio Assistance (TTS) */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            Audio Synthesis (TTS)
          </h3>

          <div className="space-y-3.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-[11px] text-slate-400 leading-normal">
              Convert the current active dashboard state, alerts, and operational briefings into speech audio.
            </p>

            <button
              onClick={handleReadScreen}
              className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition duration-150 border cursor-pointer ${
                ttsActive
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border-emerald-500/20'
              }`}
              aria-label={ttsActive ? 'Stop Reading Screen' : 'Read Screen aloud'}
              id="btn-tts-speak"
            >
              {ttsActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{ttsActive ? 'Stop Synthesis' : 'Read Screen Aloud'}</span>
            </button>
          </div>
        </div>

        {/* Speech-To-Text Simulation */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-emerald-400" />
            Voice Command Interface (STT)
          </h3>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[110px]">
            {speechActive ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2 animate-pulse">
                <div className="flex gap-1.5 items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <p className="text-[11px] text-emerald-400 font-mono truncate max-w-full">
                  {voiceText || 'Listening for tactical order...'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400 leading-normal">
                  Dispatch teams or prompt AI hands-free using voice command simulation.
                </p>
                <button
                  type="button"
                  onClick={handleSimulateVoiceInput}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold transition duration-150 cursor-pointer"
                  aria-label="Simulate microphone voice input"
                  id="btn-voice-stt"
                >
                  <Mic className="w-4 h-4" />
                  <span>Simulate Voice Order</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
