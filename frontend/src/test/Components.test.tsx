import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConnectionBadge } from '../components/ConnectionBadge';
import { SafetyBanner } from '../components/SafetyBanner';
import { TimerWidget } from '../components/TimerWidget';

describe('UI Components', () => {
  it('renders ConnectionBadge in local AI mode', () => {
    render(
      <ConnectionBadge
        isOnline={true}
        aiStatus={{
          engine: 'Gemma',
          runtime: 'Ollama / Local',
          modelName: 'gemma2:2b',
          status: 'connected',
          latencyMs: 15.0,
          mode: 'LOCAL AI',
          totalInferences: 5,
          successCount: 5,
          failureCount: 0,
          fallbackAvailable: true,
          providerName: 'LocalGemmaProvider',
          ollamaBaseUrl: 'http://localhost:11434',
        }}
      />
    );
    expect(screen.getByText('LOCAL AI (GEMMA)')).toBeInTheDocument();
  });

  it('renders SafetyBanner with outdoor reminders', () => {
    render(<SafetyBanner />);
    expect(screen.getByText('Outdoor Safety First:')).toBeInTheDocument();
  });

  it('renders TimerWidget with starting seconds', () => {
    render(<TimerWidget initialSeconds={60} label="Test Pause" />);
    expect(screen.getByText('Test Pause')).toBeInTheDocument();
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });
});
