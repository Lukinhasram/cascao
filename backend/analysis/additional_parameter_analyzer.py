"""
Analyzer for additional parameters with basic statistical analysis.
"""
import pandas as pd
import numpy as np
from .base_analyzer import BaseAnalyzer


# Map parameter types to NASA API parameter names and units
PARAMETER_MAP = {
    'solar_radiation': {
        'nasa_param': 'ALLSKY_SFC_SW_DWN',
        'column_name': 'solar_radiation',
        'unit': 'kWh/m²/day',
        'name': 'solar_radiation'
    },
    'cloud_cover': {
        'nasa_param': 'CLOUD_AMT',
        'column_name': 'cloud_cover',
        'unit': '%',
        'name': 'cloud_cover'
    },
    'evapotranspiration': {
        'nasa_param': 'EVPTRNS',
        'column_name': 'evapotranspiration',
        'unit': 'mm/day',
        'name': 'evapotranspiration'
    },
    'surface_pressure': {
        'nasa_param': 'PS',
        'column_name': 'surface_pressure',
        'unit': 'kPa',
        'name': 'surface_pressure'
    }
}


class AdditionalParameterAnalyzer(BaseAnalyzer):
    """Analyzer for calculating basic statistics of additional parameters."""
    
    def __init__(self, parameter_type: str):
        """
        Initialize the analyzer.
        
        Args:
            parameter_type: Type of parameter to analyze (from PARAMETER_MAP keys)
        """
        if parameter_type not in PARAMETER_MAP:
            raise ValueError(f"Unknown parameter type: {parameter_type}")
        
        self.parameter_type = parameter_type
        self.param_info = PARAMETER_MAP[parameter_type]
        super().__init__()
    
    @property
    def name(self) -> str:
        """Return the name of this analyzer."""
        return f"{self.parameter_type}_analyzer"
    
    def analyze(self, df: pd.DataFrame) -> dict:
        """
        Calculate basic statistics for the additional parameter.
        
        Args:
            df: DataFrame with weather data containing the parameter column
            
        Returns:
            dict: Dictionary with statistical analysis
        """
        column = self.param_info['column_name']
        
        if column not in df.columns:
            raise ValueError(f"Column '{column}' not found in DataFrame")
        
        values = df[column].dropna()
        
        if len(values) == 0:
            raise ValueError(f"No valid data for {column}")
        
        # Calculate statistics
        return {
            "parameter_name": self.param_info['name'],
            "parameter_unit": self.param_info['unit'],
            "avg_value": float(values.mean()),
            "min_value": float(values.min()),
            "max_value": float(values.max()),
            "median_value": float(values.median()),
            "std_dev": float(values.std()),
            "percentiles": {
                "10th_percentile": float(np.percentile(values, 10)),
                "25th_percentile": float(np.percentile(values, 25)),
                "75th_percentile": float(np.percentile(values, 75)),
                "90th_percentile": float(np.percentile(values, 90))
            }
        }
