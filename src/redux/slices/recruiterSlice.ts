import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET } from "@/utils/api";

// Define the recruiter profile interface
interface RecruiterProfile {
  userId: string;
  companyId: string;
  email: string;
  userName: string;
  companyName: string;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: RecruiterProfile = {
  userId: "",
  companyId: "",
  email: "",
  userName: "",
  companyName: "",
  isLoading: false,
  error: null,
};

// Async thunk to fetch recruiter profile
export const fetchRecruiterProfile = createAsyncThunk(
  "recruiter/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || "";
      const response = await fetchWithAuth_GET<any>(`${baseUrl}/recruiter/user/${userId}`);
      
      return {
        userId: response.user.id,
        companyId: response.company.id,
        email: response.user.email,
        userName: response.user.userName,
        companyName: response.company.name,
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch recruiter profile");
    }
  }
);

// Create the slice
const recruiterSlice = createSlice({
  name: "recruiter",
  initialState,
  reducers: {
    clearRecruiterProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecruiterProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecruiterProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId = action.payload.userId;
        state.companyId = action.payload.companyId;
        state.email = action.payload.email;
        state.userName = action.payload.userName;
        state.companyName = action.payload.companyName;
      })
      .addCase(fetchRecruiterProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRecruiterProfile } = recruiterSlice.actions;
export default recruiterSlice.reducer;