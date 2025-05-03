import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { setStatus } from '../slices/jobCreationSlice';
import { fetchWithAuth_POST } from '@/utils/api';

interface JobCreationResponse {
  message: string;
  createdRecruiter: {
    id: string;
    companyId: string;
    recruiterId: string;
    requestedBy: string | null;
    jobCode: string;
    location: string;
    title: string;
    jobDescription: string;
    package: string;
    assignmentLink: string | null;
    endAt: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface JobSkillPayload {
  job_id: string;
  skills: {
    skill_id: string;
    skill_level: 'beginner' | 'intermediate' | 'advanced';
  }[];
  is_active: boolean;
  created_by: string;
}

interface JobSkillResponse {
  message: string;
  success: boolean;
  skillsAdded: number;
}

interface JobQuestionsPayload {
  job_id: string;
  created_by: string;
  is_active: boolean;
  questions: string[];
}

interface JobQuestionsResponse {
  message: string;
  success: boolean;
  questionsAdded: number;
}

export const createJobWithSkillsAndQuestions = createAsyncThunk(
  'jobs/createJob',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setStatus({
        status: 'submitting'
      }));
      
      const state = getState() as RootState;
      const jobCreation = state.jobCreation;
      const recruiter = state.recruiter;
            
      const company_id = recruiter.companyId;
      const recruiter_id = recruiter.userId;
      const created_by = recruiter.userId;
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || '';
      
      const jobPayload = {
        company_id,
        recruiter_id,
        title: jobCreation.title,
        job_code: jobCreation.job_code,
        job_description: jobCreation.job_desc,
        package: jobCreation.package,
        location: jobCreation.location,
        requested_by: jobCreation.requested_by,
        assignment_link: jobCreation.assignment_link || undefined,
        end_at: jobCreation.last_date_to_apply
      };
      
      
      
      const jobResponse = await fetchWithAuth_POST<JobCreationResponse, typeof jobPayload>(
        `${baseUrl}/jobs`,
        jobPayload
      );
      
      const jobId = jobResponse.createdRecruiter.id;
      
            
      if (jobCreation.required_skills.length > 0) {
        const skillsPayload: JobSkillPayload = {
          job_id: jobId,
          skills: jobCreation.required_skills.map(skill => ({
            skill_id: skill.id,
            skill_level: skill.level
          })),
          is_active: true,
          created_by
        };
        
        
        
        await fetchWithAuth_POST<JobSkillResponse, JobSkillPayload>(
          `${baseUrl}/jobs/skills`,
          skillsPayload
        );
        
        
      }
            
      if (jobCreation.additional_questions.length > 0) {
        const questionsPayload: JobQuestionsPayload = {
          job_id: jobId,
          created_by,
          is_active: true,
          questions: jobCreation.additional_questions
        };
        
        
        
        await fetchWithAuth_POST<JobQuestionsResponse, JobQuestionsPayload>(
          `${baseUrl}/jobs/extra-questions`,
          questionsPayload
        );
        
        
      }
            
      dispatch(setStatus({
        status: 'success'
      }));
      
      return {
        jobId,
        message: 'Job created successfully with skills and questions'
      };
    } catch (error: unknown) {
      
      
      let errorMessage = 'Failed to create job';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      dispatch(setStatus({
        status: 'error',
        error: errorMessage
      }));
      
      return rejectWithValue(errorMessage);
    }
  }
);