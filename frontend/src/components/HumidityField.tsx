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
    ? `${difference.toFixed(1)}% ${humidityStats.avg_percent > idealHumidity ? 'mais úmido' : 'mais seco'} do que sua umidade ideal`
    : 'Próximo da sua umidade ideal';

  // Classify humidity
  const getHumidityClassification = (humidity: number): string => {
    if (humidity < 30) return 'Muito seco';
    if (humidity < 50) return 'Seco';
    if (humidity < 70) return 'Confortável';
    if (humidity < 85) return 'Úmido';
    return 'Muito úmido';
  };

  // Determine if variability is low or high
  const isLowVariability = humidityStats.std_dev < 10;

  return (
    <div className="data-field humidity-field">
      <h3 className="field-title">💧 Umidade</h3>
      
      {/* Slider visualization */}
      <div className="slider-visualization">
        <div className="slider-label">umidade ideal</div>
        <div className="slider-track">
          <div 
            className="slider-thumb"
            style={{ left: `${idealHumidity}%` }}
          />
        </div>
        <div className="slider-range">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Average humidity panel */}
      <div className="info-panel most-likely">
        <div className="panel-label">umidade média:</div>
        <div className="panel-main-value">{humidityStats.avg_percent.toFixed(1)}%</div>
        <div className="panel-comparison">{comparisonText}</div>
      </div>

      {/* Probability panel */}
      <div className="info-panel probability">
        <div className="panel-icon">📊</div>
        <div className="panel-content">
          <div className="probability-text">
            "Neste dia, a umidade normalmente fica entre {humidityProbability.dry_threshold_percent}% e {humidityProbability.humid_threshold_percent}%. 
            Umidade muito baixa (abaixo de {humidityProbability.dry_threshold_percent}%) ou muito alta 
            (acima de {humidityProbability.humid_threshold_percent}%) são menos comuns. 
            A umidade já variou de uma mínima de {humidityStats.min_percent}% a uma máxima de {humidityStats.max_percent}%."
          </div>
        </div>
      </div>

      {/* Classification panel */}
      <div className="info-panel trend">
        <div className="panel-icon">🌡️</div>
        <div className="panel-content">
          <div className="trend-text">
            "Com uma umidade média de {humidityStats.avg_percent.toFixed(1)}%, o clima neste dia é geralmente 
            classificado como '{getHumidityClassification(humidityStats.avg_percent)}'. 
            {humidityStats.avg_percent > 70 ? 'Isso pode fazer o calor parecer mais intenso.' : 
             humidityStats.avg_percent < 40 ? 'Isso pode causar desconforto respiratório e pele seca.' :
             'Isso proporciona condições geralmente confortáveis.'}"
          </div>
        </div>
      </div>

      {/* Standard deviation panel */}
      <div className="info-panel std-dev">
        <div className="panel-header">
          {isLowVariability ? 'desvio padrão baixo' : 'desvio padrão alto'}
        </div>
        <div className="panel-description">
          {isLowVariability 
            ? `"A umidade neste dia costuma ser consistente. Ela não varia muito de um ano para o outro, então você pode prever as condições."`
            : `"A umidade neste dia é variável. Pode mudar significativamente de um ano para o outro, então esteja preparado para diferentes condições!"`
          }
        </div>
        <div className="panel-stats">
          <div>Desvio Padrão: {humidityStats.std_dev.toFixed(2)}%</div>
          <div>Amplitude: {humidityStats.range_percent.toFixed(2)}%</div>
        </div>
      </div>

      {/* Days breakdown */}
      <div className="info-panel stats-breakdown">
        <div className="panel-header">Distribuição Histórica</div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Dias Úmidos</div>
            <div className="stat-value">{humidityProbability.humid_days_count}</div>
            <div className="stat-detail">({humidityProbability.humid_probability_percent}%)</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Dias Normais</div>
            <div className="stat-value">{humidityProbability.normal_days_count}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Dias Secos</div>
            <div className="stat-value">{humidityProbability.dry_days_count}</div>
            <div className="stat-detail">({humidityProbability.dry_probability_percent}%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumidityField;
