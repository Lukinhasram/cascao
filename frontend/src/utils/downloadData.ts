import type { ClimateAnalysisResponse, UserPreferences } from '../types/climate';

interface DownloadableData {
  metadata: {
    exported_at: string;
    location: {
      latitude: number;
      longitude: number;
    };
    date_analyzed: {
      day: number;
      month: number;
    };
    user_preferences: {
      ideal_temperature: { value: number; unit: '°C' };
      ideal_rain: { value: number; unit: 'mm' };
      ideal_wind_speed: { value: number; unit: 'm/s' };
      ideal_humidity: { value: number; unit: '%' };
    };
  };
  analysis_period: {
    start_year: number;
    end_year: number;
    total_years_analyzed: number;
  };
  data_quality: {
    confidence_level: string;
    quality: string;
  };
  temperature: {
    unit: '°C';
    average_maximum: number;
    average_minimum: number;
    median: number;
    record_maximum: number;
    record_minimum: number;
    standard_deviation: number;
    percentiles: {
      '10th': number;
      '90th': number;
    };
    variability: {
      coefficient_of_variation: number;
      temperature_range: number;
      yearly_std_dev: number;
      yearly_cv_percent: number;
      classification: string;
    };
    trend: {
      slope: number;
      description: string;
      interpretation: string;
    };
    probability: {
      hot_threshold: number;
      cold_threshold: number;
      hot_probability_percent: number;
      cold_probability_percent: number;
      hot_days_count: number;
      cold_days_count: number;
      normal_days_count: number;
    };
  };
  rain: {
    unit: 'mm';
    threshold: number;
    probability_of_rain_percent: number;
    rainy_days_count: number;
    dry_days_count: number;
    frequency_analysis: {
      rainy_days: number;
      total_days: number;
      percentage: number;
    };
  };
  wind: {
    unit: 'm/s';
    average_speed: number;
  };
  humidity: {
    unit: '%';
    average: number;
    minimum: number;
    maximum: number;
    standard_deviation: number;
    range: number;
    percentiles: {
      '10th': number;
      '90th': number;
    };
    probability: {
      humid_threshold: number;
      dry_threshold: number;
      humid_probability_percent: number;
      dry_probability_percent: number;
      humid_days_count: number;
      dry_days_count: number;
      normal_days_count: number;
    };
  };
  additional_parameters?: Array<{
    parameter_name: string;
    unit: string;
    average: number;
    minimum: number;
    maximum: number;
    median: number;
    standard_deviation: number;
    percentiles: {
      '10th': number;
      '25th': number;
      '75th': number;
      '90th': number;
    };
  }>;
}

export function downloadClimateData(
  data: ClimateAnalysisResponse,
  preferences: UserPreferences,
  location: { lat: number; lon: number },
  date: { day: number; month: number }
): void {
  // Format data with metadata and units
  const downloadableData: DownloadableData = {
    metadata: {
      exported_at: new Date().toISOString(),
      location: {
        latitude: location.lat,
        longitude: location.lon,
      },
      date_analyzed: {
        day: date.day,
        month: date.month,
      },
      user_preferences: {
        ideal_temperature: { value: preferences.idealTemperature, unit: '°C' },
        ideal_rain: { value: preferences.idealRain, unit: 'mm' },
        ideal_wind_speed: { value: preferences.idealWindSpeed, unit: 'm/s' },
        ideal_humidity: { value: preferences.idealHumidity, unit: '%' },
      },
    },
    analysis_period: {
      start_year: data.analysis_period.start_year,
      end_year: data.analysis_period.end_year,
      total_years_analyzed: data.analysis_period.total_years_analyzed,
    },
    data_quality: {
      confidence_level: data.summary_statistics.confidence_level,
      quality: data.summary_statistics.data_quality,
    },
    temperature: {
      unit: '°C',
      average_maximum: data.temperature.avg_max_c,
      average_minimum: data.temperature.avg_min_c,
      median: data.temperature.median_c,
      record_maximum: data.temperature.record_max_c,
      record_minimum: data.temperature.record_min_c,
      standard_deviation: data.temperature.std_dev,
      percentiles: {
        '10th': data.temperature.percentiles['10th_percentile_c'],
        '90th': data.temperature.percentiles['90th_percentile_c'],
      },
      variability: {
        coefficient_of_variation: data.temperature.variability_analysis.coefficient_of_variation,
        temperature_range: data.temperature.variability_analysis.temperature_range_c,
        yearly_std_dev: data.temperature.variability_analysis.yearly_variability.std_dev_c,
        yearly_cv_percent: data.temperature.variability_analysis.yearly_variability.coefficient_variation_percent,
        classification: data.temperature.variability_analysis.yearly_variability.classification,
      },
      trend: {
        slope: data.temperature.trend.slope,
        description: data.temperature.trend.description,
        interpretation: data.temperature.trend.interpretation,
      },
      probability: {
        hot_threshold: data.temperature_probability.hot_threshold_c,
        cold_threshold: data.temperature_probability.cold_threshold_c,
        hot_probability_percent: data.temperature_probability.hot_probability_percent,
        cold_probability_percent: data.temperature_probability.cold_probability_percent,
        hot_days_count: data.temperature_probability.hot_days_count,
        cold_days_count: data.temperature_probability.cold_days_count,
        normal_days_count: data.temperature_probability.normal_days_count,
      },
    },
    rain: {
      unit: 'mm',
      threshold: data.rain_probability.threshold_mm,
      probability_of_rain_percent: data.rain_probability.probability_percent,
      rainy_days_count: data.rain_probability.rainy_days_count,
      dry_days_count: data.rain_probability.dry_days_count,
      frequency_analysis: {
        rainy_days: data.rain_probability.frequency_analysis.rainy_days,
        total_days: data.rain_probability.frequency_analysis.total_days,
        percentage: data.rain_probability.frequency_analysis.percentage,
      },
    },
    wind: {
      unit: 'm/s',
      average_speed: data.wind.avg_speed_ms,
    },
    humidity: {
      unit: '%',
      average: data.humidity.avg_percent,
      minimum: data.humidity.min_percent,
      maximum: data.humidity.max_percent,
      standard_deviation: data.humidity.std_dev,
      range: data.humidity.range_percent,
      percentiles: {
        '10th': data.humidity.percentiles['10th_percentile_percent'],
        '90th': data.humidity.percentiles['90th_percentile_percent'],
      },
      probability: {
        humid_threshold: data.humidity_probability.humid_threshold_percent,
        dry_threshold: data.humidity_probability.dry_threshold_percent,
        humid_probability_percent: data.humidity_probability.humid_probability_percent,
        dry_probability_percent: data.humidity_probability.dry_probability_percent,
        humid_days_count: data.humidity_probability.humid_days_count,
        dry_days_count: data.humidity_probability.dry_days_count,
        normal_days_count: data.humidity_probability.normal_days_count,
      },
    },
  };

  // Add additional parameters if present
  if (data.additional_parameters && data.additional_parameters.length > 0) {
    downloadableData.additional_parameters = data.additional_parameters.map(param => ({
      parameter_name: param.parameter_name,
      unit: param.parameter_unit,
      average: param.avg_value,
      minimum: param.min_value,
      maximum: param.max_value,
      median: param.median_value,
      standard_deviation: param.std_dev,
      percentiles: {
        '10th': param.percentiles['10th_percentile'],
        '25th': param.percentiles['25th_percentile'],
        '75th': param.percentiles['75th_percentile'],
        '90th': param.percentiles['90th_percentile'],
      },
    }));
  }

  // Create JSON string with pretty formatting
  const jsonString = JSON.stringify(downloadableData, null, 2);

  // Create blob and download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Generate filename with location and date
  const filename = `climate-data_lat${location.lat}_lon${location.lon}_${date.month}-${date.day}.json`;
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
