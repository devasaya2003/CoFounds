import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_POST, fetchWithAuth_DELETE, fetchWithAuth_PUT } from "@/utils/api";

// Interface for certificate model
export interface CandidateCertificate {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  filePath: string | null;
  startedAt: string | null;
  endAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for adding certificate
export interface AddCandidateCertificatePayload {
  userId: string;
  title: string;
  description?: string | null;
  link?: string | null;
  filePath?: string | null;
  startedAt?: string | null;
  endAt?: string | null;
}

// Interface for updating certificate
export interface UpdateCandidateCertificatePayload extends AddCandidateCertificatePayload {
  certificateId: string;
}

/**
 * Fetch candidate certificates
 */
export const fetchCandidateCertificates = createAsyncThunk(
  "candidate/fetchCertificates",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<CandidateCertificate[]>(
        `${baseUrl}/candidate/certificates/user/${userId}`
      );
      
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch candidate certificates");
    }
  }
);

/**
 * Add new certificate
 */
export const addCandidateCertificate = createAsyncThunk(
  "candidate/addCertificate",
  async (certificateData: AddCandidateCertificatePayload, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_POST(
        '/api/v1/candidate/certificates',
        {
          user_id: certificateData.userId,
          title: certificateData.title,
          description: certificateData.description,
          link: certificateData.link,
          file_path: certificateData.filePath,
          started_at: certificateData.startedAt,
          end_at: certificateData.endAt
        }
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to add certificate");
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add certificate");
    }
  }
);

/**
 * Update certificate
 */
export const updateCandidateCertificate = createAsyncThunk(
  "candidate/updateCertificate",
  async (certificateData: UpdateCandidateCertificatePayload, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_PUT(
        `/api/v1/candidate/certificates/${certificateData.certificateId}`,
        {
          user_id: certificateData.userId,
          title: certificateData.title,
          description: certificateData.description,
          link: certificateData.link,
          file_path: certificateData.filePath,
          started_at: certificateData.startedAt,
          end_at: certificateData.endAt
        }
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to update certificate");
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update certificate");
    }
  }
);

/**
 * Delete certificate
 */
export const deleteCandidateCertificate = createAsyncThunk(
  "candidate/deleteCertificate",
  async (certificateId: string, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth_DELETE(
        `/api/v1/candidate/certificates/${certificateId}`
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to delete certificate");
      }
      
      return certificateId;
    } catch (error) {
      return rejectWithValue("Failed to delete certificate");
    }
  }
);
