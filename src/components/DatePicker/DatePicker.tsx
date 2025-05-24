"use client";

import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_YEARS = Array.from(
  { length: CURRENT_YEAR - 1920 + 1 },
  (_, i) => (1920 + i).toString()
);

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  startYear?: number;
  endYear?: number;
}

const CalendarDropdown = React.memo(
  ({
    date,
    setDate,
    currentMonth,
    currentYear,
    handleMonthChange,
    handleYearChange,
    disabled,
    startYear,
  }: {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    currentMonth: string | undefined;
    currentYear: string | undefined;
    handleMonthChange: (month: string) => void;
    handleYearChange: (year: string) => void;
    disabled: boolean;
    startYear: number;
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
              {MONTHS.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
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
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
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
            return (
              calendarDate > new Date() ||
              calendarDate < new Date(startYear, 0, 1)
            );
          }}
        />
      </>
    );
  }
);

CalendarDropdown.displayName = "CalendarDropdown";

export function DatePicker({
  date,
  setDate,
  label = "Date",
  error,
  disabled = false,
  startYear = 1920,
  endYear = CURRENT_YEAR,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const today = React.useMemo(() => new Date(), []);

  const effectiveDate = date || today;

  const displayDate = React.useMemo(
    () => (date ? format(date, "PPP") : "Select date"),
    [date]
  );

  const currentMonth = React.useMemo(
    () => MONTHS[getMonth(effectiveDate)],
    [effectiveDate]
  );

  const currentYear = React.useMemo(
    () => getYear(effectiveDate).toString(),
    [effectiveDate]
  );

  const handleMonthChange = React.useCallback(
    (month: string) => {
      const baseDate = date || today;
      const newDate = setMonth(baseDate, MONTHS.indexOf(month));
      setDate(newDate);
    },
    [date, setDate, today]
  );

  const handleYearChange = React.useCallback(
    (year: string) => {
      const baseDate = date || today;
      const newDate = setYear(baseDate, parseInt(year));
      setDate(newDate);
    },
    [date, setDate, today]
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-between text-left font-normal border",
              error ? "border-red-500" : "border-gray-300",
              disabled && "bg-gray-100 cursor-not-allowed opacity-70",
              "bg-white hover:bg-gray-50 h-10"
            )}
          >
            <span className={`${date ? "text-gray-800" : "text-gray-500"}`}>
              {displayDate}
            </span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        {/* Only render content when open */}
        {open && (
          <PopoverContent className="w-auto p-0" sideOffset={4}>
            <CalendarDropdown
              date={effectiveDate}
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
      {error && (
        <p className="text-sm text-red-600 mt-1 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}