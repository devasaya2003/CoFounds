import { RootState } from "../store";

export const selectAllSkills = (state: RootState) => state.skill.allSkills;
export const selectFilteredSkills = (state: RootState) => state.skill.filteredSkills;
export const selectSelectedSkill = (state: RootState) => state.skill.selectedSkill;
export const selectSkillPagination = (state: RootState) => state.skill.pagination;
export const selectSkillFilters = (state: RootState) => state.skill.filters;
export const selectSkillIsLoading = (state: RootState) => state.skill.isLoading;
export const selectSkillError = (state: RootState) => state.skill.error;
export const selectSkillUpdateStatus = (state: RootState) => state.skill.isLoading;
export const selectSkillCreateStatus = (state: RootState) => state.skill.isLoading;