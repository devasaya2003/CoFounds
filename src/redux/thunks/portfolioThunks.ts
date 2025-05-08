import { createAsyncThunk } from '@reduxjs/toolkit';
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

const mockUpdateResponse = (data: Partial<UserProfile>): UserProfile => {
    return {
        id: 'mock-id',
        email: 'user@example.com',
        userName: 'username',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        description: data.description || '',
        dob: data.dob || null,
        skillset: data.skillset || [],
        education: data.education || [],
        projects: data.projects || [],
        certificates: data.certificates || [],
        experience: data.experience || [],
        role: 'candidate',
        verified: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null,
        updatedBy: null,
        phone: data.phone || null,
        profileImage: data.profileImage || null
    };
};

export const updateUserProfileThunk = createAsyncThunk(
    'portfolio/updateProfile',
    async (profileData: Partial<UserProfile>, { getState, rejectWithValue }) => {
        try {
            console.group('📝 Development Mode: Portfolio Update');
            console.log('----------------------------------------');
            console.log('PROFILE DATA TO BE SENT:');
            console.log(JSON.stringify(profileData, null, 2));

            console.log('----------------------------------------');
            console.log('DATE OF BIRTH DEBUGGING:');
            console.log(`DOB value: ${profileData.dob || 'NULL'}`);

            if (profileData.dob) {
                const isValidDate = !isNaN(new Date(profileData.dob).getTime());
                console.log(`Is valid date? ${isValidDate}`);

                if (isValidDate) {
                    const parsedDate = new Date(profileData.dob);
                    console.log(`Year: ${parsedDate.getFullYear()}`);
                    console.log(`Month: ${parsedDate.getMonth() + 1}`);
                    console.log(`Day: ${parsedDate.getDate()}`);
                } else {
                    console.error('⚠️ INVALID DATE FORMAT!');
                }
            } else {
                console.warn('⚠️ No date of birth provided in update data');
            }

            console.log('----------------------------------------');

            await new Promise(resolve => setTimeout(resolve, 800));

            const mockResponse = mockUpdateResponse(profileData);

            console.log('MOCK API RESPONSE:');
            console.log(JSON.stringify(mockResponse, null, 2));
            console.log('----------------------------------------');
            console.groupEnd();

            return mockResponse;
        } catch (error) {
            console.error('❌ Portfolio update simulation failed:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile');
        }
    }
);