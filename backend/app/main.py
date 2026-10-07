from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.endpoints import router as api_router
from app.database.mongo import db_manager
from app.ai.factory import ai_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: attempt optional DB connection
    print(f"🌲 [TrailMind AI] Starting backend server on port {settings.PORT}...")
    await db_manager.connect()
    yield
    # Shutdown
    print("🌲 [TrailMind AI] Shutting down backend.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Offline-first outdoor adventure companion powered by open-weight Gemma AI.",
    lifespan=lifespan
)

# Enable CORS for frontend dev and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    ai_status = await ai_manager.get_system_status()
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
        "database": "mongodb_atlas" if db_manager.is_connected() else "local_in_memory",
        "ai": {
            "mode": ai_status["mode"],
            "runtime": ai_status["runtime"],
            "model": ai_status["modelName"],
            "status": ai_status["status"]
        }
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to TrailMind AI — Plan less. Explore more.",
        "tagline": "Your AI should help you leave the screen.",
        "docs": "/docs",
        "health": "/health"
    }

# Mount API endpoints under /api
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
