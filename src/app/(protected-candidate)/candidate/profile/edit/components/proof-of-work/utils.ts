import { ProofOfWorkDate } from './types';

export function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatDateForApi(date?: ProofOfWorkDate): string | null {
  if (!date || !date.year || !date.month || !date.day) {
    return null;
  }
  return `${date.year}-${date.month}-${date.day}`;
}

export function generateYears(): string[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());
}

export function generateMonths(): { value: string; label: string }[] {
  return [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
}

export function generateDays(): string[] {
  return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
}