import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { setFormStatus } from '../slices/formsSlice';

// Create a job submission thunk
export const submitJobForm = createAsyncThunk(
  'jobs/submitJob',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const jobFormData = state.forms.jobCreation?.data;
      
      // Set status to submitting
      dispatch(setFormStatus({
        formType: 'jobCreation',
        status: 'submitting'
      }));
      
      // Here, you would make your API call to submit the job
      // For now, just simulate an API call
      const response = await new Promise<{ success: boolean, jobId: string }>((resolve) => {
        setTimeout(() => {
          resolve({ success: true, jobId: 'job_' + Date.now() });
        }, 1500);
      });
      
      // Set success status
      dispatch(setFormStatus({
        formType: 'jobCreation',
        status: 'success'
      }));
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create job';
      
      // And then use errorMessage instead of error.message
      dispatch(setFormStatus({
        formType: 'jobCreation',
        status: 'error',
        error: errorMessage
      }));
      
      return rejectWithValue(errorMessage);
    }
  }
);