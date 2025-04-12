import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobFormData } from '@/types/job';

// Define form types
export type FormType = 'jobCreation' | 'companyProfile' | 'recruiterProfile';

// Define these interface updates at the top of your file:
interface CompanyProfileData {
  // Add your company profile fields here
  name: string;
  // Add more fields as needed
}

interface RecruiterProfileData {
  // Add your recruiter profile fields here
  name: string;
  // Add more fields as needed
}

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
    data: CompanyProfileData;
    status: 'idle' | 'submitting' | 'success' | 'error';
    error: string | null;
    isDirty: boolean;
  };
  recruiterProfile?: {
    data: RecruiterProfileData;
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
        value: unknown;
      }>
    ) => {
      const { formType, fieldPath, value } = action.payload;
      
      if (!state[formType]) return;
      
      // Parse the field path (e.g., "lastDateToApply.year" or "requiredSkills")
      const pathParts = fieldPath.split('.');
      let currentObj: Record<string, unknown> = state[formType]!.data as Record<string, unknown>;
      
      // Navigate to the nested property, except the last one
      for (let i = 0; i < pathParts.length - 1; i++) {
        const key = pathParts[i];
        if (typeof currentObj[key] !== 'object' || currentObj[key] === null) {
          currentObj[key] = {};
        }
        currentObj = currentObj[key] as Record<string, unknown>;
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
        (state[formType] as { currentStep: number }).currentStep = step;
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
        item: unknown;
      }>
    ) => {
      const { formType, fieldPath, item } = action.payload;
      
      if (!state[formType]) return;
      
      // Navigate to the array field
      const pathParts = fieldPath.split('.');
      let currentObj: Record<string, unknown> = state[formType]!.data as Record<string, unknown>;
      
      for (let i = 0; i < pathParts.length; i++) {
        const key = pathParts[i];
        currentObj = currentObj[key] as Record<string, unknown>;
      }
      
      // Check if it's already there (for skills)
      if (Array.isArray(currentObj)) {
        if (typeof item === 'string') {
          if (!currentObj.includes(item)) {
            currentObj.push(item);
          }
        } else {
          currentObj.push(item);
        }
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
      let currentObj: unknown = state[formType]!.data;
      
      for (let i = 0; i < pathParts.length; i++) {
        const key = pathParts[i];
        if (typeof currentObj === 'object' && currentObj !== null) {
          currentObj = (currentObj as Record<string, unknown>)[key];
        } else {
          // If we can't navigate further, return early
          return;
        }
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