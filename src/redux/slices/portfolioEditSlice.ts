import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the portfolio structure
export interface PortfolioEditState {
  // User data
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  description: string;
  
  // Skills
  skillset: Array<{
    id?: string;
    skill: {
      id?: string;
      name: string;
    };
    skillLevel: string | null;
  }>;
  
  // Experience
  experience: Array<{
    id?: string;
    title: string;
    companyName: string;
    description: string | null;
    startedAt: string;
    endAt: string | null;
  }>;
  
  // Education
  education: Array<{
    id?: string;
    eduFrom: string;
    degree: {
      id?: string;
      name: string;
    };
    startedAt: string;
    endAt: string | null;
  }>;
  
  // Projects
  projects: Array<{
    id?: string;
    title: string;
    description: string | null;
    link: string | null;
    startedAt: string;
    endAt: string | null;
  }>;
  
  // Certificates
  certificates: Array<{
    id?: string;
    title: string;
    description: string | null;
    filePath: string | null;
    link: string | null;
    startedAt: string | null;
    endAt: string | null;
  }>;
  
  // UI state
  isEditMode: boolean;
  isLoading: boolean;
  error: string | null;
  originalUserName: string;
  hasChanges: boolean;
  isUsernameChanged: boolean;
}

const initialState: PortfolioEditState = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  description: '',
  skillset: [],
  experience: [],
  education: [],
  projects: [],
  certificates: [],
  isEditMode: false, // Start in preview mode
  isLoading: false,
  error: null,
  originalUserName: '',
  hasChanges: false,
  isUsernameChanged: false
};

// Async thunk to fetch portfolio data using native fetch
export const fetchPortfolioForEdit = createAsyncThunk(
  'portfolioEdit/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/portfolio/edit', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch portfolio');
    }
  }
);

// Async thunk to update portfolio using native fetch
export const updatePortfolio = createAsyncThunk(
  'portfolioEdit/updatePortfolio',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const portfolioData = state.portfolioEdit;
      
      // Extract only the data fields (not UI state)
      const {
        firstName, lastName, userName, email, description,
        skillset, experience, education, projects, certificates
      } = portfolioData;
      
      const payload = {
        firstName, lastName, userName, email, description,
        skillset, experience, education, projects, certificates
      };
      
      const response = await fetch('/api/portfolio/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to update portfolio');
    }
  }
);

const portfolioEditSlice = createSlice({
  name: 'portfolioEdit',
  initialState,
  reducers: {
    // Toggle edit mode
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },
    
    // Update basic info
    updateBasicInfo: (state, action: PayloadAction<{
      firstName?: string;
      lastName?: string;
      userName?: string;
      email?: string;
      description?: string;
    }>) => {
      const { firstName, lastName, userName, email, description } = action.payload;
      
      if (firstName !== undefined) state.firstName = firstName;
      if (lastName !== undefined) state.lastName = lastName;
      if (email !== undefined) state.email = email;
      if (description !== undefined) state.description = description;
      
      if (userName !== undefined) {
        state.isUsernameChanged = userName !== state.originalUserName;
        state.userName = userName;
      }
      
      state.hasChanges = true;
    },
    
    // Add a skill
    addSkill: (state, action: PayloadAction<{
      skill: { name: string };
      skillLevel: string | null;
    }>) => {
      state.skillset.push(action.payload);
      state.hasChanges = true;
    },
    
    // Update a skill
    updateSkill: (state, action: PayloadAction<{
      index: number;
      skill: { name: string };
      skillLevel: string | null;
    }>) => {
      const { index, skill, skillLevel } = action.payload;
      if (index >= 0 && index < state.skillset.length) {
        state.skillset[index] = { ...state.skillset[index], skill, skillLevel };
      }
      state.hasChanges = true;
    },
    
    // Remove a skill
    removeSkill: (state, action: PayloadAction<number>) => {
      state.skillset.splice(action.payload, 1);
      state.hasChanges = true;
    },
    
    // Add an experience
    addExperience: (state, action: PayloadAction<{
      title: string;
      companyName: string;
      description: string | null;
      startedAt: string;
      endAt: string | null;
    }>) => {
      state.experience.push(action.payload);
      state.hasChanges = true;
    },
    
    // Update an experience
    updateExperience: (state, action: PayloadAction<{
      index: number;
      title?: string;
      companyName?: string;
      description?: string | null;
      startedAt?: string;
      endAt?: string | null;
    }>) => {
      const { index, ...updates } = action.payload;
      if (index >= 0 && index < state.experience.length) {
        state.experience[index] = { ...state.experience[index], ...updates };
      }
      state.hasChanges = true;
    },
    
    // Remove an experience
    removeExperience: (state, action: PayloadAction<number>) => {
      state.experience.splice(action.payload, 1);
      state.hasChanges = true;
    },
    
    // Add an education entry
    addEducation: (state, action: PayloadAction<{
      eduFrom: string;
      degree: { name: string };
      startedAt: string;
      endAt: string | null;
    }>) => {
      state.education.push(action.payload);
      state.hasChanges = true;
    },
    
    // Update an education entry
    updateEducation: (state, action: PayloadAction<{
      index: number;
      eduFrom?: string;
      degree?: { name: string };
      startedAt?: string;
      endAt?: string | null;
    }>) => {
      const { index, ...updates } = action.payload;
      if (index >= 0 && index < state.education.length) {
        state.education[index] = { ...state.education[index], ...updates };
      }
      state.hasChanges = true;
    },
    
    // Remove an education entry
    removeEducation: (state, action: PayloadAction<number>) => {
      state.education.splice(action.payload, 1);
      state.hasChanges = true;
    },
    
    // Add a project
    addProject: (state, action: PayloadAction<{
      title: string;
      description: string | null;
      link: string | null;
      startedAt: string;
      endAt: string | null;
    }>) => {
      state.projects.push(action.payload);
      state.hasChanges = true;
    },
    
    // Update a project
    updateProject: (state, action: PayloadAction<{
      index: number;
      title?: string;
      description?: string | null;
      link?: string | null;
      startedAt?: string;
      endAt?: string | null;
    }>) => {
      const { index, ...updates } = action.payload;
      if (index >= 0 && index < state.projects.length) {
        state.projects[index] = { ...state.projects[index], ...updates };
      }
      state.hasChanges = true;
    },
    
    // Remove a project
    removeProject: (state, action: PayloadAction<number>) => {
      state.projects.splice(action.payload, 1);
      state.hasChanges = true;
    },
    
    // Add a certificate
    addCertificate: (state, action: PayloadAction<{
      title: string;
      description: string | null;
      filePath: string | null;
      link: string | null;
      startedAt: string | null;
      endAt: string | null;
    }>) => {
      state.certificates.push(action.payload);
      state.hasChanges = true;
    },
    
    // Update a certificate
    updateCertificate: (state, action: PayloadAction<{
      index: number;
      title?: string;
      description?: string | null;
      filePath?: string | null;
      link?: string | null;
      startedAt?: string | null;
      endAt?: string | null;
    }>) => {
      const { index, ...updates } = action.payload;
      if (index >= 0 && index < state.certificates.length) {
        state.certificates[index] = { ...state.certificates[index], ...updates };
      }
      state.hasChanges = true;
    },
    
    // Remove a certificate
    removeCertificate: (state, action: PayloadAction<number>) => {
      state.certificates.splice(action.payload, 1);
      state.hasChanges = true;
    },
    
    // Reset changes by reloading from original data
    resetChanges: (state) => {
      return { ...initialState, isLoading: false };
    },
    
    // Initialize from auth state
    initializeFromAuthState: (state, action: PayloadAction<any>) => {
      const userData = action.payload;
      
      // Basic info
      state.firstName = userData.firstName || '';
      state.lastName = userData.lastName || '';
      state.userName = userData.userName || '';
      state.originalUserName = userData.userName || '';
      state.email = userData.email || '';
      state.description = userData.description || '';
      
      // Collections - ensure we have proper defaults if fields don't exist
      state.skillset = userData.skillset || [];
      state.experience = userData.experience || [];
      state.education = userData.education || [];
      state.projects = userData.projects || [];
      state.certificates = userData.certificates || [];
      
      // Reset UI state
      state.hasChanges = false;
      state.isUsernameChanged = false;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch portfolio
    builder
      .addCase(fetchPortfolioForEdit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioForEdit.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update all portfolio data fields
        const data = action.payload.data;
        state.firstName = data.firstName || '';
        state.lastName = data.lastName || '';
        state.userName = data.userName || '';
        state.originalUserName = data.userName || '';
        state.email = data.email || '';
        state.description = data.description || '';
        state.skillset = data.skillset || [];
        state.experience = data.experience || [];
        state.education = data.education || [];
        state.projects = data.projects || [];
        state.certificates = data.certificates || [];
        
        // Reset UI state
        state.hasChanges = false;
        state.isUsernameChanged = false;
      })
      .addCase(fetchPortfolioForEdit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update portfolio
      .addCase(updatePortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePortfolio.fulfilled, (state) => {
        state.isLoading = false;
        state.originalUserName = state.userName;
        state.hasChanges = false;
        state.isUsernameChanged = false;
      })
      .addCase(updatePortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  toggleEditMode,
  updateBasicInfo,
  addSkill,
  updateSkill,
  removeSkill,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addProject,
  updateProject,
  removeProject,
  addCertificate,
  updateCertificate,
  removeCertificate,
  resetChanges,
  initializeFromAuthState // Add this line
} = portfolioEditSlice.actions;

export default portfolioEditSlice.reducer;