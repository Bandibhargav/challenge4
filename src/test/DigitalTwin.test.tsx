/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DigitalTwin } from '../components/DigitalTwin';
import { INITIAL_SECTORS } from '../utils/stadiumData';
import { StadiumSector } from '../types';

describe('DigitalTwin Sub-component Tests', () => {
  const mockOnSelect = vi.fn();
  const mockRefresh = vi.fn();

  it('renders interactive sector paths and handles selection clicks', () => {
    render(
      <DigitalTwin
        sectors={INITIAL_SECTORS}
        onSelectSector={mockOnSelect}
        selectedSector={INITIAL_SECTORS[0]}
        onRefreshMetrics={mockRefresh}
      />
    );

    // Verify first sector name in detailed panel is visible
    expect(screen.getAllByText('North Stand Lower (N1)').length).toBeGreaterThanOrEqual(1);
    
    // Test clicking a sector path
    const targetSectorPath = screen.getByLabelText(/Sector East Grandstand/i);
    expect(targetSectorPath).toBeInTheDocument();
    fireEvent.click(targetSectorPath);
    
    expect(mockOnSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'SEC-E2' })
    );
  });

  it('handles keyboard enter keypresses on sectors for accessibility', () => {
    render(
      <DigitalTwin
        sectors={INITIAL_SECTORS}
        onSelectSector={mockOnSelect}
        selectedSector={null}
        onRefreshMetrics={mockRefresh}
      />
    );

    const targetSectorPath = screen.getByLabelText(/Sector East Grandstand/i);
    fireEvent.keyDown(targetSectorPath, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnSelect).toHaveBeenCalled();
  });
});
