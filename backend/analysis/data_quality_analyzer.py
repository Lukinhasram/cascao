"""
Data quality analyzer module.
"""
import pandas as pd
from typing import Dict, Any
from .base_analyzer import BaseAnalyzer
from config import config


class DataQualityAnalyzer(BaseAnalyzer):
    """Analyzer for data quality assessment."""
    
    @property
    def name(self) -> str:
        return "DataQualityAnalyzer"
    
    def analyze(self, df: pd.DataFrame, **kwargs) -> Dict[str, Any]:
        """
        Assess data quality based on number of years.
        
        Args:
            df: DataFrame with climate data
            **kwargs: Additional parameters (unused)
            
        Returns:
            Dictionary with data quality assessment
        """
        total_years = len(df)
        
        # Determine data quality
        if total_years >= config.GOOD_DATA_MIN_YEARS:
            data_quality = "good"
        elif total_years >= config.LIMITED_DATA_MIN_YEARS:
            data_quality = "limited"
        else:
            data_quality = "insufficient"
        
        # Determine confidence level
        if total_years >= config.HIGH_CONFIDENCE_MIN_YEARS:
            confidence_level = "high"
        elif total_years >= config.MEDIUM_CONFIDENCE_MIN_YEARS:
            confidence_level = "medium"
        else:
            confidence_level = "low"
        
        return {
            "data_quality": data_quality,
            "confidence_level": confidence_level
        }
