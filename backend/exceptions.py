"""
Custom exception classes for better error handling.
"""


class ClimateAPIException(Exception):
    """Base exception for all climate API errors."""
    pass


class DataSourceError(ClimateAPIException):
    """Raised when there's an error fetching data from external sources."""
    pass


class NASAAPIError(DataSourceError):
    """Raised when NASA POWER API request fails."""
    pass


class DataProcessingError(ClimateAPIException):
    """Raised when there's an error processing climate data."""
    pass


class InsufficientDataError(DataProcessingError):
    """Raised when there's not enough data for analysis."""
    pass


class DataValidationError(DataProcessingError):
    """Raised when data validation fails."""
    pass


class ConfigurationError(ClimateAPIException):
    """Raised when there's a configuration error."""
    pass


class AnalysisError(ClimateAPIException):
    """Raised when statistical analysis fails."""
    pass
