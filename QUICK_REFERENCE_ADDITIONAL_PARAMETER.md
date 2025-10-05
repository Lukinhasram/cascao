# Quick Reference: Additional Parameter Feature

## User Interface

```
┌─────────────────────────────────────────────────────────┐
│  Configure Your Ideal Preferences                       │
├─────────────────────────────────────────────────────────┤
│  Additional Parameter (Optional)         ▼              │
│  [None ▼]                                                │
│  Options: None, Solar Radiation, Cloud Cover,           │
│           Evapotranspiration, Surface Pressure          │
├─────────────────────────────────────────────────────────┤
│  Ideal Temperature: 25°C      [========|====]           │
│  Ideal Rain: 0mm              [|================]       │
│  Ideal Wind: 5m/s             [====|============]       │
│  Ideal Humidity: 60%          [==========|======]       │
│                                                          │
│               [Analyze Climate]                         │
└─────────────────────────────────────────────────────────┘
```

## Results Display (when parameter selected)

```
┌─────────────────────────────────────────────────────────┐
│  Climate Analysis Results                               │
│  Based on 25 years of data (2000 - 2024)               │
├─────────────────────────────────────────────────────────┤
│  ★ SOLAR RADIATION (appears first if selected)          │
│                                                          │
│  Average Value: 5.23 kWh/m²/day                         │
│  Range: 2.10 - 7.85 kWh/m²/day                          │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │   Median     │  │  Std. Dev    │                    │
│  │  5.15 kWh/m² │  │  0.98 kWh/m² │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                          │
│  Distribution Percentiles:                              │
│  10th: 3.45   25th: 4.67   75th: 5.89   90th: 6.78    │
│                                                          │
│  This data shows the historical patterns...             │
├─────────────────────────────────────────────────────────┤
│  TEMPERATURE (existing fields follow)                   │
│  ...                                                     │
└─────────────────────────────────────────────────────────┘
```

## API Request Example

**Before:**
```
GET /v1/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10
```

**After (with parameter):**
```
GET /v1/climate-analysis?lat=-9.665&lon=-35.735&day=4&month=10&additional_parameter=solar_radiation
```

## Parameter Options

| Parameter Name       | NASA Code           | Unit        | Description                    |
|---------------------|---------------------|-------------|--------------------------------|
| Solar Radiation     | ALLSKY_SFC_SW_DWN   | kWh/m²/day  | Solar energy reaching surface  |
| Cloud Cover         | CLOUD_AMT           | %           | Cloud coverage percentage      |
| Evapotranspiration  | EVPTRNS             | mm/day      | Water vapor from surface       |
| Surface Pressure    | PS                  | kPa         | Atmospheric pressure           |

## Key Statistics Displayed

For each parameter, the following statistics are calculated and displayed:

1. **Average Value** - Mean across all historical dates
2. **Range** - Minimum to maximum observed values
3. **Median** - 50th percentile value
4. **Standard Deviation** - Measure of variability
5. **Percentiles** - Distribution quartiles (10th, 25th, 75th, 90th)

## Design Principles

✓ **Optional** - Default is "None", doesn't affect existing functionality
✓ **Informational** - No ideal value required, pure statistics
✓ **Top Position** - Displays first in results when selected
✓ **Distinct Styling** - Gradient background differentiates from other fields
✓ **Consistent** - Follows same design patterns as existing fields

## Code Architecture

```
Frontend:
  UserInputForm
    └─> Dropdown selector (additionalParameter in state)
  
  App.tsx
    └─> Passes parameter to API
    └─> Conditionally renders AdditionalParameterField
  
  AdditionalParameterField
    └─> Displays statistics in panels

Backend:
  main.py
    └─> Accepts additional_parameter query param
    └─> Adds NASA parameter to request
  
  statistics.py
    └─> Creates AdditionalParameterAnalyzer if needed
    └─> Processes additional column
  
  additional_parameter_analyzer.py
    └─> Calculates basic statistics
    └─> Returns formatted results
```

## Deployment Notes

The feature is fully implemented and ready for deployment. No database changes or migrations required.

**To deploy:**
1. Rebuild frontend: `cd frontend && npm run build`
2. Rebuild backend: Docker will pick up changes automatically
3. Deploy using existing `./deploy.sh` script

The feature is backwards compatible - existing API calls without the parameter work exactly as before.
