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
  const difference = Math.abs(mostLikelyTemp - idealTemperature);
  const comparisonText = difference > 3 
    ? `${difference.toFixed(1)}° a mais do que a sua temperatura ideal`
    : 'Próximo da sua temperatura ideal';

  // Determine if variability is low or high for the panel message
  const stdDev = temperatureStats.variability_analysis.yearly_variability.std_dev_c;
  const isLowVariability = stdDev < 2;

  return (
    <div className="data-field temperature-field">
      <h3 className="field-title">🌡️ Temperatura</h3>
      
      {/* Slider visualization */}
      <div className="slider-visualization">
        <div className="slider-label">temperatura ideal</div>
        <div className="slider-track">
          <div 
            className="slider-thumb"
            style={{ left: `${((idealTemperature - 15) / (40 - 15)) * 100}%` }}
          />
        </div>
        <div className="slider-range">
          <span>15°C</span>
          <span>40°C</span>
        </div>
      </div>

      {/* Most likely temperature panel */}
      <div className="info-panel most-likely">
        <div className="panel-label">temperatura mais provável:</div>
        <div className="panel-main-value">{mostLikelyTemp.toFixed(1)}°C</div>
        <div className="panel-comparison">{comparisonText}</div>
      </div>

      {/* Probability panel */}
      <div className="info-panel probability">
        <div className="panel-icon">📊</div>
        <div className="panel-content">
          <div className="probability-text">
            "Neste dia, a temperatura normalmente fica entre {temperatureProbability.cold_threshold_c}°C e {temperatureProbability.hot_threshold_c}°C. 
            Temperaturas muito frias (abaixo de {temperatureProbability.cold_threshold_c}°C) ou muito quentes 
            (acima de {temperatureProbability.hot_threshold_c}°C) são raras. A temperatura já variou de uma mínima 
            recorde de {temperatureStats.record_min_c}°C a uma máxima recorde de {temperatureStats.record_max_c}°C."
          </div>
        </div>
      </div>

      {/* Trend panel */}
      <div className="info-panel trend">
        <div className="panel-icon">📈</div>
        <div className="panel-content">
          <div className="trend-text">
            "A linha de tendência mostra uma leve inclinação para {temperatureStats.trend.description === 'warming' ? 'cima' : temperatureStats.trend.description === 'cooling' ? 'baixo' : 'estável'}, 
            indicando que as temperaturas neste dia têm {temperatureStats.trend.description === 'warming' ? 'aumentado' : temperatureStats.trend.description === 'cooling' ? 'diminuído' : 'permanecido estáveis'} 
            gradualmente ao longo das últimas décadas."
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
            ? `"O clima neste dia costuma ser muito consistente. A temperatura não varia muito de um ano para o outro, então você sabe o que esperar."`
            : `"O clima neste dia é muito variável. A temperatura pode mudar drasticamente de um ano para o outro, então prepare-se para surpresas!"`
          }
        </div>
        <div className="panel-stats">
          <div>Desvio Padrão: {stdDev.toFixed(2)}°C</div>
          <div>Coeficiente de Variação: {temperatureStats.variability_analysis.yearly_variability.coefficient_variation_percent.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureField;
