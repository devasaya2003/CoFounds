import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  skillInitialState,
  fetchAllSkills,
  fetchSkillById,
  fetchSkillByName,
  fetchSkillsPaginated,
  updateSkill,
  bulkUpdateSkills,
  createSkill,
  bulkCreateSkills,
  skillMasterReducers,
  SkillState,
} from "../masters/skillMaster";

const skillSlice = createSlice({
  name: "skill",
  initialState: skillInitialState,
  reducers: {
    filterSkillsByName: (state, action: PayloadAction<string>) => {
      skillMasterReducers.filterSkillsByName(state, action);
    },
    resetSkillState: () => skillMasterReducers.resetSkillState(),
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchAllSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allSkills = action.payload;
        state.filteredSkills = action.payload;
        state.pagination.totalSkills = action.payload.length;
      })
      .addCase(fetchAllSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchSkillById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSkillById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSkill = action.payload;
      })
      .addCase(fetchSkillById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchSkillByName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSkillByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSkill = action.payload;
      })
      .addCase(fetchSkillByName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(fetchSkillsPaginated.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSkillsPaginated.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredSkills = action.payload.skills;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalSkills: action.payload.totalSkills,
        };
      })
      .addCase(fetchSkillsPaginated.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(updateSkill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.isLoading = false;

        
        const skillIndex = state.allSkills.findIndex(
          (skill) => skill.id === action.payload.id
        );
        if (skillIndex !== -1) {
          state.allSkills[skillIndex] = action.payload;
        }

        
        const filteredIndex = state.filteredSkills.findIndex(
          (skill) => skill.id === action.payload.id
        );
        if (filteredIndex !== -1) {
          state.filteredSkills[filteredIndex] = action.payload;
        }

        
        if (state.selectedSkill?.id === action.payload.id) {
          state.selectedSkill = action.payload;
        }
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(bulkUpdateSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bulkUpdateSkills.fulfilled, (state, action) => {
        state.isLoading = false;

        
        
      })
      .addCase(bulkUpdateSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(createSkill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.isLoading = false;

        
        state.allSkills.push(action.payload);
        state.filteredSkills.push(action.payload);
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      
      .addCase(bulkCreateSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bulkCreateSkills.fulfilled, (state, action) => {
        state.isLoading = false;

        
        
      })
      .addCase(bulkCreateSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});


export const { filterSkillsByName, resetSkillState } = skillSlice.actions;


export {
  fetchAllSkills,
  fetchSkillById,
  fetchSkillByName,
  fetchSkillsPaginated,
  updateSkill,
  bulkUpdateSkills,
  createSkill,
  bulkCreateSkills,
};


export default skillSlice.reducer;