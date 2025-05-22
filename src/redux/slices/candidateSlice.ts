import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_POST } from "@/utils/api";

// Interfaces for candidate data structures
interface CandidateSkill {
  id: string;
  skill: {
    id: string;
    name: string;
  };
  skillLevel: string;
  createdAt: string;
  updatedAt: string;
}

interface CandidateProject {
  id: string;
  title: string;
  link: string | null;
  description: string | null;
  startedAt: string | null;
  endAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CandidateEducation {
  id: string;
  degree: {
    id: string;
    name: string;
  };
  startedAt: string | null;
  endAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CandidateExperience {
  id: string;
  companyName: string;
  title: string;
  description: string | null;
  startedAt: string | null;
  endAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CandidateCertificate {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  filePath: string | null;
  startedAt: string | null;
  endAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CandidateLink {
  id: string;
  linkTitle: string;
  linkUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CandidateProfile {
  userId: string;
  email: string;
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  description: string | null;
  dob: string | null;
  profileImage: string | null;
  role: string;
  verified: boolean;
  isActive: boolean; // Add isActive field
  skills: CandidateSkill[];
  projects: CandidateProject[];
  education: CandidateEducation[];
  experience: CandidateExperience[];
  certificates: CandidateCertificate[];
  links: CandidateLink[];
  skillsCount: number;
  projectsCount: number;
  educationCount: number;
  experienceCount: number;
  certificatesCount: number;
  linksCount: number;
  isLoading: boolean;
  error: string | null;
  skillsLoading: boolean;
  skillsError: string | null;
  projectsLoading: boolean;
  projectsError: string | null;
  educationLoading: boolean;
  educationError: string | null;
  experienceLoading: boolean;
  experienceError: string | null;
  certificatesLoading: boolean;
  certificatesError: string | null;
  linksLoading: boolean;
  linksError: string | null;
}

// Updated API response interface with profileImage field
interface CandidateSummaryResponse {
  success: boolean;
  data: {
    id: string;
    userName: string | null;
    firstName: string | null;
    lastName: string | null;
    dob: string | null;
    email: string;
    profileImage: string | null; // Added profileImage field
    description: string | null;
    verified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    counts: {
      skillset: number;
      education: number;
      projects: number;
      certificates: number;
      experience: number;
      links: number;
    };
  };
}

const initialState: CandidateProfile = {
  userId: "",
  email: "",
  userName: null,
  firstName: null,
  lastName: null,
  phone: null,
  description: null,
  dob: null,
  profileImage: null,
  role: "",
  verified: false,
  isActive: false, // Add initial value for isActive
  skills: [],
  projects: [],
  education: [],
  experience: [],
  certificates: [],
  links: [],
  skillsCount: 0,
  projectsCount: 0,
  educationCount: 0,
  experienceCount: 0,
  certificatesCount: 0,
  linksCount: 0,
  isLoading: false,
  error: null,
  skillsLoading: false,
  skillsError: null,
  projectsLoading: false,
  projectsError: null,
  educationLoading: false,
  educationError: null,
  experienceLoading: false,
  experienceError: null,
  certificatesLoading: false,
  certificatesError: null,
  linksLoading: false,
  linksError: null,
};

// Helper function to get candidate's full name
export const getCandidateFullName = (candidate: CandidateProfile): string => {
  if (candidate.firstName || candidate.lastName) {
    return `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim();
  }
  return candidate.userName || "";
};

// Updated function to handle profileImage field
export const fetchCandidateSummary = createAsyncThunk(
  "candidate/fetchSummary",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<CandidateSummaryResponse>(
        `${baseUrl}/candidate/summary/${userId}`
      );

      if (!response.success || !response.data) {
        return rejectWithValue("Failed to fetch candidate summary");
      }

      return {
        user: {
          id: response.data.id,
          email: response.data.email,
          userName: response.data.userName,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: null, // Not provided in new API
          description: response.data.description,
          dob: response.data.dob,
          profileImage: response.data.profileImage, // Use actual profileImage from API
          role: "candidate", // Assumed based on context
          verified: response.data.verified,
          isActive: response.data.isActive,
        },
        counts: {
          skills: response.data.counts.skillset,
          projects: response.data.counts.projects,
          education: response.data.counts.education,
          experience: response.data.counts.experience,
          certificates: response.data.counts.certificates,
          links: response.data.counts.links,
        },
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch candidate summary");
    }
  }
);

// Updated thunk for fetching candidate skills
export const fetchCandidateSkills = createAsyncThunk(
  "candidate/fetchSkills",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<CandidateSkill[]>(
        `${baseUrl}/candidate/skills/user/${userId}`
      );

      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch candidate skills");
    }
  }
);

// Updated thunk for fetching candidate projects
export const fetchCandidateProjects = createAsyncThunk(
  "candidate/fetchProjects",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<CandidateProject[]>(
        `${baseUrl}/candidate/projects/user/${userId}`
      );

      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch candidate projects");
    }
  }
);

// Updated thunk for fetching candidate education
export const fetchCandidateEducation = createAsyncThunk(
  "candidate/fetchEducation",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<CandidateEducation[]>(
        `${baseUrl}/candidate/education/user/${userId}`
      );

      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch candidate education");
    }
  }
);

// Updated thunk for fetching candidate experience
export const fetchCandidateExperience = createAsyncThunk(
  "candidate/fetchExperience",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<CandidateExperience[]>(
        `${baseUrl}/candidate/experience/user/${userId}`
      );
      
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch candidate experience");
    }
  }
);

// Updated thunk for fetching candidate certificates
export const fetchCandidateCertificates = createAsyncThunk(
  "candidate/fetchCertificates",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<CandidateCertificate[]>(
        `${baseUrl}/candidate/certificates/user/${userId}`
      );
      
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch candidate certificates");
    }
  }
);

// Updated thunk for fetching candidate links
export const fetchCandidateLinks = createAsyncThunk(
  "candidate/fetchLinks",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<CandidateLink[]>(
        `${baseUrl}/links/user/${userId}`
      );
      
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch candidate links");
    }
  }
);

// Add a new interface for profile update payload
interface UpdateCandidateProfilePayload {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  description?: string | null;
  dob?: string | null;
  profileImage?: string | null;
}

// Update the thunk for updating candidate profile
export const updateCandidateProfile = createAsyncThunk(
  "candidate/updateProfile",
  async (profileData: UpdateCandidateProfilePayload, { rejectWithValue }) => {
    try {
      const apiData = {
        user_id: profileData.userId,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        dob: profileData.dob,
        description: profileData.description,
        profile_image: profileData.profileImage
      };
      
      const response = await fetch('/api/v1/candidate/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to update profile");
      }
      
      // Parse the response and use the returned data
      const data = await response.json();
      
      if (!data.success || !data.updatedProfile) {
        return rejectWithValue("Update succeeded but response data is invalid");
      }
      
      // Return the server-provided data instead of the input data
      return {
        userId: profileData.userId,
        firstName: data.updatedProfile.firstName,
        lastName: data.updatedProfile.lastName,
        description: data.updatedProfile.description,
        dob: data.updatedProfile.dob,
        profileImage: data.updatedProfile.profileImage,
        // Include other fields from the response
        userName: data.updatedProfile.userName
      };
    } catch (error) {
      return rejectWithValue("Failed to update profile");
    }
  }
);

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    clearCandidateProfile: () => initialState,
    // Optional: Add a synchronous action for local-only updates
    updateLocalProfile: (state, action: PayloadAction<Partial<UpdateCandidateProfilePayload>>) => {
      if (action.payload.firstName !== undefined) state.firstName = action.payload.firstName;
      if (action.payload.lastName !== undefined) state.lastName = action.payload.lastName;
      if (action.payload.description !== undefined) state.description = action.payload.description;
      if (action.payload.dob !== undefined) state.dob = action.payload.dob;
      if (action.payload.profileImage !== undefined) state.profileImage = action.payload.profileImage;
    }
  },
  extraReducers: (builder) => {
    builder
      // Replace fetchCandidateProfile with fetchCandidateSummary
      .addCase(fetchCandidateSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidateSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId = action.payload.user.id;
        state.email = action.payload.user.email;
        state.userName = action.payload.user.userName;
        state.firstName = action.payload.user.firstName;
        state.lastName = action.payload.user.lastName;
        state.phone = action.payload.user.phone;
        state.description = action.payload.user.description;
        state.dob = action.payload.user.dob;
        state.profileImage = action.payload.user.profileImage;
        state.role = action.payload.user.role;
        state.verified = action.payload.user.verified;
        state.isActive = action.payload.user.isActive; // Set isActive in state
        state.skillsCount = action.payload.counts.skills;
        state.projectsCount = action.payload.counts.projects;
        state.educationCount = action.payload.counts.education;
        state.experienceCount = action.payload.counts.experience;
        state.certificatesCount = action.payload.counts.certificates;
        state.linksCount = action.payload.counts.links;
      })
      .addCase(fetchCandidateSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch skills
      .addCase(fetchCandidateSkills.pending, (state) => {
        state.skillsLoading = true;
        state.skillsError = null;
      })
      .addCase(fetchCandidateSkills.fulfilled, (state, action) => {
        state.skillsLoading = false;
        state.skills = action.payload;
      })
      .addCase(fetchCandidateSkills.rejected, (state, action) => {
        state.skillsLoading = false;
        state.skillsError = action.payload as string;
      })

      // Fetch projects
      .addCase(fetchCandidateProjects.pending, (state) => {
        state.projectsLoading = true;
        state.projectsError = null;
      })
      .addCase(fetchCandidateProjects.fulfilled, (state, action) => {
        state.projectsLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchCandidateProjects.rejected, (state, action) => {
        state.projectsLoading = false;
        state.projectsError = action.payload as string;
      })

      // Fetch education
      .addCase(fetchCandidateEducation.pending, (state) => {
        state.educationLoading = true;
        state.educationError = null;
      })
      .addCase(fetchCandidateEducation.fulfilled, (state, action) => {
        state.educationLoading = false;
        state.education = action.payload;
      })
      .addCase(fetchCandidateEducation.rejected, (state, action) => {
        state.educationLoading = false;
        state.educationError = action.payload as string;
      })

      // Fetch experience
      .addCase(fetchCandidateExperience.pending, (state) => {
        state.experienceLoading = true;
        state.experienceError = null;
      })
      .addCase(fetchCandidateExperience.fulfilled, (state, action) => {
        state.experienceLoading = false;
        state.experience = action.payload;
      })
      .addCase(fetchCandidateExperience.rejected, (state, action) => {
        state.experienceLoading = false;
        state.experienceError = action.payload as string;
      })

      // Fetch certificates
      .addCase(fetchCandidateCertificates.pending, (state) => {
        state.certificatesLoading = true;
        state.certificatesError = null;
      })
      .addCase(fetchCandidateCertificates.fulfilled, (state, action) => {
        state.certificatesLoading = false;
        state.certificates = action.payload;
      })
      .addCase(fetchCandidateCertificates.rejected, (state, action) => {
        state.certificatesLoading = false;
        state.certificatesError = action.payload as string;
      })

      // Fetch links
      .addCase(fetchCandidateLinks.pending, (state) => {
        state.linksLoading = true;
        state.linksError = null;
      })
      .addCase(fetchCandidateLinks.fulfilled, (state, action) => {
        state.linksLoading = false;
        state.links = action.payload;
      })
      .addCase(fetchCandidateLinks.rejected, (state, action) => {
        state.linksLoading = false;
        state.linksError = action.payload as string;
      })

      // Add cases for the new update profile thunk
      .addCase(updateCandidateProfile.pending, (state) => {
        // Optionally add a loading state for profile updates
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update state with new profile data
        if (action.payload.firstName !== undefined) state.firstName = action.payload.firstName;
        if (action.payload.lastName !== undefined) state.lastName = action.payload.lastName;
        if (action.payload.description !== undefined) state.description = action.payload.description;
        if (action.payload.dob !== undefined) state.dob = action.payload.dob;
        if (action.payload.profileImage !== undefined) state.profileImage = action.payload.profileImage;
        if (action.payload.userName !== undefined) state.userName = action.payload.userName;
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCandidateProfile, updateLocalProfile } = candidateSlice.actions;
export default candidateSlice.reducer;
