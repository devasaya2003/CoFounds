import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_PUT } from "@/utils/api";

// Interface for skill model - updated to match actual API response
export interface CandidateSkill {
  id: string;
  skill: {
    id: string;
    name: string;
  };
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

// Interface for batch skill operations
export interface SkillOperationsPayload {
  userId: string;
  newSkills?: {
    skillId: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
  }[];
  updatedSkills?: {
    id: string;
    skillId: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
  }[];
  deletedSkills?: string[];
}

// Define the response type for the batch update operation
export interface SkillUpdateRequest {
  user_id: string;
  new_skillset: { skill_id: string; skill_level: string }[];
  updated_skillset: { skill_id: string; skill_level: string }[];
  deleted_skillset: string[];
}

export interface SkillUpdateResponse {
  success: boolean;
  message: string;
  data: {
    updated: number;
    created: number;
    reactivated: number;
    deleted: number;
    total: number;
  };
}

/**
 * Fetch candidate skills
 */
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

/**
 * Update skills (add, update, delete in a single request)
 */
export const updateCandidateSkills = createAsyncThunk<
  {
    operations: SkillUpdateRequest;
    response: SkillUpdateResponse;
  },
  SkillOperationsPayload,
  { rejectValue: string }
>(
  "candidate/updateSkills",
  async (operations: SkillOperationsPayload, { rejectWithValue }) => {
    try {
      // Transform payload to match API expectations
      const apiPayload: SkillUpdateRequest = {
        user_id: operations.userId,
        new_skillset: operations.newSkills?.map(skill => ({
          skill_id: skill.skillId,
          skill_level: skill.skillLevel
        })) || [],
        updated_skillset: operations.updatedSkills?.map(skill => ({
          skill_id: skill.skillId,
          skill_level: skill.skillLevel
        })) || [],
        deleted_skillset: operations.deletedSkills || []
      };
      
      const response = await fetchWithAuth_PUT<SkillUpdateResponse>(
        '/api/v1/candidate/skills',
        apiPayload
      );
      
      if (!response.success) {
        return rejectWithValue("Failed to update skills");
      }
      
      // Return properly typed data
      return {
        operations: apiPayload,
        response
      };
    } catch (error) {
      return rejectWithValue("Failed to update skills");
    }
  }
);
