"""
Humidity analyzer module.
"""
import pandas as pd
import numpy as np
from typing import Dict, Any
from .base_analyzer import BaseAnalyzer
from config import config


class HumidityAnalyzer(BaseAnalyzer):
    """Analyzer for humidity statistics."""
    
    @property
    def name(self) -> str:
        return "HumidityAnalyzer"
    
    def analyze(self, df: pd.DataFrame, **kwargs) -> Dict[str, Any]:
        """
        Analyze humidity statistics.
        
        Args:
            df: DataFrame with 'humidity' column
            **kwargs: Additional parameters (unused)
            
        Returns:
            Dictionary with humidity analysis results
        """
        self.validate_data(df, ['humidity'])
        
        humidity_values = df['humidity']
        
        # Basic statistics
        avg_humidity = round(humidity_values.mean(), 2)
        min_humidity = round(humidity_values.min(), 2)
        max_humidity = round(humidity_values.max(), 2)
        humidity_std_dev = round(humidity_values.std(), 2)
        
        # Percentiles
        humidity_10th_percentile = round(np.percentile(humidity_values, 10), 2)
        humidity_90th_percentile = round(np.percentile(humidity_values, 90), 2)
        
        return {
            "avg_percent": avg_humidity,
            "min_percent": min_humidity,
            "max_percent": max_humidity,
            "std_dev": humidity_std_dev,
            "percentiles": {
                "10th_percentile_percent": humidity_10th_percentile,
                "90th_percentile_percent": humidity_90th_percentile
            },
            "range_percent": round(max_humidity - min_humidity, 2)
        }
