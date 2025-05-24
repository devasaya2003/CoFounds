import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_POST, fetchWithAuth_DELETE } from "@/utils/api";

// Interface for skill model
export interface CandidateSkill {
  id: string;
  skill: {
    id: string;
    name: string;
  };
  skillLevel: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for adding a skill
export interface AddCandidateSkillPayload {
  userId: string;
  skillId: string;
  skillLevel: string;
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
 * Add a new skill
 */
export const addCandidateSkill = createAsyncThunk(
  "candidate/addSkill",
  async (skillData: AddCandidateSkillPayload, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_POST(
        '/api/v1/candidate/skills',
        {
          user_id: skillData.userId,
          skill_id: skillData.skillId,
          skill_level: skillData.skillLevel
        }
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to add skill");
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add skill");
    }
  }
);

/**
 * Delete a skill
 */
export const deleteCandidateSkill = createAsyncThunk(
  "candidate/deleteSkill",
  async (skillId: string, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_DELETE(
        `/api/v1/candidate/skills/${skillId}`
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to delete skill");
      }
      
      return skillId;
    } catch (error) {
      return rejectWithValue("Failed to delete skill");
    }
  }
);
