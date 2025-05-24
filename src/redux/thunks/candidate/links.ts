import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_PUT } from "@/utils/api";

// Interface for link model
export interface CandidateLink {
  id: string;
  linkTitle: string;
  linkUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for batch link operations
export interface LinkOperationsPayload {
  userId: string;
  newLinks?: {
    linkUrl: string;
    linkTitle: string;
  }[];
  updatedLinks?: {
    id: string;
    linkUrl: string;
    linkTitle: string;
  }[];
  deletedLinks?: string[];
}

// Update the response type to match the actual API response
export interface LinkUpdateRequest {
  user_id: string;
  new_links: { link_url: string; link_title: string }[];
  updated_links: { id: string; link_url: string; link_title: string }[];
  deleted_links: string[];
}

export interface LinkUpdateResponse {
  success: boolean;
  message: string;
  data: {
    updated: number;
    created: number;
    deleted: number;
    total: number;
  };
}

/**
 * Fetch candidate links
 */
export const fetchCandidateLinks = createAsyncThunk(
  "candidate/fetchLinks",
  async (userId: string, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/v1";
      const response = await fetchWithAuth_GET<CandidateLink[]>(
        `${baseUrl}/candidate/links/user/${userId}`
      );
      
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch candidate links");
    }
  }
);

/**
 * Update links (add, update, delete in a single request)
 */
export const updateCandidateLinks = createAsyncThunk<
  {
    operations: LinkUpdateRequest;
    response: LinkUpdateResponse;
  },
  LinkOperationsPayload, 
  { rejectValue: string }
>(
  "candidate/updateLinks",
  async (operations: LinkOperationsPayload, { rejectWithValue }) => {
    try {
      // Transform payload to match API expectations
      const apiPayload: LinkUpdateRequest = {
        user_id: operations.userId,
        new_links: operations.newLinks?.map(link => ({
          link_url: link.linkUrl,
          link_title: link.linkTitle
        })) || [],
        updated_links: operations.updatedLinks?.map(link => ({
          id: link.id,
          link_url: link.linkUrl,
          link_title: link.linkTitle
        })) || [],
        deleted_links: operations.deletedLinks || []
      };
      
      const response = await fetchWithAuth_PUT<LinkUpdateResponse>(
        '/api/v1/candidate/links',
        apiPayload
      );
      
      if (!response.success) {
        return rejectWithValue("Failed to update links");
      }
      
      // Return properly typed data
      return {
        operations: apiPayload,
        response
      };
    } catch (error) {
      return rejectWithValue("Failed to update links");
    }
  }
);
