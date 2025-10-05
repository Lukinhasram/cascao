import React from 'react';
import type { HumidityStats, HumidityProbability } from '../types/climate';
import './DataField.css';

interface HumidityFieldProps {
  humidityStats: HumidityStats;
  humidityProbability: HumidityProbability;
  idealHumidity: number;
}

const HumidityField: React.FC<HumidityFieldProps> = ({
  humidityStats,
  humidityProbability,
  idealHumidity
}) => {
  // Calculate difference from ideal
  const difference = Math.abs(humidityStats.avg_percent - idealHumidity);
  const comparisonText = difference > 10 
    ? `${difference.toFixed(1)}% ${humidityStats.avg_percent > idealHumidity ? 'more humid' : 'drier'} than your ideal humidity`
    : 'Close to your ideal humidity';

  // Classify humidity
  const getHumidityClassification = (humidity: number): string => {
    if (humidity < 30) return 'Very dry';
    if (humidity < 50) return 'Dry';
    if (humidity < 70) return 'Comfortable';
    if (humidity < 85) return 'Humid';
    return 'Very humid';
  };

  // Determine if variability is low or high
  const isLowVariability = humidityStats.std_dev < 10;

  return (
    <div className="data-field humidity-field">
      <h3 className="field-title">Humidity</h3>
      
      {/* Slider visualization */}
      <div className="slider-visualization">
        <div className="slider-label">ideal humidity</div>
        <div className="slider-track">
          <div 
            className="slider-thumb"
            style={{ left: `${idealHumidity}%` }}
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
              {idealHumidity}%
            </div>
          </div>
        </div>
        <div className="slider-range">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Average humidity panel */}
      <div className="info-panel most-likely">
        <div className="panel-label">average humidity:</div>
        <div className="panel-main-value">{humidityStats.avg_percent.toFixed(1)}%</div>
        <div className="panel-comparison">{comparisonText}</div>
      </div>

      {/* Probability panel */}
      <div className="info-panel probability">
        <div className="panel-content">
          <div className="probability-text">
            On this day, humidity typically ranges between {humidityProbability.dry_threshold_percent}% and {humidityProbability.humid_threshold_percent}%. 
            Very low humidity (below {humidityProbability.dry_threshold_percent}%) or very high humidity 
            (above {humidityProbability.humid_threshold_percent}%) are less common. 
            Humidity has ranged from a minimum of {humidityStats.min_percent}% to a maximum of {humidityStats.max_percent}%.
          </div>
        </div>
      </div>

      {/* Classification panel */}
      <div className="info-panel trend">
        <div className="panel-content">
          <div className="trend-text">
            With an average humidity of {humidityStats.avg_percent.toFixed(1)}%, the weather on this day is generally 
            classified as '{getHumidityClassification(humidityStats.avg_percent)}'. 
            {humidityStats.avg_percent > 70 ? 'This can make the heat feel more intense.' : 
             humidityStats.avg_percent < 40 ? 'This may cause respiratory discomfort and dry skin.' :
             'This provides generally comfortable conditions.'}
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
            ? `Humidity on this day tends to be consistent. It doesn't vary much from year to year, so you can predict conditions.`
            : `Humidity on this day is variable. It can change significantly from year to year, so be prepared for different conditions!`
          }
        </div>
        <div className="panel-stats">
          <div>Standard Deviation: {humidityStats.std_dev.toFixed(2)}%</div>
          <div>Range: {humidityStats.range_percent.toFixed(2)}%</div>
        </div>
      </div>

      {/* Days breakdown */}
      <div className="info-panel stats-breakdown">
        <div className="panel-header">Historical Distribution</div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Humid Days</div>
            <div className="stat-value">{humidityProbability.humid_days_count}</div>
            <div className="stat-detail">({humidityProbability.humid_probability_percent}%)</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Normal Days</div>
            <div className="stat-value">{humidityProbability.normal_days_count}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Dry Days</div>
            <div className="stat-value">{humidityProbability.dry_days_count}</div>
            <div className="stat-detail">({humidityProbability.dry_probability_percent}%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumidityField;
