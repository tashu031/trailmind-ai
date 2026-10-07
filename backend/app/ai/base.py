from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import time

class AIProvider(ABC):
    """
    Abstract base class for all AI providers in TrailMind AI.
    Provides uniform interfaces for mission generation, observation analysis,
    journal chronicling, and health status, while tracking telemetry.
    """
    def __init__(self, name: str):
        self.name = name
        self.total_inferences = 0
        self.success_count = 0
        self.failure_count = 0
        self.last_latency_ms = 0.0

    def record_success(self, latency_ms: float):
        self.total_inferences += 1
        self.success_count += 1
        self.last_latency_ms = latency_ms

    def record_failure(self):
        self.total_inferences += 1
        self.failure_count += 1

    @abstractmethod
    async def generate_mission(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate structured outdoor mission JSON"""
        pass

    @abstractmethod
    async def analyze_observation(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze nature observation and return educational insights"""
        pass

    @abstractmethod
    async def generate_journal(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate adventure journal narrative and discoveries"""
        pass

    @abstractmethod
    async def query_memory(self, query: str, adventures: list) -> Dict[str, Any]:
        """Synthesize past adventure memories"""
        pass

    @abstractmethod
    async def check_health(self) -> Dict[str, Any]:
        """Return connectivity, active model, and status"""
        pass
