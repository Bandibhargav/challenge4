/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AccessibilityCenter } from '../components/AccessibilityCenter';

describe('AccessibilityCenter Accessibility Tests', () => {
  const mockSetFontSize = vi.fn();
  const mockSetContrast = vi.fn();
  const mockSetScreenReader = vi.fn();
  const mockVoiceCommand = vi.fn();

  it('renders correctly and enables toggling visual settings', () => {
    render(
      <AccessibilityCenter
        fontSize="normal"
        setFontSize={mockSetFontSize}
        highContrast={false}
        setHighContrast={mockSetContrast}
        screenReaderActive={false}
        setScreenReaderActive={mockSetScreenReader}
        onVoiceCommandReceived={mockVoiceCommand}
      />
    );

    // Verify Title
    expect(screen.getByText('Universal Accessibility & Inclusivity Center')).toBeInTheDocument();

    // Verify Toggles and Buttons
    const contrastCheckbox = screen.getByLabelText('Stark High Contrast Mode');
    const screenReaderCheckbox = screen.getByLabelText('Text-Only Screen Reader View');

    expect(contrastCheckbox).toBeInTheDocument();
    expect(screenReaderCheckbox).toBeInTheDocument();

    // Click Toggles
    fireEvent.click(contrastCheckbox);
    expect(mockSetContrast).toHaveBeenCalledWith(true);

    fireEvent.click(screenReaderCheckbox);
    expect(mockSetScreenReader).toHaveBeenCalledWith(true);
  });

  it('allows speech synthesis and mic trigger simulation', () => {
    render(
      <AccessibilityCenter
        fontSize="normal"
        setFontSize={mockSetFontSize}
        highContrast={false}
        setHighContrast={mockSetContrast}
        screenReaderActive={false}
        setScreenReaderActive={mockSetScreenReader}
        onVoiceCommandReceived={mockVoiceCommand}
      />
    );

    const speakBtn = screen.getByLabelText('Read Screen aloud');
    fireEvent.click(speakBtn);

    const voiceBtn = screen.getByLabelText('Simulate microphone voice input');
    fireEvent.click(voiceBtn);
    expect(screen.getByText('Listening for tactical order...')).toBeInTheDocument();
  });
});
