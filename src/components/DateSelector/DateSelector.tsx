'use client';

import { useEffect, useState, useRef } from 'react';
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
  error
}: DateSelectorProps) {  
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const initialized = useRef(false);
  
  // Get current date values for defaults
  const today = new Date();
  const currentYear = today.getFullYear().toString();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = today.getDate().toString().padStart(2, '0');
  
  // Fix the initialization issue - make sure it runs with the right dependencies
  useEffect(() => {
    if (!initialized.current) {
      // Set initialized to true immediately
      initialized.current = true;
      
      const isYearMissing = !selectedYear || selectedYear === '';
      const isMonthMissing = !selectedMonth || selectedMonth === '';
      const isDayMissing = !selectedDay || selectedDay === '';
      
      // Immediately dispatch updates for any missing values
      if (isYearMissing) {
        onYearChange(currentYear);
      }
      
      if (isMonthMissing) {
        onMonthChange(currentMonth);
      }
    }
  }, [selectedYear, selectedMonth, selectedDay, onYearChange, onMonthChange, currentYear, currentMonth]);
    
  const isLeapYear = (year: number): boolean => {
    if (year % 400 === 0) return true;
    if (year % 100 === 0) return false;
    return year % 4 === 0;
  };
    
  const getDaysInMonth = (year: number, month: number): number => {            
    return new Date(year, month, 0).getDate();
  };
    
  // Calculate available days based on selected year and month
  useEffect(() => {
    // Always get valid values - use current date as fallback
    const yearToUse = selectedYear || currentYear;
    const monthToUse = selectedMonth || currentMonth;
    
    const yearNum = parseInt(yearToUse, 10);
    const monthNum = parseInt(monthToUse, 10);
    
    if (isNaN(yearNum) || isNaN(monthNum)) {
      return;
    }
        
    const daysInMonth = getDaysInMonth(yearNum, monthNum);
    
    const newDays = Array.from({ length: daysInMonth }, (_, i) => 
      (i + 1).toString().padStart(2, '0')
    );
    
    setAvailableDays(newDays);
    
    // Handle day selection
    if (!selectedDay || selectedDay === '') {
      // If day is missing, select current day or first day of month
      const dayToUse = (monthToUse === currentMonth && yearToUse === currentYear) 
        ? currentDay 
        : '01';
        
      // Make sure the default day is valid for this month
      const finalDay = parseInt(dayToUse, 10) > daysInMonth 
        ? daysInMonth.toString().padStart(2, '0')
        : dayToUse;
        
      onDayChange(finalDay);
    } else {
      // If day exists but is invalid for the month, adjust it
      const dayNum = parseInt(selectedDay, 10);
      if (dayNum > daysInMonth) {
        onDayChange(daysInMonth.toString().padStart(2, '0'));
      }
    }
  }, [selectedYear, selectedMonth, selectedDay, onDayChange, currentYear, currentMonth, currentDay]);

  return (
    <div className="flex gap-3">
      {/* Year First */}
      <div className="w-1/3 relative">
        <label className="text-xs text-gray-500 font-medium mb-1 block">
          Year
        </label>
        <div className="relative">
          <select
            value={selectedYear || ''}
            onChange={(e) => onYearChange(e.target.value)}
            className={`w-full appearance-none px-3 py-2.5 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            <option value="">Select Year</option>
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
            value={selectedMonth || ''}
            onChange={(e) => onMonthChange(e.target.value)}
            className={`w-full appearance-none px-3 py-2.5 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            <option value="">Select Month</option>
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
            value={selectedDay || ''}
            onChange={(e) => onDayChange(e.target.value)}
            className={`w-full appearance-none px-3 py-2.5 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={disabled || availableDays.length === 0}
          >
            <option value="">Select Day</option>
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