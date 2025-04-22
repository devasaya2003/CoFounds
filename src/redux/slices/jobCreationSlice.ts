import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Skill, SkillWithLevel } from '@/types/shared';
export interface SkillWithId extends SkillWithLevel {}

export interface JobCreationState {
  title: string;
  job_code: string;
  job_desc: string;
  assignment_link: string;
  required_skills: SkillWithId[];
  last_date_to_apply: string; 
  additional_questions: string[];
  location: string; 
  requested_by: string; 
  package: number; 
  status: 'idle' | 'submitting' | 'success' | 'error';
  currentStep: number;
  error: string | null;
  isDirty: boolean;
}

const initialState: JobCreationState = {
  title: '',
  job_code: '',
  job_desc: '',
  assignment_link: '',
  required_skills: [],
  
  last_date_to_apply: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
  additional_questions: [],
  location: '', 
  requested_by: '', 
  package: 0, 
  status: 'idle',
  currentStep: 1,
  error: null,
  isDirty: false
};

const jobCreationSlice = createSlice({
  name: 'jobCreation',
  initialState,
  reducers: {
    
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
      state.isDirty = true;
    },
    
    setRequestedBy: (state, action: PayloadAction<string>) => {
      state.requested_by = action.payload;
      state.isDirty = true;
    },
    
    setPackage: (state, action: PayloadAction<number>) => {
      state.package = action.payload;
      state.isDirty = true;
    },
    
    
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.isDirty = true;
    },
    
    setJobCode: (state, action: PayloadAction<string>) => {
      state.job_code = action.payload;
      state.isDirty = true;
    },
    
    setJobDesc: (state, action: PayloadAction<string>) => {
      state.job_desc = action.payload;
      state.isDirty = true;
    },
    
    setAssignmentLink: (state, action: PayloadAction<string>) => {
      state.assignment_link = action.payload;
      state.isDirty = true;
    },
    
    
    setLastDateToApply: (state, action: PayloadAction<{
      year: string;
      month: string;
      day: string;
    }>) => {
      const { year, month, day } = action.payload;
      
      const dateStr = `${year}-${month}-${day}T00:00:00.000Z`;
      state.last_date_to_apply = dateStr;
      state.isDirty = true;
    },
    
    addSkill: (state, action: PayloadAction<SkillWithId>) => {
      const skill = action.payload;
      
      if (!state.required_skills.some(s => s.id === skill.id)) {
        state.required_skills.push(skill);
        state.isDirty = true;
      }
    },
    
    removeSkill: (state, action: PayloadAction<string>) => {
      
      state.required_skills = state.required_skills.filter(
        skill => skill.id !== action.payload
      );
      state.isDirty = true;
    },
    
    
    updateSkillLevel: (state, action: PayloadAction<{
      skillId: string;
      skill_level: 'beginner' | 'intermediate' | 'advanced';
    }>) => {
      const { skillId, skill_level } = action.payload;
      const skillIndex = state.required_skills.findIndex(skill => skill.id === skillId);
      if (skillIndex !== -1) {
        state.required_skills[skillIndex].level = skill_level;
        state.isDirty = true;
      }
    },
    
    
    addQuestion: (state, action: PayloadAction<string>) => {
      state.additional_questions.push(action.payload);
      state.isDirty = true;
    },
    
    removeQuestionAction: (state, action: PayloadAction<number>) => {
      state.additional_questions.splice(action.payload, 1);
      state.isDirty = true;
    },
    
    updateQuestion: (state, action: PayloadAction<{
      index: number;
      question: string;
    }>) => {
      const { index, question } = action.payload;
      if (index >= 0 && index < state.additional_questions.length) {
        state.additional_questions[index] = question;
        state.isDirty = true;
      }
    },
    
    
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    
    
    setStatus: (state, action: PayloadAction<{
      status: 'idle' | 'submitting' | 'success' | 'error';
      error?: string;
    }>) => {
      const { status, error } = action.payload;
      state.status = status;
      state.error = error || null;
    },
    
    
    resetForm: (state) => {
      return {
        ...initialState,
        last_date_to_apply: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z'
      };
    }
  }
});

export const {
  setTitle,
  setJobCode,
  setJobDesc,
  setAssignmentLink,
  setLastDateToApply,
  addSkill,
  removeSkill,
  addQuestion,
  removeQuestionAction,
  updateQuestion,
  setStep,
  setStatus,
  resetForm,
  setLocation,
  setRequestedBy,
  setPackage,
  updateSkillLevel
} = jobCreationSlice.actions;

export default jobCreationSlice.reducer;