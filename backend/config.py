"""
Configuration module for loading environment variables.
"""
import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Application configuration loaded from environment variables."""
    
    # NASA API Configuration
    NASA_BASE_URL: str = os.getenv("NASA_BASE_URL", "https://power.larc.nasa.gov/api/temporal/daily/point")
    NASA_COMMUNITY: str = os.getenv("NASA_COMMUNITY", "AG")
    NASA_FORMAT: str = os.getenv("NASA_FORMAT", "CSV")
    NASA_TIMEOUT: float = float(os.getenv("NASA_TIMEOUT", "45.0"))
    
    # Data Collection Parameters
    START_YEAR: int = int(os.getenv("START_YEAR", "2000"))
    NASA_PARAMETERS: List[str] = os.getenv("NASA_PARAMETERS", "T2M_MAX,T2M_MIN,T2M,PRECTOTCORR,WS2M,RH2M").split(",")
    
    # Analysis Thresholds
    RAIN_THRESHOLD_MM: float = float(os.getenv("RAIN_THRESHOLD_MM", "1.0"))
    PERCENTILE_COLD: int = int(os.getenv("PERCENTILE_COLD", "25"))
    PERCENTILE_HOT: int = int(os.getenv("PERCENTILE_HOT", "75"))
    PERCENTILE_DRY: int = int(os.getenv("PERCENTILE_DRY", "25"))
    PERCENTILE_HUMID: int = int(os.getenv("PERCENTILE_HUMID", "75"))
    
    # Data Quality Thresholds
    GOOD_DATA_MIN_YEARS: int = int(os.getenv("GOOD_DATA_MIN_YEARS", "20"))
    LIMITED_DATA_MIN_YEARS: int = int(os.getenv("LIMITED_DATA_MIN_YEARS", "10"))
    HIGH_CONFIDENCE_MIN_YEARS: int = int(os.getenv("HIGH_CONFIDENCE_MIN_YEARS", "25"))
    MEDIUM_CONFIDENCE_MIN_YEARS: int = int(os.getenv("MEDIUM_CONFIDENCE_MIN_YEARS", "15"))
    
    # Temperature Variability Classification Thresholds
    TEMP_CV_VERY_CONSISTENT: float = float(os.getenv("TEMP_CV_VERY_CONSISTENT", "5"))
    TEMP_CV_CONSISTENT: float = float(os.getenv("TEMP_CV_CONSISTENT", "10"))
    TEMP_CV_MODERATE: float = float(os.getenv("TEMP_CV_MODERATE", "15"))
    
    # Temperature Trend Thresholds
    TEMP_TREND_STABLE_THRESHOLD: float = float(os.getenv("TEMP_TREND_STABLE_THRESHOLD", "0.01"))
    
    # API Configuration
    API_VERSION: str = os.getenv("API_VERSION", "v1")
    API_TITLE: str = os.getenv("API_TITLE", "Vai Chover no Meu Desfile? API")
    API_DESCRIPTION: str = os.getenv("API_DESCRIPTION", "Provides historical climate analysis for a specific date and location.")
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173,https://cascao-frontend-880627998185.us-central1.run.app").split(",")


# Create a singleton instance
config = Config()
