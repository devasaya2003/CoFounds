import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET } from "@/utils/api";

// Define the recruiter profile interface
interface RecruiterProfile {
  userId: string;
  companyId: string;
  email: string;
  userName: string;
  firstName: string; // Add firstName
  lastName: string;  // Add lastName
  companyName: string;
  phone: string | null;
  description: string | null;
  dob: string | null;
  isLoading: boolean;
  error: string | null;
}

// Define API response interface
interface RecruiterApiResponse {
  user: {
    id: string;
    email: string;
    userName: string;
    firstName: string; // Add firstName
    lastName: string;  // Add lastName
    phone: string | null;
    dob: string | null;
    description: string | null;
    // Add other possible user fields if needed
  };
  company: {
    id: string;
    name: string;
    // Add other possible company fields if needed
  };
}

// Initial state
const initialState: RecruiterProfile = {
  userId: "",
  companyId: "",
  email: "",
  userName: "",
  firstName: "",   // Initialize firstName
  lastName: "",    // Initialize lastName
  companyName: "",
  phone: null,
  description: null,
  dob: null,
  isLoading: false,
  error: null,
};

// Helper function to get full name
export const getRecruiterFullName = (recruiter: RecruiterProfile): string => {
  if (recruiter.firstName || recruiter.lastName) {
    return `${recruiter.firstName || ""} ${recruiter.lastName || ""}`.trim();
  }
  return recruiter.userName || "";
};

// Async thunk to fetch recruiter profile
export const fetchRecruiterProfile = createAsyncThunk(
  "recruiter/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || "";
      const response = await fetchWithAuth_GET<RecruiterApiResponse>(`${baseUrl}/recruiter/user/${userId}`);
      
      return {
        userId: response.user.id,
        companyId: response.company.id,
        email: response.user.email,
        userName: response.user.userName,
        firstName: response.user.firstName,  // Extract firstName
        lastName: response.user.lastName,    // Extract lastName
        companyName: response.company.name,
        phone: response.user.phone,
        description: response.user.description,
        dob: response.user.dob,
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
        state.firstName = action.payload.firstName;  // Set firstName
        state.lastName = action.payload.lastName;    // Set lastName
        state.companyName = action.payload.companyName;
        state.phone = action.payload.phone;
        state.description = action.payload.description;
        state.dob = action.payload.dob;
      })
      .addCase(fetchRecruiterProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRecruiterProfile } = recruiterSlice.actions;
export default recruiterSlice.reducer;