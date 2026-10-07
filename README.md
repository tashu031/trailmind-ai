# TrailMind AI

<div align="center">

**"Your AI should help you leave the screen."**

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-orange?style=flat-square)](https://hacktoberfest.com)
[![DEV Challenge: TOUCH GRASS](https://img.shields.io/badge/DEV%20Challenge-TOUCH%20GRASS-2D5A27?style=flat-square)](https://dev.to)
[![Open-Weight AI](https://img.shields.io/badge/AI-Gemma%20Open--Weight-3A7D44?style=flat-square)](https://huggingface.co/google/gemma-2-2b)
[![Offline First](https://img.shields.io/badge/Offline-First-forest?style=flat-square)](https://web.dev/offline-first/)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat-square)](https://render.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

*Plan less. Explore more.*

</div>

---

## 🌿 What is TrailMind AI?

TrailMind AI is an AI-powered outdoor adventure companion built around one simple idea:

> **AI should help you spend less time with AI.**

Instead of creating another chatbot that keeps users staring at a screen, TrailMind uses open-weight Gemma AI to create short, personalized outdoor missions that encourage people to walk, explore, observe, and reflect.

The app transforms an ordinary walk, garden visit, hike, or outdoor break into a small mindful adventure.

The experience is intentionally designed so users spend only a short amount of time planning with the application and the majority of the experience away from the screen.

---

## 🎯 Hacktoberfest 2026 — TOUCH GRASS

TrailMind AI was created for the Hacktoberfest 2026 DEV Open-Source AI Challenge — Week 1: TOUCH GRASS.

TrailMind directly addresses the challenge theme by reversing the typical AI interaction model.

Traditional AI:

    User → AI → More Screen Time → More Usage

TrailMind AI:

    User → AI → Outdoor Mission → Leave the Screen → Explore → Reflect → Return & Journal

The goal is not to maximize AI usage.

The goal is to make AI useful enough that you can close the app and go outside.

---

## 🧠 The Core Loop

    PLAN
    ~30 seconds on screen
          ↓
    EXPLORE
    Screen-free outdoor time
          ↓
    REFLECT
    3 short questions
          ↓
    JOURNAL
    AI-generated memory

The AI is intentionally front-loaded.

It helps plan the experience, then gets out of the way.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ Outside Mission Generator | Creates personalized outdoor missions based on time, location, activity, difficulty, and interests |
| 📵 Screen Down Mode | Minimal high-contrast interface designed to encourage users to stop looking at the screen |
| 🔍 Nature Detective | Educational identification and explanation of plants, birds, rocks, sounds, and outdoor observations |
| 📷 Observation Capture | Record notes, photos, moods, and discoveries while exploring |
| ⏱️ Sensory Timers | Short observation and mindfulness timers for intentional outdoor pauses |
| 📖 Adventure Journal | Turns observations and reflections into a personalized adventure story |
| 🧠 AI Memory | Allows users to query and revisit previous adventures |
| 📊 Outside Score | A non-competitive mindful engagement metric rather than a fitness score |
| 📡 Offline-First Experience | PWA, IndexedDB, service worker, and offline fallback engine |
| 🔒 Privacy First | Outdoor observations remain local by default |
| 🖥️ AI Transparency Panel | Shows the active AI provider, runtime mode, inference information, and system status |
| 🎬 Demo Mode | Canonical Jaipur outdoor adventure for judges and demonstrations |
| 🛡️ Outdoor Safety Guidance | Built-in reminders around paths, weather, wildlife, and unknown plants |

---

## 🤖 Open-Weight AI Architecture

Open AI is not just an add-on in TrailMind.

The application was designed around an AI provider abstraction so that the core application does not depend on a single proprietary AI API.

    TrailMind AI
         │
         ▼
    AIProviderFactory
         │
    ┌────┼──────────────┐
    │    │              │
    ▼    ▼              ▼
    Local Gemma    Cloud Provider    Fallback Engine
    + Ollama         Optional         Offline Rules
    │                  │                 │
    ▼                  ▼                 ▼
    Primary       User Configured    Always Available

### 1. Local Gemma — Primary AI

The recommended configuration runs an open-weight Gemma model locally through Ollama.

    User
      │
      ▼
    TrailMind
      │
      ▼
    LocalGemmaProvider
      │
      ▼
    Ollama
      │
      ▼
    Gemma

Typical local configuration:

    OLLAMA_BASE_URL=http://localhost:11434
    GEMMA_MODEL=gemma2:2b

Local inference means that outdoor observations can be processed without automatically sending them to a cloud AI provider.

### 2. Optional Hosted AI Provider

TrailMind also supports an optional OpenAI-compatible/cloud provider abstraction.

This allows users or deployments to configure a hosted Gemma-compatible endpoint when local inference is not available.

The application logic remains independent of the provider.

### 3. Offline Rule Engine

TrailMind also contains a zero-dependency fallback engine.

This is especially important for outdoor use.

If the local model or hosted provider is unavailable, the application can continue operating using the offline procedural engine.

    Gemma unavailable
          ↓
    Offline Rule Engine
          ↓
    Mission still works

This makes the application resilient instead of completely dependent on network connectivity or an external AI API.

---

## 🔐 Privacy by Design

TrailMind is designed around a local-first philosophy.

By default:

    Outdoor Observation
            ↓
          Device
            ↓
      Local Storage / AI

The application does not require a cloud database or cloud AI provider for its core experience.

Optional cloud services can be configured when required.

### Default storage architecture

- IndexedDB on the client
- In-memory backend fallback
- Optional MongoDB Atlas persistence

### Optional integrations

- MongoDB Atlas
- Sentry
- ElevenLabs
- Hosted Gemma-compatible AI providers

Cloud integrations are optional rather than mandatory.

---

## 🧩 AI-Powered Workflows

TrailMind uses AI in several meaningful parts of the experience.

| Workflow | Function | Purpose |
|---|---|---|
| Mission Generation | `generateMission()` | Creates a personalized outdoor adventure |
| Mission Regeneration | `regenerateMission()` | Produces a fresh variation |
| Observation Analysis | `analyzeObservation()` | Provides educational nature analysis |
| Journal Creation | `generateJournal()` | Converts reflections into an adventure journal |
| Memory | `queryMemory()` | Retrieves meaningful information from past adventures |
| Voice | `speak()` | Provides optional outdoor narration |

All AI prompt templates are centralized in:

    backend/app/ai/prompts.py

This keeps AI behavior separated from the React UI.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Python 3.12+, FastAPI, Pydantic |
| AI | Google Gemma open-weight models |
| Local AI Runtime | Ollama |
| Local Storage | IndexedDB |
| Offline Support | Service Worker + PWA |
| Optional Database | MongoDB Atlas |
| Optional Monitoring | Sentry |
| Optional Voice | ElevenLabs + Web Speech API |
| Maps | Leaflet + OpenStreetMap |
| Testing | Vitest + Pytest |
| Deployment | Render |
| CI/CD | GitHub Actions |
| Containerization | Docker |

---

## 📁 Project Structure

    trailmind-ai/
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── ConnectionBadge.tsx
    │   │   │   ├── DevPanelModal.tsx
    │   │   │   ├── Header.tsx
    │   │   │   ├── NatureDetectiveModal.tsx
    │   │   │   ├── ObservationModal.tsx
    │   │   │   ├── SafetyBanner.tsx
    │   │   │   ├── ScreenDownOverlay.tsx
    │   │   │   ├── ShareCardModal.tsx
    │   │   │   └── TimerWidget.tsx
    │   │   │
    │   │   ├── pages/
    │   │   │   ├── LandingPage.tsx
    │   │   │   ├── OnboardingPage.tsx
    │   │   │   ├── MissionPreviewPage.tsx
    │   │   │   ├── MissionModePage.tsx
    │   │   │   ├── AdventureCompletionPage.tsx
    │   │   │   ├── JournalViewPage.tsx
    │   │   │   └── HistoryPage.tsx
    │   │   │
    │   │   ├── services/
    │   │   │   ├── api.ts
    │   │   │   ├── db.ts
    │   │   │   └── speech.ts
    │   │   │
    │   │   ├── types/
    │   │   │   └── index.ts
    │   │   │
    │   │   └── App.tsx
    │   │
    │   └── public/
    │       ├── sw.js
    │       └── manifest.json
    │
    ├── backend/
    │   └── app/
    │       ├── ai/
    │       │   ├── base.py
    │       │   ├── local_gemma.py
    │       │   ├── cloud_provider.py
    │       │   ├── fallback_engine.py
    │       │   ├── factory.py
    │       │   ├── prompts.py
    │       │   └── json_utils.py
    │       │
    │       ├── api/
    │       │   └── endpoints.py
    │       │
    │       ├── services/
    │       ├── schemas/
    │       ├── database/
    │       │   └── mongo.py
    │       │
    │       └── main.py
    │
    ├── docs/
    ├── .github/
    │   └── workflows/
    │       └── ci.yml
    │
    ├── docker-compose.yml
    ├── render.yaml
    ├── .env.example
    ├── architecture.md
    └── README.md

---

## 🚀 Getting Started

### Prerequisites

Install:

- Node.js 20+
- npm
- Python 3.12+
- Git
- Ollama (optional but recommended for local Gemma inference)

### 1. Clone the Repository

    git clone https://github.com/tashu031/trailmind-ai.git
    cd trailmind-ai

---

## ⚙️ Environment Configuration

Create your environment file:

    cp .env.example .env

Example configuration:

    APP_ENV=development
    PORT=8000
    HOST=0.0.0.0

    OLLAMA_BASE_URL=http://localhost:11434
    GEMMA_MODEL=gemma2:2b
    GEMMA_VISION_MODEL=paligemma
    AI_TIMEOUT_SECONDS=30.0

    CLOUD_AI_PROVIDER=none
    CLOUD_AI_API_KEY=
    CLOUD_AI_BASE_URL=https://api.openai.com/v1
    CLOUD_AI_MODEL=google/gemma-2-9b-it

    MONGODB_URI=
    MONGODB_DB_NAME=trailmind_db

    SENTRY_DSN=

    ELEVENLABS_API_KEY=
    ELEVENLABS_VOICE_ID=21m00Tcm4TlvD8q8ikWAM

Most optional integrations can remain empty.

TrailMind is designed to work without them.

---

## 🦙 Local Gemma Setup with Ollama

For the full local AI experience, install Ollama.

### 1. Install Ollama

Download it from:

https://ollama.com

### 2. Pull Gemma

    ollama pull gemma2:2b

### 3. Start Ollama

    ollama serve

### 4. Verify Ollama

    curl http://localhost:11434/api/tags

### 5. Run Gemma

    ollama run gemma2:2b

TrailMind will detect the local Ollama endpoint and use Gemma when available.

---

## 🐍 Backend Setup

Open a terminal:

    cd backend

Create a virtual environment:

    python -m venv .venv

### Windows

    .venv\Scripts\activate

### macOS/Linux

    source .venv/bin/activate

Install dependencies:

    pip install -r requirements.txt

Run the FastAPI backend:

    uvicorn app.main:app --reload --port 8000

Backend:

    http://localhost:8000

Swagger API documentation:

    http://localhost:8000/docs

Health endpoint:

    http://localhost:8000/health

---

## ⚛️ Frontend Setup

Open another terminal:

    cd frontend

Install dependencies:

    npm install

Start the development server:

    npm run dev

Frontend:

    http://localhost:5173

During local development, Vite proxies API requests:

    Frontend :5173
          │
          │ /api/*
          ▼
    Backend :8000

---

## 🧪 Testing

### Backend

    cd backend
    pytest tests/ -v

### Frontend

    cd frontend
    npm test

### Production Frontend Build

    cd frontend
    npm run build

The production build is generated inside:

    frontend/dist/

---

## 🐳 Docker

TrailMind also includes Docker support.

Run the full stack:

    docker compose up --build

Stop the containers:

    docker compose down

---

## ☁️ Render Deployment

TrailMind is deployed using Render with two services:

    Render
       │
       ├── Static Frontend
       │   trailmind-frontend
       │
       └── FastAPI Backend
           trailmind-backend

The deployment configuration is stored in:

    render.yaml

The project uses:

- Render Static Site for the React frontend
- Render Web Service for the FastAPI backend

The deployed application can therefore be accessed without running the development servers locally.

---

## ⚠️ AI Behavior on Render

Local Ollama is intentionally designed for the user's own machine and is not available inside the Render deployment environment.

Therefore, the deployed version uses the following architecture:

Local Development:

    React
      ↓
    FastAPI
      ↓
    Ollama
      ↓
    Gemma

Render Deployment:

    React
      ↓
    FastAPI
      ↓
    Offline Rule Engine

If a hosted Gemma-compatible provider is configured, the Render backend can use that provider instead.

This keeps the deployed application resilient while preserving the project's primary open-weight AI architecture.

---

## 🎬 Hacktoberfest Demo Mode

TrailMind includes a canonical demonstration experience designed for Hacktoberfest judging.

### Demo Location

Jaipur City Forest & Smriti Van

### Demo Duration

30 minutes

### Activity

Urban Nature Detective

### Difficulty

Easy

The application includes a Demo Mode so the complete product experience can be demonstrated without requiring the judge to physically complete an outdoor adventure.

---

## 🧭 Suggested Demo Flow

    1. Open TrailMind AI

    2. Click "Launch Jaipur Demo"

    3. Review the personalized mission

    4. Click "START ADVENTURE"

    5. Enter Mission Mode

    6. Enable Screen Down Mode

    7. Complete a checkpoint

    8. Capture an outdoor observation

    9. Open Nature Detective

    10. Complete the remaining checkpoints

    11. Finish the adventure

    12. Answer the reflection questions

    13. Generate the Adventure Journal

    14. Open the AI Transparency Panel

    15. View the Outside Score

    16. Open Adventure History

The most important part of the demo is the transition:

    AI interaction
          ↓
    Mission generated
          ↓
    Screen goes down
          ↓
    User explores the real world
          ↓
    User returns to reflect

---

## 🖥️ AI Transparency Panel

TrailMind includes an AI Transparency & Developer Panel.

It exposes the active AI architecture instead of hiding it behind a generic "AI powered" label.

The panel can display:

    AI ENGINE
    Gemma

    RUNTIME MODE
    Offline Rule Engine / Local Gemma

    NETWORK STATE
    Online / Offline

    INFERENCE LATENCY
    Measured runtime information

    PROVIDER PIPELINE
    1. Local Gemma
    2. Optional Cloud Provider
    3. Offline Rule Engine

This makes the open-weight architecture visible to developers and users.

---

## 🌲 Outside Score

TrailMind intentionally does not try to become another fitness tracker.

The Outside Score is a mindful engagement metric.

It can consider signals such as:

- Time spent outside
- Sensory observations
- Completed checkpoints
- Reflections
- Exploration activity

It is explicitly:

> Not a fitness score.

The goal is to encourage mindful engagement rather than competition.

---

## 📡 Offline-First Architecture

Outdoor environments can have unreliable connectivity.

TrailMind therefore follows an offline-first approach.

    TrailMind
       │
       ├── Online
       │      ↓
       │    FastAPI
       │      ↓
       │    AI Providers
       │
       └── Offline
              ↓
          IndexedDB
              ↓
       Offline Engine
              ↓
       User Experience

The application can continue providing its core outdoor experience even when network-dependent AI services are unavailable.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Backend health and AI status |
| POST | `/api/mission/generate` | Generate an outdoor mission |
| POST | `/api/mission/regenerate` | Generate a fresh mission variation |
| POST | `/api/observation/analyze` | Analyze an outdoor observation |
| POST | `/api/journal/generate` | Generate an Adventure Journal |
| GET | `/api/adventures` | List adventure history |
| GET | `/api/adventures/{id}` | Get a specific adventure |
| POST | `/api/adventures` | Save an adventure |
| POST | `/api/observations` | Save an observation |
| GET | `/api/ai/status` | Get AI provider status |
| POST | `/api/ai/memory` | Query adventure memory |
| POST | `/api/voice/speak` | Optional voice narration |

Interactive API documentation:

    /docs

---

## 🗄️ Optional MongoDB Atlas

MongoDB is optional.

Without MongoDB:

    Client → IndexedDB
    Backend → In-memory storage

With MongoDB:

    Client
       ↓
    FastAPI
       ↓
    MongoDB Atlas

Set:

    MONGODB_URI=your_mongodb_connection_string
    MONGODB_DB_NAME=trailmind_db

The application can continue operating without MongoDB.

---

## 📊 Optional Sentry Monitoring

Sentry can be configured for monitoring and telemetry.

Set:

    SENTRY_DSN=your_sentry_dsn

Relevant workflows include:

- Mission generation
- Observation analysis
- Journal generation

Monitoring is optional and does not affect the core offline-first architecture.

---

## 🔊 Optional ElevenLabs Voice

TrailMind can optionally use ElevenLabs for natural voice narration.

Set:

    ELEVENLABS_API_KEY=your_api_key
    ELEVENLABS_VOICE_ID=your_voice_id

If ElevenLabs is not configured, the application falls back to the browser's built-in Web Speech API.

---

## 🗺️ Maps

TrailMind can use:

- Leaflet
- OpenStreetMap

The mapping layer is designed to avoid requiring a proprietary map API key for the basic experience.

---

## 🛡️ Safety

TrailMind includes responsible outdoor safety guidance.

The application is designed to:

- Encourage staying on established paths
- Remind users to check weather conditions
- Discourage approaching wild animals
- Avoid claiming that unknown plants, mushrooms, or berries are safe to consume
- Avoid medical or emergency decision-making
- Clearly label Nature Detective results as educational

### Nature Detective Disclaimer

Nature identification is:

> Educational Identification Only

Users should not use TrailMind as a substitute for professional ecological, medical, or emergency advice.

---

## 🔒 Privacy Principles

TrailMind follows these principles:

### Local First

Core functionality should not require a cloud account.

### Optional Cloud

Cloud persistence is opt-in.

### Open Models

The architecture supports open-weight AI rather than forcing users into one proprietary model provider.

### Transparent AI

The application exposes which AI runtime is being used.

### Minimal Screen Time

The application is intentionally designed to reduce screen interaction after the mission begins.

---

## 🧠 Why Open AI Matters

TrailMind uses open-weight AI because the project's purpose is fundamentally connected to independence.

A closed cloud-only AI experience would create a dependency on:

- Internet connectivity
- API keys
- Cloud availability
- Usage limits
- Vendor infrastructure
- Per-request costs

TrailMind instead supports local Gemma inference.

    Open-Weight AI
          │
          ├── Offline
          │
          ├── Privacy
          │
          └── Choice

This is particularly meaningful for an application designed for outdoor environments where connectivity may be unreliable.

---

## ⚖️ Closed API vs Open-Weight AI

| Closed Cloud AI | Open Gemma + Local Runtime |
|---|---|
| Requires network | Can work offline |
| Cloud dependency | Local inference possible |
| API key required | No API key for local mode |
| Usage limits | No cloud rate limits in local mode |
| Data may leave device | Local processing can keep data on device |
| Vendor-specific | Provider abstraction |
| Cloud inference cost | Local inference has no per-token cloud cost |

---

## 📱 Progressive Web App

TrailMind is designed as a Progressive Web App.

It includes:

- Service Worker
- Offline support
- IndexedDB storage
- Installable web experience
- Responsive UI
- Mobile-friendly observation capture

The application is designed to work across desktop and mobile browsers.

---

## 🧪 Current Validation

The project has automated tests for both major application layers.

### Frontend

    Vitest
    ✓ Component tests
    ✓ Outside Score tests

### Backend

    Pytest
    ✓ API endpoint tests
    ✓ AI status tests
    ✓ Mission generation tests
    ✓ Observation analysis tests
    ✓ Journal generation tests

Production frontend builds successfully using:

    npm run build

---

## 🛠️ Development Philosophy

TrailMind follows several engineering principles:

### Separation of Concerns

Frontend UI, backend APIs, business logic, AI providers, and persistence are separated.

### Provider Abstraction

AI logic is implemented through provider interfaces instead of being tightly coupled to a single model.

### Local-First

The application remains useful even when optional cloud services are unavailable.

### Progressive Enhancement

Optional services improve the experience but do not define the core application.

### Transparent AI

The user can see what AI runtime is active.

### Safety by Design

Outdoor recommendations are constrained by safety guidance.

---

## 🚧 Known Limitations

### 1. Local Gemma Requires Ollama

Full local Gemma inference requires Ollama and a downloaded model.

Without Ollama, TrailMind uses its offline fallback engine.

### 2. Render Does Not Run Local Ollama

The deployed Render environment uses the offline engine unless a hosted AI provider is configured.

### 3. Render Free Tier

The backend may experience cold starts after periods of inactivity.

### 4. Vision Models

Advanced multimodal Nature Detective functionality requires a compatible vision model/runtime.

### 5. Browser Camera APIs

Photo capture depends on browser support for camera-enabled file inputs.

---

## 🔮 Future Improvements

Potential future work includes:

- [ ] React Native / Capacitor mobile application
- [ ] Better native GPS support
- [ ] Advanced camera integration
- [ ] MongoDB Atlas vector search for semantic memory
- [ ] More advanced trail mapping
- [ ] Seasonal outdoor mission packs
- [ ] Community mission sharing
- [ ] Voice-only mission mode
- [ ] Improved multimodal Gemma integration
- [ ] More offline AI model options
- [ ] Personalized long-term outdoor habit insights

---

## 🤝 Contributing

Contributions are welcome.

A typical workflow:

    git clone https://github.com/tashu031/trailmind-ai.git

    cd trailmind-ai

    git checkout -b feature/your-feature

Make your changes, test them, and create a pull request.

Please keep contributions aligned with the project's core principles:

- Outdoor-first
- Privacy-first
- Open AI
- Offline resilience
- Safety
- Minimal screen time

---

## 📜 License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

---

## 🌱 The Bigger Idea

Most AI products optimize for:

    More prompts
         ↓
    More responses
         ↓
    More engagement
         ↓
    More screen time

TrailMind tries to reverse that:

    One useful AI interaction
              ↓
          Go outside
              ↓
            Explore
              ↓
           Observe
              ↓
           Reflect
              ↓
        Return briefly
              ↓
        Save the memory

The best AI experience might not be the one that keeps you talking to AI the longest.

It might be the one that gives you a reason to stop talking to it.

---

<div align="center">

## 🌿 TrailMind AI

**Plan less. Explore more.**

**Your AI should help you leave the screen.**

Built for **Hacktoberfest 2026 — DEV Challenge: TOUCH GRASS**

</div>