import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { setStatus, setSubmissionStatus } from '../slices/candidateOnboardingSlice';
import { DateField } from '@/types/candidate_onboarding';

// Simulate API endpoints for reference
const API_ENDPOINTS = {
  PROFILE: '/api/v1/candidate/user-master',
  SKILLS: '/api/v1/candidate/user-skillset',
  EDUCATION: '/api/v1/candidate/user-education',
  CERTIFICATES: '/api/v1/candidate/user-certificates',
  EXPERIENCE: '/api/v1/candidate/user-experience',
  PROJECTS: '/api/v1/candidate/user-projects'
};

// Helper to format dates properly for API
const formatDateForAPI = (dateObj: DateField | null): string => {
    if (!dateObj) return '';

    if (dateObj.year && dateObj.month && dateObj.day) {
        return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}T00:00:00.000Z`;
    }

    if (typeof dateObj === 'string') {
        return dateObj;
    }

    return '';
};

/**
 * Simulate an API call with console logging
 * @param endpoint The API endpoint (for reference only)
 * @param data The data that would be sent to the API
 * @param delay Time in ms to simulate network delay
 * @returns A promise that resolves after the delay with simulated response
 */
async function simulateApiCall<T>(endpoint: string, data: unknown, delay = 1000): Promise<T> {
  console.group(`📡 API Call Simulation to ${endpoint}`);
  console.log('📦 Request Payload:');
  console.log(JSON.stringify(data, null, 2));
  console.groupEnd();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate successful response
  return {
    success: true,
    message: `Step completed successfully at ${new Date().toLocaleTimeString()}`,
    data: data
  } as unknown as T;
}

// Step 1: Username step submission
export const submitUserNameStep = createAsyncThunk(
    'candidate/submitUserName',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        try {
            dispatch(setStatus({ status: 'submitting', error: 'Submitting username...' }));
            dispatch(setSubmissionStatus({ step: 'set-username', status: 'loading' }));

            const profilePayload = {
                user_id: authState.user?.id,
                user_name: onboardingData.userName,
                created_by: authState.user?.id,
                updated_by: authState.user?.id,
            };

            // Simulate API call instead of actual fetch
            const response = await simulateApiCall(
                API_ENDPOINTS.PROFILE,
                profilePayload
            );

            dispatch(setStatus({ status: 'success', error: 'Username submitted successfully.' }));
            dispatch(setSubmissionStatus({ step: 'set-username', status: 'success' }));
            
            return response;
        } catch (error: unknown) {
            const err = error as Error;
            dispatch(setStatus({ status: 'error', error: err.message || 'Failed to submit username' }));
            dispatch(setSubmissionStatus({ step: 'set-username', status: 'error', error: err.message }));
            return rejectWithValue(err.message || 'Failed to submit username');
        }
    }
);

// Step 2: Personal info and skills
export const submitPersonalInfoStep = createAsyncThunk(
    'candidate/submitPersonalInfo',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        try {
            dispatch(setStatus({ status: 'submitting', error: 'Submitting personal info...' }));
            dispatch(setSubmissionStatus({ step: 'personal-info', status: 'loading' }));

            // First update the profile with personal details
            const profilePayload = {
                user_id: authState.user?.id,
                first_name: onboardingData.firstName,
                last_name: onboardingData.lastName,
                dob: formatDateForAPI(onboardingData.dateOfBirth),
                description: onboardingData.description,
                updated_by: authState.user?.id,
            };

            // Simulate profile update API call
            const profileResponse = await simulateApiCall(
                API_ENDPOINTS.PROFILE,
                profilePayload
            );

            // Then submit skills
            const skillsPayload = {
                user_id: authState.user?.id,
                created_by: authState.user?.id,
                updated_by: authState.user?.id,
                skills: onboardingData.skills.map(skill => ({
                    skill_id: skill.id,
                    skill_level: skill.level.toLowerCase()
                }))
            };

            // Simulate skills submission API call
            const skillsResponse = await simulateApiCall(
                API_ENDPOINTS.SKILLS,
                skillsPayload
            );

            dispatch(setStatus({ status: 'success', error: 'Personal info submitted successfully.' }));
            dispatch(setSubmissionStatus({ step: 'personal-info', status: 'success' }));
            
            return { profile: profileResponse, skills: skillsResponse };
        } catch (error: unknown) {
            const err = error as Error;
            dispatch(setStatus({ status: 'error', error: err.message || 'Failed to submit personal info' }));
            dispatch(setSubmissionStatus({ step: 'personal-info', status: 'error', error: err.message }));
            return rejectWithValue(err.message || 'Failed to submit personal info');
        }
    }
);

// Step 3: Education
export const submitEducationStep = createAsyncThunk(
    'candidate/submitEducation',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        try {
            dispatch(setStatus({ status: 'submitting', error: 'Submitting education...' }));
            dispatch(setSubmissionStatus({ step: 'education', status: 'loading' }));

            const educationPayload = {
                user_id: authState.user?.id,
                created_by: authState.user?.id,
                updated_by: authState.user?.id,
                education: (onboardingData.education || []).map(edu => ({
                    degree_id: edu.degree,
                    edu_from: edu.institution,
                    started_at: formatDateForAPI(edu.startDate),
                    end_at: edu.endDate ? formatDateForAPI(edu.endDate) : null
                }))
            };

            // Simulate education API call
            const response = await simulateApiCall(
                API_ENDPOINTS.EDUCATION,
                educationPayload
            );

            dispatch(setStatus({ status: 'success', error: 'Education submitted successfully.' }));
            dispatch(setSubmissionStatus({ step: 'education', status: 'success' }));
            
            return response;
        } catch (error: unknown) {
            const err = error as Error;
            dispatch(setStatus({ status: 'error', error: err.message || 'Failed to submit education' }));
            dispatch(setSubmissionStatus({ step: 'education', status: 'error', error: err.message }));
            return rejectWithValue(err.message || 'Failed to submit education');
        }
    }
);

// Step 4: Certificates
export const submitCertificatesStep = createAsyncThunk(
    'candidate/submitCertificates',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        try {
            dispatch(setStatus({ status: 'submitting', error: 'Submitting certificates...' }));
            dispatch(setSubmissionStatus({ step: 'certificates', status: 'loading' }));

            const certificatesPayload = {
                user_id: authState.user?.id,
                created_by: authState.user?.id,
                updated_by: authState.user?.id,
                certificates: (onboardingData.certificates || []).map(cert => ({
                    title: cert.title,
                    description: cert.description || '',
                    url: cert.externalUrl || null,
                    file_path: cert.fileUrl || null,
                    started_at: formatDateForAPI(cert.startDate),
                    end_at: cert.endDate ? formatDateForAPI(cert.endDate) : null
                }))
            };

            // Simulate certificates API call
            const response = await simulateApiCall(
                API_ENDPOINTS.CERTIFICATES,
                certificatesPayload
            );

            dispatch(setStatus({ status: 'success', error: 'Certificates submitted successfully.' }));
            dispatch(setSubmissionStatus({ step: 'certificates', status: 'success' }));
            
            return response;
        } catch (error: unknown) {
            const err = error as Error;
            dispatch(setStatus({ status: 'error', error: err.message || 'Failed to submit certificates' }));
            dispatch(setSubmissionStatus({ step: 'certificates', status: 'error', error: err.message }));
            return rejectWithValue(err.message || 'Failed to submit certificates');
        }
    }
);

// Step 5: Experience
export const submitExperienceStep = createAsyncThunk(
    'candidate/submitExperience',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        try {
            dispatch(setStatus({ status: 'submitting', error: 'Submitting work experience...' }));
            dispatch(setSubmissionStatus({ step: 'proof-of-work', status: 'loading' }));

            const experiencePayload = {
                user_id: authState.user?.id,
                created_by: authState.user?.id,
                updated_by: authState.user?.id,
                experiences: (onboardingData.proofsOfWork || []).map(exp => ({
                    title: exp.title,
                    company_name: exp.company_name,
                    description: exp.description || '',
                    started_at: formatDateForAPI(exp.startDate),
                    end_at: exp.endDate ? formatDateForAPI(exp.endDate) : null
                }))
            };

            // Simulate experience API call
            const response = await simulateApiCall(
                API_ENDPOINTS.EXPERIENCE,
                experiencePayload
            );

            dispatch(setStatus({ status: 'success', error: 'Work experience submitted successfully.' }));
            dispatch(setSubmissionStatus({ step: 'proof-of-work', status: 'success' }));
            
            return response;
        } catch (error: unknown) {
            const err = error as Error;
            dispatch(setStatus({ status: 'error', error: err.message || 'Failed to submit work experience' }));
            dispatch(setSubmissionStatus({ step: 'proof-of-work', status: 'error', error: err.message }));
            return rejectWithValue(err.message || 'Failed to submit work experience');
        }
    }
);

// Step 6: Projects
export const submitProjectsStep = createAsyncThunk(
    'candidate/submitProjects',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        try {
            dispatch(setStatus({ status: 'submitting', error: 'Submitting projects...' }));
            dispatch(setSubmissionStatus({ step: 'projects', status: 'loading' }));

            const projectsPayload = {
                user_id: authState.user?.id,
                created_by: authState.user?.id,
                updated_by: authState.user?.id,
                projects: (onboardingData.projects || []).map(proj => ({
                    title: proj.title,
                    description: proj.description || '',
                    link: proj.projectLink || '',
                    started_at: formatDateForAPI(proj.startDate),
                    end_at: proj.endDate ? formatDateForAPI(proj.endDate) : null
                }))
            };

            // Simulate projects API call
            const response = await simulateApiCall(
                API_ENDPOINTS.PROJECTS,
                projectsPayload
            );

            dispatch(setStatus({ status: 'success', error: 'Projects submitted successfully.' }));
            dispatch(setSubmissionStatus({ step: 'projects', status: 'success' }));
            
            return response;
        } catch (error: unknown) {
            const err = error as Error;
            dispatch(setStatus({ status: 'error', error: err.message || 'Failed to submit projects' }));
            dispatch(setSubmissionStatus({ step: 'projects', status: 'error', error: err.message }));
            return rejectWithValue(err.message || 'Failed to submit projects');
        }
    }
);