import React from 'react';
import { Eye, CheckCircle2, ChevronRight, X, Volume2 } from 'lucide-react';
import { Checkpoint } from '../types';

interface ScreenDownOverlayProps {
  checkpoint: Checkpoint;
  currentNumber: number;
  totalCheckpoints: number;
  onComplete: () => void;
  onExit: () => void;
  onSpeak: () => void;
}

export const ScreenDownOverlay: React.FC<ScreenDownOverlayProps> = ({
  checkpoint,
  currentNumber,
  totalCheckpoints,
  onComplete,
  onExit,
  onSpeak,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0F1E12] text-[#E7F5E9] flex flex-col justify-between p-6 sm:p-10 select-none animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#21461D] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-300">
            Screen Down Mode Active
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSpeak}
            className="p-2 rounded-xl bg-[#1A381B] text-emerald-300 hover:bg-[#254F27] transition-colors"
            title="Listen to instruction"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-[#1A381B] text-emerald-300 hover:bg-[#254F27] transition-colors"
            title="Exit Screen Down Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Outdoor High-Contrast Content */}
      <div className="my-auto max-w-xl mx-auto w-full text-center py-6">
        <p className="font-mono text-emerald-400 font-semibold tracking-widest uppercase text-sm mb-3">
          Mission {currentNumber} of {totalCheckpoints}
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
          {checkpoint.title}
        </h2>

        <div className="bg-[#152B19] border-2 border-[#2C5E33] rounded-3xl p-6 sm:p-8 my-6 shadow-2xl">
          <p className="text-xl sm:text-2xl font-serif text-emerald-100 leading-relaxed font-normal">
            "{checkpoint.instruction}"
          </p>
          {checkpoint.tips && (
            <p className="mt-4 text-sm text-emerald-300/80 font-mono italic">
              Hint: {checkpoint.tips}
            </p>
          )}
        </div>

        <p className="text-xs text-emerald-400/60 uppercase tracking-widest font-mono">
          Put phone away • Observe real world • Return when ready
        </p>
      </div>

      {/* Bottom Big Touch Action */}
      <div className="max-w-xl mx-auto w-full pt-4">
        <button
          onClick={onComplete}
          className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-[#0A1A0D] font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all"
        >
          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          <span>I've Completed This Checkpoint</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
