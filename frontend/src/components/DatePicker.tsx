import React from 'react';
import './DatePicker.css';

interface DatePickerProps {
  day: number;
  month: number;
  onDateChange: (day: number, month: number) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ day, month, onDateChange }) => {
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
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
      <h3 className="date-title">Select Date</h3>
      <p className="date-instruction">
        Choose the day and month for historical climate analysis
      </p>

      <div className="date-selectors">
        <div className="selector-group">
          <label htmlFor="month-select">Month:</label>
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

        <div className="selector-group">
          <label htmlFor="day-select">Day:</label>
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
      </div>

      <div className="date-info">
        <p>
          <strong>Selected date:</strong> {months[month - 1].label} {day}
        </p>
        <p className="date-note">
          The analysis will use historical data for this specific day across multiple years
        </p>
      </div>
    </div>
  );
};

export default DatePicker;
