import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_PUT } from "@/utils/api";

// Interface for education model
export interface CandidateEducation {
  id: string;
  eduFrom: string;
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

// Interface for batch education operations
export interface EducationOperationsPayload {
  userId: string;
  newEducation?: {
    degreeId: string;
    eduFrom: string;
    startedAt?: string | null;
    endAt?: string | null;
  }[];
  updatedEducation?: {
    id: string;
    degreeId: string;
    eduFrom: string;
    startedAt?: string | null;
    endAt?: string | null;
  }[];
  deletedEducation?: string[];
}

// Define the response type for the batch update operation
export interface EducationUpdateRequest {
  user_id: string;
  new_education: {
    degree_id: string;
    institution: string;
    started_at: string | null;
    end_at: string | null;
  }[];
  updated_education: {
    id: string;
    degree_id: string;
    institution: string;
    started_at: string | null;
    end_at: string | null;
  }[];
  deleted_education: string[];
}

export interface EducationUpdateResponse {
  success: boolean;
  message?: string;
  data: {
    updated: number;
    created: number;
    deleted: number;
    total: number;
  };
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
 * Update education (add, update, delete in a single request)
 */
export const updateCandidateEducation = createAsyncThunk<
  {
    operations: EducationUpdateRequest;
    response: EducationUpdateResponse;
  },
  EducationOperationsPayload,
  { rejectValue: string }
>(
  "candidate/updateEducation",
  async (operations: EducationOperationsPayload, { rejectWithValue }) => {
    try {
      // Transform payload to match API expectations
      const apiPayload: EducationUpdateRequest = {
        user_id: operations.userId,
        new_education: operations.newEducation?.map(edu => ({
          degree_id: edu.degreeId,
          institution: edu.eduFrom,
          started_at: edu.startedAt ?? null,
          end_at: edu.endAt ?? null
        })) || [],
        updated_education: operations.updatedEducation?.map(edu => ({
          id: edu.id,
          degree_id: edu.degreeId,
          institution: edu.eduFrom,
          started_at: edu.startedAt ?? null,
          end_at: edu.endAt ?? null
        })) || [],
        deleted_education: operations.deletedEducation || []
      };
      
      const response = await fetchWithAuth_PUT<EducationUpdateResponse>(
        '/api/v1/candidate/education',
        apiPayload
      );
      
      if (!response.success) {
        return rejectWithValue("Failed to update education");
      }
      
      // Return properly typed data
      return {
        operations: apiPayload,
        response
      };
    } catch (error) {
      return rejectWithValue("Failed to update education");
    }
  }
);