/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useState } from 'react';
import { StadiumSector, SectorStatus } from '../types';
import { Shield, Thermometer, Users, LogIn, AlertCircle, RefreshCw } from 'lucide-react';

interface DigitalTwinProps {
  sectors: StadiumSector[];
  onSelectSector: (sector: StadiumSector) => void;
  selectedSector: StadiumSector | null;
  onRefreshMetrics: () => void;
}

export const DigitalTwin = memo<DigitalTwinProps>(({ 
  sectors,
  onSelectSector,
  selectedSector,
  onRefreshMetrics,
}) => {
  const [hoveredSector, setHoveredSector] = useState<StadiumSector | null>(null);

  const getStatusColor = (status: SectorStatus) => {
    switch (status) {
      case SectorStatus.NORMAL:
        return 'fill-emerald-500/20 stroke-emerald-400 hover:fill-emerald-500/30';
      case SectorStatus.WARNING:
        return 'fill-amber-500/30 stroke-amber-400 hover:fill-amber-500/45';
      case SectorStatus.CRITICAL:
        return 'fill-rose-500/40 stroke-rose-400 hover:fill-rose-500/55';
    }
  };

  const getStatusBadge = (status: SectorStatus) => {
    switch (status) {
      case SectorStatus.NORMAL:
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Normal</span>;
      case SectorStatus.WARNING:
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Warning</span>;
      case SectorStatus.CRITICAL:
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Critical</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden" id="aura-digital-twin">
      {/* Visual Decoration Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-white font-sans">
              Stadium Digital Twin
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-dimensional spatial visualization and sector telemetry.
          </p>
        </div>
        <button
          onClick={onRefreshMetrics}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-emerald-400 border border-slate-700/50 text-xs font-medium transition duration-150 cursor-pointer"
          aria-label="Refresh telemetry metrics"
          id="btn-refresh-twin"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Telemetry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive SVG Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 rounded-xl p-4 border border-slate-800/60 relative min-h-[340px]">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 select-none uppercase tracking-widest">
            Spatial Radar Vector
          </span>

          {/* Stadium Pitch Center Marker */}
          <div className="absolute w-36 h-24 border border-slate-800/40 rounded bg-slate-900/10 flex items-center justify-center select-none pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest text-slate-600 uppercase">
              Azteca Pitch
            </span>
          </div>

          <svg
            viewBox="0 0 500 360"
            className="w-full max-w-[420px] h-auto drop-shadow-2xl"
            role="img"
            aria-label="Stadium interactive map overview. Select sectors to analyze telemetry."
          >
            <g>
              {sectors.map((sec) => {
                const isSelected = selectedSector?.id === sec.id;
                const isHovered = hoveredSector?.id === sec.id;
                return (
                  <path
                    key={sec.id}
                    d={sec.coordinates}
                    className={`transition-all duration-200 cursor-pointer stroke-2 ${getStatusColor(sec.status)} ${
                      isSelected ? 'stroke-white fill-slate-700/40' : 'stroke-slate-800'
                    }`}
                    onClick={() => onSelectSector(sec)}
                    onMouseEnter={() => setHoveredSector(sec)}
                    onMouseLeave={() => setHoveredSector(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Sector ${sec.name}, occupancy ${sec.currentOccupancy} of ${sec.capacity} seats, Status ${sec.status}`}
                    aria-pressed={isSelected}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectSector(sec);
                      }
                    }}
                  />
                );
              })}
            </g>
          </svg>

          {/* Interactive Tooltip Overlay */}
          {(hoveredSector || selectedSector) && (
            <div className="absolute bottom-3 right-3 bg-slate-900/95 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 shadow-xl max-w-[200px] pointer-events-none animate-fade-in backdrop-blur-md">
              <p className="font-semibold text-white truncate">{(hoveredSector || selectedSector)?.name}</p>
              <div className="flex items-center gap-1 text-slate-400 mt-1">
                <Users className="w-3 h-3 text-slate-500" />
                <span>{((hoveredSector || selectedSector)?.currentOccupancy || 0).toLocaleString()} pax</span>
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Panel details */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 font-mono">
              Telemetry Detail
            </h3>

            {selectedSector ? (
              <div className="space-y-4 animate-fade-in" id="sector-telemetry-detail">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">{selectedSector.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">ID: {selectedSector.id}</p>
              <p className="text-[11px] text-slate-500 mt-1">Live sector insight with proactive crowd balancing guidance.</p>
                  </div>
                  {getStatusBadge(selectedSector.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span>Occupancy</span>
                    </div>
                    <p className="text-base font-bold text-white">
                      {selectedSector.currentOccupancy.toLocaleString()}
                    </p>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-sky-400 rounded-full"
                        style={{ width: `${(selectedSector.currentOccupancy / selectedSector.capacity) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {Math.round((selectedSector.currentOccupancy / selectedSector.capacity) * 100)}% capacity
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Heat Signature</span>
                    </div>
                    <p className="text-base font-bold text-white">{selectedSector.temperature}°C</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Safe operating range</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Gate Influx Flow</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                        Active Scanner
                      </span>
                    </div>
                    <p className="text-base font-bold text-white">
                      {selectedSector.gateFlowRate} <span className="text-xs font-normal text-slate-400">fans/min</span>
                    </p>
                  </div>
                </div>

                {selectedSector.status !== SectorStatus.NORMAL && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-2.5 items-start mt-4">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-300">Operational Alert</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        High flow rates detected. Check crowd pressure levels and dispatch crowd units at Gate {selectedSector.id.charAt(selectedSector.id.length - 1)}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950 text-slate-500">
                <Shield className="w-8 h-8 stroke-1 text-slate-600 mb-2" />
                <p className="text-xs text-center px-6">
                  Select a sector from the 2D spatial layout to examine active stream telemetry.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sensor Health Status</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Nodes Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
