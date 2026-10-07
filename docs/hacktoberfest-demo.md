# Hacktoberfest 2026 Week 1 Demo Guide

## 90-second demo

1. Open TrailMind and show the landing page.
2. Choose **Start an Adventure** or use the **Jaipur Demo** for a deterministic judging path.
3. Show onboarding preferences and generate a mission.
4. On the mission preview, point out the preparation and safety notes.
5. Start the adventure and immediately activate **Screen Down**.
6. Complete one checkpoint and capture an observation.
7. Open **Nature Detective** and explain that the primary path is local Gemma/Ollama, with an offline rule-engine fallback.
8. Finish the adventure and answer the four reflection questions.
9. Show the AI-generated Adventure Journal and **Outside Score**.
10. Open History and demonstrate **AI Memory** over past adventures.
11. Open the AI transparency panel and show the active provider, model, latency, and fallback status.
12. Toggle the browser offline. The cached PWA shell, IndexedDB adventure data, and local fallback experience should remain usable.

## What to emphasize to judges

### Relevance to "Touch Grass"
The product is deliberately designed around a short screen interaction followed by a longer screen-free outdoor experience. The Screen Down mode and screen-light metric make that product philosophy visible.

### Why open innovation matters
Local Gemma through Ollama gives TrailMind a model that can run without sending private observations to a third-party AI API. It also makes the AI provider replaceable and keeps the project usable when connectivity disappears.

### Technical execution
- React + TypeScript + Vite frontend
- FastAPI backend
- Local Gemma via Ollama
- IndexedDB for local-first persistence
- PWA service worker
- MongoDB Atlas as an optional sync layer
- Sentry spans around AI inference when configured
- Docker + Docker Compose
- GitHub Actions CI
- Render deployment configuration

## Important honesty rule

The demo must clearly distinguish:
- **Local Gemma** when Ollama and the configured model are available.
- **Offline Rule Engine** when Gemma is unavailable.
- **Cloud AI** only when explicitly configured.

Never describe the rule engine as Gemma inference.
