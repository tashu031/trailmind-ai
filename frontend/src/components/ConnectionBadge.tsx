import React from 'react';
import { Cpu, Wifi, WifiOff } from 'lucide-react';
import { AIStatus } from '../types';

interface ConnectionBadgeProps {
  isOnline: boolean;
  aiStatus: AIStatus | null;
  onClick?: () => void;
}

export const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({ isOnline, aiStatus, onClick }) => {
  const isLocalAI = aiStatus?.mode === 'LOCAL AI' && aiStatus?.status === 'connected';
  const isCloud = aiStatus?.mode === 'CLOUD';

  let label = 'OFFLINE';
  let dotColor = 'bg-amber-500';
  let badgeBorder = 'border-amber-200 text-amber-800 bg-amber-50';
  let icon = <WifiOff className="w-3.5 h-3.5 mr-1 text-amber-600" />;

  if (isLocalAI) {
    label = 'LOCAL AI (GEMMA)';
    dotColor = 'bg-forest-600';
    badgeBorder = 'border-forest-200 text-forest-800 bg-forest-50';
    icon = <Cpu className="w-3.5 h-3.5 mr-1 text-forest-600" />;
  } else if (isOnline) {
    label = isCloud ? 'CLOUD GEMMA' : 'ONLINE (DEMO ENGINE)';
    dotColor = 'bg-emerald-500';
    badgeBorder = 'border-emerald-200 text-emerald-800 bg-emerald-50';
    icon = <Wifi className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
  }

  return (
    <button
      onClick={onClick}
      title="View AI Engine & Connection Status"
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs transition-all hover:scale-105 ${badgeBorder}`}
    >
      <span className={`w-2 h-2 rounded-full mr-1.5 animate-pulse ${dotColor}`} />
      {icon}
      <span>{label}</span>
    </button>
  );
};
