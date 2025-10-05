import React from 'react';
import type { RainProbability } from '../types/climate';
import './DataField.css';

interface RainFieldProps {
  rainProbability: RainProbability;
  idealRain: number;
}

const RainField: React.FC<RainFieldProps> = ({
  rainProbability,
  idealRain
}) => {
  // Determine if the ideal rain matches the probability
  const isLikelyRainy = rainProbability.probability_percent > 50;
  const comparisonText = idealRain > 10 && !isLikelyRainy
    ? `Rain probability is low (${rainProbability.probability_percent.toFixed(1)}%), but you prefer rain`
    : idealRain < 5 && isLikelyRainy
    ? `Rain probability is high (${rainProbability.probability_percent.toFixed(1)}%), but you prefer dry weather`
    : `Rain conditions match your preferences`;

  return (
    <div className="data-field rain-field">
      <h3 className="field-title">Rain</h3>
      
      {/* Slider visualization */}
      <div className="slider-visualization">
        <div className="slider-label">ideal rain</div>
        <div className="slider-track">
          <div 
            className="slider-thumb"
            style={{ left: `${(idealRain / 50) * 100}%` }}
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
              {idealRain}mm
            </div>
          </div>
        </div>
        <div className="slider-range">
          <span>0mm</span>
          <span>50mm</span>
        </div>
      </div>

      {/* Probability panel */}
      <div className="info-panel most-likely">
        <div className="panel-label">rain probability:</div>
        <div className="panel-main-value">{rainProbability.probability_percent.toFixed(1)}%</div>
        <div className="panel-comparison">{comparisonText}</div>
      </div>

      {/* Statistics panel */}
      <div className="info-panel probability">
        <div className="panel-content">
          <div className="probability-text">
            Over the past {rainProbability.frequency_analysis.total_days} years, it rained {rainProbability.rainy_days_count} times 
            on this day (more than {rainProbability.threshold_mm}mm). This means there's a {rainProbability.probability_percent.toFixed(1)}% 
            probability of significant rain.
          </div>
        </div>
      </div>

      {/* Days breakdown */}
      <div className="info-panel stats-breakdown">
        <div className="panel-header">Historical Days</div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Rainy Days</div>
            <div className="stat-value">{rainProbability.rainy_days_count}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Dry Days</div>
            <div className="stat-value">{rainProbability.dry_days_count}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RainField;
