import { RootState } from "../store";
import { getRecruiterFullName } from "../slices/recruiterSlice";

export const selectRecruiterProfile = (state: RootState) => state.recruiter;
export const selectRecruiterLoading = (state: RootState) => state.recruiter.isLoading;
export const selectRecruiterError = (state: RootState) => state.recruiter.error;
export const selectRecruiterFullName = (state: RootState) => getRecruiterFullName(state.recruiter);
export const selectCompanyName = (state: RootState) => state.recruiter.companyName;