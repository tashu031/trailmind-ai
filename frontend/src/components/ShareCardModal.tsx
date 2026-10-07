import React, { useRef } from 'react';
import { Share2, Download, X, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { Journal } from '../types';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  journal: Journal;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  journal,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `TrailMind: ${journal.title}`,
          text: `I spent ${journal.durationMinutes} mindful minutes outside with only ${journal.screenLightMinutes} minutes of screen time! Outside score: ${journal.outsideScore}/100. "AI should help you leave the screen."`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Copy text to clipboard
      navigator.clipboard.writeText(
        `🌲 TrailMind Adventure: ${journal.title}\n📅 ${journal.date}\n⏱️ ${journal.durationMinutes} mins outside (${journal.screenLightMinutes} mins screen)\n🎯 Outside Score: ${journal.outsideScore}/100\n✨ "${journal.shareCardText}"`
      );
      alert('Adventure card summary copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-earth-bark/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-cream-50 border border-earth-stone w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-earth-stone">
          <h3 className="font-serif font-bold text-lg text-forest-900">
            Share Adventure Card
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-earth-moss hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Card Visual */}
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-forest-800 to-forest-950 text-cream-50 rounded-3xl p-6 shadow-xl relative overflow-hidden mb-5 border border-forest-700"
        >
          {/* Subtle nature leaf texture background */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-forest-700/20 blur-2xl pointer-events-none" />

          {/* Top Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-forest-700 text-cream-100">
                <Compass className="w-4 h-4" />
              </span>
              <span className="font-serif font-bold tracking-tight text-sm text-cream-100">
                TrailMind AI
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-300">
              {journal.date}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-xl font-bold font-serif mb-2 leading-tight text-white">
            {journal.title}
          </h4>

          {/* Core Metric Highlights */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-forest-700/60 my-3 text-center">
            <div>
              <span className="text-xs font-mono text-emerald-300 block">Outside</span>
              <span className="text-lg font-bold text-white">{journal.durationMinutes}m</span>
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-300 block">Screen</span>
              <span className="text-lg font-bold text-emerald-300">{journal.screenLightMinutes}m</span>
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-300 block">Engagement</span>
              <span className="text-lg font-bold text-amber-300">{journal.outsideScore}</span>
            </div>
          </div>

          {/* Takeaway Quote */}
          <p className="text-xs italic text-cream-200/90 font-serif leading-relaxed my-2">
            "{journal.shareCardText}"
          </p>

          {/* Footer Philosophy */}
          <div className="flex items-center justify-between pt-3 border-t border-forest-700/60 text-[10px] text-emerald-400 font-mono">
            <span>TOUCH GRASS • DEV 2026</span>
            <span>OPEN AI • GEMMA</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={handleShare}
            className="flex-1 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-cream-50 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share / Copy Link
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-3 rounded-xl border border-earth-stone hover:bg-cream-200 text-earth-bark text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-earth-moss" />
            PDF / Print
          </button>
        </div>
      </div>
    </div>
  );
};
