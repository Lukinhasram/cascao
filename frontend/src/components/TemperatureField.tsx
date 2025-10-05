import React from 'react';
import type { TemperatureStats, TemperatureProbability } from '../types/climate';
import './DataField.css';

interface TemperatureFieldProps {
  temperatureStats: TemperatureStats;
  temperatureProbability: TemperatureProbability;
  idealTemperature: number;
}

const TemperatureField: React.FC<TemperatureFieldProps> = ({
  temperatureStats,
  temperatureProbability,
  idealTemperature
}) => {
  // Calculate difference from ideal
  const mostLikelyTemp = temperatureStats.median_c;
  const difference = mostLikelyTemp - idealTemperature;
  const comparisonText = Math.abs(difference) > 3
    ? difference > 0 
      ? `${difference.toFixed(1)}° more than your ideal temperature`
      : `${Math.abs(difference).toFixed(1)}° less than your ideal temperature`
    : 'Close to your ideal temperature';

  // Determine if variability is low or high for the panel message
  const stdDev = temperatureStats.variability_analysis.yearly_variability.std_dev_c;
  const isLowVariability = stdDev < 2;

  return (
    <div className="data-field temperature-field">
      <h3 className="field-title">Temperature</h3>
      
      {/* Slider visualization */}
      <div className="slider-visualization">
        <div className="slider-label">ideal temperature</div>
        <div className="slider-track">
          <div 
            className="slider-thumb"
            style={{ left: `${((idealTemperature - 15) / (40 - 15)) * 100}%` }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '-35px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2c3e50',
              whiteSpace: 'nowrap'
            }}>
              {idealTemperature}°C
            </div>
          </div>
        </div>
        <div className="slider-range">
          <span>15°C</span>
          <span>40°C</span>
        </div>
      </div>

      {/* Most likely temperature panel */}
      <div className="info-panel most-likely">
        <div className="panel-label">most likely temperature:</div>
        <div className="panel-main-value">{mostLikelyTemp.toFixed(1)}°C</div>
        <div className="panel-comparison">{comparisonText}</div>
      </div>

      {/* Probability panel */}
      <div className="info-panel probability">
        <div className="panel-content">
          <div className="probability-text">
            On this day, the temperature typically ranges between minimums of {temperatureProbability.cold_threshold_c}°C and maxes of {temperatureProbability.hot_threshold_c}°C. 
            Very cold temperatures (below {temperatureProbability.cold_threshold_c}°C) or very hot temperatures 
            (above {temperatureProbability.hot_threshold_c}°C) are rare. Temperature has ranged from a record low 
            of {temperatureStats.record_min_c}°C to a record high of {temperatureStats.record_max_c}°C.
          </div>
        </div>
      </div>

      {/* Trend panel */}
      <div className="info-panel trend">
        <div className="panel-content">
          <div className="trend-text">
            The trend line shows a slight inclination {temperatureStats.trend.description === 'warming' ? 'upward' : temperatureStats.trend.description === 'cooling' ? 'downward' : 'stable'}, 
            indicating that temperatures on this day have been {temperatureStats.trend.description === 'warming' ? 'increasing' : temperatureStats.trend.description === 'cooling' ? 'decreasing' : 'remaining stable'} 
            gradually over the past decades.
          </div>
        </div>
      </div>

      {/* Standard deviation panel */}
      <div className="info-panel std-dev">
        <div className="panel-header">
          {isLowVariability ? 'low standard deviation' : 'high standard deviation'}
        </div>
        <div className="panel-description">
          {isLowVariability 
            ? `The weather on this day tends to be very consistent. Temperature doesn't vary much from year to year, so you know what to expect.`
            : `The weather on this day is highly variable. Temperature can change drastically from year to year, so be prepared for surprises!`
          }
        </div>
        <div className="panel-stats">
          <div>Standard Deviation: {stdDev.toFixed(2)}°C</div>
          <div>Coefficient of Variation: {temperatureStats.variability_analysis.yearly_variability.coefficient_variation_percent.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureField;
