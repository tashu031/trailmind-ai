import httpx
from typing import Optional
from app.config import settings

class VoiceService:
    """
    Optional ElevenLabs Text-to-Speech integration.
    Synthesizes natural, calming audio narration for outdoor mission checkpoints.
    Gracefully returns None if API key is not configured.
    """
    def __init__(self):
        self.api_key = settings.ELEVENLABS_API_KEY
        self.voice_id = settings.ELEVENLABS_VOICE_ID

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def synthesize_speech(self, text: str) -> Optional[bytes]:
        if not self.is_configured():
            return None

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}"
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.65,
                "similarity_boost": 0.75
            }
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    return resp.content
        except Exception as e:
            print(f"[Voice] ElevenLabs synthesis failed: {e}")
        return None

voice_service = VoiceService()
