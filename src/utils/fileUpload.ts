import { fetchWithAuth_UPLOAD } from './api';

interface UploadResponse {
  success: boolean;
  fileUrl: string;
  error?: string;
}

interface DeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Extracts the file path from a Supabase URL
 * @param url - The full Supabase URL
 * @returns The path component that can be used for deletion
 */
export function extractPathFromUrl(url: string): string | null {
  if (!url) return null;

  try {
    console.log("Extracting path from URL:", url);
        
    const urlMatch = url.match(/\/public\/([^/]+)\/(.+)$/);
    if (urlMatch && urlMatch.length >= 3) {
      const extractedPath = urlMatch[2];
      console.log("Extracted path from URL:", extractedPath);
      return extractedPath;
    }
            
    const parts = url.split('/');
    if (parts.length >= 2) {
      console.log("Using URL as path directly:", url);
      return url;
    }
    
    console.log("Could not extract path from URL");
    return null;
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return null;
  }
}

/**
 * Uploads a file using the secure API endpoint
 * @param file - The file to upload
 * @param userId - The user ID for folder organization
 * @param category - Optional category for organization (default: 'profile')
 * @returns The URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  userId: string,
  category: string = 'profile'
): Promise<string> {  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  formData.append('category', category);
  
  try {
    console.log("Starting file upload for user:", userId);
    
    const response = await fetchWithAuth_UPLOAD<UploadResponse>('/api/v1/upload', formData);
    
    if (!response.success || !response.fileUrl) {
      console.error("Upload failed:", response.error);
      throw new Error(response.error || 'Upload failed');
    }
    
    console.log("Upload successful, received URL");
    return response.fileUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Deletes a file using the secure API endpoint
 * @param filePath - The path of the file to delete or full URL
 * @returns Whether the deletion was successful
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    console.log("Starting delete for file URL:", fileUrl);
        
    const filePath = extractPathFromUrl(fileUrl);
    
    if (!filePath) {
      console.error('Failed to extract path from URL:', fileUrl);
      return false;
    }
    
    console.log("Sending delete request for path:", filePath);
    
    const encodedPath = encodeURIComponent(filePath);
    const response = await fetch(`/api/v1/upload?path=${encodedPath}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Delete response error:', result);
      return false;
    }
    
    console.log("Delete response:", result);
    return result.success;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
