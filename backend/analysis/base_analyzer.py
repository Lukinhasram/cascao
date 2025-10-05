"""
Base analyzer class for pluggable analysis modules.
"""
from abc import ABC, abstractmethod
import pandas as pd
from typing import Dict, Any


class BaseAnalyzer(ABC):
    """Abstract base class for climate data analyzers."""
    
    def __init__(self, config=None):
        """
        Initialize the analyzer with optional configuration.
        
        Args:
            config: Configuration object with analysis parameters
        """
        self.config = config
    
    @abstractmethod
    def analyze(self, df: pd.DataFrame, **kwargs) -> Dict[str, Any]:
        """
        Perform analysis on the climate data.
        
        Args:
            df: Cleaned DataFrame with climate data
            **kwargs: Additional parameters for analysis
            
        Returns:
            Dictionary containing analysis results
        """
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Return the name of this analyzer."""
        pass
    
    def validate_data(self, df: pd.DataFrame, required_columns: list) -> None:
        """
        Validate that required columns exist in the DataFrame.
        
        Args:
            df: DataFrame to validate
            required_columns: List of required column names
            
        Raises:
            ValueError: If required columns are missing
        """
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"{self.name}: Missing required columns: {missing_columns}")
