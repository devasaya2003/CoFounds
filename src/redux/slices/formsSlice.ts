import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobFormData } from '@/types/job';

// Define form types
export type FormType = 'jobCreation' | 'companyProfile' | 'recruiterProfile';

// Define interfaces for different form types
export interface FormState {
  jobCreation?: {
    data: JobFormData;
    status: 'idle' | 'submitting' | 'success' | 'error';
    currentStep: number;
    error: string | null;
    isDirty: boolean;
  };
  companyProfile?: {
    // Add company profile form data structure when needed
    data: any;
    status: 'idle' | 'submitting' | 'success' | 'error';
    error: string | null;
    isDirty: boolean;
  };
  recruiterProfile?: {
    // Add recruiter profile form data structure when needed
    data: any;
    status: 'idle' | 'submitting' | 'success' | 'error';
    error: string | null;
    isDirty: boolean;
  };
}

// Initial state
const initialState: FormState = {
  jobCreation: {
    data: {
      jobTitle: '',
      jobCode: '',
      jobDescription: '',
      assignmentLink: '',
      requiredSkills: [],
      lastDateToApply: {
        year: new Date().getFullYear().toString(),
        month: '01',
        day: '01'
      },
      additionalQuestions: []
    },
    status: 'idle',
    currentStep: 1,
    error: null,
    isDirty: false
  }
  // Add other forms with their initial states when needed
};

// Create the slice
const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    // Update form data
    updateFormData: (
      state,
      action: PayloadAction<{
        formType: FormType;
        fieldPath: string;
        value: any;
      }>
    ) => {
      const { formType, fieldPath, value } = action.payload;
      
      if (!state[formType]) return;
      
      // Parse the field path (e.g., "lastDateToApply.year" or "requiredSkills")
      const pathParts = fieldPath.split('.');
      let currentObj = state[formType]!.data as any;
      
      // Navigate to the nested property, except the last one
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentObj = currentObj[pathParts[i]];
      }
      
      // Set the value to the last property
      currentObj[pathParts[pathParts.length - 1]] = value;
      
      // Mark form as dirty
      state[formType]!.isDirty = true;
    },
    
    // Set step for multi-step forms
    setFormStep: (
      state,
      action: PayloadAction<{
        formType: FormType;
        step: number;
      }>
    ) => {
      const { formType, step } = action.payload;
      if (state[formType] && 'currentStep' in state[formType]!) {
        (state[formType] as any).currentStep = step;
      }
    },
    
    // Set form submission status
    setFormStatus: (
      state,
      action: PayloadAction<{
        formType: FormType;
        status: 'idle' | 'submitting' | 'success' | 'error';
        error?: string;
      }>
    ) => {
      const { formType, status, error } = action.payload;
      if (state[formType]) {
        state[formType]!.status = status;
        state[formType]!.error = error || null;
      }
    },
    
    // Reset form to initial state
    resetForm: (
      state,
      action: PayloadAction<{
        formType: FormType;
      }>
    ) => {
      const { formType } = action.payload;
      
      if (formType === 'jobCreation') {
        state.jobCreation = {
          ...initialState.jobCreation!,
          data: {
            ...initialState.jobCreation!.data,
            lastDateToApply: {
              ...initialState.jobCreation!.data.lastDateToApply,
              year: new Date().getFullYear().toString()
            }
          }
        };
      } else if (formType === 'companyProfile') {
        state.companyProfile = initialState.companyProfile;
      } else if (formType === 'recruiterProfile') {
        state.recruiterProfile = initialState.recruiterProfile;
      }
    },
    
    // Add an item to an array field (for requiredSkills or additionalQuestions)
    addArrayItem: (
      state,
      action: PayloadAction<{
        formType: FormType;
        fieldPath: string;
        item: any;
      }>
    ) => {
      const { formType, fieldPath, item } = action.payload;
      
      if (!state[formType]) return;
      
      // Navigate to the array field
      const pathParts = fieldPath.split('.');
      let currentObj = state[formType]!.data as any;
      
      for (let i = 0; i < pathParts.length; i++) {
        currentObj = currentObj[pathParts[i]];
      }
      
      // Check if it's already there (for skills)
      if (Array.isArray(currentObj) && typeof item === 'string') {
        if (!currentObj.includes(item)) {
          currentObj.push(item);
        }
      } else if (Array.isArray(currentObj)) {
        currentObj.push(item);
      }
      
      // Mark form as dirty
      state[formType]!.isDirty = true;
    },
    
    // Remove an item from an array field
    removeArrayItem: (
      state,
      action: PayloadAction<{
        formType: FormType;
        fieldPath: string;
        index: number;
        value?: string; // For skills where we remove by value
      }>
    ) => {
      const { formType, fieldPath, index, value } = action.payload;
      
      if (!state[formType]) return;
      
      // Navigate to the array field
      const pathParts = fieldPath.split('.');
      let currentObj = state[formType]!.data as any;
      
      for (let i = 0; i < pathParts.length; i++) {
        currentObj = currentObj[pathParts[i]];
      }
      
      // Remove the item
      if (Array.isArray(currentObj)) {
        if (value !== undefined) {
          // Remove by value (for skills)
          const valueIndex = currentObj.indexOf(value);
          if (valueIndex !== -1) {
            currentObj.splice(valueIndex, 1);
          }
        } else {
          // Remove by index
          currentObj.splice(index, 1);
        }
      }
      
      // Mark form as dirty
      state[formType]!.isDirty = true;
    }
  }
});

export const { 
  updateFormData, 
  setFormStep, 
  setFormStatus, 
  resetForm,
  addArrayItem,
  removeArrayItem
} = formsSlice.actions;

export default formsSlice.reducer;