import { fetchWithAuth_GET, fetchWithAuth_PUT } from '@/utils/api';
import { UserMaster, UserSkillset, UserProjects, UserCertificates, UserEducation, UserExperience, SkillMaster, DegreeMaster } from '@prisma/client';

export interface UserProfile extends Omit<UserMaster, 'passwordHash'> {
    skillset: (UserSkillset & {
        skill: SkillMaster;
    })[];
    education: (UserEducation & {
        degree: DegreeMaster;
    })[];
    projects: UserProjects[];
    certificates: UserCertificates[];
    experience: UserExperience[];
}

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