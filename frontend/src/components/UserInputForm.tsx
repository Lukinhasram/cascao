import React, { useState } from 'react';
import type { UserPreferences, AdditionalParameterType } from '../types/climate';
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
  const [selectedParameter, setSelectedParameter] = useState<AdditionalParameterType>('none');

  const handleSliderChange = (field: keyof UserPreferences, value: number) => {
    onPreferencesChange({
      ...preferences,
      [field]: value
    });
  };

  const handleAddParameter = () => {
    if (selectedParameter !== 'none' && !preferences.additionalParameters.includes(selectedParameter)) {
      onPreferencesChange({
        ...preferences,
        additionalParameters: [...preferences.additionalParameters, selectedParameter]
      });
      setSelectedParameter('none');
    }
  };

  const handleRemoveParameter = (paramToRemove: AdditionalParameterType) => {
    onPreferencesChange({
      ...preferences,
      additionalParameters: preferences.additionalParameters.filter(p => p !== paramToRemove)
    });
  };

  const getParameterDisplayName = (param: AdditionalParameterType): string => {
    const names: Record<AdditionalParameterType, string> = {
      'none': 'None',
      'solar_radiation': 'Solar Radiation',
      'cloud_cover': 'Cloud Cover',
      'evapotranspiration': 'Evapotranspiration',
      'surface_pressure': 'Surface Pressure'
    };
    return names[param];
  };

  return (
    <div className="user-input-form">
      <h2>Configure Your Ideal Preferences</h2>

      {/* Additional Parameter Selector */}
      <div className="input-group parameter-selector">
        <label htmlFor="additional-parameter">
          <span className="label-text">Additional Parameters (Optional)</span>
        </label>
        <div className="parameter-select-row">
          <select
            id="additional-parameter"
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value as AdditionalParameterType)}
            className="parameter-dropdown"
          >
            <option value="none">Select a parameter...</option>
            <option value="solar_radiation" disabled={preferences.additionalParameters.includes('solar_radiation')}>
              Solar Radiation
            </option>
            <option value="cloud_cover" disabled={preferences.additionalParameters.includes('cloud_cover')}>
              Cloud Cover
            </option>
            <option value="evapotranspiration" disabled={preferences.additionalParameters.includes('evapotranspiration')}>
              Evapotranspiration
            </option>
            <option value="surface_pressure" disabled={preferences.additionalParameters.includes('surface_pressure')}>
              Surface Pressure
            </option>
          </select>
          <button
            type="button"
            onClick={handleAddParameter}
            disabled={selectedParameter === 'none'}
            className="add-parameter-btn"
          >
            Add
          </button>
        </div>
        
        {/* Selected Parameters Tags */}
        {preferences.additionalParameters.length > 0 && (
          <div className="parameter-tags">
            {preferences.additionalParameters.map((param) => (
              <div key={param} className="parameter-tag">
                <span>{getParameterDisplayName(param)}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveParameter(param)}
                  className="remove-tag-btn"
                  aria-label={`Remove ${getParameterDisplayName(param)}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
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
