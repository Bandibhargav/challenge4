/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TransitHub } from '../types';
import { Bus, Train, Route, AlertCircle, Sparkles } from 'lucide-react';

interface TransitTrackerProps {
  hubs: TransitHub[];
}

export const TransitTracker: React.FC<TransitTrackerProps> = ({ hubs }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="aura-transit-tracker">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            <Route className="w-5 h-5 text-sky-400" />
            Smart Transit & Navigation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of incoming train channels, bus shuttles, and highway parking terminals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hubs.map((hub) => (
          <div
            key={hub.id}
            className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between"
            aria-label={`Transit Hub: ${hub.name}, status: ${hub.status}, capacity: ${hub.loadPercentage}%`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${
                  hub.type === 'Metro' ? 'bg-sky-500/10 text-sky-400' : 'bg-indigo-500/10 text-indigo-400'
                }`}>
                  {hub.type === 'Metro' ? <Train className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-normal">{hub.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{hub.type}</p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                hub.status === 'On Time'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {hub.status}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>Terminal Load</span>
                  <span className={`font-mono font-semibold ${hub.loadPercentage > 90 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {hub.loadPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${hub.loadPercentage > 90 ? 'bg-rose-500' : 'bg-sky-400'}`}
                    style={{ width: `${hub.loadPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Frequency:</span>
                <span className="font-semibold text-white">
                  {hub.frequencyMinutes > 0 ? `Every ${hub.frequencyMinutes} mins` : 'Continuous'}
                </span>
              </div>

              {hub.alerts && (
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex gap-2 items-start mt-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 leading-normal">{hub.alerts}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex gap-2.5 items-start mt-6">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-normal">
          <strong>Smart Rerouting Insight:</strong> Diverting Metro Line 2 traffic to Bus Shuttle Hub East resolves current 14-minute peak queue delays instantly.
        </p>
      </div>
    </div>
  );
};
