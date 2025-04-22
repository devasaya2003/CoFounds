import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_PUT, fetchWithAuth_POST } from "@/utils/api";
import { UpdateSkill } from "@/backend/interfaces/PUT/update_skill";
import { UpdateBulkSkill } from "@/backend/interfaces/PUT/update_bulk_skill";
import { CreateSkill } from "@/backend/interfaces/POST/create_skill";


export interface Skill {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillState {
  allSkills: Skill[];
  filteredSkills: Skill[];
  selectedSkill: Skill | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSkills: number;
  };
  filters: {
    searchTerm: string;
  };
  isLoading: boolean;
  error: string | null;
}


interface GetAllSkillsResponse {
  [index: number]: Skill;
  length: number;
}

interface GetSkillByIdResponse extends Skill {}

interface GetSkillByNameResponse extends Skill {}

interface GetSkillsPaginatedResponse {
  result: {
    skills: Skill[];
    totalSkills: number;
    totalPages: number;
    currentPage: number;
  };
}


export const skillInitialState: SkillState = {
  allSkills: [],
  filteredSkills: [],
  selectedSkill: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalSkills: 0,
  },
  filters: {
    searchTerm: "",
  },
  isLoading: false,
  error: null,
};


const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL_API || "";




export const fetchAllSkills = createAsyncThunk(
  "skill/fetchAllSkills",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetAllSkillsResponse>(`${baseUrl}/skills`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue("Failed to fetch all skills");
    }
  }
);


export const fetchSkillById = createAsyncThunk(
  "skill/fetchSkillById",
  async (skillId: string, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetSkillByIdResponse>(`${baseUrl}/skills/${skillId}`);
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to fetch skill with ID: ${skillId}`);
    }
  }
);


export const fetchSkillByName = createAsyncThunk(
  "skill/fetchSkillByName",
  async (skillName: string, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetSkillByNameResponse>(
        `${baseUrl}/skills/name/${encodeURIComponent(skillName)}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to fetch skill with name: ${skillName}`);
    }
  }
);


export const fetchSkillsPaginated = createAsyncThunk(
  "skill/fetchSkillsPaginated",
  async (pageNo: number, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetSkillsPaginatedResponse>(
        `${baseUrl}/skills/page/${pageNo}`
      );
      return response.result;
    } catch (error) {
      return rejectWithValue(`Failed to fetch skills for page: ${pageNo}`);
    }
  }
);


export const updateSkill = createAsyncThunk(
  "skill/updateSkill",
  async (
    { skillId, data }: { skillId: string; data: Partial<UpdateSkill> },
    { rejectWithValue }
  ) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || "";
      const response = await fetchWithAuth_PUT<Skill, Partial<UpdateSkill>>(
        `${baseUrl}/skills/${skillId}`,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to update skill with ID: ${skillId}`);
    }
  }
);


export const bulkUpdateSkills = createAsyncThunk(
  "skill/bulkUpdateSkills",
  async (updates: UpdateBulkSkill[], { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || "";
      const response = await fetchWithAuth_PUT<
        { success: boolean; updatedCount: number },
        UpdateBulkSkill[]
      >(`${baseUrl}/skills/bulk`, updates);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to perform bulk update of skills");
    }
  }
);


export const createSkill = createAsyncThunk(
  "skill/createSkill",
  async (data: CreateSkill, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || "";
      const response = await fetchWithAuth_POST<Skill, CreateSkill>(
        `${baseUrl}/skills`,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue("Failed to create skill");
    }
  }
);


export const bulkCreateSkills = createAsyncThunk(
  "skill/bulkCreateSkills",
  async (skills: CreateSkill[], { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || "";
      const response = await fetchWithAuth_POST<
        { success: boolean; createdCount: number },
        CreateSkill[]
      >(`${baseUrl}/skills/bulk`, skills);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to perform bulk creation of skills");
    }
  }
);


export const skillMasterReducers = {
  filterSkillsByName: (state: SkillState, action: { payload: string }) => {
    const searchTerm = action.payload.toLowerCase();
    state.filters.searchTerm = searchTerm;

    if (searchTerm) {
      state.filteredSkills = state.allSkills.filter((skill) =>
        skill.name.toLowerCase().includes(searchTerm)
      );
    } else {
      state.filteredSkills = state.allSkills;
    }
  },

  resetSkillState: () => skillInitialState,
};