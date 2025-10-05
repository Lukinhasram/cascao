"""
Rain probability analyzer module.
"""
import pandas as pd
from typing import Dict, Any
from .base_analyzer import BaseAnalyzer
from config import config


class RainAnalyzer(BaseAnalyzer):
    """Analyzer for rain probability and frequency."""
    
    @property
    def name(self) -> str:
        return "RainAnalyzer"
    
    def analyze(self, df: pd.DataFrame, **kwargs) -> Dict[str, Any]:
        """
        Analyze rain probability and patterns.
        
        Args:
            df: DataFrame with 'precipitation' column
            **kwargs: Additional parameters (unused)
            
        Returns:
            Dictionary with rain analysis results
        """
        self.validate_data(df, ['precipitation'])
        
        total_years = len(df)
        rain_threshold = config.RAIN_THRESHOLD_MM
        
        # Calculate rainy days
        rainy_days = df[df['precipitation'] > rain_threshold].shape[0]
        dry_days = total_years - rainy_days
        rain_frequency_percent = round((rainy_days / total_years) * 100, 2) if total_years > 0 else 0.0
        
        return {
            "threshold_mm": rain_threshold,
            "probability_percent": rain_frequency_percent,
            "rainy_days_count": int(rainy_days),
            "dry_days_count": int(dry_days),
            "frequency_analysis": {
                "rainy_days": int(rainy_days),
                "total_days": int(total_years),
                "percentage": rain_frequency_percent
            }
        }
