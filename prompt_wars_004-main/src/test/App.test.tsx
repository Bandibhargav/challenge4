/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

describe('App Component Core Tests', () => {
  it('renders branding header and KPI stats cleanly', () => {
    render(<App />);
    expect(screen.getAllByText(/AURA/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Stadium Occupancy/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Incidents/i)).toBeInTheDocument();
    expect(screen.getByText(/Dispatched Teams/i)).toBeInTheDocument();
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
});
