import pandas as pd
import io
from typing import List, Optional
from exceptions import DataProcessingError, InsufficientDataError
from .rain_analyzer import RainAnalyzer
from .temperature_analyzer import TemperatureAnalyzer
from .temperature_probability_analyzer import TemperatureProbabilityAnalyzer
from .humidity_analyzer import HumidityAnalyzer
from .humidity_probability_analyzer import HumidityProbabilityAnalyzer
from .wind_analyzer import WindAnalyzer
from .data_quality_analyzer import DataQualityAnalyzer
from .base_analyzer import BaseAnalyzer


def process_csv_data(list_of_csvs: list[str]) -> pd.DataFrame:
    """
    Process a list of CSV strings from NASA and return a cleaned DataFrame.
    
    Args:
        list_of_csvs: List of CSV text strings with NASA data
        
    Returns:
        pd.DataFrame: Cleaned and concatenated DataFrame with renamed columns
        
    Raises:
        InsufficientDataError: If no valid data is found in the CSV files
    """
    if not list_of_csvs:
        raise InsufficientDataError("NASA CSV list is empty.")

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
        raise InsufficientDataError("No valid data found in NASA files after processing.")

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
        raise InsufficientDataError("No valid data remaining after cleaning missing values.")
    
    return df_full


def calculate_climate_statistics(df: pd.DataFrame, lat: float, lon: float, 
                                analyzers: Optional[List[BaseAnalyzer]] = None) -> dict:
    """
    Calculate comprehensive climate statistics using pluggable analyzers.
    
    Args:
        df: Cleaned DataFrame with weather data
        lat: Latitude of the location
        lon: Longitude of the location
        analyzers: Optional list of analyzer instances to use
        
    Returns:
        dict: Dictionary containing all climate analysis results
    """
    # Use default analyzers if none provided
    if analyzers is None:
        analyzers = [
            RainAnalyzer(),
            TemperatureAnalyzer(),
            TemperatureProbabilityAnalyzer(),
            HumidityAnalyzer(),
            HumidityProbabilityAnalyzer(),
            WindAnalyzer(),
            DataQualityAnalyzer()
        ]
    
    # Base analysis structure
    analysis = {
        "location": {
            "lat": lat,
            "lon": lon,
        },
        "analysis_period": {
            "start_year": int(df['YEAR'].min()),
            "end_year": int(df['YEAR'].max()),
            "total_years_analyzed": len(df),
        }
    }
    
    # Run each analyzer
    for analyzer in analyzers:
        try:
            result = analyzer.analyze(df)
            
            # Map analyzer results to expected keys
            if isinstance(analyzer, RainAnalyzer):
                analysis["rain_probability"] = result
            elif isinstance(analyzer, TemperatureAnalyzer):
                analysis["temperature"] = result
            elif isinstance(analyzer, TemperatureProbabilityAnalyzer):
                analysis["temperature_probability"] = result
            elif isinstance(analyzer, HumidityAnalyzer):
                analysis["humidity"] = result
            elif isinstance(analyzer, HumidityProbabilityAnalyzer):
                analysis["humidity_probability"] = result
            elif isinstance(analyzer, WindAnalyzer):
                analysis["wind"] = result
            elif isinstance(analyzer, DataQualityAnalyzer):
                analysis["summary_statistics"] = result
                
        except Exception as e:
            print(f"Error in {analyzer.name}: {e}")
            # Continue with other analyzers
    
    return analysis


def process_and_analyze_data(list_of_csvs: list[str], lat: float, lon: float,
                            analyzers: Optional[List[BaseAnalyzer]] = None) -> dict:
    """
    Main function to process CSV data and perform climate analysis.
    
    Args:
        list_of_csvs: List of CSV text strings with NASA data
        lat: Latitude of the location
        lon: Longitude of the location
        analyzers: Optional list of analyzer instances to use
        
    Returns:
        dict: Dictionary containing all climate analysis results or error message
    """
    try:
        # Process CSV data
        df = process_csv_data(list_of_csvs)
        
        # Calculate statistics using pluggable analyzers
        analysis = calculate_climate_statistics(df, lat, lon, analyzers)
        
        return analysis
        
    except (InsufficientDataError, DataProcessingError) as e:
        return {"error": str(e)}
    except Exception as e:
        return {"error": f"Unexpected error during analysis: {str(e)}"}
