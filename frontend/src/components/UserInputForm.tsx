import React from 'react';
import type { UserPreferences } from '../types/climate';
import './UserInputForm.css';

interface UserInputFormProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onSubmit: () => void;
  loading: boolean;
}

const UserInputForm: React.FC<UserInputFormProps> = ({
  preferences,
  onPreferencesChange,
  onSubmit,
  loading
}) => {
  const handleSliderChange = (field: keyof UserPreferences, value: number) => {
    onPreferencesChange({
      ...preferences,
      [field]: value
    });
  };

  return (
    <div className="user-input-form">
      <h2>Configure Your Ideal Preferences</h2>
      
      <div className="input-group">
        <label htmlFor="temperature-slider">
          <span className="label-text">Ideal Temperature</span>
          <span className="value-display">{preferences.idealTemperature}°C</span>
        </label>
        <input
          id="temperature-slider"
          type="range"
          min="15"
          max="40"
          step="1"
          value={preferences.idealTemperature}
          onChange={(e) => handleSliderChange('idealTemperature', Number(e.target.value))}
          className="slider"
        />
      </div>

      <div className="input-group">
        <label htmlFor="rain-slider">
          <span className="label-text">Ideal Rain</span>
          <span className="value-display">{preferences.idealRain}mm</span>
        </label>
        <input
          id="rain-slider"
          type="range"
          min="0"
          max="50"
          step="1"
          value={preferences.idealRain}
          onChange={(e) => handleSliderChange('idealRain', Number(e.target.value))}
          className="slider"
        />
      </div>

      <div className="input-group">
        <label htmlFor="wind-slider">
          <span className="label-text">Ideal Wind</span>
          <span className="value-display">{preferences.idealWindSpeed}m/s</span>
        </label>
        <input
          id="wind-slider"
          type="range"
          min="0"
          max="20"
          step="0.5"
          value={preferences.idealWindSpeed}
          onChange={(e) => handleSliderChange('idealWindSpeed', Number(e.target.value))}
          className="slider"
        />
      </div>

      <div className="input-group">
        <label htmlFor="humidity-slider">
          <span className="label-text">Ideal Humidity</span>
          <span className="value-display">{preferences.idealHumidity}%</span>
        </label>
        <input
          id="humidity-slider"
          type="range"
          min="0"
          max="100"
          step="5"
          value={preferences.idealHumidity}
          onChange={(e) => handleSliderChange('idealHumidity', Number(e.target.value))}
          className="slider"
        />
      </div>

      <button 
        className="submit-button" 
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Analyze Climate'}
      </button>
    </div>
  );
};

export default UserInputForm;
