import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUserFromApiStatus } from "@/utils/authHelpers";
import { RootState } from "../store";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  verified: boolean;
  userName?: string | null;
  firstName?: string | null; 
  lastName?: string | null;  
  phone?: string | null;
  description?: string | null;
  dob?: string | null;       
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface SignUpData {
  email: string;
  password: string;
  role: string;
}

interface AuthState {
  email: string;
  password: string;
  isLoading: boolean;
  isLoadingUserDetails: boolean;
  error: string | null;
  userDetailsError: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  token: string | null;
  user: AuthUser | null;
  layoutInitialized: boolean;
}

const initialState: AuthState = {
  email: "",
  password: "",
  isLoading: false,
  isLoadingUserDetails: false,
  error: null,
  userDetailsError: null,
  isAuthenticated: false,
  userRole: null,
  token: null,
  user: null,
  layoutInitialized: false,
};

export const restoreUserSession = createAsyncThunk(
  "auth/restoreUserSession",
  async (_, { rejectWithValue }) => {
    try {
      const { isAuthenticated, user } = await getUserFromApiStatus();

      if (!isAuthenticated || !user) {
        return rejectWithValue("Please sign in again!");
      }

      return { user, isAuthenticated };
    } catch (error) {
      return rejectWithValue("Failed to restore user session");
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState() as { auth: AuthState };

    try {
      const response = await fetch("/api/auth/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: auth.email,
          password: auth.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Authentication failed");
      }

      const data = await response.json();

      console.log("DATA OF REDUX LOGIN: ", JSON.stringify(data));

      if (data.token) {
        localStorage.setItem("auth_token", data.token);

        document.cookie = `auth_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      }

      return {
        success: true,
        role: data.user.role,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      return rejectWithValue("Authentication failed. Please try again.");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.error || "Failed to send password reset email"
        );
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Failed to send password reset email");
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (signupData: SignUpData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Signup failed");
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        document.cookie = `auth_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      }

      return {
        success: true,
        role: data.user.role,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      return rejectWithValue("Signup failed. Please try again.");
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { getState }) => {
    const state = getState() as RootState;
    
    if (state.auth.isAuthenticated && state.auth.user?.userName) {
      try {

        const userName = state.auth.user.userName;
        const url = `/api/portfolio/${userName}`;

        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText.substring(0, 200));
          throw new Error(`Failed to fetch user details: ${response.status}`);
        }

        const responseText = await response.text();

        try {
          const data = JSON.parse(responseText);
          
          if (data.success && data.data) {
            return data.data;
          } else {
            throw new Error(data.error || 'Failed to fetch user details');
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.error("Raw response:", responseText.substring(0, 200));
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }
    }
    
    throw new Error('User not authenticated or username missing');
  }
);

export const getFullName = (user: AuthUser | null): string => {
  if (!user) return "";
  
  
  if (user.firstName || user.lastName) {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }
  
  return user.userName || "";
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: () => initialState,
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (action.payload) {
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userRole = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem("auth_token");
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },
    setLayoutInitialized: (state, action: PayloadAction<boolean>) => {
      state.layoutInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.userRole = action.payload.role;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(restoreUserSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(restoreUserSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(restoreUserSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.userRole = action.payload.role;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoadingUserDetails = true;
        state.userDetailsError = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoadingUserDetails = false;
        state.user = {
          ...state.user,
          ...action.payload
        };
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.isLoadingUserDetails = false;
        state.userDetailsError = action.error.message || 'Failed to fetch user details';
      });
  },
});

export const {
  setEmail,
  setPassword,
  clearError,
  resetAuth,
  setToken,
  logout,
  setLayoutInitialized,
} = authSlice.actions;
export default authSlice.reducer;