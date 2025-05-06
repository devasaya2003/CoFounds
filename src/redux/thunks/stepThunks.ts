import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { setStatus, setSubmissionStatus } from '../slices/candidateOnboardingSlice';
import { DateField } from '@/types/candidate_onboarding';
import { fetchWithAuth_POST } from '@/utils/api';

const API_ENDPOINTS = {
    PROFILE: '/api/v1/candidate/profile',
    SKILLS: '/api/v1/candidate/skills',
    EDUCATION: '/api/v1/candidate/education',
    CERTIFICATES: '/api/v1/candidate/certificates',
    EXPERIENCE: '/api/v1/candidate/experience',
    PROJECTS: '/api/v1/candidate/projects'
};

const formatDateForAPI = (dateObj: DateField | null): string | null => {
    if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day) {
        return null;
    }

    const year = parseInt(dateObj.year, 10);
    const month = parseInt(dateObj.month, 10);
    const day = parseInt(dateObj.day, 10);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return null;
    }
    
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
    }

    // Changed format: remove the time part that could cause timezone issues
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

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

    await new Promise(resolve => setTimeout(resolve, delay));

    return {
        success: true,
        message: `Step completed successfully at ${new Date().toLocaleTimeString()}`,
        data: data
    } as unknown as T;
}

export const submitUserNameStep = createAsyncThunk(
    'candidate/submitUserName',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        try {
            dispatch(setStatus({ status: 'submitting' }));
            dispatch(setSubmissionStatus({ step: 'set-username', status: 'loading' }));

            const profilePayload = {
                user_id: authState.user?.id,
                user_name: onboardingData.userName
            };

            const response = await fetchWithAuth_POST(
                API_ENDPOINTS.PROFILE,
                profilePayload
            );

            dispatch(setStatus({ status: 'success' }));
            dispatch(setSubmissionStatus({ step: 'set-username', status: 'success' }));

            return response;
        } catch (error: unknown) {
            const err = error as Error;
            console.error('Error updating username:', err);

            dispatch(setStatus({ status: 'error', error: err.message || 'Failed to submit username' }));
            dispatch(setSubmissionStatus({
                step: 'set-username',
                status: 'error',
                error: err.message
            }));

            return rejectWithValue(err.message || 'Failed to submit username');
        }
    }
);

export const submitPersonalInfoStep = createAsyncThunk(
    'candidate/submitPersonalInfo',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        try {
            dispatch(setStatus({ status: 'submitting', error: 'Submitting personal info...' }));
            dispatch(setSubmissionStatus({ step: 'personal-info', status: 'loading' }));

            const profilePayload = {
                user_id: authState.user?.id,
                first_name: onboardingData.firstName,
                last_name: onboardingData.lastName,
                dob: formatDateForAPI(onboardingData.dateOfBirth),
                description: onboardingData.description,
                updated_by: authState.user?.id,
            };

            console.log("DOB: ", profilePayload.dob);

            const profileResponse = await fetchWithAuth_POST(
                API_ENDPOINTS.PROFILE,
                profilePayload
            );

            const skillsPayload = {
                user_id: authState.user?.id,
                skills: onboardingData.skills.map(skill => ({
                  skill_id: skill.id,
                  skill_level: skill.level.toLowerCase()
                }))
              };
              
              
              const skillsResponse = await fetchWithAuth_POST(
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

export const submitEducationStep = createAsyncThunk(
    'candidate/submitEducation',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;        
        const DEV_MODE = process.env.NODE_ENV === 'development';
        const fallbackUserId = DEV_MODE ? 'dev-test-user-123' : null;
        const userId = authState.user?.id || fallbackUserId;
        
        if (!userId) {
            return rejectWithValue("Authentication required: No user ID available");
        }

        try {
            dispatch(setStatus({ status: 'submitting' }));
            dispatch(setSubmissionStatus({ step: 'education', status: 'loading' }));
            
            const educationPayload = {
                user_id: userId,
                education: (onboardingData.education || []).map(edu => ({
                    degree_id: edu.degree,
                    edu_from: edu.institution,
                    started_at: formatDateForAPI(edu.startDate),
                    end_at: edu.endDate ? formatDateForAPI(edu.endDate) : null
                }))
            };
            
            const response = await fetchWithAuth_POST(
                API_ENDPOINTS.EDUCATION,
                educationPayload
            );

            dispatch(setStatus({ status: 'success' }));
            dispatch(setSubmissionStatus({ step: 'education', status: 'success' }));

            return response;
        } catch (error: unknown) {
            const err = error as Error;
            console.error('Error updating education:', err);
            
            dispatch(setStatus({ status: 'error', error: err.message || 'Failed to submit education' }));
            dispatch(setSubmissionStatus({ 
                step: 'education', 
                status: 'error', 
                error: err.message 
            }));
            
            return rejectWithValue(err.message || 'Failed to submit education');
        }
    }
);

export const submitCertificatesStep = createAsyncThunk(
    'candidate/submitCertificates',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        const DEV_MODE = process.env.NODE_ENV === 'development';
        const fallbackUserId = DEV_MODE ? 'dev-test-user-123' : null;
        const userId = authState.user?.id || fallbackUserId;
        
        if (!userId) {
            return rejectWithValue("Authentication required: No user ID available");
        }

        try {
            dispatch(setStatus({ status: 'submitting' }));
            dispatch(setSubmissionStatus({ step: 'certificates', status: 'loading' }));

            if (onboardingData.certificates.length === 0) {
                
                                
                dispatch(setStatus({ status: 'success' }));
                dispatch(setSubmissionStatus({ step: 'certificates', status: 'success' }));
                
                return { success: true, message: "Step completed - no certificates to submit" };
            }
            
            const tempFiles = onboardingData.certificates
                .filter(cert => cert.fileUrl && cert.tempFileId)
                .map(cert => ({ 
                    tempFileId: cert.tempFileId, 
                    certificateId: cert.id 
                }));
                
            const finalizedFiles: Record<string, string> = {};
                
            if (tempFiles.length > 0) {                
                interface FileUploadResult {
                    originalId: string;
                    publicUrl: string;
                    success: boolean;
                    certificateId?: string;
                }
                
                const finalizationResponse = await fetchWithAuth_POST('/api/v1/upload/finalize', {
                    userId,
                    files: tempFiles
                }) as { results?: Array<FileUploadResult> };
                                
                if (finalizationResponse && finalizationResponse.results) {                    
                    finalizationResponse.results.forEach((result: FileUploadResult) => {
                        if (result.success && result.certificateId) {                            
                            finalizedFiles[result.certificateId] = result.publicUrl;
                            
                        }
                    });
                }
            }
            
            const certificatesPayload = {
                user_id: userId,
                created_by: userId,
                updated_by: userId,
                certificates: (onboardingData.certificates || []).map(cert => {                    
                    const finalFileUrl = finalizedFiles[cert.id] || cert.fileUrl || null;
   
                    return {
                        title: cert.title,
                        description: cert.description || '',
                        url: cert.externalUrl || null,                        file_path: finalFileUrl, 
                        started_at: formatDateForAPI(cert.startDate),
                        end_at: cert.endDate ? formatDateForAPI(cert.endDate) : null
                    };
                })
            };
            
            const response = await fetchWithAuth_POST(
                API_ENDPOINTS.CERTIFICATES,
                certificatesPayload
            );
          
            dispatch(setStatus({ status: 'success' }));
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

export const submitExperienceStep = createAsyncThunk(
    'candidate/submitExperience',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        const DEV_MODE = process.env.NODE_ENV === 'development';
        const fallbackUserId = DEV_MODE ? 'dev-test-user-123' : null;
        const userId = authState.user?.id || fallbackUserId;
        
        if (!userId) {
            return rejectWithValue("Authentication required: No user ID available");
        }

        try {
            dispatch(setStatus({ status: 'submitting' }));
            dispatch(setSubmissionStatus({ step: 'proof-of-work', status: 'loading' }));
            
            if (onboardingData.proofsOfWork.length === 0) {
                dispatch(setStatus({ 
                    status: 'error', 
                    error: 'You must add at least one work experience to continue' 
                }));
                dispatch(setSubmissionStatus({ 
                    step: 'proof-of-work', 
                    status: 'error', 
                    error: 'At least one work experience is required' 
                }));
                
                return rejectWithValue("At least one work experience is required");
            }
            
            const experiencePayload = {
                user_id: userId,
                experiences: (onboardingData.proofsOfWork || []).map(exp => ({
                    title: exp.title,
                    company_name: exp.company_name,
                    description: exp.description || '',
                    started_at: formatDateForAPI(exp.startDate),
                    end_at: exp.endDate ? formatDateForAPI(exp.endDate) : null
                }))
            };
            
            const response = await fetchWithAuth_POST(
                API_ENDPOINTS.EXPERIENCE,
                experiencePayload
            );

            dispatch(setStatus({ status: 'success' }));
            dispatch(setSubmissionStatus({ step: 'proof-of-work', status: 'success' }));

            return response;
        } catch (error: unknown) {
            const err = error as Error;
            console.error('Error updating experiences:', err);
            
            dispatch(setStatus({ status: 'error', error: err.message || 'Failed to submit work experience' }));
            dispatch(setSubmissionStatus({ 
                step: 'proof-of-work', 
                status: 'error', 
                error: err.message 
            }));
            
            return rejectWithValue(err.message || 'Failed to submit work experience');
        }
    }
);

export const submitProjectsStep = createAsyncThunk(
    'candidate/submitProjects',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        // Use development fallback for consistency with other thunks
        const DEV_MODE = process.env.NODE_ENV === 'development';
        const fallbackUserId = DEV_MODE ? 'dev-test-user-123' : null;
        const userId = authState.user?.id || fallbackUserId;
        
        if (!userId) {
            return rejectWithValue("Authentication required: No user ID available");
        }

        try {
            dispatch(setStatus({ status: 'submitting' }));
            dispatch(setSubmissionStatus({ step: 'projects', status: 'loading' }));

            // Check if there are any projects to submit
            if (onboardingData.projects.length === 0) {
                
                
                // Mark step as success without API call
                dispatch(setStatus({ status: 'success' }));
                dispatch(setSubmissionStatus({ step: 'projects', status: 'success' }));
                
                return { success: true, message: "Step completed - no projects to submit" };
            }

            const projectsPayload = {
                user_id: userId,
                projects: (onboardingData.projects || []).map(proj => ({
                    title: proj.title,
                    description: proj.description || '',
                    link: proj.projectLink || '',
                    started_at: formatDateForAPI(proj.startDate),
                    end_at: proj.endDate ? formatDateForAPI(proj.endDate) : null
                }))
            };

            // Use real API call instead of simulation
            const response = await fetchWithAuth_POST(
                API_ENDPOINTS.PROJECTS,
                projectsPayload
            );

            dispatch(setStatus({ status: 'success' }));
            dispatch(setSubmissionStatus({ step: 'projects', status: 'success' }));

            return response;
        } catch (error: unknown) {
            const err = error as Error;
            console.error('Error updating projects:', err);
            
            dispatch(setStatus({ status: 'error', error: err.message || 'Failed to submit projects' }));
            dispatch(setSubmissionStatus({ 
                step: 'projects', 
                status: 'error', 
                error: err.message 
            }));
            
            return rejectWithValue(err.message || 'Failed to submit projects');
        }
    }
);