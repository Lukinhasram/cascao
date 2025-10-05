from pydantic import BaseModel


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


class TemperatureProbability(BaseModel):
    hot_threshold_c: float
    cold_threshold_c: float
    hot_probability_percent: float
    cold_probability_percent: float
    hot_days_count: int
    cold_days_count: int
    normal_days_count: int
    classification_method: str


class HumidityProbability(BaseModel):
    humid_threshold_percent: float
    dry_threshold_percent: float
    humid_probability_percent: float
    dry_probability_percent: float
    humid_days_count: int
    dry_days_count: int
    normal_days_count: int
    classification_method: str


class VariabilityAnalysis(BaseModel):
    coefficient_of_variation: float
    temperature_range_c: float
    yearly_variability: 'YearlyVariability'


class YearlyVariability(BaseModel):
    std_dev_c: float
    coefficient_variation_percent: float
    classification: str
    description: str
    interpretation: str


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


class HumidityStats(BaseModel):
    avg_percent: float
    min_percent: float
    max_percent: float
    std_dev: float
    percentiles: dict
    range_percent: float


class SummaryStatistics(BaseModel):
    data_quality: str
    confidence_level: str


# Modelo principal da resposta da API
class ClimateAnalysisResponse(BaseModel):
    location: Location
    analysis_period: AnalysisPeriod
    rain_probability: RainProbability
    temperature_probability: TemperatureProbability
    humidity_probability: HumidityProbability
    temperature: TemperatureStats
    wind: WindStats
    humidity: HumidityStats
    summary_statistics: SummaryStatistics


# Resolve forward references
VariabilityAnalysis.model_rebuild()