"""
Temperature probability analyzer module.
"""
import pandas as pd
import numpy as np
from typing import Dict, Any
from .base_analyzer import BaseAnalyzer
from config import config


class TemperatureProbabilityAnalyzer(BaseAnalyzer):
    """Analyzer for hot/cold day probabilities."""
    
    @property
    def name(self) -> str:
        return "TemperatureProbabilityAnalyzer"
    
    def analyze(self, df: pd.DataFrame, **kwargs) -> Dict[str, Any]:
        """
        Analyze probability of hot and cold days.
        
        Args:
            df: DataFrame with 'temp_min' and 'temp_max' columns
            **kwargs: Additional parameters (unused)
            
        Returns:
            Dictionary with temperature probability analysis
        """
        self.validate_data(df, ['temp_min', 'temp_max'])
        
        total_years = len(df)
        temp_min_values = df['temp_min']
        temp_max_values = df['temp_max']
        
        # Calculate percentile thresholds
        cold_percentile = config.PERCENTILE_COLD
        hot_percentile = config.PERCENTILE_HOT
        
        temp_cold_threshold = np.percentile(temp_min_values, cold_percentile)
        temp_hot_threshold = np.percentile(temp_max_values, hot_percentile)
        
        # Count days
        hot_days = df[df['temp_max'] > temp_hot_threshold].shape[0]
        cold_days = df[df['temp_min'] < temp_cold_threshold].shape[0]
        normal_days = total_years - hot_days - cold_days
        
        # Calculate probabilities
        hot_probability_percent = round((hot_days / total_years) * 100, 2) if total_years > 0 else 0.0
        cold_probability_percent = round((cold_days / total_years) * 100, 2) if total_years > 0 else 0.0
        
        return {
            "hot_threshold_c": round(temp_hot_threshold, 2),
            "cold_threshold_c": round(temp_cold_threshold, 2),
            "hot_probability_percent": hot_probability_percent,
            "cold_probability_percent": cold_probability_percent,
            "hot_days_count": int(hot_days),
            "cold_days_count": int(cold_days),
            "normal_days_count": int(normal_days),
            "classification_method": f"{cold_percentile}th and {hot_percentile}th percentile thresholds"
        }
