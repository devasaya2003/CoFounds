import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  companyInitialState,
  fetchAllCompanies,
  fetchCompanyById,
  fetchCompanyByName,
  fetchCompaniesPaginated,
  fetchCompaniesBySize,
  fetchCompaniesBySizePaginated,
  updateCompany,
  bulkUpdateCompanies,
  createCompany,
  bulkCreateCompanies,
  CompanyState,
} from "../masters/companyMaster";

const companySlice = createSlice({
  name: "company",
  initialState: companyInitialState,
  reducers: {
    filterCompaniesByName: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload.toLowerCase();
      state.filteredCompanies = state.allCompanies.filter((company) =>
        company.name.toLowerCase().includes(state.filters.searchTerm)
      );
    },
    setCompanySizeFilter: (
      state,
      action: PayloadAction<{ lower: number | null; upper: number | null }>
    ) => {
      state.filters.sizeRange = action.payload;
    },
    clearCompanyFilters: (state) => {
      state.filters = companyInitialState.filters;
      state.filteredCompanies = state.allCompanies;
    },
    resetCompanyState: () => companyInitialState,
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchAllCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allCompanies = action.payload;
        state.filteredCompanies = action.payload;
        state.pagination.totalCompanies = action.payload.length;
      })
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchCompanyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCompany = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchCompanyByName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanyByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCompany = action.payload;
      })
      .addCase(fetchCompanyByName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchCompaniesPaginated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesPaginated.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredCompanies = action.payload.companies;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalCompanies: action.payload.totalCompanies,
        };
      })
      .addCase(fetchCompaniesPaginated.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchCompaniesBySize.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesBySize.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredCompanies = action.payload.companies;
        state.pagination.totalCompanies = action.payload.total;
      })
      .addCase(fetchCompaniesBySize.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchCompaniesBySizePaginated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesBySizePaginated.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredCompanies = action.payload.companies;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalCompanies: action.payload.totalCompanies,
        };
      })
      .addCase(fetchCompaniesBySizePaginated.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(updateCompany.pending, (state) => {
        state.updateStatus.isUpdating = true;
        state.updateStatus.message = null;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = true;
        state.updateStatus.message = "Company updated successfully";

        
        if (state.selectedCompany?.id === action.payload.id) {
          state.selectedCompany = action.payload;
        }

        
        const companyIndex = state.allCompanies.findIndex(
          (company) => company.id === action.payload.id
        );

        if (companyIndex !== -1) {
          state.allCompanies[companyIndex] = action.payload;
        }

        
        const filteredIndex = state.filteredCompanies.findIndex(
          (company) => company.id === action.payload.id
        );

        if (filteredIndex !== -1) {
          state.filteredCompanies[filteredIndex] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = false;
        state.error = action.payload as string;
        state.updateStatus.message = `Update failed: ${action.payload}`;
      })

      
      .addCase(bulkUpdateCompanies.pending, (state) => {
        state.updateStatus.isUpdating = true;
        state.updateStatus.message = null;
        state.error = null;
      })
      .addCase(bulkUpdateCompanies.fulfilled, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = true;
        state.updateStatus.message = `Successfully updated ${action.payload.updatedCount} companies`;
      })
      .addCase(bulkUpdateCompanies.rejected, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = false;
        state.error = action.payload as string;
        state.updateStatus.message = `Bulk update failed: ${action.payload}`;
      })

      
      .addCase(createCompany.pending, (state) => {
        state.updateStatus.isUpdating = true;
        state.updateStatus.message = null;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = true;
        state.updateStatus.message = "Company created successfully";

        
        state.allCompanies.push(action.payload);
        state.filteredCompanies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = false;
        state.error = action.payload as string;
        state.updateStatus.message = `Creation failed: ${action.payload}`;
      })

      
      .addCase(bulkCreateCompanies.pending, (state) => {
        state.updateStatus.isUpdating = true;
        state.updateStatus.message = null;
        state.error = null;
      })
      .addCase(bulkCreateCompanies.fulfilled, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = true;
        state.updateStatus.message = `Successfully created ${action.payload.createdCount} companies`;
      })
      .addCase(bulkCreateCompanies.rejected, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = false;
        state.error = action.payload as string;
        state.updateStatus.message = `Bulk creation failed: ${action.payload}`;
      });
  },
});


export const {
  filterCompaniesByName,
  setCompanySizeFilter,
  clearCompanyFilters,
  resetCompanyState,
} = companySlice.actions;


export {
  fetchAllCompanies,
  fetchCompanyById,
  fetchCompanyByName,
  fetchCompaniesPaginated,
  fetchCompaniesBySize,
  fetchCompaniesBySizePaginated,
  updateCompany,
  bulkUpdateCompanies,
  createCompany,
  bulkCreateCompanies,
};


export default companySlice.reducer;