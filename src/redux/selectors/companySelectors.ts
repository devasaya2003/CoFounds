import { RootState } from "../store";

export const selectAllCompanies = (state: RootState) => state.company.allCompanies;
export const selectFilteredCompanies = (state: RootState) => state.company.filteredCompanies;
export const selectSelectedCompany = (state: RootState) => state.company.selectedCompany;
export const selectCompanyPagination = (state: RootState) => state.company.pagination;
export const selectCompanyFilters = (state: RootState) => state.company.filters;
export const selectCompanyIsLoading = (state: RootState) => state.company.isLoading;
export const selectCompanyError = (state: RootState) => state.company.error;
export const selectCompanyUpdateStatus = (state: RootState) => state.company.updateStatus;