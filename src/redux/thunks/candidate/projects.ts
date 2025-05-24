import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_POST, fetchWithAuth_DELETE, fetchWithAuth_PUT } from "@/utils/api";

// Interface for project model
export interface CandidateProject {
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

// Interface for adding project
export interface AddCandidateProjectPayload {
  userId: string;
  title: string;
  link?: string | null;
  description?: string | null;
  startedAt?: string | null;
  endAt?: string | null;
}

// Interface for updating project
export interface UpdateCandidateProjectPayload extends AddCandidateProjectPayload {
  projectId: string;
}

/**
 * Fetch candidate projects
 */
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

/**
 * Add new project
 */
export const addCandidateProject = createAsyncThunk(
  "candidate/addProject",
  async (projectData: AddCandidateProjectPayload, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_POST(
        '/api/v1/candidate/projects',
        {
          user_id: projectData.userId,
          title: projectData.title,
          link: projectData.link,
          description: projectData.description,
          started_at: projectData.startedAt,
          end_at: projectData.endAt
        }
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to add project");
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add project");
    }
  }
);

/**
 * Update project
 */
export const updateCandidateProject = createAsyncThunk(
  "candidate/updateProject",
  async (projectData: UpdateCandidateProjectPayload, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_PUT(
        `/api/v1/candidate/projects/${projectData.projectId}`,
        {
          user_id: projectData.userId,
          title: projectData.title,
          link: projectData.link,
          description: projectData.description,
          started_at: projectData.startedAt,
          end_at: projectData.endAt
        }
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to update project");
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update project");
    }
  }
);

/**
 * Delete project
 */
export const deleteCandidateProject = createAsyncThunk(
  "candidate/deleteProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_DELETE(
        `/api/v1/candidate/projects/${projectId}`
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to delete project");
      }
      
      return projectId;
    } catch (error) {
      return rejectWithValue("Failed to delete project");
    }
  }
);
