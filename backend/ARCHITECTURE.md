# Backend Architecture Diagram

## 🏗️ New Extensible Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FASTAPI APPLICATION                         │
│                         (main.py)                                │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   /health       │  │  /v1/climate-   │  │  /climate-      │ │
│  │  (monitoring)   │  │   analysis      │  │  analysis       │ │
│  │                 │  │  (versioned)    │  │  (legacy)       │ │
│  └─────────────────┘  └────────┬────────┘  └────────┬────────┘ │
│                                 │                     │          │
└─────────────────────────────────┼─────────────────────┼──────────┘
                                  │                     │
                        ┌─────────┴─────────────────────┘
                        │
                        ▼
         ┌──────────────────────────────────────┐
         │      CONFIGURATION LAYER              │
         │         (config.py)                   │
         │  ┌─────────────────────────────────┐ │
         │  │     Environment Variables        │ │
         │  │         (.env file)              │ │
         │  │  • NASA API settings             │ │
         │  │  • Analysis thresholds           │ │
         │  │  • Data quality criteria         │ │
         │  │  • CORS origins                  │ │
         │  └─────────────────────────────────┘ │
         └──────────────────┬───────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │    DATA FETCHING SERVICE              │
         │    (services/nasa_service.py)         │
         │                                       │
         │  • Async concurrent requests          │
         │  • Configurable parameters            │
         │  • Custom exception handling          │
         │  • 2000-2024 historical data          │
         └──────────────────┬───────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │   DATA PROCESSING ORCHESTRATOR        │
         │    (analysis/statistics.py)           │
         │                                       │
         │  • Parses CSV data                    │
         │  • Cleans & validates                 │
         │  • Coordinates analyzers              │
         └──────────────────┬───────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────────────────────┐
         │            PLUGGABLE ANALYZER MODULES                 │
         │         (analysis/*_analyzer.py)                      │
         │                                                       │
         │  ┌──────────────────────────────────────────────┐   │
         │  │    BaseAnalyzer (Abstract Base Class)        │   │
         │  │    • analyze() method                        │   │
         │  │    • validate_data() method                  │   │
         │  │    • name property                           │   │
         │  └──────────────────┬───────────────────────────┘   │
         │                     │                                │
         │        ┌────────────┴────────────┐                  │
         │        ▼                         ▼                   │
         │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
         │  │   Rain   │  │   Temp   │  │ Humidity │   ...   │
         │  │ Analyzer │  │ Analyzer │  │ Analyzer │         │
         │  └──────────┘  └──────────┘  └──────────┘         │
         │                                                       │
         │  Each analyzer:                                      │
         │  • Independent & testable                            │
         │  • Configurable thresholds                           │
         │  • Returns standardized dict                         │
         └──────────────────┬───────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │     EXCEPTION HANDLING LAYER          │
         │      (exceptions.py)                  │
         │                                       │
         │  ClimateAPIException (base)           │
         │  ├─ DataSourceError                   │
         │  │  └─ NASAAPIError                   │
         │  ├─ DataProcessingError                │
         │  │  ├─ InsufficientDataError          │
         │  │  └─ DataValidationError            │
         │  ├─ ConfigurationError                │
         │  └─ AnalysisError                     │
         └──────────────────┬───────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │       RESPONSE VALIDATION             │
         │         (schemas.py)                  │
         │                                       │
         │  • Pydantic models                    │
         │  • Type validation                    │
         │  • Nested structures                  │
         └──────────────────┬───────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │           JSON RESPONSE               │
         │    ClimateAnalysisResponse            │
         │                                       │
         │  {                                    │
         │    "location": {...},                 │
         │    "analysis_period": {...},          │
         │    "rain_probability": {...},         │
         │    "temperature": {...},              │
         │    "humidity": {...},                 │
         │    "wind": {...},                     │
         │    "summary_statistics": {...}        │
         │  }                                    │
         └──────────────────────────────────────┘
```

---

## 🔄 Data Flow Summary

1. **Client Request** → `/v1/climate-analysis?lat=X&lon=Y&day=D&month=M`
2. **Main App** → Loads configuration from `.env`
3. **NASA Service** → Fetches historical data (2000-2024) concurrently
4. **Statistics Orchestrator** → Processes CSV data
5. **Pluggable Analyzers** → Run independently:
   - Rain Analyzer → Rain probability
   - Temperature Analyzer → Temp stats & trends
   - Humidity Analyzer → Humidity stats
   - Wind Analyzer → Wind stats
   - Data Quality Analyzer → Confidence levels
6. **Response Validation** → Pydantic schemas ensure type safety
7. **Client Response** → Comprehensive climate analysis JSON

---

## 🎯 Key Design Patterns

### 1. **Strategy Pattern** (Pluggable Analyzers)
- Different analysis strategies can be swapped
- Easy to add new analyzers
- Each analyzer is independent

### 2. **Configuration Pattern** (Centralized Config)
- Single source of truth for settings
- Environment-based configuration
- No hardcoded values

### 3. **Exception Hierarchy** (Custom Exceptions)
- Specific exception types
- Clear error handling
- Better debugging

### 4. **API Versioning** (Multiple Versions)
- v1, v2, v3... can coexist
- Backwards compatibility
- Graceful deprecation

---

## 🚀 Extensibility Points

### Easy to Extend:

1. **Add New Analyzer**
   ```python
   class NewAnalyzer(BaseAnalyzer):
       def analyze(self, df): ...
   ```

2. **Add New Configuration**
   ```env
   NEW_SETTING=value
   ```

3. **Add New Data Source**
   ```python
   class OpenWeatherService:
       async def fetch_data(...): ...
   ```

4. **Add New Endpoint**
   ```python
   @app.get("/v1/new-feature")
   async def new_feature(): ...
   ```

---

## 📊 Comparison

### Before (Monolithic)
```
Client → Main → NASA → Statistics (250 lines) → Response
         ↓
      Hardcoded values, generic errors
```

### After (Modular)
```
Client → Main → Config → NASA → Orchestrator → 7 Analyzers → Response
         ↓       ↓        ↓       ↓            ↓
      Versioned .env  Custom   Modular    Independent
                      Errors   Processing  & Testable
```

---

## ✨ Architecture Benefits

- **Separation of Concerns** ✅
- **Single Responsibility** ✅
- **Open/Closed Principle** ✅
- **Dependency Inversion** ✅
- **Configuration over Code** ✅
- **Type Safety** ✅
- **Error Handling** ✅
- **Testability** ✅
- **Scalability** ✅
- **Maintainability** ✅

---

**Result: Enterprise-grade, extensible, production-ready backend! 🎉**
