import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_POST, fetchWithAuth_DELETE, fetchWithAuth_PUT } from "@/utils/api";

// Interface for experience model
export interface CandidateExperience {
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

// Interface for adding experience
export interface AddCandidateExperiencePayload {
  userId: string;
  companyName: string;
  title: string;
  description?: string | null;
  startedAt?: string | null;
  endAt?: string | null;
}

// Interface for updating experience
export interface UpdateCandidateExperiencePayload extends AddCandidateExperiencePayload {
  experienceId: string;
}

/**
 * Fetch candidate experience
 */
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

/**
 * Add new experience
 */
export const addCandidateExperience = createAsyncThunk(
  "candidate/addExperience",
  async (experienceData: AddCandidateExperiencePayload, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_POST(
        '/api/v1/candidate/experience',
        {
          user_id: experienceData.userId,
          company_name: experienceData.companyName,
          title: experienceData.title,
          description: experienceData.description,
          started_at: experienceData.startedAt,
          end_at: experienceData.endAt
        }
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to add experience");
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add experience");
    }
  }
);

/**
 * Update experience
 */
export const updateCandidateExperience = createAsyncThunk(
  "candidate/updateExperience",
  async (experienceData: UpdateCandidateExperiencePayload, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_PUT(
        `/api/v1/candidate/experience/${experienceData.experienceId}`,
        {
          user_id: experienceData.userId,
          company_name: experienceData.companyName,
          title: experienceData.title,
          description: experienceData.description,
          started_at: experienceData.startedAt,
          end_at: experienceData.endAt
        }
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to update experience");
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update experience");
    }
  }
);

/**
 * Delete experience
 */
export const deleteCandidateExperience = createAsyncThunk(
  "candidate/deleteExperience",
  async (experienceId: string, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_DELETE(
        `/api/v1/candidate/experience/${experienceId}`
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to delete experience");
      }
      
      return experienceId;
    } catch (error) {
      return rejectWithValue("Failed to delete experience");
    }
  }
);
