from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# Importa as funções e modelos dos outros arquivos
from services.nasa_service import get_historical_data_for_day
from analysis.statistics import process_and_analyze_data
from schemas import ClimateAnalysisResponse

app = FastAPI(
    title="Vai Chover no Meu Desfile? API",
    description="Provides historical climate analysis for a specific date and location.",
    version="1.0.0"
)

# --- CORS Middleware ---
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/climate-analysis", response_model=ClimateAnalysisResponse)
async def get_climate_analysis(
        lat: float = Query(..., description="Latitude", example=-9.665),
        lon: float = Query(..., description="Longitude", example=-35.735),
        day: int = Query(..., ge=1, le=31, description="Day of the month", example=4),
        month: int = Query(..., ge=1, le=12, description="Month of the year", example=10)
):
    """
    Main endpoint that returns comprehensive climate analysis.
    """
    nasa_params = ["T2M_MAX", "T2M_MIN", "T2M", "PRECTOTCORR", "WS2M", "RH2M"]

    try:
        # 1. Call the service to fetch NASA data
        list_of_csvs = await get_historical_data_for_day(lat, lon, nasa_params, month, day)

        if not list_of_csvs:
            raise HTTPException(status_code=404, detail="No historical data found for this location/date.")

        # 2. Call the analysis module to process the data
        analysis_result = process_and_analyze_data(list_of_csvs, lat, lon)

        if "error" in analysis_result:
            raise HTTPException(status_code=500, detail=analysis_result["error"])

        # 3. Return the result
        return analysis_result

    except Exception as e:
        # This print will be very useful if something goes wrong
        print(f"Unexpected error occurred in endpoint: {e}")
        # Complete traceback will also appear in terminal
        raise HTTPException(status_code=500, detail="Internal server error occurred.")