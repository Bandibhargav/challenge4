/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import App from '../App';
import { AccessibilityCenter } from '../components/AccessibilityCenter';

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('App Component Core Tests', () => {
  it('renders branding header and KPI stats cleanly', () => {
    render(<App />);
    expect(screen.getAllByText(/AURA/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Stadium Occupancy/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Incidents/i)).toBeInTheDocument();
    expect(screen.getByText(/Dispatched Teams/i)).toBeInTheDocument();
  });

  it('renders the operations playbook and AI workflow guidance', () => {
    render(<App />);
    expect(screen.getByText(/AI-assisted tournament operations/i)).toBeInTheDocument();
    expect(screen.getByText(/Operational playbook/i)).toBeInTheDocument();
  });

  it('allows clicking on sync telemetry to change data flows', () => {
    render(<App />);
    const syncButton = screen.getAllByLabelText('Refresh telemetry metrics')[0];
    expect(syncButton).toBeInTheDocument();
    fireEvent.click(syncButton);
  });

  it('renders tab elements for mobile viewport routing', () => {
    render(<App />);
    const gridTab = screen.getByRole('tab', { name: /grid/i });
    const aiTab = screen.getByRole('tab', { name: /ai bot/i });
    const crisisTab = screen.getByRole('tab', { name: /crisis/i });

    expect(gridTab).toBeInTheDocument();
    expect(aiTab).toBeInTheDocument();
    expect(crisisTab).toBeInTheDocument();

    // Switch to AI Bot Tab
    fireEvent.click(aiTab);
    expect(screen.getAllByText('AURA Command Core').length).toBeGreaterThanOrEqual(1);
  });

  it('refreshes the selected sector telemetry after syncing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);

    render(<App />);

    const sectorButtons = screen.getAllByRole('button', { name: /Sector North Stand Lower/i });
    fireEvent.click(sectorButtons[0]);
    const refreshButtons = screen.getAllByLabelText('Refresh telemetry metrics');
    fireEvent.click(refreshButtons[0]);

    expect(screen.getAllByText('8,180').length).toBeGreaterThan(0);
  });

  it('cleans up pending voice-command timers when unmounted', () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { unmount } = render(
      <AccessibilityCenter
        fontSize="normal"
        setFontSize={vi.fn()}
        highContrast={false}
        setHighContrast={vi.fn()}
        screenReaderActive={false}
        setScreenReaderActive={vi.fn()}
        onVoiceCommandReceived={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /simulate microphone voice input/i }));
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
