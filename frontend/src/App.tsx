import { useState } from 'react';
import type { ClimateAnalysisResponse, UserPreferences } from './types/climate';
import { climateService } from './services/climateService';
import UserInputForm from './components/UserInputForm';
import LocationPicker from './components/LocationPicker';
import DatePicker from './components/DatePicker';
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
    idealHumidity: 60
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
        ...date
      });
      setClimateData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados climáticos');
      console.error('Error fetching climate data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cascão</h1>
        <p className="subtitle">
          Análise climática histórica baseada em dados da NASA
        </p>
      </header>

      <main className="app-main">
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

        <UserInputForm
          preferences={preferences}
          onPreferencesChange={setPreferences}
          onSubmit={handleAnalyzeClimate}
          loading={loading}
        />

        {error && (
          <div className="error-message">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {climateData && (
          <div className="climate-results">
            <div className="results-header">
              <h2>Resultados da Análise Climática</h2>
              <p className="analysis-period">
                Baseado em {climateData.analysis_period.total_years_analyzed} anos de dados 
                ({climateData.analysis_period.start_year} - {climateData.analysis_period.end_year})
              </p>
              <div className="confidence-badge">
                Confiança: {climateData.summary_statistics.confidence_level === 'high' ? 'Alta' : 
                           climateData.summary_statistics.confidence_level === 'medium' ? 'Média' : 'Baixa'}
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
          </div>
        )}

        {!climateData && !loading && !error && (
          <div className="welcome-message">
            <p>👆 Configure suas preferências ideais acima e clique em "Analisar Clima" para ver as estatísticas!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
