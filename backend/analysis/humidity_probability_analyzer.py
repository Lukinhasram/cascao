"""
Humidity probability analyzer module.
"""
import pandas as pd
import numpy as np
from typing import Dict, Any
from .base_analyzer import BaseAnalyzer
from config import config


class HumidityProbabilityAnalyzer(BaseAnalyzer):
    """Analyzer for humid/dry day probabilities."""
    
    @property
    def name(self) -> str:
        return "HumidityProbabilityAnalyzer"
    
    def analyze(self, df: pd.DataFrame, **kwargs) -> Dict[str, Any]:
        """
        Analyze probability of humid and dry days.
        
        Args:
            df: DataFrame with 'humidity' column
            **kwargs: Additional parameters (unused)
            
        Returns:
            Dictionary with humidity probability analysis
        """
        self.validate_data(df, ['humidity'])
        
        total_years = len(df)
        humidity_values = df['humidity']
        
        # Calculate percentile thresholds
        dry_percentile = config.PERCENTILE_DRY
        humid_percentile = config.PERCENTILE_HUMID
        
        humidity_dry_threshold = np.percentile(humidity_values, dry_percentile)
        humidity_humid_threshold = np.percentile(humidity_values, humid_percentile)
        
        # Count days
        humid_days = df[df['humidity'] > humidity_humid_threshold].shape[0]
        dry_days = df[df['humidity'] < humidity_dry_threshold].shape[0]
        normal_days = total_years - humid_days - dry_days
        
        # Calculate probabilities
        humid_probability_percent = round((humid_days / total_years) * 100, 2) if total_years > 0 else 0.0
        dry_probability_percent = round((dry_days / total_years) * 100, 2) if total_years > 0 else 0.0
        
        return {
            "humid_threshold_percent": round(humidity_humid_threshold, 2),
            "dry_threshold_percent": round(humidity_dry_threshold, 2),
            "humid_probability_percent": humid_probability_percent,
            "dry_probability_percent": dry_probability_percent,
            "humid_days_count": int(humid_days),
            "dry_days_count": int(dry_days),
            "normal_days_count": int(normal_days),
            "classification_method": f"{dry_percentile}th and {humid_percentile}th percentile thresholds"
        }
