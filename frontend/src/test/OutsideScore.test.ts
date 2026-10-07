import { describe, it, expect } from 'vitest';

function calculateScore(
  durationMinutes: number,
  missionsCompleted: number,
  observationsCount: number,
  screenLightMinutes: number,
  hasReflections: boolean
): number {
  const durPts = Math.min(40, durationMinutes);
  const misPts = Math.min(25, missionsCompleted * 5);
  const obsPts = Math.min(20, observationsCount * 5);
  const reflPts = hasReflections ? 10 : 5;
  const screenBonus = screenLightMinutes <= 5 ? 5 : 0;
  return Math.min(100, Math.max(10, durPts + misPts + obsPts + reflPts + screenBonus));
}

describe('Outside Score Calculation', () => {
  it('calculates full 100 score for mindful 45 minute walk with minimal screen time', () => {
    const score = calculateScore(45, 5, 4, 3, true);
    expect(score).toBe(100);
  });

  it('rewards screen-light bonus when under 5 minutes', () => {
    const scoreLowScreen = calculateScore(30, 4, 2, 2, true);
    const scoreHighScreen = calculateScore(30, 4, 2, 15, true);
    expect(scoreLowScreen).toBeGreaterThan(scoreHighScreen);
    expect(scoreLowScreen - scoreHighScreen).toBe(5);
  });

  it('stays within 0 to 100 bounds', () => {
    const minimalScore = calculateScore(0, 0, 0, 60, false);
    expect(minimalScore).toBeGreaterThanOrEqual(10);
    const maximalScore = calculateScore(180, 10, 20, 1, true);
    expect(maximalScore).toBe(100);
  });
});
