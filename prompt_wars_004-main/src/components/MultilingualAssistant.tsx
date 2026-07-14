/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SAMPLE_PROMPTS, OFFLINE_AI_ANSWERS } from '../utils/stadiumData';
import { Bot, Send, Sparkles, Globe, RefreshCw, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

interface MultilingualAssistantProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isGenerating: boolean;
}

export const MultilingualAssistant: React.FC<MultilingualAssistantProps> = ({
  messages,
  onSendMessage,
  isGenerating,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current && typeof chatEndRef.current.scrollIntoView === 'function') {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputText.trim();
    if (!trimmedInput || isGenerating) return;
    onSendMessage(trimmedInput);
    setInputText('');
  };

  const handlePresetClick = (prompt: string) => {
    if (isGenerating) return;
    onSendMessage(prompt);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[520px]" id="aura-ai-assistant">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
              AURA Operations AI
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full font-mono font-medium">
                <ShieldCheck className="w-3 h-3" />
                Secure API Proxy
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Multilingual operational assistant with search grounding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">FIFA-GPT v3.5</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[220px]" role="log" aria-label="AURA AI Assistant Message Log" aria-live="polite">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <Bot className="w-10 h-10 stroke-1 text-slate-500 mb-2 animate-bounce" />
            <h3 className="text-xs font-semibold text-slate-300">AURA Command Core</h3>
            <p className="text-[11px] text-slate-500 max-w-[220px] mt-1">
              Ask any operational query. Try a preset below to test.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                  isAI
                    ? 'bg-slate-950 border border-slate-800/80 text-slate-200'
                    : 'bg-indigo-600 text-white'
                }`}>
                  <div className="font-semibold text-[10px] opacity-75 mb-1 flex items-center justify-between">
                    <span>{isAI ? 'AURA Assistant' : 'HQ Commander'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line font-sans prose prose-invert prose-xs">
                    {msg.text}
                  </div>

                  {/* Grounding Citations */}
                  {isAI && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3.5 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1.5 font-mono">
                        <FileText className="w-3 h-3 text-indigo-400" />
                        <span>Grounding Citations:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] text-indigo-300 transition"
                          >
                            <span className="truncate max-w-[110px]">{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isGenerating && (
          <div className="flex gap-3 mr-auto max-w-[80%] animate-pulse">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <Bot className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Analyzing stadium telemetry...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Preset Chip Buttons */}
      {messages.length === 0 && (
        <div className="shrink-0 pt-4 border-t border-slate-800/60 mt-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Command Actions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(prompt)}
                disabled={isGenerating}
                className="text-[10px] font-semibold bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60 text-slate-300 px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="shrink-0 mt-4 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AURA for checklists, translation briefs..."
          disabled={isGenerating}
          maxLength={300}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:opacity-50"
          aria-label="Ask operations assistant"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isGenerating}
          className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition cursor-pointer"
          aria-label="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
