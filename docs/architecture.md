# Architecture — TrailMind AI

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT (Browser)                       │
│                                                             │
│  React + Vite + TypeScript + Tailwind CSS                   │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ LandingPage │  │ OnboardingPg │  │  MissionModePage │   │
│  │             │  │ MissionPrvw  │  │  (Screen Down)   │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              CLIENT AI LAYER                          │   │
│  │  api.ts → offline fallback client generator          │   │
│  │  db.ts  → IndexedDB (idb) local-first persistence    │   │
│  │  speech.ts → ElevenLabs + Web Speech + Audio API     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────────────────────┐                            │
│  │  Service Worker (sw.js)   │  ← PWA offline cache        │
│  │  manifest.json            │  ← PWA install               │
│  └────────────────────────────┘                            │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP (proxied via Vite dev server)
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  AI Provider Factory                  │   │
│  │                                                      │   │
│  │  Priority 1: LocalGemmaProvider (Ollama HTTP API)    │   │
│  │  Priority 2: OptionalCloudProvider (OpenAI-compat.)  │   │
│  │  Priority 3: FallbackRuleEngine (offline/demo)       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ /api/mission │  │ /api/journal │  │ /api/observation │   │
│  │   generate   │  │   generate   │  │     analyze      │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                Database Manager                       │   │
│  │  MongoDB Atlas (optional) → In-memory fallback       │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
            ┌───────────┴────────────┐
            ↓                        ↓
   ┌─────────────────┐    ┌─────────────────────┐
   │  Ollama (Local) │    │   MongoDB Atlas      │
   │  gemma2:2b      │    │   (Optional Cloud)   │
   │  paligemma      │    │                     │
   └─────────────────┘    └─────────────────────┘
```

## Data Flow: Mission Generation

```
User selects preferences
        ↓
OnboardingPage → POST /api/mission/generate
        ↓
AIProviderFactory.generate_mission()
        ↓
  Is Ollama reachable?
  ├── YES → LocalGemmaProvider._call_ollama()
  │           → Gemma model inference (local)
  │           → JSON extraction + validation
  │           → Return structured Mission object
  └── NO  → FallbackRuleEngine.generate_mission()
              → Procedural rule-based generation
              → Return identical Mission structure
        ↓
MissionPreviewPage displays result
        ↓
User taps "START ADVENTURE"
        ↓
saveActiveMissionState() → IndexedDB (offline resilient)
```

## Offline-First Design

```
User starts adventure
        ↓
Mission data saved to IndexedDB
        ↓
Network connectivity lost
        ↓
App detects offline state
        ↓
Shows: "You are offline. Your adventure is still available."
        ↓
All checkpoints, timers, observations work from IndexedDB
        ↓
Nature Detective → client fallback engine (no network required)
        ↓
Adventure completes → Journal generated from client engine
        ↓
All data written to IndexedDB locally
        ↓
Network returns → syncs to MongoDB Atlas if configured
```

## Security & Privacy

- No credentials hard-coded anywhere
- All secrets loaded from environment variables
- `.env.example` provided, `.env` excluded from git
- User observations stored in browser IndexedDB by default
- Optional MongoDB sync is opt-in via `MONGODB_URI` env var
- Nature Detective photos processed locally (or via local Ollama)
- No user tracking, no analytics by default

## Performance Targets

| Operation | Target | Achieved Via |
|---|---|---|
| Mission generation (local Gemma) | <30s | Ollama async streaming |
| Mission generation (fallback) | <5ms | Pure procedural |
| Observation save | <50ms | IndexedDB put() |
| Journal generation (local) | <45s | Gemma 2B direct |
| Page navigation | <100ms | React state (no routing library) |
| Build size | <350KB gzip | Vite tree-shaking |
