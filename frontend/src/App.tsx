import { useState } from 'react';
import type { ClimateAnalysisResponse, UserPreferences } from './types/climate';
import { climateService } from './services/climateService';
import { downloadClimateData } from './utils/downloadData';
import UserInputForm from './components/UserInputForm';
import LocationPicker from './components/LocationPicker';
import DatePicker from './components/DatePicker';
import AdditionalParameterField from './components/AdditionalParameterField';
import TemperatureField from './components/TemperatureField';
import RainField from './components/RainField';
import WindField from './components/WindField';
import HumidityField from './components/HumidityField';
import './App.css';

function App() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    idealTemperature: 25,
    idealRain: 0,
    idealWindSpeed: 5,
    idealHumidity: 60,
    additionalParameters: []
  });

  const [climateData, setClimateData] = useState<ClimateAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Location and date state - Default: Maceió, AL, Brazil on October 4th
  const [location, setLocation] = useState({
    lat: -9.665,
    lon: -35.735
  });

  const [date, setDate] = useState({
    day: 4,
    month: 10
  });

  const handleLocationChange = (lat: number, lon: number) => {
    setLocation({ lat, lon });
  };

  const handleDateChange = (day: number, month: number) => {
    setDate({ day, month });
  };

  const handleAnalyzeClimate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await climateService.getClimateAnalysis({
        ...location,
        ...date,
        additional_parameters: preferences.additionalParameters.filter(p => p !== 'none')
      });
      setClimateData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching climate data');
      console.error('Error fetching climate data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadData = () => {
    if (climateData) {
      downloadClimateData(climateData, preferences, location, date);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-logo">
          <img src="/logo.svg" alt="Cascão Logo" className="logo" />
        </div>
        <div className="header-content">
          <h1>Cascão</h1>
          <p className="subtitle">
            Historical climate analysis based on NASA data
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="location-date-container">
          <LocationPicker
            lat={location.lat}
            lon={location.lon}
            onLocationChange={handleLocationChange}
          />

          <DatePicker
            day={date.day}
            month={date.month}
            onDateChange={handleDateChange}
          />
        </div>

        <UserInputForm
          preferences={preferences}
          onPreferencesChange={setPreferences}
          onSubmit={handleAnalyzeClimate}
          loading={loading}
        />

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {climateData && (
          <div className="climate-results">
            <div className="results-header">
              <div className="results-header-content">
                <div>
                  <h2>Climate Analysis Results</h2>
                  <p className="analysis-period">
                    Based on {climateData.analysis_period.total_years_analyzed} years of data 
                    ({climateData.analysis_period.start_year} - {climateData.analysis_period.end_year})
                  </p>
                </div>
                <div className="results-header-actions">
                  <div className="confidence-badge">
                    Confidence: {climateData.summary_statistics.confidence_level === 'high' ? 'High' : 
                               climateData.summary_statistics.confidence_level === 'medium' ? 'Medium' : 'Low'}
                  </div>
                  <button 
                    className="download-button"
                    onClick={handleDownloadData}
                    title="Download all data as JSON"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download JSON
                  </button>
                </div>
              </div>
            </div>

            <TemperatureField
              temperatureStats={climateData.temperature}
              temperatureProbability={climateData.temperature_probability}
              idealTemperature={preferences.idealTemperature}
            />

            <RainField
              rainProbability={climateData.rain_probability}
              idealRain={preferences.idealRain}
            />

            <WindField
              windStats={climateData.wind}
              idealWindSpeed={preferences.idealWindSpeed}
            />

            <HumidityField
              humidityStats={climateData.humidity}
              humidityProbability={climateData.humidity_probability}
              idealHumidity={preferences.idealHumidity}
            />

            {/* Additional Parameter Fields - shown below main fields */}
            {climateData.additional_parameters && climateData.additional_parameters.length > 0 && (
              <div className="additional-parameters-section">
                {climateData.additional_parameters.map((paramStats) => (
                  <AdditionalParameterField
                    key={paramStats.parameter_name}
                    stats={paramStats}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!climateData && !loading && !error && (
          <div className="welcome-message">
            <p>Configure your ideal preferences above and click "Analyze Climate" to see the statistics!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
