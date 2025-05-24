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
export interface UpdateLinksResponse {
  success: boolean;
  message?: string;
  data?: {
    updated: number;
    created: number;
    deleted: number;
    total: number;
  };
  error?: string;
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
  { operations: any; result: any }, // Return type modified to match reducer expectations
  LinkOperationsPayload, 
  { rejectValue: string }
>(
  "candidate/updateLinks",
  async (operations: LinkOperationsPayload, { rejectWithValue }) => {
    try {
      // Transform payload to match API expectations
      const apiPayload = {
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
      
      const response = await fetchWithAuth_PUT<UpdateLinksResponse>(
        '/api/v1/candidate/links',
        apiPayload
      );
      
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to update links");
      }
      
      // Return a structure that matches what the reducer expects
      return {
        operations: apiPayload,
        result: response.data || { updated: 0, created: 0, deleted: 0, total: 0 }
      };
    } catch (error) {
      return rejectWithValue("Failed to update links");
    }
  }
);

// Helper functions for common single operations (internally use the batch operation)

/**
 * Add a single new link (convenience method)
 */
export const addCandidateLink = createAsyncThunk(
  "candidate/addLink",
  async (
    { userId, linkTitle, linkUrl }: { userId: string; linkTitle: string; linkUrl: string }, 
    { dispatch, rejectWithValue }
  ) => {
    try {
      await dispatch(updateCandidateLinks({
        userId,
        newLinks: [{ linkTitle, linkUrl }]
      })).unwrap();
      
      // After the operation succeeds, fetch the updated links to get the new link with its ID
      const updatedLinks = await dispatch(fetchCandidateLinks(userId)).unwrap();
      
      // Find the newly added link (typically the one with matching title and url)
      const newLink = updatedLinks.find(
        link => link.linkTitle === linkTitle && link.linkUrl === linkUrl
      );
      
      if (!newLink) {
        return rejectWithValue("Link was added but couldn't be retrieved");
      }
      
      return newLink;
    } catch (error) {
      return rejectWithValue("Failed to add link");
    }
  }
);

/**
 * Delete a single link (convenience method)
 */
export const deleteCandidateLink = createAsyncThunk(
  "candidate/deleteLink",
  async (
    { userId, linkId }: { userId: string; linkId: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await dispatch(updateCandidateLinks({
        userId,
        deletedLinks: [linkId]
      })).unwrap();
      
      // Return the linkId for the reducer to remove from state
      return linkId;
    } catch (error) {
      return rejectWithValue("Failed to delete link");
    }
  }
);
