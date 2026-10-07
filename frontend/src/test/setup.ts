import '@testing-library/jest-dom';

// Mock Web Speech API
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: () => {},
    cancel: () => {},
    getVoices: () => [],
  },
  writable: true,
});

// Mock Web Audio API
class MockAudioContext {
  currentTime = 0;
  destination = {};
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  createGain() {
    return {
      gain: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
    };
  }
}

(window as any).AudioContext = MockAudioContext;
(window as any).webkitAudioContext = MockAudioContext;
