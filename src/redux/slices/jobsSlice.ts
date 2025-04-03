import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchWithAuth_GET } from "@/utils/api";

interface JobStatus {
  applied: number;
  underReview: number;
  inProgress: number;
  rejected: number;
  closed: number;
}

export interface Job {
  id: string;
  title: string;
  jobCode: string;
  recruiterName: string;
  requestedBy: string;
  status: JobStatus;
}

interface JobsState {
  jobs: Job[];
  filteredJobs: Job[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  jobsPerPage: number;
  activeView: string;
}

const initialState: JobsState = {
  jobs: [],
  filteredJobs: [],
  isLoading: false,
  error: null,
  searchTerm: "",
  currentPage: 1,
  jobsPerPage: 9,
  activeView: "all-jobs",
};

// Async thunk for fetching jobs
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call using fetchWithAuth_GET
      // For now, we'll just return mock data
      return MOCK_JOBS; // This would typically be: await fetchWithAuth_GET<Job[]>("/api/v1/jobs");
    } catch (error) {
      return rejectWithValue("Failed to fetch jobs");
    }
  }
);

// Mock data for jobs (same as in page.tsx)
const MOCK_JOBS = [
    {
      id: "job1",
      title: "Senior Frontend Developer",
      jobCode: "FE-2025-001",
      recruiterName: "John Smith",
      requestedBy: "Sarah Johnson",
      status: {
        applied: 12,
        underReview: 5,
        inProgress: 3,
        rejected: 8,
        closed: 1
      }
    },
    {
      id: "job2",
      title: "Backend Engineer",
      jobCode: "BE-2025-002",
      recruiterName: "Emily Davis",
      requestedBy: "Michael Thompson",
      status: {
        applied: 18,
        underReview: 7,
        inProgress: 4,
        rejected: 6,
        closed: 0
      }
    },
    {
      id: "job3",
      title: "Product Manager",
      jobCode: "PM-2025-003",
      recruiterName: "David Wilson",
      requestedBy: "Jennifer Lopez",
      status: {
        applied: 24,
        underReview: 9,
        inProgress: 5,
        rejected: 10,
        closed: 2
      }
    },
    {
      id: "job4",
      title: "UX/UI Designer",
      jobCode: "UX-2025-004",
      recruiterName: "John Smith",
      requestedBy: "Robert Davis",
      status: {
        applied: 15,
        underReview: 6,
        inProgress: 3,
        rejected: 5,
        closed: 1
      }
    },
    {
      id: "job5",
      title: "DevOps Engineer",
      jobCode: "DO-2025-005",
      recruiterName: "Emily Davis",
      requestedBy: "Lisa Wang",
      status: {
        applied: 9,
        underReview: 4,
        inProgress: 2,
        rejected: 3,
        closed: 0
      }
    },
    {
      id: "job6",
      title: "Data Scientist",
      jobCode: "DS-2025-006",
      recruiterName: "David Wilson",
      requestedBy: "Mark Johnson",
      status: {
        applied: 21,
        underReview: 8,
        inProgress: 4,
        rejected: 9,
        closed: 2
      }
    },
    {
      id: "job7",
      title: "Full Stack Developer",
      jobCode: "FS-2025-007",
      recruiterName: "John Smith",
      requestedBy: "Amanda Chen",
      status: {
        applied: 27,
        underReview: 12,
        inProgress: 6,
        rejected: 8,
        closed: 3
      }
    },
    {
      id: "job8",
      title: "Mobile App Developer",
      jobCode: "MA-2025-008",
      recruiterName: "Emily Davis",
      requestedBy: "Daniel Kim",
      status: {
        applied: 14,
        underReview: 6,
        inProgress: 4,
        rejected: 5,
        closed: 1
      }
    },
    {
      id: "job9",
      title: "QA Engineer",
      jobCode: "QA-2025-009",
      recruiterName: "David Wilson",
      requestedBy: "Olivia Martinez",
      status: {
        applied: 19,
        underReview: 8,
        inProgress: 5,
        rejected: 7,
        closed: 2
      }
    },
    {
      id: "job10",
      title: "Technical Project Manager",
      jobCode: "TPM-2025-010",
      recruiterName: "John Smith",
      requestedBy: "William Johnson",
      status: {
        applied: 16,
        underReview: 7,
        inProgress: 4,
        rejected: 6,
        closed: 1
      }
    },
    {
      id: "job11",
      title: "Cloud Solutions Architect",
      jobCode: "CSA-2025-011",
      recruiterName: "Emily Davis",
      requestedBy: "James Wilson",
      status: {
        applied: 11,
        underReview: 5,
        inProgress: 3,
        rejected: 4,
        closed: 0
      }
    },
    {
      id: "job12",
      title: "Cybersecurity Specialist",
      jobCode: "CS-2025-012",
      recruiterName: "David Wilson",
      requestedBy: "Sophia Garcia",
      status: {
        applied: 23,
        underReview: 9,
        inProgress: 5,
        rejected: 10,
        closed: 2
      }
    }
  ];

export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      state.filteredJobs = state.jobs.filter(job => 
        job.title.toLowerCase().includes(action.payload.toLowerCase()) || 
        job.jobCode.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setActiveView: (state, action: PayloadAction<string>) => {
      state.activeView = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
        state.filteredJobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setCurrentPage, setActiveView } = jobsSlice.actions;
export default jobsSlice.reducer;