import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Skill interface
export interface SkillWithId {
  id: string;
  name: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
}

// Education interface
export interface Education {
  id: string;
  institution: string;
  startDate: {
    year: string;
    month: string;
    day: string;
  };
  endDate: {
    year: string;
    month: string;
    day: string;
  } | null;
  currentlyStudying: boolean;
  degree: string;
}

// Certificate interface
export interface Certificate {
  id: string;
  title: string;
  description: string;
  startDate: {
    year: string;
    month: string;
    day: string;
  };
  endDate: {
    year: string;
    month: string;
    day: string;
  } | null;
  fileUrl?: string; // Making this optional with ? to match the component interface
  externalUrl?: string; // Making this optional with ?
}

// Proof of Work interface
export interface ProofOfWork {
  id: string;
  title: string;
  companyName: string; // Will be "COF_PROOF_COMMUNITY" for community proofs
  description: string;
  startDate: {
    year: string;
    month: string;
    day: string;
  };
  endDate: {
    year: string;
    month: string;
    day: string;
  } | null;
  currentlyWorking: boolean;
  isCommunityProof: boolean;
}

// Project interface
export interface Project {
  id: string;
  title: string;
  description: string;
  projectUrl: string;
  startDate: {
    year: string;
    month: string;
    day: string;
  };
  endDate: {
    year: string;
    month: string;
    day: string;
  } | null;
  currentlyBuilding: boolean;
}

// Date type for reusability
export interface DateField {
  year: string;
  month: string;
  day: string;
}

// Define the state structure
interface CandidateOnboardingState {
  // Step management
  currentStep: number;
  steps: string[];
  isDirty: boolean;
  status: 'idle' | 'submitting' | 'success' | 'error';
  error: string | null;
  
  // Step 1: Username
  userName: string;
  
  // Step 2: Personal Info
  firstName: string;
  lastName: string;
  dateOfBirth: DateField | null; // Add this line
  description: string;
  skills: SkillWithId[];
  
  // Step 3: Education
  education: Education[];
  
  // Step 4: Certificates
  certificates: Certificate[];
  
  // Step 5: Proof of Work
  proofsOfWork: ProofOfWork[];
  
  // Step 6: Projects
  projects: Project[];
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
  dateOfBirth: null, // Add this line
  description: '',
  skills: [],
  
  education: [],
  
  certificates: [],
  
  proofsOfWork: [],
  
  projects: []
};

export const candidateOnboardingSlice = createSlice({
  name: 'candidateOnboarding',
  initialState,
  reducers: {
    // Navigation actions
    setStep: (state, action: PayloadAction<number>) => {
      if (action.payload >= 1 && action.payload <= state.steps.length) {
        state.currentStep = action.payload;
      }
    },
    setStatus: (state, action: PayloadAction<{ status: 'idle' | 'submitting' | 'success' | 'error', error?: string }>) => {
      state.status = action.payload.status;
      state.error = action.payload.error || null;
    },
    
    // Step 1 actions
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
      state.isDirty = true;
    },
    
    // Step 2 actions
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
    updateSkillLevel: (state, action: PayloadAction<{ skillId: string, skill_level: 'beginner' | 'intermediate' | 'advanced' }>) => {
      const { skillId, skill_level } = action.payload;
      const skillToUpdate = state.skills.find(skill => skill.id === skillId);
      if (skillToUpdate) {
        skillToUpdate.skill_level = skill_level;
        state.isDirty = true;
      }
    },
    
    // Step 3 actions
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
    
    // Step 4 actions
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
    
    // Step 5 actions
    addProofOfWork: (state, action: PayloadAction<ProofOfWork>) => {
      state.proofsOfWork.push(action.payload);
      state.isDirty = true;
    },
    updateProofOfWork: (state, action: PayloadAction<{ id: string, updates: Partial<ProofOfWork> }>) => {
      const { id, updates } = action.payload;
      const index = state.proofsOfWork.findIndex(pow => pow.id === id);
      if (index !== -1) {
        state.proofsOfWork[index] = { ...state.proofsOfWork[index], ...updates };
        
        // Update company name if isCommunityProof changed
        if (updates.isCommunityProof !== undefined) {
          state.proofsOfWork[index].companyName = updates.isCommunityProof ? 'COF_PROOF_COMMUNITY' : state.proofsOfWork[index].companyName;
        }
        
        state.isDirty = true;
      }
    },
    removeProofOfWork: (state, action: PayloadAction<string>) => {
      state.proofsOfWork = state.proofsOfWork.filter(pow => pow.id !== action.payload);
      state.isDirty = true;
    },
    
    // Step 6 actions
    addProject: (state, action: PayloadAction<Project>) => {
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
    
    // Form reset
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
  setDateOfBirth, // Export the new action
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