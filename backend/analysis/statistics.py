import pandas as pd
import io
import numpy as np
from scipy import stats


def process_and_analyze_data(list_of_csvs: list[str], lat: float, lon: float) -> dict:
    # ... (o começo da função continua igual até o df_full.rename) ...
    if not list_of_csvs:
        return {"error": "A lista de CSVs da NASA chegou vazia."}

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
            print(f"Erro ao processar o CSV #{i + 1}: {e}")

    if not list_of_dfs:
        return {"error": "Nenhum dado válido foi encontrado nos arquivos da NASA após o processamento."}

    df_full = pd.concat(list_of_dfs, ignore_index=True).dropna()

    rename_map = {
        'T2M_MAX': 'temp_max',
        'T2M_MIN': 'temp_min',
        'T2M': 'temp_avg',
        'PRECTOTCORR': 'precipitation',
        'WS2M': 'wind_speed'
    }
    df_full.rename(columns=rename_map, inplace=True)

    total_years = len(df_full)
    if total_years == 0:
        return {"error": "Nenhum dado válido restou após a limpeza de valores ausentes."}

    # Cálculos de chuva
    rainy_days = df_full[df_full['precipitation'] > 1.0].shape[0]
    rain_frequency_percent = round((rainy_days / total_years) * 100, 2)

    # Cálculos de temperatura
    temp_max_values = df_full['temp_max']
    temp_min_values = df_full['temp_min']
    temp_avg_values = df_full['temp_avg']
    
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
    
    # Velocidade média do vento
    avg_wind_speed = round(df_full['wind_speed'].mean(), 2)

    # Tendência de temperatura (regressão linear)
    if total_years > 1:
        slope, intercept, _, _, _ = stats.linregress(df_full['YEAR'], df_full['temp_max'])
        trend_desc = "warming" if slope > 0.01 else "cooling" if slope < -0.01 else "stable"
        trend_slope = round(slope, 4)
    else:
        trend_desc = "insufficient data"
        trend_slope = 0

    analysis = {
        "location": {
            "lat": lat,
            "lon": lon,
        },
        "analysis_period": {
            "start_year": int(df_full['YEAR'].min()),
            "end_year": int(df_full['YEAR'].max()),
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
                "temperature_range_c": round(record_max_temp - record_min_temp, 2)
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
        "summary_statistics": {
            "data_quality": "good" if total_years >= 20 else "limited" if total_years >= 10 else "insufficient",
            "confidence_level": "high" if total_years >= 25 else "medium" if total_years >= 15 else "low"
        }
    }
    return analysis