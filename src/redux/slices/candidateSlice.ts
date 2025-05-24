import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as candidateThunks from '../thunks/candidate';

// Interfaces for candidate data structures
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
  isActive: boolean;
  skills: candidateThunks.CandidateSkill[];
  projects: candidateThunks.CandidateProject[];
  education: candidateThunks.CandidateEducation[];
  experience: candidateThunks.CandidateExperience[];
  certificates: candidateThunks.CandidateCertificate[];
  links: candidateThunks.CandidateLink[];
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
  isActive: false,
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

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    clearCandidateProfile: () => initialState,
    // Optional: Add a synchronous action for local-only updates
    updateLocalProfile: (state, action: PayloadAction<Partial<candidateThunks.UpdateCandidateProfilePayload>>) => {
      if (action.payload.firstName !== undefined) state.firstName = action.payload.firstName;
      if (action.payload.lastName !== undefined) state.lastName = action.payload.lastName;
      if (action.payload.description !== undefined) state.description = action.payload.description;
      if (action.payload.dob !== undefined) state.dob = action.payload.dob;
      if (action.payload.profileImage !== undefined) state.profileImage = action.payload.profileImage;
    }
  },
  extraReducers: (builder) => {
    builder
      // Personal Info
      .addCase(candidateThunks.fetchCandidateSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(candidateThunks.fetchCandidateSummary.fulfilled, (state, action) => {
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
        state.isActive = action.payload.user.isActive;
        state.skillsCount = action.payload.counts.skills;
        state.projectsCount = action.payload.counts.projects;
        state.educationCount = action.payload.counts.education;
        state.experienceCount = action.payload.counts.experience;
        state.certificatesCount = action.payload.counts.certificates;
        state.linksCount = action.payload.counts.links;
      })
      .addCase(candidateThunks.fetchCandidateSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(candidateThunks.updateCandidateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(candidateThunks.updateCandidateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.firstName !== undefined) state.firstName = action.payload.firstName;
        if (action.payload.lastName !== undefined) state.lastName = action.payload.lastName;
        if (action.payload.description !== undefined) state.description = action.payload.description;
        if (action.payload.dob !== undefined) state.dob = action.payload.dob;
        if (action.payload.profileImage !== undefined) state.profileImage = action.payload.profileImage;
        if (action.payload.userName !== undefined) state.userName = action.payload.userName;
      })
      .addCase(candidateThunks.updateCandidateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Skills
      .addCase(candidateThunks.fetchCandidateSkills.pending, (state) => {
        state.skillsLoading = true;
        state.skillsError = null;
      })
      .addCase(candidateThunks.fetchCandidateSkills.fulfilled, (state, action) => {
        state.skillsLoading = false;
        state.skills = action.payload;
      })
      .addCase(candidateThunks.fetchCandidateSkills.rejected, (state, action) => {
        state.skillsLoading = false;
        state.skillsError = action.payload as string;
      })
      .addCase(candidateThunks.addCandidateSkill.pending, (state) => {
        state.skillsLoading = true;
        state.skillsError = null;
      })
      .addCase(candidateThunks.addCandidateSkill.fulfilled, (state, action) => {
        state.skillsLoading = false;
        state.skills.push(action.payload);
        state.skillsCount += 1;
      })
      .addCase(candidateThunks.addCandidateSkill.rejected, (state, action) => {
        state.skillsLoading = false;
        state.skillsError = action.payload as string;
      })
      .addCase(candidateThunks.deleteCandidateSkill.pending, (state) => {
        state.skillsLoading = true;
        state.skillsError = null;
      })
      .addCase(candidateThunks.deleteCandidateSkill.fulfilled, (state, action) => {
        state.skillsLoading = false;
        state.skills = state.skills.filter(skill => skill.id !== action.payload);
        state.skillsCount = Math.max(0, state.skillsCount - 1);
      })
      .addCase(candidateThunks.deleteCandidateSkill.rejected, (state, action) => {
        state.skillsLoading = false;
        state.skillsError = action.payload as string;
      })

      // Projects
      .addCase(candidateThunks.fetchCandidateProjects.pending, (state) => {
        state.projectsLoading = true;
        state.projectsError = null;
      })
      .addCase(candidateThunks.fetchCandidateProjects.fulfilled, (state, action) => {
        state.projectsLoading = false;
        state.projects = action.payload;
      })
      .addCase(candidateThunks.fetchCandidateProjects.rejected, (state, action) => {
        state.projectsLoading = false;
        state.projectsError = action.payload as string;
      })
      // Add project actions (add, update, delete) here

      // Education
      .addCase(candidateThunks.fetchCandidateEducation.pending, (state) => {
        state.educationLoading = true;
        state.educationError = null;
      })
      .addCase(candidateThunks.fetchCandidateEducation.fulfilled, (state, action) => {
        state.educationLoading = false;
        state.education = action.payload;
      })
      .addCase(candidateThunks.fetchCandidateEducation.rejected, (state, action) => {
        state.educationLoading = false;
        state.educationError = action.payload as string;
      })
      // Add education actions (add, update, delete) here

      // Experience
      .addCase(candidateThunks.fetchCandidateExperience.pending, (state) => {
        state.experienceLoading = true;
        state.experienceError = null;
      })
      .addCase(candidateThunks.fetchCandidateExperience.fulfilled, (state, action) => {
        state.experienceLoading = false;
        state.experience = action.payload;
      })
      .addCase(candidateThunks.fetchCandidateExperience.rejected, (state, action) => {
        state.experienceLoading = false;
        state.experienceError = action.payload as string;
      })
      // Add experience actions (add, update, delete) here

      // Certificates
      .addCase(candidateThunks.fetchCandidateCertificates.pending, (state) => {
        state.certificatesLoading = true;
        state.certificatesError = null;
      })
      .addCase(candidateThunks.fetchCandidateCertificates.fulfilled, (state, action) => {
        state.certificatesLoading = false;
        state.certificates = action.payload;
      })
      .addCase(candidateThunks.fetchCandidateCertificates.rejected, (state, action) => {
        state.certificatesLoading = false;
        state.certificatesError = action.payload as string;
      })
      // Add certificate actions (add, update, delete) here

      // Links
      .addCase(candidateThunks.fetchCandidateLinks.pending, (state) => {
        state.linksLoading = true;
        state.linksError = null;
      })
      .addCase(candidateThunks.fetchCandidateLinks.fulfilled, (state, action) => {
        state.linksLoading = false;
        state.links = action.payload;
      })
      .addCase(candidateThunks.fetchCandidateLinks.rejected, (state, action) => {
        state.linksLoading = false;
        state.linksError = action.payload as string;
      })
      .addCase(candidateThunks.addCandidateLink.pending, (state) => {
        state.linksLoading = true;
        state.linksError = null;
      })
      .addCase(candidateThunks.addCandidateLink.fulfilled, (state, action) => {
        state.linksLoading = false;
        state.links.push(action.payload);
        state.linksCount += 1;
      })
      .addCase(candidateThunks.addCandidateLink.rejected, (state, action) => {
        state.linksLoading = false;
        state.linksError = action.payload as string;
      })
      .addCase(candidateThunks.deleteCandidateLink.pending, (state) => {
        state.linksLoading = true;
        state.linksError = null;
      })
      .addCase(candidateThunks.deleteCandidateLink.fulfilled, (state, action) => {
        state.linksLoading = false;
        state.links = state.links.filter(link => link.id !== action.payload);
        state.linksCount = Math.max(0, state.linksCount - 1);
      })
      .addCase(candidateThunks.deleteCandidateLink.rejected, (state, action) => {
        state.linksLoading = false;
        state.linksError = action.payload as string;
      })
      .addCase(candidateThunks.updateCandidateLinks.pending, (state) => {
        state.linksLoading = true;
        state.linksError = null;
      })
      .addCase(candidateThunks.updateCandidateLinks.fulfilled, (state, action) => {
        state.linksLoading = false;
        
        // Process deleted links if any were included in the operation
        if (action.payload.operations?.deleted_links?.length) {
          state.links = state.links.filter(link => 
            !action.payload.operations.deleted_links.includes(link.id)
          );
          
          // Update the link count accordingly
          if (action.payload.result?.deleted > 0) {
            state.linksCount = Math.max(0, state.linksCount - action.payload.result.deleted);
          }
        }
        
        // Note: For added/updated links, we don't update the state here
        // since we'll trigger a fetch to get the complete updated data
      })
      .addCase(candidateThunks.updateCandidateLinks.rejected, (state, action) => {
        state.linksLoading = false;
        state.linksError = action.payload as string;
      });
  },
});

export const { clearCandidateProfile, updateLocalProfile } = candidateSlice.actions;

// Re-export all thunks for external use
export * from '../thunks/candidate';

export default candidateSlice.reducer;
