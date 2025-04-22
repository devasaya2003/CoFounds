import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  degreeInitialState,
  fetchAllDegrees,
  fetchDegreeById,
  fetchDegreeByName,
  fetchDegreesPaginated,
  fetchDegreesByType,
  fetchDegreesByTypePaginated,
  degreeMasterReducers,
  DegreeState,
  createDegree,
  bulkCreateDegrees,
  updateDegree,
  bulkUpdateDegrees,
} from "../masters/degreeMaster";

const degreeSlice = createSlice({
  name: "degree",
  initialState: degreeInitialState,
  reducers: {
    filterDegreesByName: (state, action: PayloadAction<string>) => {
      degreeMasterReducers.filterDegreesByName(state, action);
    },
    resetDegreeState: () => degreeMasterReducers.resetDegreeState(),
    resetUpdateStatus: (state) => {
      state.updateStatus = {
        isUpdating: false,
        success: false,
        message: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchAllDegrees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllDegrees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allDegrees = action.payload;
        state.filteredDegrees = action.payload;
        state.pagination.totalDegrees = action.payload.length;
      })
      .addCase(fetchAllDegrees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchDegreeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDegreeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDegree = action.payload;
      })
      .addCase(fetchDegreeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchDegreeByName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDegreeByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDegree = action.payload;
      })
      .addCase(fetchDegreeByName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchDegreesPaginated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDegreesPaginated.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredDegrees = action.payload.degrees;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalDegrees: action.payload.totalDegrees,
        };
      })
      .addCase(fetchDegreesPaginated.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchDegreesByType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDegreesByType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredDegrees = action.payload;
      })
      .addCase(fetchDegreesByType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchDegreesByTypePaginated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDegreesByTypePaginated.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredDegrees = action.payload.degrees;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalDegrees: action.payload.totalDegrees,
        };
      })
      .addCase(fetchDegreesByTypePaginated.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(createDegree.pending, (state) => {
        state.updateStatus.isUpdating = true;
        state.updateStatus.message = null;
        state.error = null;
      })
      .addCase(createDegree.fulfilled, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = true;
        state.updateStatus.message = "Degree created successfully";

        
        state.allDegrees.push(action.payload);
        state.filteredDegrees.push(action.payload);
        
        
        state.pagination.totalDegrees += 1;
      })
      .addCase(createDegree.rejected, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = false;
        state.error = action.payload as string;
        state.updateStatus.message = `Creation failed: ${action.payload}`;
      })

      
      .addCase(bulkCreateDegrees.pending, (state) => {
        state.updateStatus.isUpdating = true;
        state.updateStatus.message = null;
        state.error = null;
      })
      .addCase(bulkCreateDegrees.fulfilled, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = true;
        state.updateStatus.message = `Successfully created ${action.payload.createdCount} degrees`;
      })
      .addCase(bulkCreateDegrees.rejected, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = false;
        state.error = action.payload as string;
        state.updateStatus.message = `Bulk creation failed: ${action.payload}`;
      })

      
      .addCase(updateDegree.pending, (state) => {
        state.updateStatus.isUpdating = true;
        state.updateStatus.message = null;
        state.error = null;
      })
      .addCase(updateDegree.fulfilled, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = true;
        state.updateStatus.message = "Degree updated successfully";
        
        
        const degreeIndex = state.allDegrees.findIndex(
          (degree) => degree.id === action.payload.id
        );
        if (degreeIndex !== -1) {
          state.allDegrees[degreeIndex] = action.payload;
        }
        
        
        const filteredIndex = state.filteredDegrees.findIndex(
          (degree) => degree.id === action.payload.id
        );
        if (filteredIndex !== -1) {
          state.filteredDegrees[filteredIndex] = action.payload;
        }
        
        
        if (state.selectedDegree?.id === action.payload.id) {
          state.selectedDegree = action.payload;
        }
      })
      .addCase(updateDegree.rejected, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = false;
        state.error = action.payload as string;
        state.updateStatus.message = `Update failed: ${action.payload}`;
      })
      
      
      .addCase(bulkUpdateDegrees.pending, (state) => {
        state.updateStatus.isUpdating = true;
        state.updateStatus.message = null;
        state.error = null;
      })
      .addCase(bulkUpdateDegrees.fulfilled, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = true;
        state.updateStatus.message = `Successfully updated ${action.payload.updatedCount} degrees`;
      })
      .addCase(bulkUpdateDegrees.rejected, (state, action) => {
        state.updateStatus.isUpdating = false;
        state.updateStatus.success = false;
        state.error = action.payload as string;
        state.updateStatus.message = `Bulk update failed: ${action.payload}`;
      });
  },
});


export const { filterDegreesByName, resetDegreeState, resetUpdateStatus } = degreeSlice.actions;


export {
  fetchAllDegrees,
  fetchDegreeById,
  fetchDegreeByName,
  fetchDegreesPaginated,
  fetchDegreesByType,
  fetchDegreesByTypePaginated,
  createDegree,
  bulkCreateDegrees,
  updateDegree,
  bulkUpdateDegrees,
};


export default degreeSlice.reducer;