"""
Temperature analyzer module.
"""
import pandas as pd
import numpy as np
from typing import Dict, Any
from scipy import stats
from .base_analyzer import BaseAnalyzer
from config import config


class TemperatureAnalyzer(BaseAnalyzer):
    """Analyzer for temperature statistics and trends."""
    
    @property
    def name(self) -> str:
        return "TemperatureAnalyzer"
    
    def analyze(self, df: pd.DataFrame, **kwargs) -> Dict[str, Any]:
        """
        Analyze temperature statistics, variability, and trends.
        
        Args:
            df: DataFrame with temperature columns
            **kwargs: Additional parameters (unused)
            
        Returns:
            Dictionary with temperature analysis results
        """
        self.validate_data(df, ['temp_max', 'temp_min', 'temp_avg', 'YEAR'])
        
        temp_max_values = df['temp_max']
        temp_min_values = df['temp_min']
        temp_avg_values = df['temp_avg']
        
        # Basic statistics
        avg_max_temp = round(temp_max_values.mean(), 2)
        avg_min_temp = round(temp_min_values.mean(), 2)
        median_temp = round(temp_avg_values.median(), 2)
        record_max_temp = round(temp_max_values.max(), 2)
        record_min_temp = round(temp_min_values.min(), 2)
        temp_std_dev = round(temp_avg_values.std(), 2)
        
        # Percentiles
        temp_10th_percentile = round(np.percentile(temp_min_values, 10), 2)
        temp_90th_percentile = round(np.percentile(temp_max_values, 90), 2)
        
        # Variability analysis (using average temperatures)
        yearly_temp_variability = round(temp_avg_values.std(), 2)
        avg_temp = round(temp_avg_values.mean(), 2)
        temp_coefficient_variation = round((yearly_temp_variability / avg_temp) * 100, 2) if avg_temp > 0 else 0
        
        # Classify variability
        variability_info = self._classify_variability(temp_coefficient_variation, yearly_temp_variability)
        
        # Calculate trend (using average temperatures)
        trend_info = self._calculate_trend(df['YEAR'], df['temp_avg'])
        
        return {
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
                "coefficient_of_variation": round((temp_std_dev / avg_temp) * 100, 2) if avg_temp > 0 else 0,
                "temperature_range_c": round(record_max_temp - record_min_temp, 2),
                "yearly_variability": variability_info
            },
            "trend": trend_info
        }
    
    def _classify_variability(self, cv: float, std_dev: float) -> Dict[str, Any]:
        """Classify temperature variability based on coefficient of variation."""
        if cv < config.TEMP_CV_VERY_CONSISTENT:
            classification = "very_consistent"
            description = "Temperature very consistent year after year"
        elif cv < config.TEMP_CV_CONSISTENT:
            classification = "consistent"
            description = "Temperature relatively consistent"
        elif cv < config.TEMP_CV_MODERATE:
            classification = "moderate"
            description = "Moderate temperature variability"
        else:
            classification = "high"
            description = "High temperature variability between years"
        
        return {
            "std_dev_c": std_dev,
            "coefficient_variation_percent": cv,
            "classification": classification,
            "description": description,
            "interpretation": f"Temperature varies by ±{std_dev}°C on average from year to year"
        }
    
    def _calculate_trend(self, years: pd.Series, temps: pd.Series) -> Dict[str, Any]:
        """Calculate temperature trend using linear regression."""
        if len(years) > 1:
            regression_result = stats.linregress(years, temps)
            slope = float(regression_result.slope)
            trend_slope = round(slope, 4)
            
            threshold = config.TEMP_TREND_STABLE_THRESHOLD
            if slope > threshold:
                trend_desc = "warming"
                interpretation = f"Temperature is increasing at {abs(trend_slope):.4f}°C per year"
            elif slope < -threshold:
                trend_desc = "cooling"
                interpretation = f"Temperature is decreasing at {abs(trend_slope):.4f}°C per year"
            else:
                trend_desc = "stable"
                interpretation = f"Temperature is stable at {abs(trend_slope):.4f}°C per year"
        else:
            trend_desc = "insufficient data"
            trend_slope = 0.0
            interpretation = "Not enough data to determine temperature trend"
        
        return {
            "slope": trend_slope,
            "description": trend_desc,
            "interpretation": interpretation
        }
