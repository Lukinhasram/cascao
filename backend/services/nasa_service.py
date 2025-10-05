import httpx
import asyncio
from datetime import datetime

BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"


async def get_nasa_data(latitude: float, longitude: float, parameters: list[str], start_date: str, end_date: str):
    """Fetch daily data from NASA POWER API for a specific geographic point."""
    parameters_str = ",".join(parameters)
    params = {
        "start": start_date,
        "end": end_date,
        "latitude": latitude,
        "longitude": longitude,
        "community": "AG",
        "parameters": parameters_str,
        "format": "CSV"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(BASE_URL, params=params, timeout=45.0)
            response.raise_for_status()
            return response.text
        except (httpx.HTTPStatusError, httpx.RequestError) as e:
            print(f"Request error for period {start_date}-{end_date}: {e}")
            return None


async def get_historical_data_for_day(latitude: float, longitude: float, parameters: list[str], month: int, day: int):
    """Fetch data for the same day/month across different years, concurrently."""
    current_year = datetime.now().year
    day_month_str = f"{str(month).zfill(2)}{str(day).zfill(2)}"
    tasks = []

    for year in range(2000, current_year):  # Excludes current year as it may be incomplete
        date_str = f"{year}{day_month_str}"
        task = get_nasa_data(latitude, longitude, parameters, date_str, date_str)
        tasks.append(task)

    results = await asyncio.gather(*tasks)
    return [res for res in results if res]

    for year in range(1985, current_year):  # Não inclui o ano atual, pois pode estar incompleto
        date_str = f"{year}{day_month_str}"
        task = get_nasa_data(latitude, longitude, parametros, date_str, date_str)
        tasks.append(task)

    results = await asyncio.gather(*tasks)
    return [res for res in results if res]