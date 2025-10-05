import React from 'react';
import type { AdditionalParameterStats } from '../types/climate';
import './DataField.css';

interface AdditionalParameterFieldProps {
  stats: AdditionalParameterStats;
}

const AdditionalParameterField: React.FC<AdditionalParameterFieldProps> = ({ stats }) => {
  // Format parameter name for display
  const displayName = stats.parameter_name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="data-field additional-parameter-field">
      <h3 className="field-title">{displayName}</h3>
      
      {/* Main statistics panel */}
      <div className="info-panel most-likely">
        <div className="panel-label">Average Value:</div>
        <div className="panel-main-value">
          {stats.avg_value.toFixed(2)} {stats.parameter_unit}
        </div>
        <div className="panel-comparison">
          Range: {stats.min_value.toFixed(2)} - {stats.max_value.toFixed(2)} {stats.parameter_unit}
        </div>
      </div>

      {/* Statistics grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Median</div>
          <div className="stat-value">{stats.median_value.toFixed(2)} {stats.parameter_unit}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Std. Deviation</div>
          <div className="stat-value">{stats.std_dev.toFixed(2)} {stats.parameter_unit}</div>
        </div>
      </div>

      {/* Percentiles panel */}
      <div className="info-panel percentiles">
        <div className="panel-header">Distribution Percentiles</div>
        <div className="percentiles-grid">
          <div className="percentile-item">
            <span className="percentile-label">10th:</span>
            <span className="percentile-value">{stats.percentiles["10th_percentile"].toFixed(2)} {stats.parameter_unit}</span>
          </div>
          <div className="percentile-item">
            <span className="percentile-label">25th:</span>
            <span className="percentile-value">{stats.percentiles["25th_percentile"].toFixed(2)} {stats.parameter_unit}</span>
          </div>
          <div className="percentile-item">
            <span className="percentile-label">75th:</span>
            <span className="percentile-value">{stats.percentiles["75th_percentile"].toFixed(2)} {stats.parameter_unit}</span>
          </div>
          <div className="percentile-item">
            <span className="percentile-label">90th:</span>
            <span className="percentile-value">{stats.percentiles["90th_percentile"].toFixed(2)} {stats.parameter_unit}</span>
          </div>
        </div>
      </div>

      {/* Explanation panel */}
      <div className="info-panel explanation">
        <div className="panel-content">
          <div className="explanation-text">
            This data shows the historical patterns for {displayName.toLowerCase()} on this specific date. 
            The percentiles indicate that 50% of observations fall between the 25th and 75th percentiles, 
            while extreme values (below 10th or above 90th percentile) are rare.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalParameterField;
