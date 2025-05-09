import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_POST, fetchWithAuth_PUT } from "@/utils/api";
import { CreateDegree } from "@/backend/interfaces/POST/create_degree";
import { UpdateDegree } from "@/backend/interfaces/PUT/update_degree";
import { UpdateBulkDegree } from "@/backend/interfaces/PUT/update_bulk_degree";


export interface Degree {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DegreeState {
  allDegrees: Degree[];
  filteredDegrees: Degree[];
  selectedDegree: Degree | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDegrees: number;
  };
  filters: {
    searchTerm: string;
    degreeType: string | null;
  };
  isLoading: boolean;
  error: string | null;
  
  updateStatus: {
    isUpdating: boolean;
    success: boolean;
    message: string | null;
  };
}


interface GetAllDegreesResponse {
  [index: number]: Degree;
  length: number;
}

interface GetDegreeByIdResponse extends Degree {}

interface GetDegreeByNameResponse extends Degree {}

interface GetDegreesPaginatedResponse {
  result: {
    degrees: Degree[];
    totalDegrees: number;
    totalPages: number;
    currentPage: number;
  };
}

interface GetDegreesByTypeResponse {
  [index: number]: Degree;
  length: number;
}

interface GetDegreesByTypePaginatedResponse {
  currentPage: number;
  totalPages: number;
  totalDegrees: number;
  degrees: Degree[];
}

export interface BulkCreateDegreeResponse {
  success: boolean;
  message: string;
  createdCount: number;
}


export interface UpdateDegreeResponse extends Degree {}

export interface BulkUpdateDegreeResponse {
  success: boolean;
  message: string;
  updatedCount: number;
}


export const degreeInitialState: DegreeState = {
  allDegrees: [],
  filteredDegrees: [],
  selectedDegree: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalDegrees: 0,
  },
  filters: {
    searchTerm: "",
    degreeType: null,
  },
  isLoading: false,
  error: null,
  updateStatus: {
    isUpdating: false,
    success: false,
    message: null,
  },
};


const getBaseUrl = () => "/api/v1";




export const fetchAllDegrees = createAsyncThunk(
  "degree/fetchAllDegrees",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetAllDegreesResponse>(`${baseUrl}/degrees`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue("Failed to fetch all degrees");
    }
  }
);


export const fetchDegreeById = createAsyncThunk(
  "degree/fetchDegreeById",
  async (degreeId: string, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetDegreeByIdResponse>(`${baseUrl}/degrees/${degreeId}`);
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to fetch degree with ID: ${degreeId}`);
    }
  }
);


export const fetchDegreeByName = createAsyncThunk(
  "degree/fetchDegreeByName",
  async (degreeName: string, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetDegreeByNameResponse>(
        `${baseUrl}/degrees/${encodeURIComponent(degreeName)}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to fetch degree with name: ${degreeName}`);
    }
  }
);


export const fetchDegreesPaginated = createAsyncThunk(
  "degree/fetchDegreesPaginated",
  async (pageNo: number, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetDegreesPaginatedResponse>(
        `${baseUrl}/degrees/page/${pageNo}`
      );
      return response.result;
    } catch (error) {
      return rejectWithValue(`Failed to fetch degrees for page: ${pageNo}`);
    }
  }
);


export const fetchDegreesByType = createAsyncThunk(
  "degree/fetchDegreesByType",
  async (degreeType: string, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetDegreesByTypeResponse>(
        `${baseUrl}/degrees/type/${encodeURIComponent(degreeType)}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue(`Failed to fetch degrees with type: ${degreeType}`);
    }
  }
);


export const fetchDegreesByTypePaginated = createAsyncThunk(
  "degree/fetchDegreesByTypePaginated",
  async (
    { degreeType, pageNo }: { degreeType: string; pageNo: number },
    { rejectWithValue }
  ) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetDegreesByTypePaginatedResponse>(
        `${baseUrl}/degrees/type/${encodeURIComponent(degreeType)}/page/${pageNo}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        `Failed to fetch degrees with type: ${degreeType} for page: ${pageNo}`
      );
    }
  }
);




export const createDegree = createAsyncThunk(
  "degree/createDegree",
  async (data: CreateDegree, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_POST<Degree, CreateDegree>(
        `${baseUrl}/degrees`,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue("Failed to create degree");
    }
  }
);


export const bulkCreateDegrees = createAsyncThunk(
  "degree/bulkCreateDegrees",
  async (degrees: CreateDegree[], { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_POST<BulkCreateDegreeResponse, CreateDegree[]>(
        `${baseUrl}/degrees/bulk`,
        degrees
      );
      return response;
    } catch (error) {
      return rejectWithValue("Failed to perform bulk creation of degrees");
    }
  }
);




export const updateDegree = createAsyncThunk(
  "degree/updateDegree",
  async (
    { degreeId, data }: { degreeId: string; data: Partial<UpdateDegree> },
    { rejectWithValue }
  ) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_PUT<Degree, Partial<UpdateDegree>>(
        `${baseUrl}/degrees/${degreeId}`,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to update degree with ID: ${degreeId}`);
    }
  }
);


export const bulkUpdateDegrees = createAsyncThunk(
  "degree/bulkUpdateDegrees",
  async (updates: UpdateBulkDegree[], { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_PUT<BulkUpdateDegreeResponse, UpdateBulkDegree[]>(
        `${baseUrl}/degrees/bulk`,
        updates
      );
      return response;
    } catch (error) {
      return rejectWithValue("Failed to perform bulk update of degrees");
    }
  }
);


export const degreeMasterReducers = {
  filterDegreesByName: (state: DegreeState, action: { payload: string }) => {
    const searchTerm = action.payload.toLowerCase();
    state.filters.searchTerm = searchTerm;

    if (searchTerm) {
      state.filteredDegrees = state.allDegrees.filter((degree) =>
        degree.name.toLowerCase().includes(searchTerm)
      );
    } else {
      state.filteredDegrees = state.allDegrees;
    }
  },

  resetDegreeState: () => degreeInitialState,
};