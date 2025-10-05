# Quick Commands - Vai Chover no Meu Desfile?

## 🚀 Start Everything

```bash
# Option 1: Use the startup script (recommended)
./start.sh

# Option 2: Start manually in separate terminals

# Terminal 1 - Backend
cd backend
python3 -m uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔄 Restart Backend (to apply CORS changes)

```bash
# Find and kill the backend process
kill $(lsof -ti:8000)

# Start backend again
cd backend
python3 -m uvicorn main:app --reload --port 8000
```

## 🧪 Test the API

```bash
# Test if backend is responding
curl http://localhost:8000/docs

# Test the climate analysis endpoint
curl "http://localhost:8000/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10"
```

## 📊 Check Status

```bash
# Check if backend is running
lsof -i:8000

# Check if frontend is running
lsof -i:5173

# View backend logs
# (check the terminal where uvicorn is running)

# View frontend logs
# (check browser console F12)
```

## 🛑 Stop Everything

```bash
# Stop backend
kill $(lsof -ti:8000)

# Stop frontend
kill $(lsof -ti:5173)

# Or just press Ctrl+C in each terminal
```

## 🔧 Development Commands

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install

# Build frontend for production
cd frontend
npm run build

# Run frontend linter
cd frontend
npm run lint
```

## 📝 Common Workflows

### 1. First Time Setup
```bash
# Install backend deps
cd backend && pip install -r requirements.txt && cd ..

# Install frontend deps
cd frontend && npm install && cd ..

# Start everything
./start.sh
```

### 2. After Changing Backend Code
```bash
# Backend auto-reloads with --reload flag
# No action needed if using uvicorn --reload
```

### 3. After Changing Frontend Code
```bash
# Frontend auto-reloads with Vite HMR
# No action needed
```

### 4. After Changing CORS/Middleware
```bash
# Restart backend
kill $(lsof -ti:8000)
cd backend && python3 -m uvicorn main:app --reload --port 8000
```

## 🐛 Debug Mode

### Backend with detailed logs
```bash
cd backend
python3 -m uvicorn main:app --reload --port 8000 --log-level debug
```

### Frontend with source maps
```bash
cd frontend
npm run dev -- --debug
```

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc
