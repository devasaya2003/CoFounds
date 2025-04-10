import { RootState } from "../store";

export const selectAllDegrees = (state: RootState) => state.degree.allDegrees;
export const selectFilteredDegrees = (state: RootState) => state.degree.filteredDegrees;
export const selectSelectedDegree = (state: RootState) => state.degree.selectedDegree;
export const selectDegreePagination = (state: RootState) => state.degree.pagination;
export const selectDegreeFilters = (state: RootState) => state.degree.filters;
export const selectDegreeIsLoading = (state: RootState) => state.degree.isLoading;
export const selectDegreeError = (state: RootState) => state.degree.error;
export const selectDegreeUpdateStatus = (state: RootState) => state.degree.updateStatus;