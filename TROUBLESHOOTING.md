# Troubleshooting Guide - Vai Chover no Meu Desfile?

## Common Issues and Solutions

### 1. "Failed to fetch climate data" / CORS Error

**Problema**: Erro ao buscar dados do backend, geralmente relacionado a CORS.

**Soluções**:

a) **Reiniciar o backend** para aplicar as configurações de CORS:
```bash
# Parar o backend atual (Ctrl+C no terminal onde está rodando)
# Depois iniciar novamente:
cd backend
python3 -m uvicorn main:app --reload --port 8000
```

b) **Verificar se o backend está rodando**:
```bash
curl http://localhost:8000/docs
# Ou abra http://localhost:8000/docs no navegador
```

c) **Verificar portas**:
- Backend deve estar em: `http://localhost:8000`
- Frontend deve estar em: `http://localhost:5173`

### 2. Backend não inicia

**Problema**: Erro ao iniciar o servidor FastAPI

**Soluções**:

a) **Instalar dependências**:
```bash
cd backend
pip install -r requirements.txt
```

b) **Verificar se a porta 8000 está livre**:
```bash
lsof -i :8000
# Se estiver ocupada, matar o processo ou usar outra porta
```

### 3. Frontend não carrega o mapa

**Problema**: O mapa do Leaflet não aparece ou está quebrado

**Soluções**:

a) **Verificar instalação do Leaflet**:
```bash
cd frontend
npm install leaflet react-leaflet @types/leaflet
```

b) **Limpar cache e reconstruir**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 4. Coordenadas não atualizam

**Problema**: Clicar no mapa não atualiza as coordenadas

**Solução**: Recarregue a página (F5) e tente novamente. Se persistir, verifique o console do navegador (F12) por erros.

### 5. Erro 404 na API

**Problema**: API retorna 404 Not Found

**Solução**: Verifique se o endpoint está correto. A URL deve ser:
```
http://localhost:8000/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10
```

### 6. Erro ao buscar dados da NASA

**Problema**: Backend retorna erro relacionado ao serviço da NASA

**Possíveis causas**:
- Sem conexão com internet
- API da NASA temporariamente indisponível
- Coordenadas fora do range válido (lat: -90 a 90, lon: -180 a 180)

**Solução**: 
- Verificar conexão com internet
- Tentar coordenadas diferentes
- Aguardar alguns minutos e tentar novamente

## Script de Início Rápido

Use o script `start.sh` para iniciar backend e frontend juntos:

```bash
# Na raiz do projeto:
./start.sh
```

Este script:
- ✅ Inicia o backend na porta 8000
- ✅ Inicia o frontend na porta 5173
- ✅ Configura tudo automaticamente
- ✅ Para ambos com Ctrl+C

## Verificação de Saúde do Sistema

Execute estes comandos para verificar se tudo está funcionando:

```bash
# 1. Verificar backend
curl http://localhost:8000/docs

# 2. Verificar se a API responde
curl "http://localhost:8000/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10"

# 3. Verificar frontend
curl http://localhost:5173
```

## Logs e Debug

### Backend Logs
Os logs do FastAPI aparecem no terminal onde você executou `uvicorn`. Procure por:
- ✅ `Application startup complete` - Backend iniciou com sucesso
- ❌ `ERROR` - Erros durante execução

### Frontend Logs
Abra o Console do Navegador (F12 → Console) e procure por:
- 🌍 `Fetching climate data for:` - Requisição iniciada
- ✅ `Climate data received:` - Dados recebidos com sucesso
- ❌ `Error fetching climate data:` - Erro na requisição

### Verificar CORS
Se houver erro de CORS, você verá no console do navegador:
```
Access to XMLHttpRequest at 'http://localhost:8000/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solução**: Certifique-se de que o backend foi **reiniciado** após a alteração no `main.py`.

## Contato

Se o problema persistir:
1. Verifique os logs em ambos os terminais (backend e frontend)
2. Abra o console do navegador (F12) e procure por erros
3. Copie a mensagem de erro completa
4. Verifique se todas as dependências estão instaladas

## Variáveis de Ambiente

### Backend
Não requer variáveis de ambiente especiais. Usa a API pública da NASA POWER.

### Frontend
A URL do backend está hardcoded em `src/services/climateService.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000';
```

Se precisar mudar a porta do backend, atualize este arquivo.
