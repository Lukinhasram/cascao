import httpx
import asyncio
from datetime import datetime
from config import config
from exceptions import NASAAPIError

BASE_URL = config.NASA_BASE_URL


async def get_nasa_data(latitude: float, longitude: float, parameters: list[str], start_date: str, end_date: str):
    """Fetch daily data from NASA POWER API for a specific geographic point."""
    parameters_str = ",".join(parameters)
    params = {
        "start": start_date,
        "end": end_date,
        "latitude": latitude,
        "longitude": longitude,
        "community": config.NASA_COMMUNITY,
        "parameters": parameters_str,
        "format": config.NASA_FORMAT
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(BASE_URL, params=params, timeout=config.NASA_TIMEOUT)
            response.raise_for_status()
            return response.text
        except httpx.HTTPStatusError as e:
            print(f"HTTP error for period {start_date}-{end_date}: {e}")
            raise NASAAPIError(f"NASA API returned error: {e.response.status_code}")
        except httpx.RequestError as e:
            print(f"Request error for period {start_date}-{end_date}: {e}")
            return None


async def get_historical_data_for_day(latitude: float, longitude: float, parameters: list[str], month: int, day: int):
    """Fetch data for the same day/month across different years, concurrently."""
    current_year = datetime.now().year
    day_month_str = f"{str(month).zfill(2)}{str(day).zfill(2)}"
    tasks = []

    for year in range(config.START_YEAR, current_year):  # Excludes current year as it may be incomplete
        date_str = f"{year}{day_month_str}"
        task = get_nasa_data(latitude, longitude, parameters, date_str, date_str)
        tasks.append(task)

    results = await asyncio.gather(*tasks)
    return [res for res in results if res]