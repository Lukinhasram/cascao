# Frontend - Vai Chover no Meu Desfile?

Climate analysis frontend application that displays historical weather data and compares it with user preferences.

## Features

- **Interactive Map**: Click on the map to select any location in the world
  - Powered by Leaflet and OpenStreetMap
  - Manual coordinate input (latitude/longitude)
  - Real-time position updates

- **Date Picker**: Select any day and month for historical analysis
  - Day selector (1-31, adjusted for month)
  - Month selector with Portuguese month names
  - Visual feedback of selected date

- **User Input Form**: Interactive sliders to set ideal preferences for:
  - Temperature (15°C - 40°C)
  - Rain (0mm - 50mm)
  - Wind Speed (0m/s - 20m/s)
  - Humidity (0% - 100%)

- **Data Components**: Each weather metric is displayed in its own component:
  - **TemperatureField**: Shows temperature statistics, trends, and variability
  - **RainField**: Displays rain probability and historical frequency
  - **WindField**: Shows average wind speed and classification
  - **HumidityField**: Displays humidity statistics and distribution

- **Comparison Features**: Each component compares the statistical data with user's ideal values
- **Visual Feedback**: Slider visualizations, color-coded panels, and informative text

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LocationPicker.tsx      # Interactive map for location selection
│   │   ├── LocationPicker.css      # Map component styling
│   │   ├── DatePicker.tsx          # Date selection component
│   │   ├── DatePicker.css          # Date picker styling
│   │   ├── UserInputForm.tsx       # User preference input form
│   │   ├── UserInputForm.css       # Form styling
│   │   ├── TemperatureField.tsx    # Temperature data component
│   │   ├── RainField.tsx           # Rain data component
│   │   ├── WindField.tsx           # Wind data component
│   │   ├── HumidityField.tsx       # Humidity data component
│   │   └── DataField.css           # Shared styling for data components
│   ├── services/
│   │   └── climateService.ts       # API service for backend calls
│   ├── types/
│   │   └── climate.ts              # TypeScript interfaces
│   ├── App.tsx                     # Main application component
│   ├── App.css                     # Main app styling
│   ├── index.css                   # Global styles
│   └── main.tsx                    # Application entry point
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

3. Make sure the backend API is running on `http://localhost:8000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

1. **Select Location**: 
   - Click anywhere on the map to choose your location
   - Or manually enter latitude and longitude coordinates
   - The marker will update to show your selected position

2. **Choose Date**: 
   - Select the day (1-31) from the dropdown
   - Select the month from the dropdown
   - The analysis will use historical data for this specific date

3. **Configure Your Preferences**: 
   - Use the sliders to set your ideal weather conditions
   - Values update in real-time as you move the sliders

4. **Analyze Climate**: 
   - Click the "Analisar Clima" button to fetch historical data
   - Wait for the API to process the request

5. **Review Results**: Each data field shows:
   - Your ideal value visualization
   - Most likely or average value
   - Comparison with your preferences
   - Probability and statistical information
   - Historical trends and variability
   - Standard deviation analysis

## API Integration

The frontend connects to the backend API at `/climate-analysis` endpoint with the following parameters:
- `lat`: Latitude (selected from map or input manually)
- `lon`: Longitude (selected from map or input manually)
- `day`: Day of month (selected from dropdown, 1-31)
- `month`: Month (selected from dropdown, 1-12)

## Design Philosophy

The interface follows the design mockups with:
- Clean, card-based layout
- Color-coded borders for each weather metric
- Gradient backgrounds for different information panels
- Interactive sliders with real-time value display
- Responsive design for mobile and desktop
- Clear visual hierarchy and typography

## Technologies Used

- **React 19**: UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API calls
- **Leaflet**: Interactive map library
- **React-Leaflet**: React components for Leaflet
- **OpenStreetMap**: Map tile provider
- **CSS3**: Modern styling with gradients and animations
