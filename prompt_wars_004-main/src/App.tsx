/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { AuraHeader } from './components/AuraHeader';
import { DigitalTwin } from './components/DigitalTwin';
import { CrowdSimulation } from './components/CrowdSimulation';
import { EmergencyAlerts } from './components/EmergencyAlerts';
import { TransitTracker } from './components/TransitTracker';
import { MultilingualAssistant } from './components/MultilingualAssistant';
import { AccessibilityCenter } from './components/AccessibilityCenter';
import { StadiumSector, Incident, IncidentStatus, TransitHub, ChatMessage } from './types';
import { INITIAL_SECTORS, INITIAL_INCIDENTS, TRANSIT_HUBS } from './utils/stadiumData';
import { normalizeChecklist, formatTimeLabel, getIncidentFallbackChecklist, getAiFallbackResponse } from './utils/operations';
import { LayoutGrid, Bot, ShieldAlert, Route, Eye } from 'lucide-react';

export default function App() {
  // Primary States
  const [sectors, setSectors] = useState<StadiumSector[]>(INITIAL_SECTORS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [transitHubs, setTransitHubs] = useState<TransitHub[]>(TRANSIT_HUBS);
  const [selectedSector, setSelectedSector] = useState<StadiumSector | null>(INITIAL_SECTORS[0]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Simulation Controls
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [crowdArrivalRate, setCrowdArrivalRate] = useState<number>(65);

  // Accessibility States
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [screenReaderActive, setScreenReaderActive] = useState<boolean>(false);

  // AI Generation States
  const [isGeneratingChecklistId, setIsGeneratingChecklistId] = useState<string | null>(null);
  const [isGeneratingChat, setIsGeneratingChat] = useState<boolean>(false);

  // Layout Tab selection
  const [activeTab, setActiveTab] = useState<'CommandGrid' | 'Assistant' | 'Crisis' | 'Transit'>('CommandGrid');

  // Multipliers based on crowd arrival rate simulation
  const computedTotalOccupancy = useMemo(() => {
    return sectors.reduce((acc, sec) => {
      const scale = crowdArrivalRate / 100;
      const computedVal = Math.min(sec.capacity, Math.round(sec.capacity * scale));
      return acc + computedVal;
    }, 0);
  }, [sectors, crowdArrivalRate]);

  const activeAlertsCount = useMemo(() => {
    return incidents.filter((inc) => inc.status !== IncidentStatus.RESOLVED).length;
  }, [incidents]);

  const dispatchedTeamsCount = useMemo(() => {
    return incidents.filter((inc) => inc.status === IncidentStatus.DISPATCHED || inc.status === IncidentStatus.ON_SCENE).length;
  }, [incidents]);

  const transitDelayCount = useMemo(() => {
    return transitHubs.filter((hub) => hub.status !== 'On Time').length;
  }, [transitHubs]);

  // Sync Telemetry metrics action
  const handleRefreshTelemetry = () => {
    let nextSectors: StadiumSector[] = [];

    setSectors((prev) => {
      nextSectors = prev.map((sec) => {
        const delta = Math.round((Math.random() - 0.5) * 150);
        const nextOcc = Math.max(0, Math.min(sec.capacity, sec.currentOccupancy + delta));
        const nextTemp = Number((sec.temperature + (Math.random() - 0.5) * 0.8).toFixed(1));
        const nextFlow = Math.max(10, sec.gateFlowRate + Math.round((Math.random() - 0.5) * 20));
        return {
          ...sec,
          currentOccupancy: nextOcc,
          temperature: nextTemp,
          gateFlowRate: nextFlow,
        };
      });
      return nextSectors;
    });

    if (selectedSector) {
      const updated = nextSectors.find((s) => s.id === selectedSector.id);
      if (updated) {
        setSelectedSector(updated);
      }
    }
  };

  // Add new incident
  const handleAddIncident = (newInc: Omit<Incident, 'id' | 'timestamp'>) => {
    const id = `INC-${100 + incidents.length + 1}`;
    const timestamp = new Date().toISOString();
    setIncidents((prev) => [
      {
        ...newInc,
        id,
        timestamp,
      },
      ...prev,
    ]);
  };

  // Update status
  const handleUpdateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
    );
  };

  // Trigger Gemini API to generate mitigation steps
  const handleGenerateAiChecklist = async (id: string) => {
    setIsGeneratingChecklistId(id);
    const incident = incidents.find((inc) => inc.id === id);
    if (!incident) return;

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate an actionable crowd control and stadium operations safety checklist for this incident: ${incident.title}. Description: ${incident.description}. Location: ${incident.location}. Keep steps highly specific.`,
          context: { stadiumOccupancy: computedTotalOccupancy, incidentSeverity: incident.severity }
        }),
      });

      if (!response.ok) {
        throw new Error('API Request unconfigured or offline.');
      }

      const data = await response.json();
      const checklistStr = data.text;
      const parsedChecklist = normalizeChecklist(checklistStr);

      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === id ? { ...inc, aiChecklist: parsedChecklist.length > 0 ? parsedChecklist : [checklistStr] } : inc
        )
      );
    } catch (err) {
      console.warn('Using offline mock fallback for AI Checklist.', err);
      const fallbackChecklist = getIncidentFallbackChecklist(incident.title, incident.location);

      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === id ? { ...inc, aiChecklist: fallbackChecklist } : inc
        )
      );
    } finally {
      setIsGeneratingChecklistId(null);
    }
  };

  // Chat Messenger interaction with secure proxy backend
  const handleSendMessage = async (text: string) => {
    const timestamp = formatTimeLabel();
    const userMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      sender: 'user',
      text,
      timestamp,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsGeneratingChat(true);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          context: {
            stadiumOccupancy: computedTotalOccupancy,
            activeAlerts: activeAlertsCount,
            transitDelayed: transitDelayCount
          }
        }),
      });

      if (!response.ok) {
        throw new Error('API unconfigured or offline.');
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        sender: 'ai',
        text: data.text,
        timestamp: formatTimeLabel(),
        sources: data.sources,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Using fallback AI Response engine.', err);
      const matchedText = getAiFallbackResponse(text);

      const aiMsg: ChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        sender: 'ai',
        text: matchedText,
        timestamp: formatTimeLabel(),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsGeneratingChat(false);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-scale-lg';
      case 'huge':
        return 'text-scale-xl';
      default:
        return 'text-scale-md';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-slate-950 text-slate-100'
      } ${getFontSizeClass()}`}
      id="root-viewport-container"
    >
      {/* Accessibility Quick Skiplink */}
      <a href="#main-dashboard-grid" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded font-bold z-50">
        Skip to main content
      </a>

      {/* KPI & Branding Header */}
      <AuraHeader
        totalOccupancy={computedTotalOccupancy}
        activeAlerts={activeAlertsCount}
        dispatchedTeams={dispatchedTeamsCount}
        transitDelayCount={transitDelayCount}
      />

      {/* Responsive Work Space */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6" id="main-dashboard-grid">
        {/* Mobile Tab-based workspace routing, expanded grid in desktop */}
        <div className="flex lg:hidden bg-slate-900 border border-slate-800 p-1 rounded-xl justify-around text-xs font-semibold" role="tablist">
          <button
            onClick={() => setActiveTab('CommandGrid')}
            role="tab"
            aria-selected={activeTab === 'CommandGrid'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
              activeTab === 'CommandGrid' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setActiveTab('Assistant')}
            role="tab"
            aria-selected={activeTab === 'Assistant'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
              activeTab === 'Assistant' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Bot</span>
          </button>
          <button
            onClick={() => setActiveTab('Crisis')}
            role="tab"
            aria-selected={activeTab === 'Crisis'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
              activeTab === 'Crisis' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Crisis</span>
          </button>
          <button
            onClick={() => setActiveTab('Transit')}
            role="tab"
            aria-selected={activeTab === 'Transit'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
              activeTab === 'Transit' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Route className="w-4 h-4" />
            <span>Transit</span>
          </button>
        </div>

        {/* Screen Reader Optimized Text Readout View */}
        {screenReaderActive && (
          <section className="bg-slate-900 border-2 border-dashed border-emerald-500 rounded-xl p-5 space-y-4" aria-live="polite">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Accessible Narrative screen-reader feed
            </h2>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>System summary:</strong> Azteca Smart Stadium has an active capacity load of{' '}
                {computedTotalOccupancy.toLocaleString()} spectators. There are {activeAlertsCount} active emergency logs.
              </p>
              <p>
                <strong>Sectors overview:</strong>
                {sectors.map((sec) => ` Sector ${sec.name} is running at ${Math.round((sec.currentOccupancy / sec.capacity) * 100)}% load.`).join('')}
              </p>
              <p>
                <strong>Emergency checklist highlights:</strong>
                {incidents.map((inc) => ` Ticket ${inc.id} - ${inc.title} is currently marked as ${inc.status}.`).join('')}
              </p>
            </div>
          </section>
        )}

        {/* Primary Desktop grid (Auto-adaptive layouts) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-start">
          {/* Column Left (Digital Twin & Crowds) */}
          <div className="col-span-8 space-y-6">
            <DigitalTwin
              sectors={sectors}
              onSelectSector={setSelectedSector}
              selectedSector={selectedSector}
              onRefreshMetrics={handleRefreshTelemetry}
            />
            <CrowdSimulation
              simulationSpeed={simulationSpeed}
              setSimulationSpeed={setSimulationSpeed}
              crowdArrivalRate={crowdArrivalRate}
              setCrowdArrivalRate={setCrowdArrivalRate}
            />
          </div>

          {/* Column Right (Multilingual Bot & Alert Center) */}
          <div className="col-span-4 space-y-6">
            <MultilingualAssistant
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isGenerating={isGeneratingChat}
            />
            <EmergencyAlerts
              incidents={incidents}
              onAddIncident={handleAddIncident}
              onUpdateIncidentStatus={handleUpdateIncidentStatus}
              onGenerateAiChecklist={handleGenerateAiChecklist}
              generatingChecklistId={isGeneratingChecklistId}
            />
          </div>
        </div>

        {/* Mobile adaptive tab screens */}
        <div className="block lg:hidden space-y-6">
          {activeTab === 'CommandGrid' && (
            <>
              <DigitalTwin
                sectors={sectors}
                onSelectSector={setSelectedSector}
                selectedSector={selectedSector}
                onRefreshMetrics={handleRefreshTelemetry}
              />
              <CrowdSimulation
                simulationSpeed={simulationSpeed}
                setSimulationSpeed={setSimulationSpeed}
                crowdArrivalRate={crowdArrivalRate}
                setCrowdArrivalRate={setCrowdArrivalRate}
              />
            </>
          )}

          {activeTab === 'Assistant' && (
            <MultilingualAssistant
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isGenerating={isGeneratingChat}
            />
          )}

          {activeTab === 'Crisis' && (
            <EmergencyAlerts
              incidents={incidents}
              onAddIncident={handleAddIncident}
              onUpdateIncidentStatus={handleUpdateIncidentStatus}
              onGenerateAiChecklist={handleGenerateAiChecklist}
              generatingChecklistId={isGeneratingChecklistId}
            />
          )}

          {activeTab === 'Transit' && <TransitTracker hubs={transitHubs} />}
        </div>

        {/* Unified Bottom row (Transit Tracker on desktop, Accessibility Control Hub globally) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-7">
            <TransitTracker hubs={transitHubs} />
          </div>
          <div className="lg:col-span-5">
            <AccessibilityCenter
              fontSize={fontSize}
              setFontSize={setFontSize}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
              screenReaderActive={screenReaderActive}
              setScreenReaderActive={setScreenReaderActive}
              onVoiceCommandReceived={handleSendMessage}
            />
          </div>
        </div>
      </main>

      {/* Modern Compact Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-6 mt-12 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
          <span>AURA COMMAND CORE SYSTEM V1.2</span>
          <span>© 2026 FIFA TOURNAMENT OPERATIONS DIVISION. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </div>
  );
}
