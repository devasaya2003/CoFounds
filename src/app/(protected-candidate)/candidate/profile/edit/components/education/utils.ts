import { EducationDate } from "./types";

export const generateTempId = (): string => {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const formatDateForApi = (date?: EducationDate): string | null => {
  if (!date || !date.year || !date.month || !date.day) {
    return null;
  }
  return `${date.year}-${date.month}-${date.day}`;
};