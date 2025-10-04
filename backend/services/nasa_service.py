import httpx
import asyncio
from datetime import datetime

BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"


async def get_nasa_data(latitude: float, longitude: float, parametros: list[str], start_date: str, end_date: str):
    """Busca dados diários da API NASA POWER para um ponto geográfico específico."""
    parametros_str = ",".join(parametros)
    params = {
        "start": start_date,
        "end": end_date,
        "latitude": latitude,
        "longitude": longitude,
        "community": "AG",
        "parameters": parametros_str,
        "format": "CSV"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(BASE_URL, params=params, timeout=45.0)
            response.raise_for_status()
            return response.text
        except (httpx.HTTPStatusError, httpx.RequestError) as e:
            print(f"Erro na requisição para o período {start_date}-{end_date}: {e}")
            return None


async def get_historical_data_for_day(latitude: float, longitude: float, parametros: list[str], month: int, day: int):
    """Busca dados para o mesmo dia/mês em diferentes anos, concorrentemente."""
    current_year = datetime.now().year
    day_month_str = f"{str(month).zfill(2)}{str(day).zfill(2)}"
    tasks = []

    for year in range(2000, current_year):  # Não inclui o ano atual, pois pode estar incompleto
        date_str = f"{year}{day_month_str}"
        task = get_nasa_data(latitude, longitude, parametros, date_str, date_str)
        tasks.append(task)

    results = await asyncio.gather(*tasks)
    return [res for res in results if res]