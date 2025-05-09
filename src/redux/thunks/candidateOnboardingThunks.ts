import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithAuth_POST } from '@/utils/api';
import { RootState } from '../store';
import { setStatus } from '../slices/candidateOnboardingSlice';
import { DateField } from '@/types/candidate_onboarding';

const BASE_URL = "/api/v1";
const API_BASE_URL = `${BASE_URL}/api/v1/candidate`;
const PROFILE_POST_URL = `${API_BASE_URL}/user-master`;
const SKILLS_POST_URL = `${API_BASE_URL}/user-skillset`;
const EDUCATION_POST_URL = `${API_BASE_URL}/user-education`;
const CERTIFICATES_POST_URL = `${API_BASE_URL}/user-certificates`;
const EXPERIENCE_POST_URL = `${API_BASE_URL}/user-experience`;
const PROJECTS_POST_URL = `${API_BASE_URL}/user-projects`;

interface ProfileResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;    
  };
}

interface SkillsetResponse {
  success: boolean;
  message: string;
  skillsAdded: number;
}

interface EducationResponse {
  success: boolean;
  message: string;
  educationAdded: number;
}

interface CertificateResponse {
  success: boolean;
  message: string;
  certificatesAdded: number;
}

interface ExperienceResponse {
  success: boolean;
  message: string;
  experiencesAdded: number;
}

interface ProjectResponse {
  success: boolean;
  message: string;
  projectsAdded: number;
}

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
 * Thunk to submit candidate onboarding data in sequential API calls
 */
export const submitCandidateOnboarding = createAsyncThunk(
    'candidate/submitOnboarding',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as RootState;
        const authState = state.auth;
        const onboardingData = state.candidateOnboarding;

        try {            
            dispatch(setStatus({ status: 'submitting', error: 'Submitting profile...' }));

            const profilePayload = {
                user_id: authState.user?.id,
                user_name: onboardingData.userName,
                first_name: onboardingData.firstName,
                last_name: onboardingData.lastName,
                dob: formatDateForAPI(onboardingData.dateOfBirth),
                description: onboardingData.description,
                created_by: authState.user?.id,
                updated_by: authState.user?.id,
            };

            const userMasterResponse = await fetchWithAuth_POST<ProfileResponse, typeof profilePayload>(
                PROFILE_POST_URL,
                profilePayload
            );

            dispatch(setStatus({ status: 'success', error: 'Profile submitted successfully.' }));
            
            dispatch(setStatus({ status: 'submitting', error: 'Submitting skills...' }));

            const skillsPayload = {
                user_id: authState.user?.id,
                created_by: authState.user?.id,
                updated_by: authState.user?.id,
                skills: onboardingData.skills.map(skill => ({
                    skill_id: skill.id,
                    skill_level: skill.level.toLowerCase()
                }))
            };

            const userSkillsetResponse = await fetchWithAuth_POST<SkillsetResponse, typeof skillsPayload>(
                SKILLS_POST_URL,
                skillsPayload
            );

            dispatch(setStatus({ status: 'success', error: 'Skills submitted successfully.' }));
            
            dispatch(setStatus({ status: 'submitting', error: 'Submitting education...' }));

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

            const userEducationResponse = await fetchWithAuth_POST<EducationResponse, typeof educationPayload>(
                EDUCATION_POST_URL,
                educationPayload
            );

            dispatch(setStatus({ status: 'success', error: 'Education submitted successfully.' }));
            
            dispatch(setStatus({ status: 'submitting', error: 'Submitting certificates...' }));

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

            const userCertificatesResponse = await fetchWithAuth_POST<CertificateResponse, typeof certificatesPayload>(
                CERTIFICATES_POST_URL,
                certificatesPayload
            );

            dispatch(setStatus({ status: 'success', error: 'Certificates submitted successfully.' }));
            
            dispatch(setStatus({ status: 'submitting', error: 'Submitting experience...' }));

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

            const userExperienceResponse = await fetchWithAuth_POST<ExperienceResponse, typeof experiencePayload>(
                EXPERIENCE_POST_URL,
                experiencePayload
            );

            dispatch(setStatus({ status: 'success', error: 'Experience submitted successfully.' }));
            
            dispatch(setStatus({ status: 'submitting', error: 'Submitting projects...' }));

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

            const userProjectsResponse = await fetchWithAuth_POST<ProjectResponse, typeof projectsPayload>(
                PROJECTS_POST_URL,
                projectsPayload
            );

            dispatch(setStatus({ status: 'success', error: 'Projects submitted successfully.' }));
            
            dispatch(setStatus({ status: 'success', error: 'Onboarding submission complete.' }));

            return {
                success: true,
                data: {
                    profile: userMasterResponse,
                    skills: userSkillsetResponse,
                    education: userEducationResponse,
                    certificates: userCertificatesResponse,
                    experience: userExperienceResponse,
                    projects: userProjectsResponse
                }
            };

        } catch (error: unknown) {            
            const err = error as Error;
            
            const failedStep = determineFailedStep(err);

            dispatch(setStatus({
                status: 'error',
                error: `Error in ${failedStep}: ${err.message || 'An error occurred'}`
            }));

            return rejectWithValue({
                step: failedStep,
                message: err.message || 'Failed to submit onboarding data',
                error: err
            });
        }
    }
);

interface ErrorWithUrl extends Error {
    url?: string;
}

function determineFailedStep(error: Error): string {
    const errorWithUrl = error as ErrorWithUrl;

    if (errorWithUrl.url) {
        if (errorWithUrl.url.includes(PROFILE_POST_URL)) return 'profile';
        if (errorWithUrl.url.includes(SKILLS_POST_URL)) return 'skills';
        if (errorWithUrl.url.includes(EDUCATION_POST_URL)) return 'education';
        if (errorWithUrl.url.includes(CERTIFICATES_POST_URL)) return 'certificates';
        if (errorWithUrl.url.includes(EXPERIENCE_POST_URL)) return 'experience';
        if (errorWithUrl.url.includes(PROJECTS_POST_URL)) return 'projects';
    }

    return 'unknown';
}