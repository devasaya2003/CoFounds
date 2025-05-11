export const formatDateForApi = (dateObj: { year: string; month: string; day: string; } | undefined): string | null => {
  if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day) {
    return null;
  }
  return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
};

export const generateYears = (count: number = 30): string[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => (currentYear - i).toString());
};

export const generateMonths = () => [
  { value: '01', label: 'January' }, { value: '02', label: 'February' },
  { value: '03', label: 'March' }, { value: '04', label: 'April' },
  { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' },
  { value: '09', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' }
];

export const generateDays = () => Array.from(
  { length: 31 }, 
  (_, i) => (i + 1).toString().padStart(2, '0')
);

export const generateTempId = () => {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};