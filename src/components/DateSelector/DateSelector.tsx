'use client';

import { ChevronDown } from 'lucide-react';

interface DateSelectorProps {
  years: string[];
  months: { value: string; label: string }[];
  days: string[];
  selectedYear: string;
  selectedMonth: string;
  selectedDay: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onDayChange: (day: string) => void;
}

export default function DateSelector({
  years,
  months,
  days,
  selectedYear,
  selectedMonth,
  selectedDay,
  onYearChange,
  onMonthChange,
  onDayChange,
}: DateSelectorProps) {
  return (
    <div className="flex gap-3">
      <div className="w-1/3 relative">
        <label className="text-xs text-gray-500 font-medium mb-1 block">
          Month
        </label>
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full appearance-none px-3 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
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
      
      <div className="w-1/3 relative">
        <label className="text-xs text-gray-500 font-medium mb-1 block">
          Day
        </label>
        <div className="relative">
          <select
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value)}
            className="w-full appearance-none px-3 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          >
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      
      <div className="w-1/3 relative">
        <label className="text-xs text-gray-500 font-medium mb-1 block">
          Year
        </label>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full appearance-none px-3 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
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
    </div>
  );
}