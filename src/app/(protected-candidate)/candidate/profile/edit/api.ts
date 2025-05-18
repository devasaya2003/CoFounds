import { fetchWithAuth_GET, fetchWithAuth_POST, fetchWithAuth_PUT } from '@/utils/api';
import { UserMaster, UserSkillset, UserProjects, UserCertificates, UserEducation, UserExperience, SkillMaster, DegreeMaster } from '@prisma/client';
import { ProjectUpdatePayload } from './components/project/types';
import { updatePersonalInfo as updatePersonalInfoFromModule } from './personal-info/personal_info_api';

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

export async function getUserProfile(id: string, forceRefresh = false): Promise<UserProfile> {
  const cacheKey = `profile_${id}`;
  const now = Date.now();

  if (!forceRefresh &&
      profileCache[cacheKey] &&
      now - profileCache[cacheKey].timestamp < CACHE_TTL) {
    console.log(`Using cached profile for ${id}`);
    return profileCache[cacheKey].data;
  }

  console.log(`Fetching fresh profile data for ${id}`);
  try {
    const response = await fetchWithAuth_GET<{
      success: boolean,
      data: UserProfile
    }>(`/api/v1/candidate/summary/${id}`);
    if (!response) {
      throw new Error('Failed to fetch user profile');
    }

    profileCache[cacheKey] = {
      data: response.data,
      timestamp: now
    };

    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Add this function to explicitly clear cache for a user
export function clearUserProfileCache(id: string) {
  const cacheKey = `profile_${id}`;
  if (profileCache[cacheKey]) {
    console.log(`Clearing cache for ${id}`);
    delete profileCache[cacheKey];
    return true;
  }
  return false;
}

export async function updatePersonalInfo(personalData: Partial<UserProfile>): Promise<UserProfile> {
  // Delegate to the specialized module
  return await updatePersonalInfoFromModule(personalData as any);
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

// Add this to api.ts or wherever your API functions are defined
export async function updateEducation(educationData: {
  user_id: string;
  new_education: Array<{
    institution: string;
    degree_id: string;
    started_at: string | null;
    end_at: string | null;
  }>;
  updated_education: Array<{
    id: string;
    institution: string;
    degree_id: string;
    started_at: string | null;
    end_at: string | null;
  }>;
  deleted_education: string[];
}): Promise<{
  updated: number;
  created: number;
  deleted: number;
  total: number;
}> {
  try {
    console.log('==================== EDUCATION FORM DATA ====================');
    console.log('User ID:', educationData.user_id);
    
    console.log('\n===== NEW EDUCATION =====');
    educationData.new_education.forEach((edu, index) => {
      console.log(`Education #${index + 1}:`);
      console.log('- Institution:', edu.institution);
      console.log('- Degree ID:', edu.degree_id);
      console.log('- Started at:', edu.started_at);
      console.log('- End at:', edu.end_at ? edu.end_at : 'Currently studying');
    });
    
    console.log('\n===== UPDATED EDUCATION =====');
    educationData.updated_education.forEach((edu, index) => {
      console.log(`Education #${index + 1}:`);
      console.log('- ID:', edu.id);
      console.log('- Institution:', edu.institution);
      console.log('- Degree ID:', edu.degree_id);
      console.log('- Started at:', edu.started_at);
      console.log('- End at:', edu.end_at ? edu.end_at : 'Currently studying');
    });
    
    console.log('\n===== DELETED EDUCATION =====');
    console.log(educationData.deleted_education);
    console.log('================================================================');

    const response = await fetchWithAuth_PUT<ApiResponse<{
      updated: number;
      created: number;
      deleted: number;
      total: number;
    }>>(
      API_ENDPOINTS.EDUCATION,
      educationData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update education');
    }

    console.log('Education update completed:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
}

// Add to your API file
export async function updateProjects(projectsData: ProjectUpdatePayload): Promise<{
  updated: number;
  created: number;
  deleted: number;
  total: number;
}> {
  try {
    console.log('==================== PROJECTS FORM DATA ====================');
    console.log('User ID:', projectsData.user_id);
    
    console.log('\n===== NEW PROJECTS =====');
    projectsData.new_projects.forEach((proj, index) => {
      console.log(`Project #${index + 1}:`);
      console.log('- Title:', proj.title);
      console.log('- Description:', proj.description);
      console.log('- Link:', proj.link);
      console.log('- Started at:', proj.started_at);
      console.log('- End at:', proj.end_at ? proj.end_at : 'Currently building');
    });
    
    console.log('\n===== UPDATED PROJECTS =====');
    projectsData.updated_projects.forEach((proj, index) => {
      console.log(`Project #${index + 1}:`);
      console.log('- ID:', proj.id);
      console.log('- Title:', proj.title);
      console.log('- Description:', proj.description);
      console.log('- Link:', proj.link);
      console.log('- Started at:', proj.started_at);
      console.log('- End at:', proj.end_at ? proj.end_at : 'Currently building');
    });
    
    console.log('\n===== DELETED PROJECTS =====');
    console.log(projectsData.deleted_projects);
    console.log('================================================================');

    const response = await fetchWithAuth_PUT<ApiResponse<{
      updated: number;
      created: number;
      deleted: number;
      total: number;
    }>>(
      API_ENDPOINTS.PROJECTS,
      projectsData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update projects');
    }

    console.log('Projects update completed:', response.data);
    return response.data;
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

export async function updateProofOfWork(experienceData: {
  user_id: string;
  new_experiences: Array<{
    title: string;
    company: string | null;
    description: string | null;
    started_at: string | null;
    end_at: string | null;
    is_community_work: boolean;
  }>;
  updated_experiences: Array<{
    id: string;
    title: string;
    company: string | null;
    description: string | null;
    started_at: string | null;
    end_at: string | null;
    is_community_work: boolean;
  }>;
  deleted_experiences: string[];
}): Promise<{
  updated: number;
  created: number;
  deleted: number;
  total: number;
}> {
  try {
    console.log('==================== PROOF OF WORK FORM DATA ====================');
    console.log('User ID:', experienceData.user_id);
    
    console.log('\n===== NEW EXPERIENCES =====');
    experienceData.new_experiences.forEach((exp, index) => {
      console.log(`Experience #${index + 1}:`);
      console.log('- Title:', exp.title);
      console.log('- Company:', exp.company);
      console.log('- Description:', exp.description);
      console.log('- Started at:', exp.started_at);
      console.log('- End at:', exp.end_at ? exp.end_at : 'Currently working');
      console.log('- Is Community Work:', exp.is_community_work);
      console.log('------------------------');
    });
    
    console.log('\n===== UPDATED EXPERIENCES =====');
    experienceData.updated_experiences.forEach((exp, index) => {
      console.log(`Experience #${index + 1}:`);
      console.log('- ID:', exp.id);
      console.log('- Title:', exp.title);
      console.log('- Company:', exp.company);
      console.log('- Description:', exp.description);
      console.log('- Started at:', exp.started_at);
      console.log('- End at:', exp.end_at ? exp.end_at : 'Currently working');
      console.log('- Is Community Work:', exp.is_community_work);
      console.log('------------------------');
    });
    
    console.log('\n===== DELETED EXPERIENCES =====');
    console.log(experienceData.deleted_experiences);
    console.log('================================================================');

    const response = await fetchWithAuth_PUT<ApiResponse<{
      updated: number;
      created: number;
      deleted: number;
      total: number;
    }>>(
      API_ENDPOINTS.EXPERIENCE,
      experienceData
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update proof of work');
    }

    console.log('Proof of work update completed:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating proof of work:', error);
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