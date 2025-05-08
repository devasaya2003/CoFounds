import { fetchWithAuth_GET, fetchWithAuth_POST, fetchWithAuth_PUT } from '@/utils/api';
import { UserMaster, UserSkillset, UserProjects, UserCertificates, UserEducation, UserExperience, SkillMaster, DegreeMaster } from '@prisma/client';

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

export async function updatePersonalInfo(personalData: Partial<UserProfile>): Promise<UserProfile> {
  try {
    console.log('Updating personal info with data:', personalData);

    const formattedDate = personalData.dob ? formatDateForAPI(personalData.dob) : null;
    console.log("Formatted date for API:", formattedDate);

    const profilePayload = {
      user_id: personalData.id,
      first_name: personalData.firstName,
      last_name: personalData.lastName,
      dob: formattedDate,
      description: personalData.description,
      updated_by: personalData.id,
    };

    console.log("DOB:", profilePayload.dob);
    console.log("Sending payload to API:", profilePayload);

    const profileResponse = await fetchWithAuth_POST(
      API_ENDPOINTS.PROFILE,
      profilePayload
    );

    console.log("API response:", profileResponse);

    return {
      ...personalData,
    } as UserProfile;
  } catch (error) {
    console.error('Error updating personal info:', error);
    throw error;
  }
}

export async function updateSkills(skills: UserSkillset[]): Promise<UserSkillset[]> {
  try {
    console.log('Updating skills with data:', skills);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Skills update completed:', skills);

    return skills;
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

export async function updateCertificates(certificates: UserCertificates[]): Promise<UserCertificates[]> {
  try {
    console.log('Updating certificates with data:', certificates);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Certificates update completed:', certificates);

    return certificates;
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