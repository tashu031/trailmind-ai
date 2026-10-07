# TrailMind AI: The AI That Tries to Make Itself Unnecessary

> Plan less. Explore more.

## The problem

Most AI products optimize for more time in front of a screen. TrailMind was designed around the opposite outcome.

The app gives you a short planning interaction, sends you outside with a minimal mission, and only brings the screen back when you are ready to reflect.

## What I built

TrailMind is an offline-first outdoor companion that can:

- generate personalized outdoor micro-missions
- enter a Screen Down mode for the actual walk
- capture observations, notes, moods, and photos locally
- help investigate nature observations
- generate an Adventure Journal after the walk
- calculate a non-competitive Outside Score
- search past adventures with AI memory
- continue working when connectivity disappears

## Why open AI matters

The primary AI path is an open-weight Gemma model running locally through Ollama.

That changes the product in three useful ways:

1. Private observations can stay on the user's device.
2. A trail without signal does not automatically become a broken AI experience.
3. The provider is replaceable because the application talks to an `AIProvider` interface instead of a single closed API.

The project also has an explicit offline rule engine. It is a reliability fallback, not something I pretend is Gemma inference.

## Architecture

React + TypeScript + Vite powers the client.

FastAPI provides the backend.

The AI provider chain is:

`Local Gemma/Ollama → optional configured cloud provider → Offline Rule Engine`

IndexedDB stores adventures and in-progress missions locally. A service worker provides the PWA shell, and a small sync queue can upload completed adventures when the backend becomes available again.

## The anti-screen interaction

The most important feature is not the AI model.

It is what happens after the model finishes.

The user can enter **Screen Down** mode, hear the instruction, put the phone away, complete the outdoor checkpoint, and return later to record what they actually noticed.

That makes the screen the shortest part of the experience.

## What I learned

Building around an open model forced me to design for failure in a better way. Instead of assuming an always-on API, TrailMind treats inference, network access, and cloud storage as replaceable layers.

That made the product more resilient and made privacy a product feature rather than a checkbox.

## Demo

The repository includes a deterministic Jaipur demo path so the core experience can be demonstrated without requiring a specific live trail or a cloud AI account.

For a full local AI demonstration:

```bash
ollama pull gemma2:2b
ollama serve
```

Then run the FastAPI backend and React frontend.

## What I would build next

The architecture leaves room for richer local vision models, better trail-aware mission planning, optional geospatial data, and additional open-weight models without rewriting the application flow.

The goal remains the same:

**Use AI to help people spend less time using AI.**
