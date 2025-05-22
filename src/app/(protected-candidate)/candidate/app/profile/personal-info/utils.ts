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
export const formatDateToYMD = (dateString: string) => {
  try {
    console.log("Parsing date string:", dateString);
    
    // Fix: Use explicit date parsing to avoid timezone issues
    const parts = dateString.split('T')[0].split('-');
    if (parts.length !== 3) {
      throw new Error(`Invalid date format: ${dateString}`);
    }
    
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    
    console.log("Parsed YMD:", { year, month, day });
    
    return { year, month, day };
  } catch (error) {
    console.error('Error parsing date in formatDateToYMD:', error);
    return { year: '', month: '', day: '' };
  }
};

// Format year, month, and day into ISO date string
export const formatYMDtoISODate = (year: string, month: string, day: string) => {
  try {
    if (!year || !month || !day) {
      console.log('Missing date component in formatYMDtoISODate:', { year, month, day });
      return null;
    }
    
    console.log("Creating ISO date from:", { year, month, day });
    
    // Create a string date in ISO format to avoid timezone issues
    const isoDate = `${year}-${month}-${day}T00:00:00.000Z`;
    console.log("Created ISO date:", isoDate);
    
    return isoDate;
  } catch (error) {
    console.error('Error creating ISO date in formatYMDtoISODate:', error);
    return null;
  }
};
