import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_POST } from "@/utils/api";

// Interface for the API response
interface CandidateSummaryResponse {
  success: boolean;
  data: {
    id: string;
    userName: string | null;
    firstName: string | null;
    lastName: string | null;
    dob: string | null;
    email: string;
    profileImage: string | null;
    description: string | null;
    verified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    counts: {
      skillset: number;
      education: number;
      projects: number;
      certificates: number;
      experience: number;
      links: number;
    };
  };
}

// Interface for profile update payload
export interface UpdateCandidateProfilePayload {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  description?: string | null;
  dob?: string | null;
  profileImage?: string | null;
}

/**
 * Fetch candidate summary information
 */
export const fetchCandidateSummary = createAsyncThunk(
  "candidate/fetchSummary",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<CandidateSummaryResponse>(
        `${baseUrl}/candidate/summary/${userId}`
      );

      if (!response.success || !response.data) {
        return rejectWithValue("Failed to fetch candidate summary");
      }

      return {
        user: {
          id: response.data.id,
          email: response.data.email,
          userName: response.data.userName,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: null, // Not provided in new API
          description: response.data.description,
          dob: response.data.dob,
          profileImage: response.data.profileImage,
          role: "candidate",
          verified: response.data.verified,
          isActive: response.data.isActive,
        },
        counts: {
          skills: response.data.counts.skillset,
          projects: response.data.counts.projects,
          education: response.data.counts.education,
          experience: response.data.counts.experience,
          certificates: response.data.counts.certificates,
          links: response.data.counts.links,
        },
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch candidate summary");
    }
  }
);

/**
 * Update candidate profile
 */
export const updateCandidateProfile = createAsyncThunk(
  "candidate/updateProfile",
  async (profileData: UpdateCandidateProfilePayload, { rejectWithValue }) => {
    try {
      const apiData = {
        user_id: profileData.userId,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        dob: profileData.dob,
        description: profileData.description,
        profile_image: profileData.profileImage
      };
      
      const response = await fetch('/api/v1/candidate/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to update profile");
      }
      
      const data = await response.json();
      
      if (!data.success || !data.updatedProfile) {
        return rejectWithValue("Update succeeded but response data is invalid");
      }
      
      return {
        userId: profileData.userId,
        firstName: data.updatedProfile.firstName,
        lastName: data.updatedProfile.lastName,
        description: data.updatedProfile.description,
        dob: data.updatedProfile.dob,
        profileImage: data.updatedProfile.profileImage,
        userName: data.updatedProfile.userName
      };
    } catch (error) {
      return rejectWithValue("Failed to update profile");
    }
  }
);
