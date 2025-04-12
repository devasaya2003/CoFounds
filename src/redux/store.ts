import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import jobsReducer from "./slices/jobsSlice";
import recruiterReducer from "./slices/recruiterSlice";
import companyReducer from "./slices/companySlice"
import skillReducer from "./slices/skillSlice";
import degreeReducer from "./slices/degreeSlice";
import formsReducer from './slices/formsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    recruiter: recruiterReducer,
    company: companyReducer,
    skill: skillReducer,
    degree: degreeReducer,
    forms: formsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;