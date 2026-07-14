/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Clock, Users, Activity, ShieldAlert, Route } from 'lucide-react';

interface AuraHeaderProps {
  totalOccupancy: number;
  activeAlerts: number;
  dispatchedTeams: number;
  transitDelayCount: number;
}

export const AuraHeader: React.FC<AuraHeaderProps> = ({
  totalOccupancy,
  activeAlerts,
  dispatchedTeams,
  transitDelayCount,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 py-5 px-6 shadow-md shrink-0" id="aura-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo and branding */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl shadow-lg shadow-indigo-600/20 text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white font-sans flex items-center gap-2">
              AURA <span className="text-xs font-mono font-bold bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-md uppercase">Operations Hub</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              FIFA World Cup 2026 Smart Venue Command & Analytics Center
            </p>
          </div>
        </div>

        {/* Local & UTC Clocks */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800/80">
          <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="flex gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Venue Time</span>
              <span className="text-slate-200 font-bold">{timeStr || '20:59:42'}</span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-500 text-[10px] uppercase block">Tournament Day</span>
              <span className="text-slate-200 font-bold">MATCHDAY 12</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* KPI 1 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Stadium Occupancy</span>
            <p className="text-lg font-extrabold text-slate-100 mt-0.5">{totalOccupancy.toLocaleString()}</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Active Incidents</span>
            <p className="text-lg font-extrabold text-slate-100 mt-0.5">{activeAlerts}</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Dispatched Teams</span>
            <p className="text-lg font-extrabold text-slate-100 mt-0.5">{dispatchedTeams}</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Transit Delays</span>
            <p className="text-lg font-extrabold text-slate-100 mt-0.5">{transitDelayCount}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
