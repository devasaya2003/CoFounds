"use client"

import * as React from "react"
import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_YEARS = Array.from(
  { length: CURRENT_YEAR - 1920 + 1 },
  (_, i) => (1920 + i).toString()
);

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  label?: string
  disabled?: boolean
  startYear?: number
  endYear?: number
}

const CalendarDropdown = React.memo(({ 
  date, 
  setDate, 
  currentMonth,
  currentYear,
  handleMonthChange,
  handleYearChange,
  disabled, 
  startYear,
}: { 
  date: Date | undefined,
  setDate: (date: Date | undefined) => void,
  currentMonth: string | undefined,
  currentYear: string | undefined,
  handleMonthChange: (month: string) => void,
  handleYearChange: (year: string) => void,
  disabled: boolean,
  startYear: number
}) => {  
  const years = React.useMemo(() => {
    const endYear = CURRENT_YEAR;
    if (startYear === 1920) {
      return DEFAULT_YEARS;
    }
    
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => (startYear + i).toString()
    );
  }, [startYear]);
  
  return (
    <>
      {/* Month and Year Selection */}
      <div className="flex justify-between p-2 border-b">
        <Select
          onValueChange={handleMonthChange}
          value={currentMonth}
          disabled={disabled}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map(month => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={handleYearChange}
          value={currentYear}
          disabled={disabled}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar */}
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        initialFocus
        month={date}
        onMonthChange={setDate}
        disabled={(calendarDate) => {          
          return calendarDate > new Date() || calendarDate < new Date(startYear, 0, 1);
        }}
      />
    </>
  );
});

CalendarDropdown.displayName = "CalendarDropdown";

export function DatePicker({ 
  date, 
  setDate, 
  label = "Date of Birth", 
  disabled = false,
  startYear = 1920,
  endYear = CURRENT_YEAR
}: DatePickerProps) {  
  const [open, setOpen] = React.useState(false);
    
  const displayDate = React.useMemo(() => 
    date ? format(date, "PPP") : "Pick a date",
  [date]);
  
  const currentMonth = React.useMemo(() => 
    date ? MONTHS[getMonth(date)] : undefined,
  [date]);
  
  const currentYear = React.useMemo(() => 
    date ? getYear(date).toString() : undefined,
  [date]);
  
  const handleMonthChange = React.useCallback((month: string) => {
    if (date) {
      const newDate = setMonth(date, MONTHS.indexOf(month));
      setDate(newDate);
    }
  }, [date, setDate]);

  const handleYearChange = React.useCallback((year: string) => {
    if (date) {
      const newDate = setYear(date, parseInt(year));
      setDate(newDate);
    }
  }, [date, setDate]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "bg-gray-100 cursor-not-allowed opacity-70"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{displayDate}</span>
          </Button>
        </PopoverTrigger>
        
        {/* Only render content when open */}
        {open && (
          <PopoverContent className="w-auto p-0" sideOffset={4}>
            <CalendarDropdown
              date={date}
              setDate={setDate}
              currentMonth={currentMonth}
              currentYear={currentYear}
              handleMonthChange={handleMonthChange}
              handleYearChange={handleYearChange}
              disabled={disabled}
              startYear={startYear}
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}