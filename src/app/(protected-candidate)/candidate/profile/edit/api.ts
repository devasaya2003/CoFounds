import { fetchWithAuth_GET, fetchWithAuth_PUT } from '@/utils/api';

// Type definition for user data based on your API response
export interface UserProfile {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  skillset: Array<{
    id: string;
    skill: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    createdAt: string;
    updatedAt: string;
  }>;
  education: Array<{
    id: string;
    eduFrom: string;
    degree: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
    startedAt: string;
    endAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    link: string | null;
    startedAt: string;
    endAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  certificates: Array<{
    id: string;
    title: string;
    description: string | null;
    filePath: string | null;
    link: string | null;
    startedAt: string | null;
    endAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  experience: Array<{
    id: string;
    title: string;
    companyName: string;
    description: string | null;
    startedAt: string;
    endAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

// API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Fetch user profile by username
export async function getUserProfile(username: string): Promise<UserProfile> {
  try {
    const response = await fetchWithAuth_GET<ApiResponse<UserProfile>>(`/api/v1/candidate/summary/${username}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch user profile');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const response = await fetchWithAuth_PUT<ApiResponse<UserProfile>, Partial<UserProfile>>(
      '/api/portfolio/update',
      profileData
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update user profile');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}