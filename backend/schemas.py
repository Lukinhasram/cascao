from pydantic import BaseModel
from typing import Optional


# Modelos aninhados para uma estrutura mais limpa
class Location(BaseModel):
    lat: float
    lon: float


class AnalysisPeriod(BaseModel):
    start_year: int
    end_year: int
    total_years_analyzed: int


class RainProbability(BaseModel):
    threshold_mm: float
    probability_percent: float


class TemperatureTrend(BaseModel):
    slope: float
    description: str


class TemperatureStats(BaseModel):
    avg_max_c: float
    avg_min_c: float
    record_max_c: float
    record_min_c: float
    std_dev: float
    trend: TemperatureTrend


class WindStats(BaseModel):
    avg_speed_ms: float


# Modelo principal da resposta da API
class ClimateAnalysisResponse(BaseModel):
    location: Location
    analysis_period: AnalysisPeriod
    rain_probability: RainProbability
    temperature: TemperatureStats
    wind: WindStats