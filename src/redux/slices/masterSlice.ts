import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
  companyInitialState,
  companyMasterReducers,
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
  CompanyState
} from "../masters/companyMaster";

// Master state interface
interface MasterState {
  companies: CompanyState;
  // We'll add other masters here later
  // skills: SkillState;
  // resources: ResourceState;
  // degrees: DegreeState;
}

// Initial state
const initialState: MasterState = {
  companies: companyInitialState,
  // We'll add other initial states here later
};

// Create the master slice
const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    // Company reducers
    filterCompaniesByName: (state, action: PayloadAction<string>) => {
      companyMasterReducers.filterCompaniesByName(state.companies, action);
    },
    setCompanySizeFilter: (
      state,
      action: PayloadAction<{ lower: number | null; upper: number | null }>
    ) => {
      companyMasterReducers.setCompanySizeFilter(state.companies, action);
    },
    clearCompanyFilters: (state) => {
      companyMasterReducers.clearCompanyFilters(state.companies);
    },
    resetCompanyState: (state) => {
      state.companies = companyMasterReducers.resetCompanyState();
    },
    // Clear all master data
    clearAllMasterData: () => initialState,
  },
  extraReducers: (builder) => {
    // Company extra reducers
    builder
      // fetchAllCompanies
      .addCase(fetchAllCompanies.pending, (state) => {
        state.companies.isLoading = true;
        state.companies.error = null;
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.companies.isLoading = false;
        state.companies.allCompanies = action.payload;
        state.companies.filteredCompanies = action.payload;
        state.companies.pagination.totalCompanies = action.payload.length;
      })
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.companies.isLoading = false;
        state.companies.error = action.payload as string;
      })
      
      // fetchCompanyById
      .addCase(fetchCompanyById.pending, (state) => {
        state.companies.isLoading = true;
        state.companies.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.companies.isLoading = false;
        state.companies.selectedCompany = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.companies.isLoading = false;
        state.companies.error = action.payload as string;
      })
      
      // fetchCompanyByName
      .addCase(fetchCompanyByName.pending, (state) => {
        state.companies.isLoading = true;
        state.companies.error = null;
      })
      .addCase(fetchCompanyByName.fulfilled, (state, action) => {
        state.companies.isLoading = false;
        state.companies.selectedCompany = action.payload;
      })
      .addCase(fetchCompanyByName.rejected, (state, action) => {
        state.companies.isLoading = false;
        state.companies.error = action.payload as string;
      })
      
      // fetchCompaniesPaginated
      .addCase(fetchCompaniesPaginated.pending, (state) => {
        state.companies.isLoading = true;
        state.companies.error = null;
      })
      .addCase(fetchCompaniesPaginated.fulfilled, (state, action) => {
        state.companies.isLoading = false;
        state.companies.filteredCompanies = action.payload.companies;
        state.companies.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalCompanies: action.payload.totalCompanies,
        };
      })
      .addCase(fetchCompaniesPaginated.rejected, (state, action) => {
        state.companies.isLoading = false;
        state.companies.error = action.payload as string;
      })
      
      // fetchCompaniesBySize
      .addCase(fetchCompaniesBySize.pending, (state) => {
        state.companies.isLoading = true;
        state.companies.error = null;
      })
      .addCase(fetchCompaniesBySize.fulfilled, (state, action) => {
        state.companies.isLoading = false;
        state.companies.filteredCompanies = action.payload.companies;
        state.companies.pagination.totalCompanies = action.payload.total;
      })
      .addCase(fetchCompaniesBySize.rejected, (state, action) => {
        state.companies.isLoading = false;
        state.companies.error = action.payload as string;
      })
      
      // fetchCompaniesBySizePaginated
      .addCase(fetchCompaniesBySizePaginated.pending, (state) => {
        state.companies.isLoading = true;
        state.companies.error = null;
      })
      .addCase(fetchCompaniesBySizePaginated.fulfilled, (state, action) => {
        state.companies.isLoading = false;
        state.companies.filteredCompanies = action.payload.companies;
        state.companies.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalCompanies: action.payload.totalCompanies,
        };
      })
      .addCase(fetchCompaniesBySizePaginated.rejected, (state, action) => {
        state.companies.isLoading = false;
        state.companies.error = action.payload as string;
      });
      builder
      .addCase(updateCompany.pending, (state) => {
        state.companies.updateStatus.isUpdating = true;
        state.companies.updateStatus.message = null;
        state.companies.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.companies.updateStatus.isUpdating = false;
        state.companies.updateStatus.success = true;
        state.companies.updateStatus.message = "Company updated successfully";
        
        // Update the selected company if it's the one being updated
        if (state.companies.selectedCompany?.id === action.payload.id) {
          state.companies.selectedCompany = action.payload;
        }
        
        // Update in allCompanies list
        const companyIndex = state.companies.allCompanies.findIndex(
          company => company.id === action.payload.id
        );
        
        if (companyIndex !== -1) {
          state.companies.allCompanies[companyIndex] = action.payload;
        }
        
        // Update in filteredCompanies list if present
        const filteredIndex = state.companies.filteredCompanies.findIndex(
          company => company.id === action.payload.id
        );
        
        if (filteredIndex !== -1) {
          state.companies.filteredCompanies[filteredIndex] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.companies.updateStatus.isUpdating = false;
        state.companies.updateStatus.success = false;
        state.companies.error = action.payload as string;
        state.companies.updateStatus.message = `Update failed: ${action.payload}`;
      });
      
    // bulkUpdateCompanies
    builder
      .addCase(bulkUpdateCompanies.pending, (state) => {
        state.companies.updateStatus.isUpdating = true;
        state.companies.updateStatus.message = null;
        state.companies.error = null;
      })
      .addCase(bulkUpdateCompanies.fulfilled, (state, action) => {
        state.companies.updateStatus.isUpdating = false;
        state.companies.updateStatus.success = true;
        state.companies.updateStatus.message = `Successfully updated ${action.payload.updatedCount} companies`;
      })
      .addCase(bulkUpdateCompanies.rejected, (state, action) => {
        state.companies.updateStatus.isUpdating = false;
        state.companies.updateStatus.success = false;
        state.companies.error = action.payload as string;
        state.companies.updateStatus.message = `Bulk update failed: ${action.payload}`;
      });

    // Add POST reducers
    builder
      // createCompany
      .addCase(createCompany.pending, (state) => {
        state.companies.updateStatus.isUpdating = true;
        state.companies.updateStatus.message = null;
        state.companies.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companies.updateStatus.isUpdating = false;
        state.companies.updateStatus.success = true;
        state.companies.updateStatus.message = "Company created successfully";

        // Add the new company to the allCompanies and filteredCompanies lists
        state.companies.allCompanies.push(action.payload);
        state.companies.filteredCompanies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.companies.updateStatus.isUpdating = false;
        state.companies.updateStatus.success = false;
        state.companies.error = action.payload as string;
        state.companies.updateStatus.message = `Creation failed: ${action.payload}`;
      })

      // bulkCreateCompanies
      .addCase(bulkCreateCompanies.pending, (state) => {
        state.companies.updateStatus.isUpdating = true;
        state.companies.updateStatus.message = null;
        state.companies.error = null;
      })
      .addCase(bulkCreateCompanies.fulfilled, (state, action) => {
        state.companies.updateStatus.isUpdating = false;
        state.companies.updateStatus.success = true;
        state.companies.updateStatus.message = `Successfully created ${action.payload.createdCount} companies`;

        // Refresh the companies list after bulk creation
        // This can be handled by dispatching fetchAllCompanies after the bulk creation
      })
      .addCase(bulkCreateCompanies.rejected, (state, action) => {
        state.companies.updateStatus.isUpdating = false;
        state.companies.updateStatus.success = false;
        state.companies.error = action.payload as string;
        state.companies.updateStatus.message = `Bulk creation failed: ${action.payload}`;
      });
  },
});

// Export actions
export const {
  filterCompaniesByName,
  setCompanySizeFilter,
  clearCompanyFilters,
  resetCompanyState,
  clearAllMasterData,
} = masterSlice.actions;

// Export thunks
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

// Export reducer
export default masterSlice.reducer;