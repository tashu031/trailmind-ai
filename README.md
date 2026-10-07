# TrailMind AI

<div align="center">

**"Your AI should help you leave the screen."**

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-orange?style=flat-square)](https://hacktoberfest.com)
[![DEV Challenge: TOUCH GRASS](https://img.shields.io/badge/DEV%20Challenge-TOUCH%20GRASS-2D5A27?style=flat-square)](https://dev.to)
[![Open AI](https://img.shields.io/badge/AI-Gemma%20Open--Weight-3A7D44?style=flat-square)](https://huggingface.co/google/gemma-2-2b)
[![Offline First](https://img.shields.io/badge/Offline-First-forest?style=flat-square)](https://web.dev/offline-first/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

*Plan less. Explore more.*

</div>

---

## The Problem

Every AI application in 2026 is designed to maximize screen time. Notifications pull you back. Infinite feeds keep you scrolling. AI chatbots encourage longer, more dependent conversations.

**TrailMind is the opposite.**

TrailMind uses open-weight Gemma AI to get you **away from the screen** — generating personalized outdoor micro-missions, then intentionally fading into the background while you explore the real world.

---

## The Core Loop

```
PLAN (30 seconds on screen)
     ↓
EXPLORE (95%+ of time screen-free)
     ↓
REFLECT (3 short questions)
     ↓
JOURNAL (AI-written, yours to keep)
```

---

## Features

| Feature | Description |
|---|---|
| 🗺️ **Outside Mission Generator** | Gemma creates personalized sensory outdoor missions from your preferences |
| 📵 **Screen Down Mode** | Ultra-minimal high-contrast outdoor interface designed to stay closed |
| 🔍 **Nature Detective** | Educational AI identification of plants, birds, rocks, and ecology |
| 📷 **Observation Capture** | Offline-first photo, note, and mood logging |
| ⏱️ **Sensory Timers** | Built-in 60-second pause timers for mindful observation |
| 📖 **Adventure Journal** | Gemma-written narrative journal from your observations and reflections |
| 🧠 **AI Memory** | Query past adventures with natural language |
| 📊 **Outside Score** | Non-competitive mindful engagement metric (not a fitness tracker) |
| 📡 **100% Offline** | PWA + IndexedDB + offline AI fallback engine |
| 🔒 **Privacy First** | All observations stay on your device by default |
| 🖥️ **AI Transparency Panel** | Live view of which AI provider is running and inference latency |

---

## Why Open AI Matters

TrailMind is built on three open-AI principles:

### 1. Local Inference via Gemma + Ollama
```
Your observations → Your device → Gemma (local) → Your journal
                                      ↑
                               Zero cloud leakage
```

Forest trails rarely have reliable cellular signal. Closed AI APIs fail when you need them most. Gemma runs directly on your laptop or phone edge with Ollama — no API key, no rate limits, no internet required.

### 2. Absolute User Privacy
Your outdoor photos, GPS observations, plant identifications, and personal reflections **never leave your device** by default. When MongoDB Atlas is configured, cloud sync is an opt-in enhancement, not a prerequisite.

### 3. Model Flexibility
The `AIProvider` abstraction supports swapping models without touching application logic:
- `LocalGemmaProvider` → Ollama (default, recommended)
- `OptionalCloudProvider` → OpenAI-compatible endpoints (vLLM, HuggingFace TGI, Groq)
- `FallbackRuleEngine` → Offline procedural engine (zero dependencies)

---

## AI Architecture

```
AIProviderFactory
├── 1. LocalGemmaProvider (Ollama/HTTP) ← Primary: zero cloud cost
├── 2. OptionalCloudProvider (OpenAI-compatible) ← Optional: user-configured
└── 3. FallbackRuleEngine ← Always available: offline/demo mode
```

### AI-Powered Workflows

| Workflow | Function | Prompt Template |
|---|---|---|
| Mission Generation | `generateMission()` | `MISSION_USER_PROMPT_TEMPLATE` |
| Observation Analysis | `analyzeObservation()` | `OBSERVATION_USER_PROMPT_TEMPLATE` |
| Journal Creation | `generateJournal()` | `JOURNAL_USER_PROMPT_TEMPLATE` |
| Memory Synthesis | `queryMemory()` | `MEMORY_USER_PROMPT_TEMPLATE` |

All prompts live in [`backend/app/ai/prompts.py`](backend/app/ai/prompts.py) — never embedded in React components.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS |
| **Backend** | Python 3.12+, FastAPI, Pydantic v2 |
| **AI Engine** | Gemma (open-weight), Ollama (local runtime) |
| **Local Storage** | IndexedDB (idb), Service Worker, PWA |
| **Optional Cloud DB** | MongoDB Atlas (via Motor async driver) |
| **Optional Monitoring** | Sentry SDK (frontend + backend traces) |
| **Optional Voice** | ElevenLabs TTS (falls back to Web Speech API) |
| **Maps** | Leaflet + OpenStreetMap (optional, no API key) |
| **Testing** | Vitest (frontend), Pytest (backend) |
| **Deployment** | Render (backend Web Service + frontend Static Site) |
| **CI/CD** | GitHub Actions |

---

## Installation

### Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.12+
- **Ollama** (for local Gemma inference) — optional but strongly recommended

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/trailmind-ai.git
cd trailmind-ai
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your optional integrations (MongoDB, Sentry, ElevenLabs)
# Default works with zero configuration — Ollama is optional
```

---

## Local Gemma Setup (Recommended)

TrailMind works immediately without Gemma via the offline fallback engine.  
For full AI-powered mission generation, set up local Gemma:

```bash
# 1. Download and install Ollama
# macOS/Linux:
curl -fsSL https://ollama.com/install.sh | sh
# Windows: https://ollama.com/download

# 2. Pull the Gemma 2 model (2B parameter, ~1.5GB)
ollama pull gemma2:2b

# 3. Start Ollama (it will serve on http://localhost:11434)
ollama serve

# 4. Verify it's running
curl http://localhost:11434/api/tags
```

TrailMind will automatically detect the running Ollama instance and switch from the fallback engine to local Gemma inference.

### Alternative: Larger Models

```bash
ollama pull gemma2:9b     # Better quality, needs ~6GB RAM
ollama pull gemma3:4b     # Latest Gemma 3 family
```

Update `GEMMA_MODEL` in `.env` to match your chosen model.

---

## Backend Setup

```bash
# Create virtual environment
cd backend
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate
# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000
# API available at: http://localhost:8000
# Swagger docs: http://localhost:8000/docs
```

### Backend Environment Variables

Copy `.env.example` to `backend/.env` or set system environment variables:

```
OLLAMA_BASE_URL=http://localhost:11434  # Ollama API
GEMMA_MODEL=gemma2:2b                  # Model name in Ollama
MONGODB_URI=                           # Optional: MongoDB Atlas connection string
SENTRY_DSN=                            # Optional: Sentry DSN for monitoring
ELEVENLABS_API_KEY=                    # Optional: ElevenLabs voice synthesis
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev       # Development server at http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:8000`.

---

## MongoDB Atlas Setup (Optional)

MongoDB is optional. Without it, TrailMind uses in-memory storage on the backend and IndexedDB on the client.

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get your connection string (Atlas → Connect → Drivers → Python)
3. Set in `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/`

Collections created automatically:
- `adventures`
- `observations`

---

## Sentry Setup (Optional)

1. Create a project at [sentry.io](https://sentry.io)
2. Get your DSN from Project Settings → Client Keys
3. Set in `.env`: `SENTRY_DSN=https://xxxxx@sentry.io/xxxxx`

Traces captured around:
- `generateMission()` — AI mission generation latency
- `analyzeObservation()` — Nature Detective inference
- `generateJournal()` — Journal synthesis performance

---

## ElevenLabs Setup (Optional)

TrailMind works without ElevenLabs using the browser's built-in Web Speech API.

For premium natural outdoor narrator voice:
1. Create an account at [elevenlabs.io](https://elevenlabs.io)
2. Get your API key from Profile → API Keys
3. Set in `.env`: `ELEVENLABS_API_KEY=your_key_here`

Falls back silently to Web Speech API if unconfigured.

---

## Running Tests

```bash
# Backend tests
cd backend
.venv\Scripts\activate   # Windows
pytest tests/ -v

# Frontend tests
cd frontend
npm test
```

---

## Production Build

```bash
# Build frontend
cd frontend && npm run build

# Docker Compose (full stack)
docker compose up --build

# Or deploy to Render using render.yaml
```

---

## Render Deployment

**Important:** On Render, local Ollama is not available. The backend will automatically use the `FallbackRuleEngine` (offline procedural generator) unless you configure `CLOUD_AI_PROVIDER` with a hosted Gemma endpoint.

1. Connect your GitHub repository to Render
2. Render auto-detects `render.yaml` and creates both services
3. Set secret environment variables in the Render dashboard:
   - `MONGODB_URI` — MongoDB Atlas connection string
   - `SENTRY_DSN` — Sentry DSN
   - `ELEVENLABS_API_KEY` — ElevenLabs key

---

## Demo Mode

TrailMind includes a canonical Hacktoberfest demo:

**Location:** Jaipur City Forest & Smriti Van  
**Duration:** 30 minutes  
**Activity:** Urban Nature Detective  
**Difficulty:** Easy

Click **"Launch Jaipur Demo"** in the header or the landing page to experience the complete flow without requiring a real outdoor session.

---

## Demo Script (Hacktoberfest Judging)

```
1. Open TrailMind at http://localhost:5173
2. The landing page displays: "Your AI should help you leave the screen."
3. Click "Launch Jaipur Demo"
4. Mission Preview loads: "Jaipur Urban Nature Detective: The Ancient Canopy"
5. Click "START ADVENTURE" → enter Mission Mode
6. Notice the minimal interface — no chat, no feed, no distractions
7. Click "Screen Down Mode" → full-screen high-contrast outdoor UI
8. Complete a checkpoint → tap "I've Completed This Checkpoint"
9. Click "Capture Observation" → add a mindful nature note
10. Click "Nature Detective" → see educational AI identification
11. Disconnect from WiFi → offline banner appears, mission continues
12. Complete all checkpoints → "Adventure Complete"
13. Answer 3 short reflection questions
14. Generate Adventure Journal → Gemma writes a narrative story
15. Open Settings (gear icon) → AI Transparency Panel
16. Verify: "LOCAL AI (GEMMA)" badge shows active Gemma status
17. Show Outside Score: 87/100 — non-competitive mindful engagement
18. Open Adventure History → past adventures with AI Memory search
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check + AI status |
| POST | `/api/mission/generate` | Generate outdoor mission with Gemma |
| POST | `/api/mission/regenerate` | Regenerate a fresh mission variation |
| POST | `/api/observation/analyze` | Nature Detective AI analysis |
| POST | `/api/journal/generate` | Generate Adventure Journal |
| GET | `/api/adventures` | List adventure history |
| GET | `/api/adventures/{id}` | Get specific adventure |
| POST | `/api/adventures` | Save adventure to cloud |
| POST | `/api/observations` | Save observation |
| GET | `/api/ai/status` | Live AI provider status + telemetry |
| POST | `/api/ai/memory` | Query past adventures with Gemma |
| POST | `/api/voice/speak` | ElevenLabs TTS narration |

Full interactive docs at `/docs` (Swagger UI) when backend is running.

---

## Project Structure

```
trailmind-ai/
├── frontend/
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   │   ├── ConnectionBadge.tsx
│   │   │   ├── DevPanelModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── NatureDetectiveModal.tsx
│   │   │   ├── ObservationModal.tsx
│   │   │   ├── SafetyBanner.tsx
│   │   │   ├── ScreenDownOverlay.tsx
│   │   │   ├── ShareCardModal.tsx
│   │   │   └── TimerWidget.tsx
│   │   ├── pages/             # Full page views
│   │   │   ├── LandingPage.tsx
│   │   │   ├── OnboardingPage.tsx
│   │   │   ├── MissionPreviewPage.tsx
│   │   │   ├── MissionModePage.tsx
│   │   │   ├── AdventureCompletionPage.tsx
│   │   │   ├── JournalViewPage.tsx
│   │   │   └── HistoryPage.tsx
│   │   ├── services/          # API, storage, audio
│   │   │   ├── api.ts         # Backend client + offline fallback generator
│   │   │   ├── db.ts          # IndexedDB (idb) local storage
│   │   │   └── speech.ts      # ElevenLabs + Web Speech + Web Audio chimes
│   │   ├── types/index.ts     # TypeScript types
│   │   └── App.tsx            # Root router
│   └── public/
│       ├── sw.js              # Service Worker for PWA offline
│       └── manifest.json      # PWA manifest
├── backend/
│   └── app/
│       ├── ai/                # AI provider abstraction
│       │   ├── base.py        # AIProvider abstract base class
│       │   ├── local_gemma.py # LocalGemmaProvider (Ollama)
│       │   ├── cloud_provider.py # OptionalCloudProvider
│       │   ├── fallback_engine.py # Offline rule engine + demo
│       │   ├── factory.py     # AIProviderFactory (routing + fallback)
│       │   ├── prompts.py     # All Gemma prompt templates
│       │   └── json_utils.py  # JSON extraction + repair from LLM output
│       ├── api/endpoints.py   # FastAPI route handlers
│       ├── services/          # Business logic layer
│       ├── schemas/           # Pydantic v2 models
│       ├── database/mongo.py  # MongoDB Atlas + in-memory fallback
│       └── main.py            # FastAPI application
├── docs/                      # Architecture and setup documentation
├── .github/workflows/ci.yml   # GitHub Actions CI/CD
├── docker-compose.yml         # Full-stack Docker setup
├── render.yaml                # Render.com deployment config
├── .env.example               # Environment variable template
└── README.md                  # This file
```

---

## Safety

TrailMind includes responsible outdoor safety guidelines throughout:

- ⚠️ Never advise users on medical or emergency decisions
- 🍄 Never state that unknown plants, mushrooms, or berries are safe to consume
- 🐾 Never encourage approaching wild animals
- 🗺️ Always recommend staying on established public paths
- 🌦️ Remind users to check local weather before heading out
- 🚨 Nature Detective results are always labeled **Educational Identification Only**

---

## Known Limitations

1. **Ollama required for full local AI** — the offline engine provides solid fallback but real Gemma inference requires Ollama installation
2. **No native camera API in PWA** — uses `<input type="file" capture="environment">` which works on most mobile browsers
3. **Render free tier** — the backend may cold-start after inactivity; first request may take 30–60 seconds
4. **Vision model** — multimodal Nature Detective requires `paligemma` or `llava` in Ollama; text-only analysis works without it

---

## Future Improvements

- [ ] React Native / Capacitor mobile app for better GPS and camera integration
- [ ] Vector search via MongoDB Atlas for semantic memory queries
- [ ] Trail mapping with Leaflet + OpenStreetMap route generation
- [ ] Seasonal mission packs (spring foraging, winter tracking, storm watching)
- [ ] Community mission sharing (open-source, no social feed)
- [ ] Accessibility: voice-only mission mode for visual impairment

---

## Why Open AI Matters — The Honest Version

Commercial AI APIs are powerful, but they create dependency:

| Closed API | Open Gemma + Ollama |
|---|---|
| Requires internet | Works offline on trails |
| Costs per token | Zero inference cost |
| Sends private data to cloud | Data stays on device |
| Vendor lock-in | Swap models freely |
| Rate limited | No rate limits |
| API key required | No account needed |

For an application designed to get people outdoors and away from dependency on technology, building on closed AI would be philosophically inconsistent. TrailMind uses open AI because **open AI is the only kind that can actually help you leave the screen**.

---

## License

MIT License — open for contributions, forks, and extensions.

---

<div align="center">

*Built for Hacktoberfest 2026 DEV Challenge: TOUCH GRASS*

**"Most AI apps ask you to spend more time with AI. TrailMind uses AI to help you spend less time with AI."**

</div>
