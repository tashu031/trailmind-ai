import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { playChime } from '../services/speech';

interface TimerWidgetProps {
  initialSeconds?: number;
  onFinish?: () => void;
  label?: string;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({
  initialSeconds = 60,
  onFinish,
  label = 'Pause & Observe Timer',
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
    setHasFinished(false);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      setHasFinished(true);
      playChime('timer');
      if (onFinish) onFinish();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onFinish]);

  const toggle = () => {
    if (hasFinished) {
      setSecondsLeft(initialSeconds);
      setHasFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
    setHasFinished(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = ((initialSeconds - secondsLeft) / initialSeconds) * 100;

  return (
    <div className="bg-cream-50 border border-earth-stone rounded-2xl p-4 sm:p-5 shadow-xs max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-earth-moss flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-forest-600" />
          {label}
        </span>
        <span className="text-xs text-earth-moss/80 font-mono">
          {initialSeconds}s total
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Digital Display */}
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-forest-900">
            {formatTime(secondsLeft)}
          </span>
          {hasFinished && (
            <span className="text-xs font-bold text-forest-600 animate-bounce">
              Complete!
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
            className={`px-4 py-2 rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all ${
              isRunning 
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' 
                : 'bg-forest-600 text-cream-50 hover:bg-forest-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Start
              </>
            )}
          </button>

          <button
            onClick={reset}
            title="Reset Timer"
            aria-label="Reset timer"
            className="p-2 rounded-xl text-earth-bark hover:bg-cream-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-earth-moss" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-cream-200 h-1.5 rounded-full mt-3 overflow-hidden">
        <div 
          className="bg-forest-600 h-full rounded-full transition-all duration-500 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
