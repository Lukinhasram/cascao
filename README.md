# Cascão - Climate Analysis Application

A web application that provides historical climate analysis for any location and date, using NASA POWER data.

## �� Features

- **Interactive Map**: Search by address or click to select any location worldwide
- **Date Selection**: Analyze climate data for any day and month
- **Historical Analysis**: Based on 20+ years of NASA satellite data (2000-present)
- **Climate Insights**: Temperature, rainfall, wind, and humidity analysis
- **Probability Calculations**: Likelihood of specific weather conditions
- **Trend Analysis**: Long-term climate trends for your selected date

## 🚀 Live Application

**Frontend:** https://cascao-frontend-880627998185.us-central1.run.app

**Backend API:** https://cascao-backend-880627998185.us-central1.run.app

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.12** - Core language
- **Pandas & NumPy** - Data analysis
- **SciPy** - Statistical analysis
- **NASA POWER API** - Climate data source

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **Axios** - HTTP client
- **OpenStreetMap** - Map tiles and geocoding

### Deployment
- **Google Cloud Run** - Serverless container platform
- **Docker** - Containerization
- **Nginx** - Frontend web server

## 📁 Project Structure

\`\`\`
cascao/
├── backend/              # FastAPI backend
│   ├── main.py          # API entry point
│   ├── config.py        # Configuration
│   ├── schemas.py       # Data models
│   ├── services/        # External services
│   │   └── nasa_service.py
│   ├── analysis/        # Data analysis
│   │   └── statistics.py
│   ├── Dockerfile       # Backend container
│   └── requirements.txt # Python dependencies
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.tsx     # Main component
│   │   ├── components/ # UI components
│   │   ├── services/   # API client
│   │   └── types/      # TypeScript types
│   ├── Dockerfile      # Frontend container
│   ├── nginx.conf      # Web server config
│   └── package.json    # Node dependencies
│
└── deploy.sh           # Deployment script
\`\`\`

## 🏃 Local Development

### Backend Setup

1. **Create virtual environment:**
   \`\`\`bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

3. **Run the server:**
   \`\`\`bash
   uvicorn main:app --reload --port 8000
   \`\`\`

   Backend will be available at: http://localhost:8000

### Frontend Setup

1. **Install dependencies:**
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

2. **Run dev server:**
   \`\`\`bash
   npm run dev
   \`\`\`

   Frontend will be available at: http://localhost:5173

## 🌐 Deployment to Google Cloud

### Prerequisites
- Google Cloud account
- Google Cloud CLI installed
- Billing enabled

### Quick Deploy

1. **Install Google Cloud CLI:**
   \`\`\`bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   \`\`\`

2. **Enable required APIs:**
   \`\`\`bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com
   \`\`\`

3. **Deploy:**
   \`\`\`bash
   ./deploy.sh
   \`\`\`

### Update After Deployment

After deployment, update \`backend/config.py\` with your frontend URL:
\`\`\`python
CORS_ORIGINS = "http://localhost:5173,https://your-frontend-url.run.app"
\`\`\`

Then redeploy the backend.

## 📊 API Documentation

Once running, visit:
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

### Example API Request
\`\`\`bash
curl "http://localhost:8000/v1/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10"
\`\`\`

## 🔧 Configuration

### Backend Environment Variables

Create \`backend/.env\`:
\`\`\`env
# NASA API Configuration
NASA_BASE_URL=https://power.larc.nasa.gov/api/temporal/daily/point
START_YEAR=2000

# Analysis Thresholds
RAIN_THRESHOLD_MM=1.0
PERCENTILE_COLD=25
PERCENTILE_HOT=75

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,https://your-frontend-url.run.app
\`\`\`

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **NASA POWER** - For providing free access to historical climate data
- **OpenStreetMap** - For map tiles and geocoding services
- **Google Cloud** - For hosting infrastructure
