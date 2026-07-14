/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Incident, IncidentSeverity, IncidentStatus } from '../types';
import { AlertCircle, Plus, Send, ShieldAlert, CheckSquare, Sparkles, Loader } from 'lucide-react';

interface EmergencyAlertsProps {
  incidents: Incident[];
  onAddIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
  onUpdateIncidentStatus: (id: string, status: IncidentStatus) => void;
  onGenerateAiChecklist: (id: string) => Promise<void>;
  generatingChecklistId: string | null;
}

export const EmergencyAlerts: React.FC<EmergencyAlertsProps> = ({
  incidents,
  onAddIncident,
  onUpdateIncidentStatus,
  onGenerateAiChecklist,
  generatingChecklistId,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // New incident form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>(IncidentSeverity.LOW);
  const [description, setDescription] = useState('');
  const [assignedUnit, setAssignedUnit] = useState('');
  const [formError, setFormError] = useState('');
  const [submissionNotice, setSubmissionNotice] = useState('');

  const activeIncident = incidents.find((inc) => inc.id === selectedIncidentId);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmissionNotice('');

    // Input Validation & XSS Prevention / Sanitization
    if (!title.trim() || !location.trim() || !description.trim()) {
      setFormError('All fields (except assigned unit) are required.');
      return;
    }

    if (title.length > 80 || location.length > 80) {
      setFormError('Fields exceeded maximum safe character limits.');
      return;
    }

    // Sanitize basic tags/injection
    const sanitizedTitle = title.replace(/[<>]/g, '');
    const sanitizedLocation = location.replace(/[<>]/g, '');
    const sanitizedDescription = description.replace(/[<>]/g, '');
    const sanitizedUnit = assignedUnit.replace(/[<>]/g, '');

    onAddIncident({
      title: sanitizedTitle,
      location: sanitizedLocation,
      severity,
      status: IncidentStatus.REPORTED,
      description: sanitizedDescription,
      assignedUnit: sanitizedUnit || undefined,
    });

    // Reset Form
    setTitle('');
    setLocation('');
    setSeverity(IncidentSeverity.LOW);
    setDescription('');
    setAssignedUnit('');
    setShowAddForm(false);
    setSubmissionNotice('Incident logged successfully and added to the operations queue.');
  };

  const getSeverityStyle = (sev: IncidentSeverity) => {
    switch (sev) {
      case IncidentSeverity.LOW:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case IncidentSeverity.MEDIUM:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case IncidentSeverity.HIGH:
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case IncidentSeverity.CRITICAL:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="aura-emergency-alerts">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Crisis & Incident Command
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch security details, manage emergency logs, and formulate AI-driven mitigation steps.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 text-xs font-semibold shadow transition duration-150 cursor-pointer"
          aria-expanded={showAddForm}
          id="btn-report-incident"
        >
          <Plus className="w-4 h-4" />
          <span>Report Incident</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Incident List */}
        <div className="lg:col-span-5 space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {incidents.length === 0 ? (
            <p className="text-slate-500 text-xs py-4 text-center">No active operational incidents logged.</p>
          ) : (
            incidents.map((inc) => {
              const isSelected = selectedIncidentId === inc.id;
              return (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-slate-800/80 border-slate-700 shadow-md'
                      : 'bg-slate-950 border-slate-900 hover:border-slate-800'
                  }`}
                  aria-label={`Incident: ${inc.title}, Severity: ${inc.severity}, Status: ${inc.status}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono text-slate-500">{inc.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSeverityStyle(inc.severity)}`}>
                      {inc.severity}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white truncate">{inc.title}</h3>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{inc.location}</p>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-slate-500 font-mono">
                      {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`font-semibold ${inc.status === IncidentStatus.RESOLVED ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {inc.status}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Incident Details / Add Form */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl p-5 border border-slate-800/60 min-h-[300px]">
          {showAddForm ? (
            <form onSubmit={handleFormSubmit} className="space-y-4 animate-fade-in" id="add-incident-form">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-400" />
                Report New Incident Log
              </h3>

              {formError && (
                <p className="p-2.5 rounded text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {formError}
                </p>
              )}

              {submissionNotice && (
                <p className="p-2.5 rounded text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" role="status">
                  {submissionNotice}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label htmlFor="inc-title" className="block text-xs font-medium text-slate-400 mb-1">Incident Title</label>
                  <input
                    type="text"
                    id="inc-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Broken barrier at Sector S1"
                    maxLength={80}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-500 focus-visible:ring-1 focus-visible:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="inc-loc" className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    id="inc-loc"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Sector S1 lower stand"
                    maxLength={80}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-500 focus-visible:ring-1 focus-visible:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="inc-sev" className="block text-xs font-medium text-slate-400 mb-1">Severity</label>
                  <select
                    id="inc-sev"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus-visible:ring-1 focus-visible:ring-indigo-500"
                  >
                    <option value={IncidentSeverity.LOW}>Low</option>
                    <option value={IncidentSeverity.MEDIUM}>Medium</option>
                    <option value={IncidentSeverity.HIGH}>High</option>
                    <option value={IncidentSeverity.CRITICAL}>Critical</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label htmlFor="inc-unit" className="block text-xs font-medium text-slate-400 mb-1">Assign Security Team</label>
                  <input
                    type="text"
                    id="inc-unit"
                    value={assignedUnit}
                    onChange={(e) => setAssignedUnit(e.target.value)}
                    placeholder="e.g. Emergency Response Unit Alpha"
                    maxLength={80}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-500 focus-visible:ring-1 focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="inc-desc" className="block text-xs font-medium text-slate-400 mb-1">Full Incident Description</label>
                  <textarea
                    id="inc-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide exact operational specifics..."
                    rows={3}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-500 focus-visible:ring-1 focus-visible:ring-indigo-500 resize-none"
                    required
                  />
                </div>
              </div>

              {formError && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-[11px] text-emerald-300" role="status">
                  Incident logged successfully. Review it in the incident queue.
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Log</span>
                </button>
              </div>
            </form>
          ) : activeIncident ? (
            <div className="space-y-5 animate-fade-in" id="incident-detail-panel">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">{activeIncident.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <span>Location:</span>
                    <strong className="text-slate-200">{activeIncident.location}</strong>
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getSeverityStyle(activeIncident.severity)}`}>
                  {activeIncident.severity}
                </span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">Incident Details</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    {activeIncident.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">Operational Unit</h4>
                    <p className="text-xs text-slate-300 mt-1 font-semibold">
                      {activeIncident.assignedUnit || 'No security squad assigned yet.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">Assigned Status</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <select
                        value={activeIncident.status}
                        onChange={(e) => onUpdateIncidentStatus(activeIncident.id, e.target.value as IncidentStatus)}
                        className="text-xs bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-amber-400 font-semibold focus-visible:ring-1 focus-visible:ring-indigo-500"
                        aria-label={`Update status for ${activeIncident.id}`}
                      >
                        <option value={IncidentStatus.REPORTED}>Reported</option>
                        <option value={IncidentStatus.DISPATCHED}>Dispatched</option>
                        <option value={IncidentStatus.ON_SCENE}>On Scene</option>
                        <option value={IncidentStatus.RESOLVED}>Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* AI Resolution Checklist Integration */}
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                      AI Remediation Checklist
                    </h4>

                    <button
                      onClick={() => onGenerateAiChecklist(activeIncident.id)}
                      disabled={generatingChecklistId === activeIncident.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-semibold border border-indigo-500/20 transition duration-150 disabled:opacity-50 cursor-pointer"
                      id={`btn-ai-checklist-${activeIncident.id}`}
                    >
                      {generatingChecklistId === activeIncident.id ? (
                        <>
                          <Loader className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate Checklist</span>
                        </>
                      )}
                    </button>
                  </div>

                  {activeIncident.aiChecklist ? (
                    <ul className="space-y-2 font-sans bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-4 animate-fade-in text-xs text-slate-300">
                      {activeIncident.aiChecklist.map((item, index) => (
                        <li key={index} className="flex gap-2.5 items-start">
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[9px] shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="leading-normal">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic bg-slate-900/40 p-3.5 rounded-lg border border-slate-800/80 text-center">
                      No mitigation instructions drafted yet. Use Gemini to draft an actionable security sequence.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <ShieldAlert className="w-10 h-10 stroke-1 text-slate-600 mb-2" />
              <p className="text-xs">Select an active emergency ticket to examine incident telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
