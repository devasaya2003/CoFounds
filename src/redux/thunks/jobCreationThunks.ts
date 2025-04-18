import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { setStatus } from '../slices/jobCreationSlice';
import { fetchWithAuth_POST } from '@/utils/api';

// Interface for the job creation response
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

// Interface for the job skills payload
interface JobSkillPayload {
  job_id: string;
  skills: {
    skill_id: string;
    skill_level: 'beginner' | 'intermediate' | 'advanced';
  }[];
  is_active: boolean;
  created_by: string;
}

// Interface for the job skills response
interface JobSkillResponse {
  message: string;
  success: boolean;
  skillsAdded: number;
}

// Interface for the job questions payload
interface JobQuestionsPayload {
  job_id: string;
  created_by: string;
  is_active: boolean;
  questions: string[];
}

// Interface for the job questions response
interface JobQuestionsResponse {
  message: string;
  success: boolean;
  questionsAdded: number;
}

// Create a job with skills and questions thunk
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
      
      // Get IDs from Redux state instead of parameters
      const company_id = recruiter.companyId;
      const recruiter_id = recruiter.userId;
      const created_by = recruiter.userId;
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || '';

      // Step 1: Create job
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
      
      console.log('Creating job with payload:', jobPayload);
      
      const jobResponse = await fetchWithAuth_POST<JobCreationResponse, typeof jobPayload>(
        `${baseUrl}/jobs`,
        jobPayload
      );
      
      const jobId = jobResponse.createdRecruiter.id;
      console.log('Job created with ID:', jobId);
      
      // Step 2: Associate skills with job - now using skill_level from each skill
      if (jobCreation.required_skills.length > 0) {
        const skillsPayload: JobSkillPayload = {
          job_id: jobId,
          skills: jobCreation.required_skills.map(skill => ({
            skill_id: skill.id,
            skill_level: skill.skill_level // Use the stored skill level
          })),
          is_active: true,
          created_by
        };
        
        console.log('Adding skills with payload:', skillsPayload);
        
        await fetchWithAuth_POST<JobSkillResponse, JobSkillPayload>(
          `${baseUrl}/jobs/skills`,
          skillsPayload
        );
        
        console.log('Skills added successfully');
      }
      
      // Step 3: Add additional questions
      if (jobCreation.additional_questions.length > 0) {
        const questionsPayload: JobQuestionsPayload = {
          job_id: jobId,
          created_by,
          is_active: true,
          questions: jobCreation.additional_questions
        };
        
        console.log('Adding questions with payload:', questionsPayload);
        
        await fetchWithAuth_POST<JobQuestionsResponse, JobQuestionsPayload>(
          `${baseUrl}/jobs/extra-questions`,
          questionsPayload
        );
        
        console.log('Questions added successfully');
      }
      
      // All steps completed successfully
      dispatch(setStatus({
        status: 'success'
      }));
      
      return {
        jobId,
        message: 'Job created successfully with skills and questions'
      };
    } catch (error: unknown) {
      console.error('Error creating job:', error);
      
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