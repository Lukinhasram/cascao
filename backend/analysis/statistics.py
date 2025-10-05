import pandas as pd
import io
import numpy as np
from scipy import stats


def process_csv_data(list_of_csvs: list[str]) -> pd.DataFrame:
    """
    Process a list of CSV strings from NASA and return a cleaned DataFrame.
    
    Args:
        list_of_csvs: List of CSV text strings with NASA data
        
    Returns:
        pd.DataFrame: Cleaned and concatenated DataFrame with renamed columns
        
    Raises:
        ValueError: If no valid data is found in the CSV files
    """
    if not list_of_csvs:
        raise ValueError("NASA CSV list is empty.")

    list_of_dfs = []
    for i, csv_text in enumerate(list_of_csvs):
        try:
            header_end_str = "-END HEADER-"
            header_end_pos = csv_text.find(header_end_str)
            if header_end_pos != -1:
                data_text = csv_text[header_end_pos + len(header_end_str):].lstrip()
                if data_text:
                    csv_data_io = io.StringIO(data_text)
                    df = pd.read_csv(csv_data_io)
                    df.replace(-999, pd.NA, inplace=True)
                    list_of_dfs.append(df)
        except Exception as e:
            print(f"Error processing CSV #{i + 1}: {e}")

    if not list_of_dfs:
        raise ValueError("No valid data found in NASA files after processing.")

    df_full = pd.concat(list_of_dfs, ignore_index=True).dropna()

    rename_map = {
        'T2M_MAX': 'temp_max',
        'T2M_MIN': 'temp_min',
        'T2M': 'temp_avg',
        'PRECTOTCORR': 'precipitation',
        'WS2M': 'wind_speed',
        'RH2M': 'humidity'
    }
    df_full.rename(columns=rename_map, inplace=True)

    if len(df_full) == 0:
        raise ValueError("No valid data remaining after cleaning missing values.")
    
    return df_full


def calculate_climate_statistics(df: pd.DataFrame, lat: float, lon: float) -> dict:
    """
    Calculate comprehensive climate statistics from cleaned weather data.
    
    Args:
        df: Cleaned DataFrame with weather data
        lat: Latitude of the location
        lon: Longitude of the location
        
    Returns:
        dict: Dictionary containing all climate analysis results
    """
    total_years = len(df)

    # Cálculos de chuva
    rainy_days = df[df['precipitation'] > 1.0].shape[0]
    rain_frequency_percent = round((rainy_days / total_years) * 100, 2)

    # Cálculos de temperatura
    temp_max_values = df['temp_max']
    temp_min_values = df['temp_min']
    temp_avg_values = df['temp_avg']
    
    # Estatísticas básicas de temperatura
    avg_max_temp = round(temp_max_values.mean(), 2)
    avg_min_temp = round(temp_min_values.mean(), 2)
    median_temp = round(temp_avg_values.median(), 2)
    record_max_temp = round(temp_max_values.max(), 2)
    record_min_temp = round(temp_min_values.min(), 2)
    temp_std_dev = round(temp_max_values.std(), 2)
    
    # Percentis de temperatura
    temp_10th_percentile = round(np.percentile(temp_max_values, 10), 2)
    temp_90th_percentile = round(np.percentile(temp_max_values, 90), 2)
    
    # Variabilidade ano a ano - para medir consistência climática
    # Calcula o desvio padrão das temperaturas máximas para entender a variabilidade anual
    yearly_temp_variability = round(temp_max_values.std(), 2)
    
    # Coeficiente de variação para normalizar a variabilidade pela média
    temp_coefficient_variation = round((yearly_temp_variability / avg_max_temp) * 100, 2) if avg_max_temp > 0 else 0
    
    # Classificação da variabilidade baseada no coeficiente de variação
    if temp_coefficient_variation < 5:
        variability_classification = "very_consistent"
        variability_description = "Temperature very consistent year after year"
    elif temp_coefficient_variation < 10:
        variability_classification = "consistent" 
        variability_description = "Temperature relatively consistent"
    elif temp_coefficient_variation < 15:
        variability_classification = "moderate"
        variability_description = "Moderate temperature variability"
    else:
        variability_classification = "high"
        variability_description = "High temperature variability between years"
    
    # Velocidade média do vento
    avg_wind_speed = round(df['wind_speed'].mean(), 2)
    
    # Cálculos de umidade relativa
    humidity_values = df['humidity']
    avg_humidity = round(humidity_values.mean(), 2)
    min_humidity = round(humidity_values.min(), 2)
    max_humidity = round(humidity_values.max(), 2)
    humidity_std_dev = round(humidity_values.std(), 2)
    
    # Percentis de umidade
    humidity_10th_percentile = round(np.percentile(humidity_values, 10), 2)
    humidity_90th_percentile = round(np.percentile(humidity_values, 90), 2)
    
    # Cálculos de probabilidade de clima quente/frio
    # Usando os percentis 25 e 75 como thresholds para classificar temperaturas
    temp_25th_percentile = np.percentile(temp_max_values, 25)
    temp_75th_percentile = np.percentile(temp_max_values, 75)
    
    hot_days = df[df['temp_max'] > temp_75th_percentile].shape[0]
    cold_days = df[df['temp_max'] < temp_25th_percentile].shape[0]
    
    hot_probability_percent = round((hot_days / total_years) * 100, 2)
    cold_probability_percent = round((cold_days / total_years) * 100, 2)
    
    # Cálculos de probabilidade de clima úmido/seco
    # Usando os percentis 25 e 75 como thresholds para classificar umidade
    humidity_25th_percentile = np.percentile(humidity_values, 25)
    humidity_75th_percentile = np.percentile(humidity_values, 75)
    
    humid_days = df[df['humidity'] > humidity_75th_percentile].shape[0]
    dry_days = df[df['humidity'] < humidity_25th_percentile].shape[0]
    
    humid_probability_percent = round((humid_days / total_years) * 100, 2)
    dry_probability_percent = round((dry_days / total_years) * 100, 2)

    # Tendência de temperatura (regressão linear)
    if total_years > 1:
        regression_result = stats.linregress(df['YEAR'], df['temp_max'])  # type: ignore
        slope = float(regression_result[0])  # First element is slope  # type: ignore
        trend_desc = "warming" if slope > 0.01 else "cooling" if slope < -0.01 else "stable"
        trend_slope = round(slope, 4)
    else:
        trend_desc = "insufficient data"
        trend_slope = 0.0

    analysis = {
        "location": {
            "lat": lat,
            "lon": lon,
        },
        "analysis_period": {
            "start_year": int(df['YEAR'].min()),
            "end_year": int(df['YEAR'].max()),
            "total_years_analyzed": total_years,
        },
        "rain_probability": {
            "threshold_mm": 1.0,
            "probability_percent": rain_frequency_percent,
            "rainy_days_count": rainy_days,
            "dry_days_count": total_years - rainy_days,
            "frequency_analysis": {
                "rainy_days": rainy_days,
                "total_days": total_years,
                "percentage": rain_frequency_percent
            }
        },
        "temperature_probability": {
            "hot_threshold_c": round(temp_75th_percentile, 2),
            "cold_threshold_c": round(temp_25th_percentile, 2),
            "hot_probability_percent": hot_probability_percent,
            "cold_probability_percent": cold_probability_percent,
            "hot_days_count": hot_days,
            "cold_days_count": cold_days,
            "normal_days_count": total_years - hot_days - cold_days,
            "classification_method": "25th and 75th percentile thresholds"
        },
        "humidity_probability": {
            "humid_threshold_percent": round(humidity_75th_percentile, 2),
            "dry_threshold_percent": round(humidity_25th_percentile, 2),
            "humid_probability_percent": humid_probability_percent,
            "dry_probability_percent": dry_probability_percent,
            "humid_days_count": humid_days,
            "dry_days_count": dry_days,
            "normal_days_count": total_years - humid_days - dry_days,
            "classification_method": "25th and 75th percentile thresholds"
        },
        "temperature": {
            "avg_max_c": avg_max_temp,
            "avg_min_c": avg_min_temp,
            "median_c": median_temp,
            "record_max_c": record_max_temp,
            "record_min_c": record_min_temp,
            "std_dev": temp_std_dev,
            "percentiles": {
                "10th_percentile_c": temp_10th_percentile,
                "90th_percentile_c": temp_90th_percentile
            },
            "variability_analysis": {
                "coefficient_of_variation": round((temp_std_dev / avg_max_temp) * 100, 2) if avg_max_temp > 0 else 0,
                "temperature_range_c": round(record_max_temp - record_min_temp, 2),
                "yearly_variability": {
                    "std_dev_c": yearly_temp_variability,
                    "coefficient_variation_percent": temp_coefficient_variation,
                    "classification": variability_classification,
                    "description": variability_description,
                    "interpretation": f"Temperature varies by ±{yearly_temp_variability}°C on average from year to year"
                }
            },
            "trend": {
                "slope": trend_slope,
                "description": trend_desc,
                "interpretation": f"Temperature is {'increasing' if slope > 0.01 else 'decreasing' if slope < -0.01 else 'stable'} at {abs(trend_slope):.4f}°C per year"
            }
        },
        "wind": {
            "avg_speed_ms": avg_wind_speed
        },
        "humidity": {
            "avg_percent": avg_humidity,
            "min_percent": min_humidity,
            "max_percent": max_humidity,
            "std_dev": humidity_std_dev,
            "percentiles": {
                "10th_percentile_percent": humidity_10th_percentile,
                "90th_percentile_percent": humidity_90th_percentile
            },
            "range_percent": round(max_humidity - min_humidity, 2)
        },
        "summary_statistics": {
            "data_quality": "good" if total_years >= 20 else "limited" if total_years >= 10 else "insufficient",
            "confidence_level": "high" if total_years >= 25 else "medium" if total_years >= 15 else "low"
        }
    }
    return analysis


def process_and_analyze_data(list_of_csvs: list[str], lat: float, lon: float) -> dict:
    """
    Main function to process CSV data and perform climate analysis.
    
    Args:
        list_of_csvs: List of CSV text strings with NASA data
        lat: Latitude of the location
        lon: Longitude of the location
        
    Returns:
        dict: Dictionary containing all climate analysis results or error message
    """
    try:
        # Process CSV data
        df = process_csv_data(list_of_csvs)
        
        # Calculate statistics
        analysis = calculate_climate_statistics(df, lat, lon)
        
        return analysis
        
    except ValueError as e:
        return {"error": str(e)}
    except Exception as e:
        return {"error": f"Unexpected error during analysis: {str(e)}"}