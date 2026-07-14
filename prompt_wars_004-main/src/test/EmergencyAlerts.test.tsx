/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmergencyAlerts } from '../components/EmergencyAlerts';
import { INITIAL_INCIDENTS } from '../utils/stadiumData';
import { IncidentStatus } from '../types';

describe('EmergencyAlerts Incident Management Tests', () => {
  const mockOnAdd = vi.fn();
  const mockUpdateStatus = vi.fn();
  const mockGenerateAi = vi.fn().mockResolvedValue(undefined);

  it('renders a list of incident tickets and selects one to view details', () => {
    render(
      <EmergencyAlerts
        incidents={INITIAL_INCIDENTS}
        onAddIncident={mockOnAdd}
        onUpdateIncidentStatus={mockUpdateStatus}
        onGenerateAiChecklist={mockGenerateAi}
        generatingChecklistId={null}
      />
    );

    // Verify first ticket is in document
    expect(screen.getByText('Gate G Crowding Pressure')).toBeInTheDocument();

    // Click the incident to select it and show full detail pane
    const ticketButton = screen.getByRole('button', { name: /Incident: Gate G Crowding Pressure/i });
    fireEvent.click(ticketButton);

    // Detailed incident view is displayed
    expect(screen.getByText('RFID turnstile scanner malfunction causing crowd accumulation of approx. 400 people. Secondary queue lines deployed.')).toBeInTheDocument();
  });

  it('allows filling out the form to report a new security incident log', async () => {
    render(
      <EmergencyAlerts
        incidents={INITIAL_INCIDENTS}
        onAddIncident={mockOnAdd}
        onUpdateIncidentStatus={mockUpdateStatus}
        onGenerateAiChecklist={mockGenerateAi}
        generatingChecklistId={null}
      />
    );

    const reportButton = screen.getByRole('button', { name: /Report Incident/i });
    fireEvent.click(reportButton);

    // Form inputs are visible
    const titleInput = screen.getByLabelText('Incident Title');
    const locationInput = screen.getByLabelText('Location');
    const descInput = screen.getByLabelText('Full Incident Description');
    const submitButton = screen.getByRole('button', { name: /Submit Log/i });

    fireEvent.change(titleInput, { target: { value: 'Faulty exit latch' } });
    fireEvent.change(locationInput, { target: { value: 'Gate C west side' } });
    fireEvent.change(descInput, { target: { value: 'Exit latch is stuck and fans cannot pass' } });

    fireEvent.click(submitButton);

    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Faulty exit latch',
        location: 'Gate C west side',
      })
    );
  });
});
