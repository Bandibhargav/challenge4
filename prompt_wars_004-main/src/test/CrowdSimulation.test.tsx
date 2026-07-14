/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CrowdSimulation } from '../components/CrowdSimulation';

describe('CrowdSimulation Component Tests', () => {
  const mockSetSpeed = vi.fn();
  const mockSetRate = vi.fn();

  it('renders simulation parameters and scenario selection tab toggles', () => {
    render(
      <CrowdSimulation
        simulationSpeed={1}
        setSimulationSpeed={mockSetSpeed}
        crowdArrivalRate={65}
        setCrowdArrivalRate={mockSetRate}
      />
    );

    // Verify Title
    expect(screen.getByText('Predictive Crowd Simulation')).toBeInTheDocument();
    
    // Verify Sliders
    expect(screen.getByLabelText('Arrival / Inflow Rate')).toBeInTheDocument();
    expect(screen.getByLabelText('Calculation Speed')).toBeInTheDocument();

    // Verify Scenario Toggles
    const halftimeTab = screen.getByRole('tab', { name: /halftime/i });
    expect(halftimeTab).toBeInTheDocument();
    fireEvent.click(halftimeTab);
  });

  it('handles parameter adjustment sliders correctly', () => {
    render(
      <CrowdSimulation
        simulationSpeed={1}
        setSimulationSpeed={mockSetSpeed}
        crowdArrivalRate={65}
        setCrowdArrivalRate={mockSetRate}
      />
    );

    const rateSlider = screen.getByLabelText('Arrival / Inflow Rate');
    fireEvent.change(rateSlider, { target: { value: '85' } });
    expect(mockSetRate).toHaveBeenCalledWith(85);
  });
});
