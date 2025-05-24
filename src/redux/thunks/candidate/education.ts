import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_POST, fetchWithAuth_DELETE, fetchWithAuth_PUT } from "@/utils/api";

// Interface for education model
export interface CandidateEducation {
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

// Interface for adding education
export interface AddCandidateEducationPayload {
  userId: string;
  degreeId: string;
  eduFrom?: string;
  startedAt?: string | null;
  endAt?: string | null;
}

// Interface for updating education
export interface UpdateCandidateEducationPayload extends AddCandidateEducationPayload {
  educationId: string;
}

/**
 * Fetch candidate education
 */
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

/**
 * Add new education
 */
export const addCandidateEducation = createAsyncThunk(
  "candidate/addEducation",
  async (educationData: AddCandidateEducationPayload, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_POST(
        '/api/v1/candidate/education',
        {
          user_id: educationData.userId,
          degree_id: educationData.degreeId,
          edu_from: educationData.eduFrom,
          started_at: educationData.startedAt,
          end_at: educationData.endAt
        }
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to add education");
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add education");
    }
  }
);

/**
 * Update education
 */
export const updateCandidateEducation = createAsyncThunk(
  "candidate/updateEducation",
  async (educationData: UpdateCandidateEducationPayload, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_PUT(
        `/api/v1/candidate/education/${educationData.educationId}`,
        {
          user_id: educationData.userId,
          degree_id: educationData.degreeId,
          edu_from: educationData.eduFrom,
          started_at: educationData.startedAt,
          end_at: educationData.endAt
        }
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to update education");
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update education");
    }
  }
);

/**
 * Delete education
 */
export const deleteCandidateEducation = createAsyncThunk(
  "candidate/deleteEducation",
  async (educationId: string, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_DELETE(
        `/api/v1/candidate/education/${educationId}`
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to delete education");
      }
      
      return educationId;
    } catch (error) {
      return rejectWithValue("Failed to delete education");
    }
  }
);
