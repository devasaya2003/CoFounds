import { fetchWithAuth_GET, fetchWithAuth_POST, fetchWithAuth_PUT } from '@/utils/api';
import { UserMaster, UserSkillset, UserProjects, UserCertificates, UserEducation, UserExperience, SkillMaster, DegreeMaster } from '@prisma/client';

interface PendingRequest {
  promise: Promise<UserProfile>;
  timestamp: number;
}

const pendingRequests: Record<string, PendingRequest> = {};
const responseCache: Record<string, { data: UserProfile; timestamp: number }> = {};
const profileCache: Record<string, { data: UserProfile; timestamp: number }> = {};
const CACHE_TTL = 30000;

const API_ENDPOINTS = {
  PROFILE: '/api/v1/candidate/profile',
  SKILLS: '/api/v1/candidate/skills',
  EDUCATION: '/api/v1/candidate/education',
  CERTIFICATES: '/api/v1/candidate/certificates',
  EXPERIENCE: '/api/v1/candidate/experience',
  PROJECTS: '/api/v1/candidate/projects'
};

const formatDateForAPI = (dateObj: Date | null): string | null => {
  if (!dateObj) {
    return null;
  }

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

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

export interface SkillsUpdateResult {
  updated: number;
  created: number;
  reactivated: number;
  deleted: number;
  total: number;
}

export async function getUserProfile(username: string, forceRefresh = false): Promise<UserProfile> {
  const cacheKey = `profile_${username}`;
  const now = Date.now();

  if (!forceRefresh &&
      profileCache[cacheKey] &&
      now - profileCache[cacheKey].timestamp < CACHE_TTL) {
    console.log(`Using cached profile for ${username}`);
    return profileCache[cacheKey].data;
  }

  console.log(`Fetching fresh profile data for ${username}`);
  try {
    const response = await fetch(`/api/v1/candidate/summary/${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch user profile');
    }

    profileCache[cacheKey] = {
      data: result.data,
      timestamp: now
    };

    return result.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Add this function to explicitly clear cache for a user
export function clearUserProfileCache(username: string) {
  const cacheKey = `profile_${username}`;
  if (profileCache[cacheKey]) {
    console.log(`Clearing cache for ${username}`);
    delete profileCache[cacheKey];
    return true;
  }
  return false;
}

export async function updatePersonalInfo(personalData: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const formattedDate = personalData.dob ? formatDateForAPI(personalData.dob) : null;

    const profilePayload = {
      user_id: personalData.id,
      first_name: personalData.firstName,
      last_name: personalData.lastName,
      dob: formattedDate,
      description: personalData.description,
      updated_by: personalData.id,
    };

    await fetchWithAuth_POST(
      API_ENDPOINTS.PROFILE,
      profilePayload
    );

    return {
      ...personalData,
    } as UserProfile;
  } catch (error) {
    console.error('Error updating personal info:', error);
    throw error;
  }
}

export async function updateSkills(skillsData: {
  user_id: string;
  updated_skillset: Array<{ skill_id: string; skill_level: string }>;
  new_skillset: Array<{ skill_id: string; skill_level: string }>;
  deleted_skillset: string[];
}): Promise<SkillsUpdateResult> {
  try {
    const response = await fetchWithAuth_PUT<ApiResponse<SkillsUpdateResult>>(
      API_ENDPOINTS.SKILLS,
      skillsData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update skills');
    }

    return response.data;
  } catch (error) {
    console.error('Error updating skills:', error);
    throw error;
  }
}

export async function updateEducation(education: UserEducation[]): Promise<UserEducation[]> {
  try {
    console.log('Updating education with data:', education);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Education update completed:', education);

    return education;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
}

export async function updateProjects(projects: UserProjects[]): Promise<UserProjects[]> {
  try {
    console.log('Updating projects with data:', projects);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Projects update completed:', projects);

    return projects;
  } catch (error) {
    console.error('Error updating projects:', error);
    throw error;
  }
}

export async function updateCertificates(certificateData: {
  user_id: string;
  new_certificates: Array<{
    title: string;
    description: string | null;
    started_at: string | null;
    end_at: string | null;
    link: string | null;
  }>;
  updated_certificates: Array<{
    id: string;
    title: string;
    description: string | null;
    started_at: string | null;
    end_at: string | null;
    link: string | null;
  }>;
  deleted_certificates: string[];
}): Promise<{
  updated: number;
  created: number;
  deleted: number;
  total: number;
}> {
  try {
    console.log('==================== CERTIFICATE FORM DATA ====================');
    console.log('User ID:', certificateData.user_id);
    
    console.log('\n===== NEW CERTIFICATES =====');
    certificateData.new_certificates.forEach((cert, index) => {
      console.log(`Certificate #${index + 1}:`);
      console.log('- Title:', cert.title);
      console.log('- Description:', cert.description);
      console.log('- Started at:', cert.started_at);
      console.log('- End at:', cert.end_at ? cert.end_at : 'No expiry date');
      console.log('- Link:', cert.link);
      console.log('------------------------');
    });
    
    console.log('\n===== UPDATED CERTIFICATES =====');
    certificateData.updated_certificates.forEach((cert, index) => {
      console.log(`Certificate #${index + 1}:`);
      console.log('- ID:', cert.id);
      console.log('- Title:', cert.title);
      console.log('- Description:', cert.description);
      console.log('- Started at:', cert.started_at);
      console.log('- End at:', cert.end_at ? cert.end_at : 'No expiry date');
      console.log('- Link:', cert.link);
      console.log('------------------------');
    });
    
    console.log('\n===== DELETED CERTIFICATES =====');
    console.log(certificateData.deleted_certificates);
    console.log('================================================================');

    // Use the actual API call now
    const response = await fetchWithAuth_PUT<ApiResponse<{
      updated: number;
      created: number;
      deleted: number;
      total: number;
    }>>(
      API_ENDPOINTS.CERTIFICATES,
      certificateData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update certificates');
    }

    console.log('Certificates update completed:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating certificates:', error);
    throw error;
  }
}

export async function updateExperience(experience: UserExperience[]): Promise<UserExperience[]> {
  try {
    console.log('Updating experience with data:', experience);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Experience update completed:', experience);

    return experience;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  try {
    console.log('Using general update with data:', profileData);

    if (profileData.firstName !== undefined || profileData.lastName !== undefined ||
      profileData.description !== undefined || profileData.dob !== undefined) {
      return await updatePersonalInfo(profileData);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('General profile update completed');

    return {
      ...profileData,
    } as UserProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}