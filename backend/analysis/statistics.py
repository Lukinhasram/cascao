import pandas as pd
import io
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
        'PRECTOTCORR': 'precipitation',
        'WS2M': 'wind_speed'
    }
    df_full.rename(columns=rename_map, inplace=True)

    total_years = len(df_full)
    if total_years == 0:
        return {"error": "Nenhum dado válido restou após a limpeza de valores ausentes."}

    rainy_days = df_full[df_full['precipitation'] > 1.0].shape[0]

    if total_years > 1:
        slope, intercept, _, _, _ = stats.linregress(df_full['YEAR'], df_full['temp_max'])
        trend_desc = "warming" if slope > 0.01 else "cooling" if slope < -0.01 else "stable"
        trend_slope = round(slope, 4)
    else:
        trend_desc = "insufficient data"
        trend_slope = 0

    analysis = {
        "location": {
            "lat": lat,  # CORRIGIDO
            "lon": lon,  # CORRIGIDO
        },
        "analysis_period": {
            "start_year": int(df_full['YEAR'].min()),
            "end_year": int(df_full['YEAR'].max()),
            "total_years_analyzed": total_years,
        },
        "rain_probability": {
            "threshold_mm": 1.0,
            "probability_percent": round((rainy_days / total_years) * 100, 2),
        },
        "temperature": {
            "avg_max_c": round(df_full['temp_max'].mean(), 2),
            "avg_min_c": round(df_full['temp_min'].mean(), 2),
            "record_max_c": round(df_full['temp_max'].max(), 2),
            "record_min_c": round(df_full['temp_min'].min(), 2),
            "std_dev": round(df_full['temp_max'].std(), 2),
            "trend": {
                "slope": trend_slope,
                "description": trend_desc
            }
        },
        "wind": {
            "avg_speed_ms": round(df_full['wind_speed'].mean(), 2)
        }
    }
    return analysis