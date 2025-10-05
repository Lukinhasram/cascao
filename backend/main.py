from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# Importa as funções e modelos dos outros arquivos
from services.nasa_service import get_historical_data_for_day
from analysis.statistics import process_and_analyze_data
from schemas import ClimateAnalysisResponse

app = FastAPI(
    title="Vai Chover no Meu Desfile? API",
    description="Fornece análises climatológicas históricas para uma data e local específicos.",
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
        day: int = Query(..., ge=1, le=31, description="Dia do mês", example=4),
        month: int = Query(..., ge=1, le=12, description="Mês do ano", example=10)
):
    """
    Endpoint principal que retorna a análise climatológica completa.
    """
    nasa_params = ["T2M_MAX", "T2M_MIN", "T2M", "PRECTOTCORR", "WS2M"]

    try:
        # 1. Chama o serviço para buscar os dados da NASA
        list_of_csvs = await get_historical_data_for_day(lat, lon, nasa_params, month, day)

        if not list_of_csvs:
            raise HTTPException(status_code=404, detail="Nenhum dado histórico encontrado para este local/data.")

        # 2. Chama o módulo de análise para processar os dados
        analysis_result = process_and_analyze_data(list_of_csvs, lat, lon)

        if "error" in analysis_result:
            raise HTTPException(status_code=500, detail=analysis_result["error"])

        # 3. Retorna o resultado
        return analysis_result

    except Exception as e:
        # Este print agora será muito útil se algo der errado
        print(f"Ocorreu um erro inesperado no endpoint: {e}")
        # O traceback completo também aparecerá no terminal
        raise HTTPException(status_code=500, detail="Ocorreu um erro interno no servidor.")