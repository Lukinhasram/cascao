import React from 'react';
import type { WindStats } from '../types/climate';
import './DataField.css';

interface WindFieldProps {
  windStats: WindStats;
  idealWindSpeed: number;
}

const WindField: React.FC<WindFieldProps> = ({
  windStats,
  idealWindSpeed
}) => {
  // Calculate difference from ideal
  const difference = Math.abs(windStats.avg_speed_ms - idealWindSpeed);
  const comparisonText = difference > 2 
    ? `${difference.toFixed(1)}m/s ${windStats.avg_speed_ms > idealWindSpeed ? 'faster' : 'slower'} than your ideal wind`
    : 'Close to your ideal wind';

  // Classify wind speed
  const getWindClassification = (speed: number): string => {
    if (speed < 2) return 'Calm';
    if (speed < 5) return 'Light breeze';
    if (speed < 8) return 'Moderate breeze';
    if (speed < 11) return 'Strong breeze';
    return 'Gale';
  };

  return (
    <div className="data-field wind-field">
      <h3 className="field-title">Wind</h3>
      
      {/* Slider visualization */}
      <div className="slider-visualization">
        <div className="slider-label">ideal wind</div>
        <div className="slider-track">
          <div 
            className="slider-thumb"
            style={{ left: `${(idealWindSpeed / 20) * 100}%` }}
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
              {idealWindSpeed}m/s
            </div>
          </div>
        </div>
        <div className="slider-range">
          <span>0m/s</span>
          <span>20m/s</span>
        </div>
      </div>

      {/* Average wind speed panel */}
      <div className="info-panel most-likely">
        <div className="panel-label">average wind speed:</div>
        <div className="panel-main-value">{windStats.avg_speed_ms.toFixed(1)}m/s</div>
        <div className="panel-comparison">{comparisonText}</div>
      </div>

      {/* Wind classification */}
      <div className="info-panel probability">
        <div className="panel-content">
          <div className="probability-text">
            On this day, wind typically has an average speed of {windStats.avg_speed_ms.toFixed(1)}m/s, 
            which is classified as '{getWindClassification(windStats.avg_speed_ms)}'. 
            This is {windStats.avg_speed_ms < 5 ? 'a gentle wind, ideal for outdoor activities' : 
            windStats.avg_speed_ms < 10 ? 'a moderate wind, still comfortable for most activities' : 
            'a strong wind, which may affect outdoor activities'}.
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className="info-panel stats-breakdown">
        <div className="panel-header">Wind Classification</div>
        <div className="wind-scale">
          <div className="scale-item">
            <span className="scale-range">0-2 m/s</span>
            <span className="scale-label">Calm</span>
          </div>
          <div className="scale-item">
            <span className="scale-range">2-5 m/s</span>
            <span className="scale-label">Light breeze</span>
          </div>
          <div className="scale-item">
            <span className="scale-range">5-8 m/s</span>
            <span className="scale-label">Moderate breeze</span>
          </div>
          <div className="scale-item">
            <span className="scale-range">8-11 m/s</span>
            <span className="scale-label">Strong breeze</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindField;
