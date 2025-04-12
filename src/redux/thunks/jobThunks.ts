import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { setFormStatus } from '../slices/formsSlice';

// Create a job submission thunk
export const submitJobForm = createAsyncThunk(
  'jobs/submitJob',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      // Get the job form data from the redux store
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
    } catch (error: any) {
      // Set error status
      dispatch(setFormStatus({
        formType: 'jobCreation',
        status: 'error',
        error: error.message || 'Failed to create job'
      }));
      
      return rejectWithValue(error.message || 'Failed to create job');
    }
  }
);