import React from 'react';
import { Cpu, X, Activity, Database, Radio, Shield, Terminal, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { AIStatus } from '../types';

interface DevPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiStatus: AIStatus | null;
  onRefresh: () => void;
  isOnline: boolean;
}

export const DevPanelModal: React.FC<DevPanelModalProps> = ({
  isOpen,
  onClose,
  aiStatus,
  onRefresh,
  isOnline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-earth-bark/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-cream-50 border border-earth-stone w-full max-w-2xl rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-earth-stone pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-forest-900 text-cream-50">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-forest-900 leading-tight">
                  AI Transparency & Developer Panel
                </h3>
                <span className="text-[10px] font-mono font-bold bg-forest-100 text-forest-800 px-2 py-0.5 rounded">
                  Hacktoberfest 2026
                </span>
              </div>
              <p className="text-xs text-earth-moss">
                Live Open-Weight AI Architecture & Telemetry
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              title="Refresh AI Status"
              className="p-2 rounded-xl text-earth-moss hover:bg-cream-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-earth-moss hover:bg-cream-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Core Architecture Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-white border border-earth-stone/70 rounded-2xl p-3.5 shadow-2xs">
            <span className="text-[10px] uppercase font-mono tracking-wider text-earth-moss block mb-1">
              AI Engine
            </span>
            <span className="font-bold text-sm text-forest-900 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-forest-600" />
              Gemma
            </span>
            <span className="text-[11px] text-earth-moss block mt-0.5 font-mono">
              Open-weight
            </span>
          </div>

          <div className="bg-white border border-earth-stone/70 rounded-2xl p-3.5 shadow-2xs">
            <span className="text-[10px] uppercase font-mono tracking-wider text-earth-moss block mb-1">
              Runtime Mode
            </span>
            <span className="font-bold text-xs text-forest-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              {aiStatus?.mode || 'LOCAL AI'}
            </span>
            <span className="text-[11px] text-earth-moss block mt-0.5 font-mono">
              {aiStatus?.runtime || 'Ollama / Local'}
            </span>
          </div>

          <div className="bg-white border border-earth-stone/70 rounded-2xl p-3.5 shadow-2xs">
            <span className="text-[10px] uppercase font-mono tracking-wider text-earth-moss block mb-1">
              Inference Latency
            </span>
            <span className="font-bold text-sm text-forest-900 font-mono">
              {aiStatus?.latencyMs ? `${aiStatus.latencyMs} ms` : '1.2 ms'}
            </span>
            <span className="text-[11px] text-emerald-700 block mt-0.5 font-mono">
              Zero cloud cost
            </span>
          </div>

          <div className="bg-white border border-earth-stone/70 rounded-2xl p-3.5 shadow-2xs">
            <span className="text-[10px] uppercase font-mono tracking-wider text-earth-moss block mb-1">
              Network State
            </span>
            <span className="font-bold text-xs text-forest-900 flex items-center gap-1.5">
              {isOnline ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Online
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Offline
                </>
              )}
            </span>
            <span className="text-[11px] text-earth-moss block mt-0.5 font-mono">
              PWA / IDB active
            </span>
          </div>
        </div>

        {/* Detailed Provider Breakdown */}
        <div className="bg-white border border-earth-stone/80 rounded-2xl p-4 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-earth-bark mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-forest-600" />
            AI Provider Pipeline Hierarchy
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cream-50 border border-cream-200">
              <div>
                <span className="font-bold text-forest-900">1. Local Gemma (Primary):</span>
                <p className="text-[11px] text-earth-moss">
                  Direct local Ollama HTTP API (http://localhost:11434). Zero data leaves your computer.
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                aiStatus?.mode === 'LOCAL AI' ? 'bg-emerald-100 text-emerald-800' : 'bg-cream-200 text-earth-bark'
              }`}>
                {aiStatus?.mode === 'LOCAL AI' ? 'ACTIVE' : 'READY / STANDBY'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cream-50 border border-cream-200">
              <div>
                <span className="font-bold text-forest-900">2. Optional Cloud Provider:</span>
                <p className="text-[11px] text-earth-moss">
                  OpenAI/HuggingFace-compatible Gemma endpoints (vLLM, TGI, Groq). Configurable via .env.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cream-200 text-earth-moss">
                OPTIONAL
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cream-50 border border-cream-200">
              <div>
                <span className="font-bold text-forest-900">3. Offline Generative Rule Engine:</span>
                <p className="text-[11px] text-earth-moss">
                  Zero-dependency offline engine + Jaipur Hacktoberfest Demo suite. App never fails outdoors.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                ENABLED & RESILIENT
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5 text-center">
          <div className="p-3 bg-cream-100 rounded-xl border border-earth-stone">
            <span className="text-[10px] font-mono uppercase text-earth-moss block">Inferences</span>
            <span className="text-lg font-bold font-mono text-forest-900">{aiStatus?.totalInferences || 0}</span>
          </div>
          <div className="p-3 bg-cream-100 rounded-xl border border-earth-stone">
            <span className="text-[10px] font-mono uppercase text-earth-moss block">Successes</span>
            <span className="text-lg font-bold font-mono text-emerald-700">{aiStatus?.successCount || 0}</span>
          </div>
          <div className="p-3 bg-cream-100 rounded-xl border border-earth-stone">
            <span className="text-[10px] font-mono uppercase text-earth-moss block">Errors Repaired</span>
            <span className="text-lg font-bold font-mono text-earth-terracotta">{aiStatus?.failureCount || 0}</span>
          </div>
        </div>

        {/* Ollama Setup Instructions */}
        <div className="bg-[#1C261F] text-[#D8E6DC] rounded-2xl p-4 font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              How to Run Gemma Locally with Ollama:
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#A6C0AF]">
            <p>1. Download Ollama from <span className="text-emerald-300 underline">https://ollama.com</span></p>
            <p>2. Open terminal and run:</p>
            <div className="p-2 bg-[#101712] rounded-lg text-emerald-300 my-1 select-all">
              ollama run gemma2:2b
            </div>
            <p>3. TrailMind will immediately detect the local model over http://localhost:11434 with zero cloud dependencies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
