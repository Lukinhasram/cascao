from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# Import configuration
from config import config

# Import custom exceptions
from exceptions import (
    ClimateAPIException, 
    DataSourceError, 
    NASAAPIError,
    InsufficientDataError,
    DataProcessingError
)

# Import services and schemas
from services.nasa_service import get_historical_data_for_day
from analysis.statistics import process_and_analyze_data
from schemas import ClimateAnalysisResponse

# Create FastAPI app with versioning
app = FastAPI(
    title=config.API_TITLE,
    description=config.API_DESCRIPTION,
    version="1.0.0"
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint (non-versioned)
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": config.API_VERSION}


# V1 API Routes
@app.get(f"/{config.API_VERSION}/climate-analysis", response_model=ClimateAnalysisResponse)
async def get_climate_analysis(
        lat: float = Query(..., description="Latitude", example=-9.665),
        lon: float = Query(..., description="Longitude", example=-35.735),
        day: int = Query(..., ge=1, le=31, description="Day of the month", example=4),
        month: int = Query(..., ge=1, le=12, description="Month of the year", example=10),
        additional_parameters: str = Query(
            "", 
            description="Comma-separated list of additional parameters to analyze",
            example="solar_radiation,cloud_cover"
        )
):
    """
    Main endpoint that returns comprehensive climate analysis.
    
    This endpoint analyzes historical climate data for a specific date and location,
    providing probabilities and statistics for rain, temperature, humidity, and wind.
    Optionally includes analysis of multiple additional parameters.
    """
    try:
        # Determine which parameters to fetch from NASA
        parameters = config.NASA_PARAMETERS.copy()
        
        # Parse additional parameters
        requested_params = []
        if additional_parameters:
            requested_params = [p.strip() for p in additional_parameters.split(',') if p.strip()]
        
        # Add additional parameters if requested
        if requested_params:
            from analysis.additional_parameter_analyzer import PARAMETER_MAP
            for param in requested_params:
                if param in PARAMETER_MAP:
                    nasa_param = PARAMETER_MAP[param]['nasa_param']
                    if nasa_param not in parameters:
                        parameters.append(nasa_param)
        
        # 1. Call the service to fetch NASA data
        list_of_csvs = await get_historical_data_for_day(
            lat, lon, parameters, month, day
        )

        if not list_of_csvs:
            raise InsufficientDataError("No historical data found for this location/date.")

        # 2. Call the analysis module to process the data
        analysis_result = process_and_analyze_data(
            list_of_csvs, lat, lon, additional_parameters=requested_params
        )

        if "error" in analysis_result:
            raise DataProcessingError(analysis_result["error"])

        # 3. Return the result
        return analysis_result

    except InsufficientDataError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    except NASAAPIError as e:
        raise HTTPException(status_code=502, detail=f"External API error: {str(e)}")
    
    except DataProcessingError as e:
        raise HTTPException(status_code=422, detail=f"Data processing error: {str(e)}")
    
    except ClimateAPIException as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    
    except Exception as e:
        # Log unexpected errors
        print(f"Unexpected error occurred in endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error occurred.")


# Backwards compatibility - redirect old endpoint to new versioned one
@app.get("/climate-analysis", response_model=ClimateAnalysisResponse, include_in_schema=False)
async def get_climate_analysis_legacy(
        lat: float = Query(..., description="Latitude", example=-9.665),
        lon: float = Query(..., description="Longitude", example=-35.735),
        day: int = Query(..., ge=1, le=31, description="Day of the month", example=4),
        month: int = Query(..., ge=1, le=12, description="Month of the year", example=10)
):
    """Legacy endpoint for backwards compatibility. Use /v1/climate-analysis instead."""
    return await get_climate_analysis(lat, lon, day, month)