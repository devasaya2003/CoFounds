'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DateSelectorProps {
  years: string[];
  months: { value: string; label: string }[];
  selectedYear: string;
  selectedMonth: string;
  selectedDay: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onDayChange: (day: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export default function DateSelector({
  years,
  months,
  selectedYear,
  selectedMonth,
  selectedDay,
  onYearChange,
  onMonthChange,
  onDayChange,
  disabled = false,
  error,
}: DateSelectorProps) {  
  const [availableDays, setAvailableDays] = useState<string[]>([]);
    
  const isLeapYear = (year: number): boolean => {
    if (year % 400 === 0) return true;
    if (year % 100 === 0) return false;
    return year % 4 === 0;
  };
    
  const getDaysInMonth = (year: number, month: number): number => {            
    return new Date(year, month, 0).getDate();
  };
    
  useEffect(() => {
    if (!selectedYear || !selectedMonth) return;
    
    const yearNum = parseInt(selectedYear, 10);
    const monthNum = parseInt(selectedMonth, 10);
        
    const daysInMonth = getDaysInMonth(yearNum, monthNum);
        
    const newDays = Array.from({ length: daysInMonth }, (_, i) => 
      (i + 1).toString().padStart(2, '0')
    );
    
    setAvailableDays(newDays);
        
    const dayNum = parseInt(selectedDay, 10);
    if (dayNum > daysInMonth) {
      onDayChange(daysInMonth.toString().padStart(2, '0'));
    }
  }, [selectedYear, selectedMonth, selectedDay, onDayChange]);

  return (
    <div className="flex gap-3">
      {/* Year First */}
      <div className="w-1/3 relative">
        <label className="text-xs text-gray-500 font-medium mb-1 block">
          Year
        </label>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className={`w-full appearance-none px-3 py-2.5 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      
      {/* Then Month */}
      <div className="w-1/3 relative">
        <label className="text-xs text-gray-500 font-medium mb-1 block">
          Month
        </label>
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className={`w-full appearance-none px-3 py-2.5 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      
      {/* Then Day */}
      <div className="w-1/3 relative">
        <label className="text-xs text-gray-500 font-medium mb-1 block">
          Day
        </label>
        <div className="relative">
          <select
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value)}
            className={`w-full appearance-none px-3 py-2.5 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            {availableDays.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}