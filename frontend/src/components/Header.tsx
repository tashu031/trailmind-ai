import React from 'react';
import { Compass, Sparkles, BookOpen, Search, Settings } from 'lucide-react';
import { ConnectionBadge } from './ConnectionBadge';
import { AIStatus } from '../types';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOnline: boolean;
  aiStatus: AIStatus | null;
  onOpenDevPanel: () => void;
  onStartDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  isOnline,
  aiStatus,
  onOpenDevPanel,
  onStartDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-earth-stone px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-cream-50 shadow-sm group-hover:bg-forest-700 transition-colors">
            <Compass className="w-5 h-5 text-cream-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-lg tracking-tight text-forest-900 leading-none">
                TrailMind
              </span>
              <span className="text-[10px] uppercase tracking-wider font-mono font-semibold bg-forest-100 text-forest-700 px-1.5 py-0.5 rounded">
                AI
              </span>
            </div>
            <p className="text-[11px] text-earth-moss font-medium hidden sm:block">
              Plan less. Explore more.
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => onNavigate('onboarding')}
            className={`hidden sm:inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === 'onboarding' 
                ? 'bg-forest-100 text-forest-800' 
                : 'text-earth-bark hover:bg-cream-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 mr-1 text-forest-600" />
            New Mission
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`hidden sm:inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === 'history' 
                ? 'bg-forest-100 text-forest-800' 
                : 'text-earth-bark hover:bg-cream-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1 text-earth-moss" />
            Journals
          </button>

          <button
            onClick={() => onNavigate('detective')}
            className={`inline-flex items-center text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === 'detective' 
                ? 'bg-forest-100 text-forest-800' 
                : 'text-earth-bark hover:bg-cream-200'
            }`}
          >
            <Search className="w-3.5 h-3.5 mr-1 text-earth-moss" />
            <span className="hidden xs:inline">Nature Detective</span>
            <span className="xs:hidden">Detective</span>
          </button>

          {/* Quick Demo Trigger */}
          <button
            onClick={onStartDemo}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-earth-terracotta/10 text-earth-terracotta hover:bg-earth-terracotta/20 transition-all border border-earth-terracotta/20"
            title="Launch 30-min Jaipur Nature Detective Demo"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Demo Mode</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Connection status badge */}
          <ConnectionBadge 
            isOnline={isOnline} 
            aiStatus={aiStatus} 
            onClick={onOpenDevPanel} 
          />

          {/* Settings & Dev Panel Trigger */}
          <button
            onClick={onOpenDevPanel}
            aria-label="Settings and Developer Transparency Panel"
            className="p-1.5 rounded-lg text-earth-bark hover:bg-cream-200 transition-colors"
          >
            <Settings className="w-4 h-4 text-earth-moss" />
          </button>
        </nav>
      </div>
    </header>
  );
};
