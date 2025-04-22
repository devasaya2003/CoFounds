import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  SkillWithId,
  Education,
  Certificate,
  ProofOfWork,
  Project,
  DateField
} from '@/types/candidate_onboarding';


interface CandidateOnboardingState {
  userName: string;
  firstName: string;
  lastName: string;
  description: string;
  skills: SkillWithId[];
  education: Education[];
  certificates: Certificate[];
  proofsOfWork: ProofOfWork[];
  projects: Project[];
  currentStep: number;
  steps: string[];
  isDirty: boolean;
  status: 'idle' | 'submitting' | 'success' | 'error';
  error: string | null;
  dateOfBirth: DateField | null;
}

const initialState: CandidateOnboardingState = {
  currentStep: 1,
  steps: ['set-username', 'personal-info', 'education', 'certificates', 'proof-of-work', 'projects'],
  isDirty: false,
  status: 'idle',
  error: null,
  
  userName: '',
  
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  description: '',
  skills: [],
  
  education: [],
  
  certificates: [],
  
  proofsOfWork: [] as ProofOfWork[],
  
  projects: []
};

export const candidateOnboardingSlice = createSlice({
  name: 'candidateOnboarding',
  initialState,
  reducers: {
    
    setStep: (state, action: PayloadAction<number>) => {
      if (action.payload >= 1 && action.payload <= state.steps.length) {
        state.currentStep = action.payload;
      }
    },
    setStatus: (state, action: PayloadAction<{ status: 'idle' | 'submitting' | 'success' | 'error', error?: string }>) => {
      state.status = action.payload.status;
      state.error = action.payload.error || null;
    },
    
    
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
      state.isDirty = true;
    },
    
    
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
      state.isDirty = true;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
      state.isDirty = true;
    },
    setDateOfBirth: (state, action: PayloadAction<DateField>) => {
      state.dateOfBirth = action.payload;
      state.isDirty = true;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
      state.isDirty = true;
    },
    addSkill: (state, action: PayloadAction<SkillWithId>) => {
      state.skills.push(action.payload);
      state.isDirty = true;
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter(skill => skill.id !== action.payload);
      state.isDirty = true;
    },
    updateSkillLevel: (state, action: PayloadAction<{ skillId: string, level: string }>) => {
      const { skillId, level } = action.payload;
      const skillIndex = state.skills.findIndex(s => s.id === skillId);
      
      if (skillIndex !== -1) {
        state.skills[skillIndex].level = level as 'beginner' | 'intermediate' | 'advanced';
      }
    },
    
    
    addEducation: (state, action: PayloadAction<Education>) => {
      state.education.push(action.payload);
      state.isDirty = true;
    },
    updateEducation: (state, action: PayloadAction<{ id: string, updates: Partial<Education> }>) => {
      const { id, updates } = action.payload;
      const index = state.education.findIndex(edu => edu.id === id);
      if (index !== -1) {
        state.education[index] = { ...state.education[index], ...updates };
        state.isDirty = true;
      }
    },
    removeEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter(edu => edu.id !== action.payload);
      state.isDirty = true;
    },
    
    
    addCertificate: (state, action: PayloadAction<Certificate>) => {
      if (!state.certificates) {
        state.certificates = [];
      }
      state.certificates.push(action.payload);
      state.isDirty = true;
    },
    updateCertificate: (state, action: PayloadAction<{ id: string, updates: Partial<Certificate> }>) => {
      const { id, updates } = action.payload;
      const index = state.certificates.findIndex(cert => cert.id === id);
      if (index !== -1) {
        state.certificates[index] = { ...state.certificates[index], ...updates };
      }
      state.isDirty = true;
    },
    removeCertificate: (state, action: PayloadAction<string>) => {
      state.certificates = state.certificates.filter(cert => cert.id !== action.payload);
      state.isDirty = true;
    },
    
    
    addProofOfWork: (state, action: PayloadAction<ProofOfWork>) => {
      if (!state.proofsOfWork) {
        state.proofsOfWork = [];
      }
      state.proofsOfWork.push(action.payload);
      state.isDirty = true;
    },
    updateProofOfWork: (state, action: PayloadAction<{ id: string, updates: Partial<ProofOfWork> }>) => {
      const { id, updates } = action.payload;
      const index = state.proofsOfWork.findIndex(pow => pow.id === id);
      if (index !== -1) {
        state.proofsOfWork[index] = { ...state.proofsOfWork[index], ...updates };
        
        
        if (updates.isCommunityWork !== undefined) {
          state.proofsOfWork[index].company_name = updates.isCommunityWork ? 'COF_PROOF_COMMUNITY' : state.proofsOfWork[index].company_name;
        }
        
        state.isDirty = true;
      }
    },
    removeProofOfWork: (state, action: PayloadAction<string>) => {
      state.proofsOfWork = state.proofsOfWork.filter(pow => pow.id !== action.payload);
      state.isDirty = true;
    },
    
    
    addProject: (state, action: PayloadAction<Project>) => {
      if (!state.projects) {
        state.projects = [];
      }
      state.projects.push(action.payload);
      state.isDirty = true;
    },
    updateProject: (state, action: PayloadAction<{ id: string, updates: Partial<Project> }>) => {
      const { id, updates } = action.payload;
      const index = state.projects.findIndex(proj => proj.id === id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...updates };
        state.isDirty = true;
      }
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(proj => proj.id !== action.payload);
      state.isDirty = true;
    },
    
    
    resetForm: (state) => {
      return { ...initialState, currentStep: state.currentStep };
    }
  }
});

export const {
  setStep,
  setStatus,
  setUserName,
  setFirstName,
  setLastName,
  setDateOfBirth,
  setDescription,
  addSkill,
  removeSkill,
  updateSkillLevel,
  addEducation,
  updateEducation,
  removeEducation,
  addCertificate,
  updateCertificate,
  removeCertificate,
  addProofOfWork,
  updateProofOfWork,
  removeProofOfWork,
  addProject,
  updateProject,
  removeProject,
  resetForm
} = candidateOnboardingSlice.actions;

export default candidateOnboardingSlice.reducer;