import React, { useState } from 'react';
import { ShieldAlert, X, ChevronDown, ChevronUp } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside aria-label="Outdoor safety reminders" className="bg-earth-sand/30 border-y border-earth-stone px-4 py-2.5 text-xs text-earth-bark">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-forest-700 shrink-0" />
          <span className="font-semibold text-forest-900">
            Outdoor Safety First:
          </span>
          <span className="text-earth-moss hidden md:inline">
            Stay on marked paths, carry water, check weather, and never touch unknown flora or wildlife.
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse outdoor safety details" : "Expand outdoor safety details"}
            className="text-forest-700 underline font-medium md:hidden flex items-center gap-0.5"
          >
            {isExpanded ? 'Less' : 'More'}
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-earth-moss hover:text-earth-bark p-1 self-end sm:self-auto"
          title="Dismiss banner"
          aria-label="Dismiss safety banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {isExpanded && (
        <div className="max-w-6xl mx-auto mt-2 pt-2 border-t border-earth-stone/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-earth-bark/90 md:hidden animate-fadeIn">
          <p>• Stay on designated public paths & trails.</p>
          <p>• Carry adequate hydration and dress for weather.</p>
          <p>• Respect wildlife from a distance; do not approach.</p>
          <p>• AI is educational only; never rely on it for medical or survival choices.</p>
        </div>
      )}
    </aside>
  );
};
