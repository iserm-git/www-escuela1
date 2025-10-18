from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Base de datos
    DATABASE_URL: str
    
    # Aplicación
    APP_NAME: str = "Escuela API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3001"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()