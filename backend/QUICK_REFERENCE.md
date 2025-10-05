# Quick Reference Guide

## 🚀 Quick Start

```bash
# Start the backend (automatic venv setup)
cd /home/lucas/Personal\ Projects/cascao1/cascao
./start.sh

# Or manually with venv
cd backend
.venv/bin/python -m uvicorn main:app --reload --port 8000
```

---

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Climate Analysis (Versioned - Recommended)
```bash
GET /v1/climate-analysis?lat={lat}&lon={lon}&day={day}&month={month}

Example:
GET /v1/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10
```

### Climate Analysis (Legacy - Backwards Compatible)
```bash
GET /climate-analysis?lat={lat}&lon={lon}&day={day}&month={month}
```

---

## ⚙️ Configuration (.env)

### Key Settings

```env
# NASA API
NASA_BASE_URL=https://power.larc.nasa.gov/api/temporal/daily/point
START_YEAR=2000

# Thresholds
RAIN_THRESHOLD_MM=1.0
PERCENTILE_HOT=75
PERCENTILE_COLD=25

# Data Quality
GOOD_DATA_MIN_YEARS=20
HIGH_CONFIDENCE_MIN_YEARS=25

# API
API_VERSION=v1
CORS_ORIGINS=http://localhost,http://localhost:3000
```

See `.env.example` for all options.

---

## 🧩 Adding a New Analyzer

```python
# 1. Create analyzer file
# analysis/my_analyzer.py

from .base_analyzer import BaseAnalyzer
import pandas as pd
from typing import Dict, Any

class MyAnalyzer(BaseAnalyzer):
    @property
    def name(self) -> str:
        return "MyAnalyzer"
    
    def analyze(self, df: pd.DataFrame, **kwargs) -> Dict[str, Any]:
        # Validate required columns
        self.validate_data(df, ['required_column'])
        
        # Your analysis logic
        result = {
            "my_metric": 42,
            "my_data": []
        }
        
        return result
```

```python
# 2. Import in statistics.py
from .my_analyzer import MyAnalyzer

# 3. Add to analyzer list
analyzers = [
    RainAnalyzer(),
    TemperatureAnalyzer(),
    MyAnalyzer(),  # Add here
    # ... other analyzers
]
```

---

## 🚨 Custom Exceptions

```python
from exceptions import (
    NASAAPIError,           # NASA API failure
    InsufficientDataError,  # Not enough data
    DataProcessingError,    # Processing failed
    DataValidationError,    # Invalid data
    ConfigurationError,     # Config issue
    AnalysisError          # Analysis failed
)

# Usage
raise InsufficientDataError("Need at least 10 years of data")
```

---

## 🧪 Testing Commands

```bash
# Test config loading
.venv/bin/python -c "from config import config; print(config.API_VERSION)"

# Test imports
.venv/bin/python -c "from main import app; print('OK')"

# Test endpoint
curl "http://localhost:8000/v1/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10"

# View API docs
open http://localhost:8000/docs
```

---

## 📁 Project Structure

```
backend/
├── main.py                    # FastAPI app with versioned routes
├── config.py                  # Configuration loader
├── exceptions.py              # Custom exception hierarchy
├── schemas.py                 # Pydantic response models
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables (not in git)
├── .env.example              # Config template
│
├── services/
│   ├── __init__.py
│   └── nasa_service.py       # NASA API integration
│
└── analysis/
    ├── __init__.py
    ├── base_analyzer.py      # Abstract base class
    ├── statistics.py         # Analysis orchestrator
    ├── rain_analyzer.py
    ├── temperature_analyzer.py
    ├── temperature_probability_analyzer.py
    ├── humidity_analyzer.py
    ├── humidity_probability_analyzer.py
    ├── wind_analyzer.py
    └── data_quality_analyzer.py
```

---

## 🔧 Common Tasks

### Change a Threshold
```bash
# Edit .env
RAIN_THRESHOLD_MM=2.0  # Change from 1.0 to 2.0

# Restart server (will auto-reload with --reload flag)
```

### Add New Configuration
```python
# 1. Add to .env
MY_NEW_SETTING=value

# 2. Add to config.py
class Config:
    MY_NEW_SETTING: str = os.getenv("MY_NEW_SETTING", "default")

# 3. Use anywhere
from config import config
print(config.MY_NEW_SETTING)
```

### Add New Endpoint
```python
# main.py
@app.get(f"/{config.API_VERSION}/new-endpoint")
async def new_endpoint():
    return {"message": "New feature"}
```

---

## 📊 Response Structure

```json
{
  "location": {
    "lat": -9.665,
    "lon": -35.735
  },
  "analysis_period": {
    "start_year": 2000,
    "end_year": 2024,
    "total_years_analyzed": 25
  },
  "rain_probability": {
    "threshold_mm": 1.0,
    "probability_percent": 24.0,
    "rainy_days_count": 6,
    "dry_days_count": 19
  },
  "temperature": {
    "avg_max_c": 28.5,
    "avg_min_c": 21.3,
    "median_c": 25.1,
    "record_max_c": 32.4,
    "record_min_c": 18.7,
    "trend": {
      "slope": 0.0234,
      "description": "warming",
      "interpretation": "Temperature is increasing at 0.0234°C per year"
    }
  },
  // ... more fields
}
```

---

## 🐛 Debugging

### Check Logs
```bash
# Server logs show detailed errors
.venv/bin/python -m uvicorn main:app --reload --log-level debug
```

### Test Specific Analyzer
```python
from analysis.rain_analyzer import RainAnalyzer
import pandas as pd

df = pd.DataFrame({'precipitation': [0.5, 1.5, 0.3, 2.1]})
analyzer = RainAnalyzer()
result = analyzer.analyze(df)
print(result)
```

### Validate Config
```python
from config import config
print(f"Rain threshold: {config.RAIN_THRESHOLD_MM}")
print(f"Start year: {config.START_YEAR}")
print(f"NASA params: {config.NASA_PARAMETERS}")
```

---

## 📚 Documentation Files

- `ARCHITECTURE.md` - Architecture diagram and patterns
- `EXTENSIBILITY_IMPROVEMENTS.md` - Detailed guide with examples
- `REFACTORING_SUMMARY.md` - Overview of changes
- `COMPLETION_REPORT.md` - Final status report
- `QUICK_REFERENCE.md` - This file

---

## 💡 Tips

1. **Always use the venv:** `.venv/bin/python` instead of `python3`
2. **Edit .env not code:** Configuration changes don't require code changes
3. **Use specific exceptions:** Better error messages and debugging
4. **Test each analyzer independently:** Makes debugging easier
5. **Version all breaking changes:** Use `/v2/` for incompatible changes

---

## 🆘 Common Issues

### Issue: Module not found
```bash
# Solution: Ensure venv is activated or use full path
.venv/bin/python -m uvicorn main:app --reload
```

### Issue: Config not loading
```bash
# Solution: Check .env file exists
ls -la .env
# Copy from example if missing
cp .env.example .env
```

### Issue: Import errors
```bash
# Solution: Reinstall dependencies
.venv/bin/pip install -r requirements.txt
```

---

**For detailed information, see the full documentation files! 📖**
