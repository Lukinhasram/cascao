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
    ? `Probabilidade de chuva é baixa (${rainProbability.probability_percent.toFixed(1)}%), mas você prefere chuva`
    : idealRain < 5 && isLikelyRainy
    ? `Probabilidade de chuva é alta (${rainProbability.probability_percent.toFixed(1)}%), mas você prefere clima seco`
    : `Condições de chuva adequadas às suas preferências`;

  return (
    <div className="data-field rain-field">
      <h3 className="field-title">🌧️ Chuva</h3>
      
      {/* Slider visualization */}
      <div className="slider-visualization">
        <div className="slider-label">chuva ideal</div>
        <div className="slider-track">
          <div 
            className="slider-thumb"
            style={{ left: `${(idealRain / 50) * 100}%` }}
          />
        </div>
        <div className="slider-range">
          <span>0mm</span>
          <span>50mm</span>
        </div>
      </div>

      {/* Probability panel */}
      <div className="info-panel most-likely">
        <div className="panel-label">probabilidade de chuva:</div>
        <div className="panel-main-value">{rainProbability.probability_percent.toFixed(1)}%</div>
        <div className="panel-comparison">{comparisonText}</div>
      </div>

      {/* Statistics panel */}
      <div className="info-panel probability">
        <div className="panel-icon">📊</div>
        <div className="panel-content">
          <div className="probability-text">
            "Nos últimos {rainProbability.frequency_analysis.total_days} anos, choveu {rainProbability.rainy_days_count} vezes 
            neste dia (mais de {rainProbability.threshold_mm}mm). Isso significa que há uma probabilidade de {rainProbability.probability_percent.toFixed(1)}% 
            de chuva significativa."
          </div>
        </div>
      </div>

      {/* Days breakdown */}
      <div className="info-panel stats-breakdown">
        <div className="panel-header">Histórico de Dias</div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Dias com Chuva</div>
            <div className="stat-value">{rainProbability.rainy_days_count}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Dias Secos</div>
            <div className="stat-value">{rainProbability.dry_days_count}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RainField;
