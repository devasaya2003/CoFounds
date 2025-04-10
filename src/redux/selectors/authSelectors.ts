import { RootState } from "../store";
import { getFullName } from "../slices/authSlice";

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserRole = (state: RootState) => state.auth.userRole;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserFullName = (state: RootState) => getFullName(state.auth.user);