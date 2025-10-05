# Climate Analysis Application

A web application that provides historical climate analysis for any location and date, using NASA POWER data spanning from 1981 to### Backend Environment Variables

Create `backend/.env`:
```env
# NASA API Configuration
NASA_BASE_URL=https://power.larc.nasa.gov/api/temporal/daily/point
START_YEAR=1981
NASA_PARAMETERS=T2M_MAX,T2M_MIN,T2M,PRECTOTCORR,WS2M,RH2M

# Analysis Thresholds
RAIN_THRESHOLD_MM=1.0
PERCENTILE_COLD=25
PERCENTILE_HOT=75
PERCENTILE_DRY=25
PERCENTILE_HUMID=75

# Data Quality Thresholds
GOOD_DATA_MIN_YEARS=20
LIMITED_DATA_MIN_YEARS=10

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://your-frontend-url.run.app
```

## 🌟 Additional Features

### Multiple Additional Parameters
Select multiple optional climate parameters for deeper analysis:
- **Solar Radiation**: All-sky surface shortwave downward irradiance
- **Cloud Coverage**: Cloud amount percentage
- **Evapotranspiration**: Evaporation and transpiration rates
- **Surface Pressure**: Atmospheric pressure at surface level

Each parameter displays:
- Average, minimum, maximum values
- Median and standard deviation
- Percentile distribution (10th, 25th, 75th, 90th)
- Historical context and patterns

### Data Export
Download complete climate analysis in JSON format including:
- All climate parameters with units
- Statistical analysis data
- Location coordinates and date
- Export timestamp and metadata
- User preferences

## 🔌 API Endpoints

### Climate Analysis
```
GET /v1/climate-analysis
```

**Parameters:**
- `lat` (float): Latitude (-90 to 90)
- `lon` (float): Longitude (-180 to 180)
- `day` (int): Day of month (1-31)
- `month` (int): Month (1-12)
- `additional_parameters` (optional): Comma-separated list of additional parameters
  - Options: `solar_radiation`, `cloud_cover`, `evapotranspiration`, `surface_pressure`

**Example:**
```bash
curl "http://localhost:8000/v1/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10&additional_parameters=solar_radiation,cloud_cover"
```

### Health Check
```
GET /health
```Features

- **Interactive Map**: Search by address or click to select any location worldwide
- **Date Selection**: Analyze climate data for any day and month
- **Historical Analysis**: Based on 44+ years of NASA satellite data (1981-present)
- **Comprehensive Climate Insights**: 
  - Temperature analysis with trends
  - Rainfall probability and patterns
  - Wind speed statistics
  - Humidity levels
- **Additional Parameters**: Optional analysis of solar radiation, cloud cover, evapotranspiration, and surface pressure
- **Data Export**: Download complete analysis as JSON with metadata and units
- **Probability Calculations**: Statistical likelihood of specific weather conditions
- **Trend Analysis**: Long-term climate trends for your selected date
- **Mobile Responsive**: Full functionality on desktop and mobile devices

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

```
climate-analysis/
├── backend/                 # FastAPI backend
│   ├── main.py             # API entry point
│   ├── config.py           # Configuration management
│   ├── schemas.py          # Pydantic data models
│   ├── services/           # External service integrations
│   │   └── nasa_service.py # NASA POWER API client
│   ├── analysis/           # Data analysis modules
│   │   ├── statistics.py   # Main climate analysis
│   │   └── additional_parameter_analyzer.py  # Additional parameter stats
│   ├── Dockerfile          # Backend container config
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── components/    # React components
│   │   │   ├── UserInputForm.tsx
│   │   │   ├── LocationPicker.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── TemperatureField.tsx
│   │   │   ├── RainField.tsx
│   │   │   ├── WindField.tsx
│   │   │   ├── HumidityField.tsx
│   │   │   └── AdditionalParameterField.tsx
│   │   ├── services/      # API client services
│   │   │   └── climateService.ts
│   │   ├── types/         # TypeScript type definitions
│   │   │   └── climate.ts
│   │   └── utils/         # Utility functions
│   │       └── downloadData.ts
│   ├── Dockerfile         # Frontend container config
│   ├── nginx.conf         # Nginx web server config
│   └── package.json       # Node.js dependencies
│
├── deploy.sh              # Google Cloud Run deployment script
└── README.md              # This file
```

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
- Google Cloud account with billing enabled
- Google Cloud CLI installed
- Docker (for local testing)

### Quick Deploy

1. **Install Google Cloud CLI:**
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Set your project:**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable required APIs:**
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com
   ```

4. **Deploy both services:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Post-Deployment Configuration

The deployment script will output URLs for both services. Update the following:

1. **Backend CORS** - Update `backend/.env`:
   ```env
   CORS_ORIGINS=https://your-frontend-url.run.app
   ```

2. **Frontend API URL** - Update `frontend/src/services/climateService.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-backend-url.run.app';
   ```

3. **Redeploy** both services to apply changes:
   ```bash
   ./deploy.sh
   ```

### Environment Variables for Cloud Run

When deploying to Cloud Run, set these environment variables:
```bash
gcloud run services update cascao-backend \
  --set-env-vars START_YEAR=1981,CORS_ORIGINS=https://your-frontend-url.run.app \
  --region us-central1
```

## 📊 API Documentation

Once the backend is running, visit:
- **Interactive API Docs (Swagger):** http://localhost:8000/docs
- **Alternative API Docs (ReDoc):** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

### Example API Request
```bash
curl "http://localhost:8000/v1/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10"
```

## 🏗️ Architecture

### Backend Flow
1. **API Request** → FastAPI endpoint receives location and date
2. **NASA API** → Fetches historical data for the specified date across all years (1981-present)
3. **Data Processing** → Pandas/NumPy process and aggregate the data
4. **Statistical Analysis** → Calculate percentiles, trends, probabilities
5. **Response** → Return structured JSON with insights

### Frontend Flow
1. **User Input** → Map selection or address search + date picker
2. **API Call** → Send request to backend with parameters
3. **Data Visualization** → Display results in organized cards
4. **Export** → Allow JSON download of complete analysis

### Data Sources
- **NASA POWER**: Prediction Of Worldwide Energy Resources
  - Temporal resolution: Daily
  - Spatial resolution: 0.5° x 0.5° (approximately 50km)
  - Coverage: Global
  - Time span: 1981 to near real-time

## 🧪 Testing

### Backend Tests
```bash
cd backend
source .venv/bin/activate
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🐛 Troubleshooting

### Common Issues

**Backend fails to start:**
- Check if port 8000 is already in use
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Ensure `.env` file is properly configured

**Frontend can't connect to backend:**
- Verify backend is running on port 8000
- Check `VITE_API_BASE_URL` in frontend `.env`
- Check browser console for CORS errors

**CORS errors in production:**
- Ensure backend `CORS_ORIGINS` includes your frontend URL
- Redeploy backend after updating CORS settings

**NASA API timeout:**
- Increase `NASA_TIMEOUT` in backend `.env`
- Check NASA POWER API status

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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
