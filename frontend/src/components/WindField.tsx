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
    ? `${difference.toFixed(1)}m/s ${windStats.avg_speed_ms > idealWindSpeed ? 'mais rápido' : 'mais lento'} do que o seu vento ideal`
    : 'Próximo do seu vento ideal';

  // Classify wind speed
  const getWindClassification = (speed: number): string => {
    if (speed < 2) return 'Calmo';
    if (speed < 5) return 'Brisa leve';
    if (speed < 8) return 'Brisa moderada';
    if (speed < 11) return 'Brisa forte';
    return 'Ventania';
  };

  return (
    <div className="data-field wind-field">
      <h3 className="field-title">💨 Vento</h3>
      
      {/* Slider visualization */}
      <div className="slider-visualization">
        <div className="slider-label">vento ideal</div>
        <div className="slider-track">
          <div 
            className="slider-thumb"
            style={{ left: `${(idealWindSpeed / 20) * 100}%` }}
          />
        </div>
        <div className="slider-range">
          <span>0m/s</span>
          <span>20m/s</span>
        </div>
      </div>

      {/* Average wind speed panel */}
      <div className="info-panel most-likely">
        <div className="panel-label">velocidade média do vento:</div>
        <div className="panel-main-value">{windStats.avg_speed_ms.toFixed(1)}m/s</div>
        <div className="panel-comparison">{comparisonText}</div>
      </div>

      {/* Wind classification */}
      <div className="info-panel probability">
        <div className="panel-icon">🍃</div>
        <div className="panel-content">
          <div className="probability-text">
            "Neste dia, o vento normalmente tem velocidade média de {windStats.avg_speed_ms.toFixed(1)}m/s, 
            o que é classificado como '{getWindClassification(windStats.avg_speed_ms)}'. 
            Este é {windStats.avg_speed_ms < 5 ? 'um vento suave, ideal para atividades ao ar livre' : 
            windStats.avg_speed_ms < 10 ? 'um vento moderado, ainda confortável para a maioria das atividades' : 
            'um vento forte, que pode afetar atividades ao ar livre'}."
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className="info-panel stats-breakdown">
        <div className="panel-header">Classificação de Vento</div>
        <div className="wind-scale">
          <div className="scale-item">
            <span className="scale-range">0-2 m/s</span>
            <span className="scale-label">Calmo</span>
          </div>
          <div className="scale-item">
            <span className="scale-range">2-5 m/s</span>
            <span className="scale-label">Brisa leve</span>
          </div>
          <div className="scale-item">
            <span className="scale-range">5-8 m/s</span>
            <span className="scale-label">Brisa moderada</span>
          </div>
          <div className="scale-item">
            <span className="scale-range">8-11 m/s</span>
            <span className="scale-label">Brisa forte</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindField;
