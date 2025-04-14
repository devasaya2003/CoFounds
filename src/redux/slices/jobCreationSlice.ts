import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface JobCreationState {
  title: string;
  job_code: string;
  job_desc: string;
  assignment_link: string;
  required_skills: string[];
  last_date_to_apply: string; // ISO string
  additional_questions: string[];
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
  last_date_to_apply: new Date().toISOString(),
  additional_questions: [],
  status: 'idle',
  currentStep: 1,
  error: null,
  isDirty: false
};

const jobCreationSlice = createSlice({
  name: 'jobCreation',
  initialState,
  reducers: {
    // Update basic field values
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
    
    // Date handling
    setLastDateToApply: (state, action: PayloadAction<{
      year: string;
      month: string;
      day: string;
    }>) => {
      const { year, month, day } = action.payload;
      // Create ISO string date
      const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
      state.last_date_to_apply = date.toISOString();
      state.isDirty = true;
    },
    
    // Skills management
    addSkill: (state, action: PayloadAction<string>) => {
      const skill = action.payload;
      if (!state.required_skills.includes(skill)) {
        state.required_skills.push(skill);
        state.isDirty = true;
      }
    },
    
    removeSkill: (state, action: PayloadAction<string>) => {
      state.required_skills = state.required_skills.filter(
        skill => skill !== action.payload
      );
      state.isDirty = true;
    },
    
    // Additional questions management
    addQuestion: (state, action: PayloadAction<string>) => {
      state.additional_questions.push(action.payload);
      state.isDirty = true;
    },
    
    // THIS IS THE FIX: Change from void to PayloadAction<number>
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
    
    // Form navigation
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    
    // Form status management
    setStatus: (state, action: PayloadAction<{
      status: 'idle' | 'submitting' | 'success' | 'error';
      error?: string;
    }>) => {
      const { status, error } = action.payload;
      state.status = status;
      state.error = error || null;
    },
    
    // Reset form
    resetForm: (state) => {
      return {
        ...initialState,
        last_date_to_apply: new Date().toISOString()
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
  resetForm
} = jobCreationSlice.actions;

export default jobCreationSlice.reducer;