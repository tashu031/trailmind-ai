import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "TrailMind AI"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # AI Engine Settings
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    GEMMA_MODEL: str = "gemma2:2b"
    GEMMA_VISION_MODEL: str = "paligemma"
    AI_TIMEOUT_SECONDS: float = 30.0
    
    # Optional Cloud AI Provider
    CLOUD_AI_PROVIDER: str = "none"  # "none" | "openai_compatible" | "huggingface"
    CLOUD_AI_API_KEY: Optional[str] = None
    CLOUD_AI_BASE_URL: Optional[str] = None
    CLOUD_AI_MODEL: Optional[str] = "google/gemma-2-9b-it"

    # Optional Cloud Persistence (MongoDB Atlas)
    MONGODB_URI: Optional[str] = None
    MONGODB_DB_NAME: str = "trailmind_db"

    # Optional Monitoring (Sentry)
    SENTRY_DSN: Optional[str] = None

    # Optional Voice (ElevenLabs)
    ELEVENLABS_API_KEY: Optional[str] = None
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"  # Rachel / Calm outdoor narrator

    # Demo Mode
    DEMO_MODE_DEFAULT: bool = True

settings = Settings()

# Initialize Sentry if configured
if settings.SENTRY_DSN:
    try:
        import sentry_sdk
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
            environment=settings.APP_ENV,
            release=f"trailmind-ai@{settings.APP_VERSION}",
        )
        print(f"[Monitoring] Sentry initialized for environment: {settings.APP_ENV}")
    except Exception as e:
        print(f"[Monitoring] Failed to initialize Sentry: {e}")
