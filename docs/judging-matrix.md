# Hacktoberfest Week 1 Judging Matrix

| Criterion | TrailMind evidence |
|---|---|
| Writing Quality | README explains the problem, architecture, open-AI rationale, privacy model, offline design, and demo flow |
| Theme relevance | Outdoor micro-missions, Screen Down mode, observations, nature detective, journal, and Outside Score |
| Creativity | AI-generated sensory missions plus a deliberate anti-screen interaction model |
| Technical execution | Local Gemma provider, provider factory, structured JSON, IndexedDB, PWA, FastAPI, tests, Docker, CI |
| Open innovation | Open-weight Gemma can run locally through Ollama; provider abstraction allows model replacement |
| Privacy | Observations are stored locally by default; cloud persistence is optional |
| Reliability | Client and backend fallbacks keep the core flow usable without Ollama or network |
| Demonstrability | Deterministic Jaipur demo path plus AI transparency panel |

## Partner-category readiness

- **Sentry:** backend AI inference spans are already instrumented when a DSN is configured.
- **MongoDB Atlas:** optional adventure/observation persistence.
- **Render:** deployment configuration for frontend and backend.
- **ElevenLabs:** optional narration with browser speech fallback.

Only claim a partner category if the submitted demo actually uses and shows that partner technology.
