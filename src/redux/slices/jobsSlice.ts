import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchWithAuth_POST } from "@/utils/api";
import { RootState } from "../store";
import { COMPANY, RECRUITER } from "@/backend/constants/constants";
import { Job } from "@/types/job";

// Define request payload interfaces
interface JobsRequestPayload {
  type: string;
  id: string;
  page_no: number;
}

interface FetchJobsResponse {
  fetchedJobs: {
    jobs: Job[];
    totalJobs: number;
    totalPages: number;
    currentPage: number;
  };
}

interface JobsState {
  jobs: Job[];
  filteredJobs: Job[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  jobsPerPage: number;
  totalJobs: number;
  totalPages: number;
  activeView: string; // Added this property
}

const initialState: JobsState = {
  jobs: [],
  filteredJobs: [],
  isLoading: false,
  error: null,
  searchTerm: "",
  currentPage: 1,
  jobsPerPage: 10,
  totalJobs: 0,
  totalPages: 1,
  activeView: "all-jobs", // Default view
};

// Async thunk for fetching all jobs by company
export const fetchJobsByCompany = createAsyncThunk(
  "jobs/fetchJobsByCompany",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { companyId } = state.recruiter;

      if (!companyId) {
        return rejectWithValue("Company information not loaded");
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || "";
      const requestPayload: JobsRequestPayload = {
        type: COMPANY,
        id: companyId,
        page_no: state.jobs.currentPage,
      };

      const response = await fetchWithAuth_POST<FetchJobsResponse, JobsRequestPayload>(
        `${baseUrl}/jobs/identifier`,
        requestPayload
      );

      return response.fetchedJobs;
    } catch (error) {
      return rejectWithValue("Failed to fetch jobs");
    }
  }
);

// Async thunk for fetching jobs created by a specific recruiter
export const fetchJobsByRecruiter = createAsyncThunk(
  "jobs/fetchJobsByRecruiter",
  async (recruiterId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || "";
      const requestPayload: JobsRequestPayload = {
        type: RECRUITER,
        id: recruiterId,
        page_no: state.jobs.currentPage,
      };

      const response = await fetchWithAuth_POST<FetchJobsResponse, JobsRequestPayload>(
        `${baseUrl}/jobs/identifier`,
        requestPayload
      );

      return response.fetchedJobs;
    } catch (error) {
      return rejectWithValue("Failed to fetch recruiter's jobs");
    }
  }
);

export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;

      // Filter jobs based on search term
      if (action.payload) {
        const term = action.payload.toLowerCase();
        state.filteredJobs = state.jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(term) ||
            job.jobCode.toLowerCase().includes(term)
        );
      } else {
        state.filteredJobs = state.jobs;
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearJobs: (state) => {
      state.jobs = [];
      state.filteredJobs = [];
      state.currentPage = 1;
      state.totalJobs = 0;
      state.totalPages = 1;
      state.error = null;
    },
    setActiveView: (state, action: PayloadAction<string>) => {
      state.activeView = action.payload;
      state.currentPage = 1; // Reset to page 1 when changing views
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchJobsByCompany
      .addCase(fetchJobsByCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobsByCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs;
        state.filteredJobs = action.payload.jobs;
        state.totalJobs = action.payload.totalJobs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchJobsByCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle fetchJobsByRecruiter
      .addCase(fetchJobsByRecruiter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobsByRecruiter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs;
        state.filteredJobs = action.payload.jobs;
        state.totalJobs = action.payload.totalJobs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchJobsByRecruiter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setCurrentPage, clearJobs, setActiveView } =
  jobsSlice.actions;
export default jobsSlice.reducer;