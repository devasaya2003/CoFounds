/**
 * Utility functions for the personal info page
 */

// Check if URL is external (starts with http or https)
export const isExternalUrl = (url: string) => {
  if (!url) return false;
  return url.startsWith('http') || url.startsWith('https');
};

// Date selector options
export const YEARS = Array.from(
  { length: 100 }, 
  (_, i) => (new Date().getFullYear() - i).toString()
);

export const MONTHS = [
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
  { value: '12', label: 'December' },
];

// Format date string into date parts (year, month, day)
export const formatDateToYMD = (dateString: string | null) => {
  if (!dateString) return { year: '', month: '', day: '' };
  
  const date = new Date(dateString);
  return {
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    day: date.getDate().toString().padStart(2, '0')
  };
};

// Format year, month, and day into ISO date string
export const formatYMDtoISODate = (year: string, month: string, day: string) => {
  if (!year || !month || !day) return null;
  return `${year}-${month}-${day}T00:00:00.000Z`;
};
