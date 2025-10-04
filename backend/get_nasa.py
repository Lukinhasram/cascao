import httpx
import asyncio

BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

async def get_nasa_data(latitude: float, longitude: float, parametros: list[str]):
    """
    Busca dados diários da API NASA POWER para um ponto geográfico específico.

    Args:
        latitude: A latitude do ponto.
        longitude: A longitude do ponto.
        parametros: Uma lista de strings com os parâmetros desejados (ex: ["T2M", "ALLSKY_SFC_SW_DWN"]).

    Returns:
        O conteúdo da resposta da API em formato de texto (CSV, neste caso).
    """
    # Junta a lista de parâmetros em uma única string separada por vírgulas
    parametros_str = ",".join(parametros)

    # Dicionário com todos os parâmetros da requisição
    params = {
        "start": "20200101",
        "end": "20251004",
        "latitude": latitude,
        "longitude": longitude,
        "community": "AG",
        "parameters": parametros_str,
        "time-standard": "LST",
        "format": "CSV"
    }

    print(f"Buscando dados para Lat: {latitude}, Lon: {longitude}...")
    
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

# --- Exemplo de como usar a função ---
async def main():
    # Defina suas variáveis aqui
    lat_exemplo = -9.7828
    lon_exemplo = -36.6105
    params_exemplo = ["T2M", "ALLSKY_SFC_SW_DWN", "RH2M"] # Temperatura, Radiação Solar, Umidade

    dados_csv = await get_nasa_data(lat_exemplo, lon_exemplo, params_exemplo)

    if dados_csv:
        # Mostra as primeiras 500 caracteres dos dados recebidos para verificação
        print("\n--- Início dos Dados (CSV) ---")
        print(dados_csv[:5000])
        print("...")

if __name__ == "__main__":
    asyncio.run(main())
