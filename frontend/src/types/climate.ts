// TypeScript interfaces matching the backend API response structure

export interface Location {
  lat: number;
  lon: number;
}

export interface AnalysisPeriod {
  start_year: number;
  end_year: number;
  total_years_analyzed: number;
}

export interface FrequencyAnalysis {
  rainy_days: number;
  total_days: number;
  percentage: number;
}

export interface RainProbability {
  threshold_mm: number;
  probability_percent: number;
  rainy_days_count: number;
  dry_days_count: number;
  frequency_analysis: FrequencyAnalysis;
}

export interface TemperatureProbability {
  hot_threshold_c: number;
  cold_threshold_c: number;
  hot_probability_percent: number;
  cold_probability_percent: number;
  hot_days_count: number;
  cold_days_count: number;
  normal_days_count: number;
  classification_method: string;
}

export interface HumidityProbability {
  humid_threshold_percent: number;
  dry_threshold_percent: number;
  humid_probability_percent: number;
  dry_probability_percent: number;
  humid_days_count: number;
  dry_days_count: number;
  normal_days_count: number;
  classification_method: string;
}

export interface YearlyVariability {
  std_dev_c: number;
  coefficient_variation_percent: number;
  classification: string;
  description: string;
  interpretation: string;
}

export interface VariabilityAnalysis {
  coefficient_of_variation: number;
  temperature_range_c: number;
  yearly_variability: YearlyVariability;
}

export interface TemperatureTrend {
  slope: number;
  description: string;
  interpretation: string;
}

export interface TemperatureStats {
  avg_max_c: number;
  avg_min_c: number;
  median_c: number;
  record_max_c: number;
  record_min_c: number;
  std_dev: number;
  percentiles: {
    "10th_percentile_c": number;
    "90th_percentile_c": number;
  };
  variability_analysis: VariabilityAnalysis;
  trend: TemperatureTrend;
}

export interface WindStats {
  avg_speed_ms: number;
}

export interface HumidityStats {
  avg_percent: number;
  min_percent: number;
  max_percent: number;
  std_dev: number;
  percentiles: {
    "10th_percentile_percent": number;
    "90th_percentile_percent": number;
  };
  range_percent: number;
}

export interface SummaryStatistics {
  data_quality: string;
  confidence_level: string;
}

export interface ClimateAnalysisResponse {
  location: Location;
  analysis_period: AnalysisPeriod;
  rain_probability: RainProbability;
  temperature_probability: TemperatureProbability;
  humidity_probability: HumidityProbability;
  temperature: TemperatureStats;
  wind: WindStats;
  humidity: HumidityStats;
  summary_statistics: SummaryStatistics;
}

// User input interface
export interface UserPreferences {
  idealTemperature: number;
  idealRain: number;
  idealWindSpeed: number;
  idealHumidity: number;
}
