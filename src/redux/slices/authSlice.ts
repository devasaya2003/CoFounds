import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  verified: boolean;
  userName?: string | null;
  phone?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
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
          password: auth.password 
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
        user: data.user
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
        return rejectWithValue(errorData.error || "Failed to send password reset email");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Failed to send password reset email");
    }
  }
);

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
      localStorage.removeItem("auth_token");
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
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
      });
  },
});

export const { setEmail, setPassword, clearError, resetAuth, setToken, logout } = authSlice.actions;
export default authSlice.reducer;