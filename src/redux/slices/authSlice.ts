import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUserFromApiStatus } from "@/utils/authHelpers";

interface UserProfile {
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
  error: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  token: string | null;
  user: UserProfile | null;
}

const initialState: AuthState = {
  email: "",
  password: "",
  isLoading: false,
  error: null,
  isAuthenticated: false,
  userRole: null,
  token: null,
  user: null,
};


export const restoreUserSession = createAsyncThunk(
  "auth/restoreUserSession",
  async (_, { rejectWithValue }) => {
    try {
      const { isAuthenticated, user } = await getUserFromApiStatus();

      if (!isAuthenticated || !user) {
        return rejectWithValue("Not authenticated");
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


export const getFullName = (user: UserProfile | null): string => {
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
} = authSlice.actions;
export default authSlice.reducer;