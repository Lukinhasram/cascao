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


class FrequencyAnalysis(BaseModel):
    rainy_days: int
    total_days: int
    percentage: float


class RainProbability(BaseModel):
    threshold_mm: float
    probability_percent: float
    rainy_days_count: int
    dry_days_count: int
    frequency_analysis: FrequencyAnalysis


class TemperaturePercentiles(BaseModel):
    percentile_10th_c: float = None
    percentile_90th_c: float = None

    class Config:
        populate_by_name = True
        extra = "allow"


class VariabilityAnalysis(BaseModel):
    coefficient_of_variation: float
    temperature_range_c: float


class TemperatureTrend(BaseModel):
    slope: float
    description: str
    interpretation: str


class TemperatureStats(BaseModel):
    avg_max_c: float
    avg_min_c: float
    median_c: float
    record_max_c: float
    record_min_c: float
    std_dev: float
    percentiles: dict
    variability_analysis: VariabilityAnalysis
    trend: TemperatureTrend


class WindStats(BaseModel):
    avg_speed_ms: float


class SummaryStatistics(BaseModel):
    data_quality: str
    confidence_level: str


# Modelo principal da resposta da API
class ClimateAnalysisResponse(BaseModel):
    location: Location
    analysis_period: AnalysisPeriod
    rain_probability: RainProbability
    temperature: TemperatureStats
    wind: WindStats
    summary_statistics: SummaryStatistics