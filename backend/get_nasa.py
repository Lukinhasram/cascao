import httpx
import asyncio
from datetime import datetime

BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

async def get_nasa_data(latitude: float, longitude: float, parametros: list[str], start_date: str, end_date: str):
    """
    Busca dados diários da API NASA POWER para um ponto geográfico específico.

    Args:
        latitude: A latitude do ponto.
        longitude: A longitude do ponto.
        parametros: Uma lista de strings com os parâmetros desejados (ex: ["T2M", "ALLSKY_SFC_SW_DWN"]).
        start_date: A data de início no formato YYYYMMDD.
        end_date: A data de fim no formato YYYYMMDD.

    Returns:
        O conteúdo da resposta da API em formato de texto (CSV, neste caso).
    """
    # Junta a lista de parâmetros em uma única string separada por vírgulas
    parametros_str = ",".join(parametros)

    # Dicionário com todos os parâmetros da requisição
    params = {
        "start": start_date,
        "end": end_date,
        "latitude": latitude,
        "longitude": longitude,
        "community": "AG",
        "parameters": parametros_str,
        "time-standard": "LST",
        "format": "CSV"
    }

    print(f"Buscando dados para Lat: {latitude}, Lon: {longitude} de {start_date} a {end_date}...")
    
    async with httpx.AsyncClient() as client:
        try:
            # Faz a requisição GET para a URL base com os parâmetros
            response = await client.get(BASE_URL, params=params, timeout=30.0)

            # Lança uma exceção se a requisição falhou
            response.raise_for_status()

            print("Dados recebidos com sucesso!")
            # Retorna o conteúdo da resposta, que neste caso é o CSV como texto
            return response.text

        except httpx.HTTPStatusError as e:
            print(f"Erro na requisição: {e.response.status_code} - {e.response.text}")
        except httpx.RequestError as e:
            print(f"Erro de conexão: {e}")
        
    return None

async def get_same_day_data(latitude: float, longitude: float, parametros: list[str], day_start: str, day_end: str):
    """
    Busca dados para o mesmo intervalo de dias em diferentes anos.

    Args:
        latitude: A latitude do ponto.
        longitude: A longitude do ponto.
        parametros: Uma lista de strings com os parâmetros desejados.
        day_start: O dia e mês de início no formato "MMDD".
        day_end: O dia e mês de fim no formato "MMDD".

    Returns:
        Uma lista de strings, onde cada string é o conteúdo CSV para um ano.
    """
    current_year = datetime.now().year
    tasks = []
    for year in range(2000, current_year + 1):
        start_date = f"{year}{day_start}"
        end_date = f"{year}{day_end}"
        # Cria uma tarefa para cada chamada de API e a adiciona à lista
        task = get_nasa_data(latitude, longitude, parametros, start_date, end_date)
        tasks.append(task)

    # Executa todas as tarefas concorrentemente
    results = await asyncio.gather(*tasks)
    
    # Filtra resultados nulos (em caso de erro em alguma requisição)
    return [res for res in results if res]


# --- Exemplo de como usar a função ---
async def main():
    # Defina suas variáveis aqui
    lat_exemplo = -9.7828
    lon_exemplo = -36.6105
    params_exemplo = ["T2M", "ALLSKY_SFC_SW_DWN", "RH2M"] # Temperatura, Radiação Solar, Umidade
    dia_inicio = "0101" # 1 de Janeiro
    dia_fim = "0131"    # 31 de Janeiro

    # Chama a nova função para buscar dados para o mesmo período em vários anos
    lista_dados_csv = await get_same_day_data(lat_exemplo, lon_exemplo, params_exemplo, dia_inicio, dia_fim)

    if lista_dados_csv:
        print(f"\n--- {len(lista_dados_csv)} anos de dados recebidos ---")
        # Mostra as primeiras 6000 caracteres do primeiro resultado para verificação
        print("\n--- Exemplo do Primeiro Ano (CSV) ---")
        print(lista_dados_csv)
        print("...")

if __name__ == "__main__":
    asyncio.run(main())

