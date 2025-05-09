import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET } from "@/utils/api";


interface RecruiterProfile {
  userId: string;
  companyId: string;
  email: string;
  userName: string;
  firstName: string; 
  lastName: string;  
  companyName: string;
  phone: string | null;
  description: string | null;
  dob: string | null;
  isLoading: boolean;
  error: string | null;
}


interface RecruiterApiResponse {
  user: {
    id: string;
    email: string;
    userName: string;
    firstName: string; 
    lastName: string;  
    phone: string | null;
    dob: string | null;
    description: string | null;
    
  };
  company: {
    id: string;
    name: string;
    
  };
}


const initialState: RecruiterProfile = {
  userId: "",
  companyId: "",
  email: "",
  userName: "",
  firstName: "",   
  lastName: "",    
  companyName: "",
  phone: null,
  description: null,
  dob: null,
  isLoading: false,
  error: null,
};


export const getRecruiterFullName = (recruiter: RecruiterProfile): string => {
  if (recruiter.firstName || recruiter.lastName) {
    return `${recruiter.firstName || ""} ${recruiter.lastName || ""}`.trim();
  }
  return recruiter.userName || "";
};


export const fetchRecruiterProfile = createAsyncThunk(
  "recruiter/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<RecruiterApiResponse>(`${baseUrl}/recruiter/user/${userId}`);
      
      return {
        userId: response.user.id,
        companyId: response.company.id,
        email: response.user.email,
        userName: response.user.userName,
        firstName: response.user.firstName,  
        lastName: response.user.lastName,    
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
        state.firstName = action.payload.firstName;  
        state.lastName = action.payload.lastName;    
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