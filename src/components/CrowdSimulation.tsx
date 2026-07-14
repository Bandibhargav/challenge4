/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useState, useMemo } from 'react';
import { Users, AlertTriangle, TrendingUp, Zap, Clock } from 'lucide-react';

interface CrowdSimulationProps {
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  crowdArrivalRate: number; // 0 to 100
  setCrowdArrivalRate: (rate: number) => void;
}

export const CrowdSimulation = memo<CrowdSimulationProps>(({ 
  simulationSpeed,
  setSimulationSpeed,
  crowdArrivalRate,
  setCrowdArrivalRate,
}) => {
  const [simulationMode, setSimulationMode] = useState<'PreMatch' | 'Halftime' | 'Exit'>('PreMatch');

  const simulationMetrics = useMemo(() => {
    const baseline = crowdArrivalRate * 1.5;
    switch (simulationMode) {
      case 'PreMatch':
        return {
          avgQueueTime: Math.max(2, Math.round(baseline * 0.35)),
          peakGate: 'Gate G (East)',
          predictedSaturationMin: Math.max(5, 75 - Math.round(simulationSpeed * 5)),
          status: 'Heavy Arrival Flow',
          riskLevel: baseline > 110 ? 'High' : 'Normal',
        };
      case 'Halftime':
        return {
          avgQueueTime: Math.max(1, Math.round(baseline * 0.15)),
          peakGate: 'Concourse Tier 2',
          predictedSaturationMin: 15,
          status: 'Internal Concourse Rush',
          riskLevel: 'Normal',
        };
      case 'Exit':
        return {
          avgQueueTime: Math.max(1, Math.round(baseline * 0.1)),
          peakGate: 'Gate A (North)',
          predictedSaturationMin: 40,
          status: 'Dispersal Phase Active',
          riskLevel: baseline > 120 ? 'Critical' : 'Medium',
        };
    }
  }, [simulationMode, crowdArrivalRate, simulationSpeed]);

  // Generates coordinate points for an accessible SVG flow line chart
  const lineChartPoints = useMemo(() => {
    const baseValues = [10, 25, 42, 60, 85, 95, 70, 40];
    const modifier = crowdArrivalRate / 50;
    return baseValues.map((val, idx) => {
      const x = 30 + idx * 50;
      const y = 140 - (val * modifier * 1.1);
      return { x, y };
    }).filter(p => !isNaN(p.y));
  }, [crowdArrivalRate]);

  const svgPathD = useMemo(() => {
    if (lineChartPoints.length === 0) return '';
    return lineChartPoints.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
    }, '');
  }, [lineChartPoints]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="aura-crowd-simulation">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Predictive Crowd Simulation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate crowd patterns, monitor gate bottle-necks, and preview egress efficiency.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800" role="tablist" aria-label="Simulation Scenario selection">
          {(['PreMatch', 'Halftime', 'Exit'] as const).map((mode) => (
            <button
              key={mode}
              role="tab"
              aria-selected={simulationMode === mode}
              aria-controls="simulation-scenario-panel"
              id={`tab-sim-${mode}`}
              onClick={() => setSimulationMode(mode)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition duration-150 cursor-pointer ${
                simulationMode === mode
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'PreMatch' ? 'Pre-Match' : mode === 'Halftime' ? 'Halftime' : 'Egress/Exit'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8" id="simulation-scenario-panel">
        {/* Simulator Controls */}
        <div className="md:col-span-5 space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Simulation Parameters
          </h3>

          {/* Crowd Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="input-arrival-rate" className="text-slate-300 font-medium">Arrival / Inflow Rate</label>
              <span className="font-mono text-indigo-400 font-bold">{crowdArrivalRate}%</span>
            </div>
            <input
              type="range"
              id="input-arrival-rate"
              min="10"
              max="100"
              value={crowdArrivalRate}
              onChange={(e) => setCrowdArrivalRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
              aria-valuemin={10}
              aria-valuemax={100}
              aria-valuenow={crowdArrivalRate}
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Light (10%)</span>
              <span>Full Capacity (100%)</span>
            </div>
          </div>

          {/* Speed Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="input-sim-speed" className="text-slate-300 font-medium">Calculation Speed</label>
              <span className="font-mono text-indigo-400 font-bold">{simulationSpeed}x</span>
            </div>
            <input
              type="range"
              id="input-sim-speed"
              min="1"
              max="5"
              step="1"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
              aria-valuemin={1}
              aria-valuemax={5}
              aria-valuenow={simulationSpeed}
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Real-time (1x)</span>
              <span>Hyper-predict (5x)</span>
            </div>
          </div>

          {/* Simulation status metrics */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">Current Phase:</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {simulationMetrics.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Est. Gate Wait Time</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                ~{simulationMetrics.avgQueueTime} mins
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Peak Congestion gate</span>
              </div>
              <span className="text-sm font-bold text-white">
                {simulationMetrics.peakGate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full Stadium Saturation</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {simulationMetrics.predictedSaturationMin} mins
              </span>
            </div>
          </div>
        </div>

        {/* Simulator Live SVG Chart */}
        <div className="md:col-span-7 flex flex-col justify-between bg-slate-950 rounded-xl p-5 border border-slate-800/60 relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Inflow Prediction Curve (8-Hour Window)
              </h4>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                simulationMetrics.riskLevel === 'Critical' || simulationMetrics.riskLevel === 'High'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}>
                {simulationMetrics.riskLevel === 'Critical' ? 'Critical Load Risk' : simulationMetrics.riskLevel === 'High' ? 'Heavy Load Alert' : 'System Safe'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Dynamic forecasting adapts instantly as crowd inflow and simulation speed change.
            </p>

            {/* Simple Accessible SVG Line Chart */}
            <div className="relative w-full h-[160px] flex items-center justify-center">
              {svgPathD ? (
                <svg className="w-full h-full" viewBox="0 0 400 160" role="img" aria-label="Line chart showing predicted crowd inflow volumes over a 6 hour window.">
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="380" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="30" y1="60" x2="380" y2="60" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="30" y1="100" x2="380" y2="100" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="30" y1="140" x2="380" y2="140" stroke="#334155" strokeWidth="1.5" />

                  {/* Flow curve line */}
                  <path
                    d={svgPathD}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* Interactive Nodes */}
                  {lineChartPoints.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      className="fill-indigo-400 stroke-slate-950 stroke-2 transition-all duration-300"
                    />
                  ))}

                  {/* X Axis Labels */}
                  <text x="30" y="155" fill="#64748b" className="text-[10px] font-mono" textAnchor="middle">H-4</text>
                  <text x="130" y="155" fill="#64748b" className="text-[10px] font-mono" textAnchor="middle">Kickoff</text>
                  <text x="230" y="155" fill="#64748b" className="text-[10px] font-mono" textAnchor="middle">Halftime</text>
                  <text x="330" y="155" fill="#64748b" className="text-[10px] font-mono" textAnchor="middle">Egress</text>
                </svg>
              ) : (
                <span className="text-slate-500 text-xs">No active projection curve.</span>
              )}
            </div>
          </div>

          {/* Screen Reader Screen Reader Accessible Table */}
          <div className="sr-only">
            <table>
              <caption>Predicted crowd flow volumes by hour</caption>
              <thead>
                <tr>
                  <th scope="col">Time Window</th>
                  <th scope="col">Relative Flow Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>H-4</td><td>10%</td></tr>
                <tr><td>H-2</td><td>25%</td></tr>
                <tr><td>H-1 (Arrival Peak)</td><td>{Math.round(crowdArrivalRate * 0.8)}%</td></tr>
                <tr><td>Kickoff</td><td>95%</td></tr>
                <tr><td>Halftime</td><td>{Math.round(crowdArrivalRate * 0.7)}%</td></tr>
                <tr><td>Egress</td><td>{Math.round(crowdArrivalRate * 0.4)}%</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex gap-2.5 items-start mt-4">
            <AlertTriangle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>Smart Prediction Node:</strong> Peak gate entry congestion is projected to clear 14 minutes earlier under coordinated redirection flows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
