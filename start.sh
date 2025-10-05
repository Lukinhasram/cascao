#!/bin/bash

# Script para iniciar o backend e frontend do projeto Cascao

echo "🚀 Iniciando Vai Chover no Meu Desfile..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se estamos no diretório correto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Encerrando servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar o backend
echo -e "${BLUE}📡 Iniciando backend (FastAPI)...${NC}"
cd backend

# Check if virtual environment exists, if not create it
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
    echo "Installing dependencies..."
    .venv/bin/pip install -r requirements.txt
fi

# Use virtual environment's Python and uvicorn
.venv/bin/python -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Aguardar o backend iniciar
sleep 3

# Iniciar o frontend
echo -e "${BLUE}🎨 Iniciando frontend (Vite)...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ Servidores iniciados com sucesso!${NC}"
echo ""
echo "📡 Backend:  http://localhost:8000"
echo "   Docs:     http://localhost:8000/docs"
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "Pressione Ctrl+C para parar os servidores"
echo ""

# Manter o script rodando
wait
