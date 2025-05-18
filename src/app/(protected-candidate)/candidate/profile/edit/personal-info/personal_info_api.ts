import { fetchWithAuth_GET, fetchWithAuth_POST } from '@/utils/api';

// Define interface for personal info data
export interface PersonalInfoData {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  description?: string | null;
  dob?: Date | null;
  profileImage?: string | null;
}

// Helper function to format date for API
const formatDateForAPI = (dateObj: Date | null): string | null => {
  if (!dateObj) {
    return null;
  }

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// GET function to fetch personal info
export async function getPersonalInfo(userId: string): Promise<PersonalInfoData> {
  try {
    console.log(`Fetching personal info for user: ${userId}`);
    
    // Use the actual API endpoint
    const response = await fetchWithAuth_GET<PersonalInfoData>(`/api/v1/candidate/profile/${userId}`);
    
    if (!response) {
      throw new Error('Failed to fetch personal info');
    }
    
    // Map the response to our expected format
    const personalInfo: PersonalInfoData = {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      userName: response.userName,
      description: response.description,
      dob: response.dob ? new Date(response.dob) : null,
      profileImage: response.profileImage,
    };
    
    console.log('Personal info fetched successfully:', personalInfo);
    return personalInfo;
  } catch (error) {
    console.error('Error fetching personal info:', error);
    throw error;
  }
}

// Function to update personal info
export async function updatePersonalInfo(personalData: PersonalInfoData): Promise<PersonalInfoData> {
  try {
    const formattedDate = personalData.dob ? formatDateForAPI(personalData.dob) : null;

    const profilePayload = {
      user_id: personalData.id,
      user_name: personalData.userName,
      first_name: personalData.firstName,
      last_name: personalData.lastName,
      dob: formattedDate,
      description: personalData.description,
      profile_image: personalData.profileImage,
      updated_by: personalData.id,
    };

    console.log('Updating personal info with payload:', profilePayload);

    // Make the actual API call
    await fetchWithAuth_POST(
      '/api/v1/candidate/profile',
      profilePayload
    );

    // Fetch the fresh data after updating
    const updatedData = await getPersonalInfo(personalData.id);
    console.log('Personal info updated and refreshed successfully');
    
    return updatedData;
  } catch (error) {
    console.error('Error updating personal info:', error);
    throw error;
  }
}
