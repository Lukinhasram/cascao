import React from 'react';
import './DatePicker.css';

interface DatePickerProps {
  day: number;
  month: number;
  onDateChange: (day: number, month: number) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ day, month, onDateChange }) => {
  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  // Get max days for selected month (simple version, doesn't account for leap years)
  const getDaysInMonth = (monthNum: number) => {
    const daysInMonth: { [key: number]: number } = {
      1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30,
      7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
    };
    return daysInMonth[monthNum] || 31;
  };

  const maxDays = getDaysInMonth(month);
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  const handleDayChange = (newDay: number) => {
    onDateChange(newDay, month);
  };

  const handleMonthChange = (newMonth: number) => {
    const maxDaysInNewMonth = getDaysInMonth(newMonth);
    const adjustedDay = day > maxDaysInNewMonth ? maxDaysInNewMonth : day;
    onDateChange(adjustedDay, newMonth);
  };

  return (
    <div className="date-picker">
      <h3 className="date-title">📅 Selecione a Data</h3>
      <p className="date-instruction">
        Escolha o dia e mês para análise climática histórica
      </p>

      <div className="date-selectors">
        <div className="selector-group">
          <label htmlFor="day-select">Dia:</label>
          <select
            id="day-select"
            value={day}
            onChange={(e) => handleDayChange(Number(e.target.value))}
            className="date-select"
          >
            {days.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="selector-group">
          <label htmlFor="month-select">Mês:</label>
          <select
            id="month-select"
            value={month}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="date-select"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="date-info">
        <p>
          <strong>Data selecionada:</strong> {day} de {months[month - 1].label}
        </p>
        <p className="date-note">
          ⓘ A análise usará dados históricos para este dia específico ao longo de vários anos
        </p>
      </div>
    </div>
  );
};

export default DatePicker;
