# Cascão

> **NASA Space Apps Challenge 2024 - "Will It Rain On My Parade?"**

A web application that provides comprehensive climate analysis based on historical NASA POWER data. Named after Cascão, a character famous for avoiding water, this tool helps you understand the probability of rain and other weather conditions for any date and location worldwide.

**Live Demo**: [https://cascao-frontend-880627998185.us-central1.run.app/](https://cascao-frontend-880627998185.us-central1.run.app/)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![React](https://img.shields.io/badge/react-19.1-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-green.svg)

## Features

- **Historical Climate Analysis**: Analyze weather patterns for any day/month combination across multiple years of NASA data
- **Rain Probability**: Calculate the likelihood of precipitation based on historical trends
- **Temperature Analysis**: Get detailed statistics including averages, extremes, and probability of hot/cold days
- **Humidity Insights**: Understand humidity patterns and probabilities
- **Wind Analysis**: Analyze wind speed patterns and statistics
- **Interactive Map**: Select any location worldwide using an intuitive map interface
- **Additional Parameters**: Optionally analyze solar radiation, cloud cover, and other climate variables
- **Data Export**: Download complete analysis results for further processing

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.12+ (for local development)
- NASA POWER API access (free, no key required)

### Running with Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/Lukinhasram/cascao.git
cd cascao
```

2. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. Run the application:
```bash
./deploy.sh
```

The application will be available at:
- Frontend: `http://localhost`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### Local Development

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Architecture

### Backend (FastAPI + Python)

The backend is built with FastAPI and structured into several and extensible modules:

- **Services**: Handles NASA POWER API integration
  - `nasa_service.py`: Fetches historical climate data asynchronously
  
- **Analysis**: Climate data processing and statistical analysis
  - `base_analyzer.py`: Base class for all analyzers
  - `rain_analyzer.py`: Rain statistics and probability analysis
  - `temperature_analyzer.py`: Temperature trends and statistics
  - `humidity_analyzer.py`: Humidity pattern analysis
  - `wind_analyzer.py`: Wind speed analysis
  - `*_probability_analyzer.py`: Probability calculations for different metrics
  - `additional_parameter_analyzer.py`: Extensible parameter analysis
  - `data_quality_analyzer.py`: Data validation and quality checks
  - `statistics.py`: Core statistical processing

- **API**: RESTful endpoints with comprehensive documentation
  - Versioned API (`/v1/`)
  - Health checks
  - Comprehensive error handling

### Frontend (React + TypeScript)

Modern, responsive UI built with React and TypeScript:

- **Components**: Modular, reusable UI components
  - `LocationPicker`: Interactive map for location selection (Leaflet)
  - `DatePicker`: Date input with validation
  - `UserInputForm`: User preferences input
  - Field components for each climate metric
  
- **Services**: API communication layer
  - `climateService.ts`: Axios-based API client
  
- **Types**: TypeScript definitions for type safety
  
- **Utils**: Helper functions including data export

## Data Source

This application uses the [NASA POWER API](https://power.larc.nasa.gov/), which provides:
- Global coverage with 0.5° x 0.5° resolution
- Historical data from 1981 to near-present
- Multiple climate parameters including:
  - Precipitation (PRECTOTCORR)
  - Temperature (T2M, T2M_MAX, T2M_MIN)
  - Humidity (RH2M)
  - Wind Speed (WS2M)
  - Solar Radiation (ALLSKY_SFC_SW_DWN)
  - Cloud Cover and more

## Use Cases

- **Event Planning**: Determine the best time for outdoor events
- **Agriculture**: Plan planting and harvesting based on historical weather patterns
- **Tourism**: Help travelers choose the best time to visit a destination
- **Research**: Access processed historical climate data for studies
- **Personal Planning**: Make informed decisions about outdoor activities

## Technologies

### Backend
- FastAPI - Modern, fast web framework
- Pandas & NumPy - Data processing and analysis
- SciPy - Advanced statistical calculations
- httpx - Async HTTP client for NASA API
- Pydantic - Data validation

### Frontend
- React 19 - UI framework
- TypeScript - Type safety
- Leaflet - Interactive maps
- Axios - HTTP client
- Vite - Build tool

## API Documentation

Once running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

### Main Endpoint

```
GET /v1/climate-analysis
```

**Parameters:**
- `lat` (float, required): Latitude (-90 to 90)
- `lon` (float, required): Longitude (-180 to 180)
- `day` (int, required): Day of month (1-31)
- `month` (int, required): Month (1-12)
- `additional_parameters` (string, optional): Comma-separated list of additional parameters

**Example:**
```
GET /v1/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Team

Created for the NASA Space Apps Challenge 2024.

## Acknowledgments

- NASA POWER project for providing free access to high-quality climate data
- NASA Space Apps Challenge for the inspiration and platform
- The open-source community for the amazing tools and libraries

**Made for the NASA Space Apps Challenge 2024**
