import { supabaseClient } from './supabaseClient';

/**
 * Uploads a file to the specified bucket in the user's folder
 * @param file - The file to upload
 * @param userId - User ID that serves as the folder name
 * @param bucketName - The name of the bucket (default: 'profiles')
 * @returns URL of the uploaded file or null if upload failed
 */
export async function uploadUserFile(
  file: File,
  userId: string,
  bucketName: string = 'COF_BUCKET'
): Promise<string | null> {
  try {
    // Create a unique file name with timestamp
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    
    // Full path including user's folder
    const filePath = `${userId}/${fileName}`;
    
    // Upload the file
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in file upload:', error);
    return null;
  }
}

/**
 * Deletes a file from storage
 * @param filePath - Full path to the file including userId/filename
 * @param bucketName - The name of the bucket (default: 'profiles')
 */
export async function deleteUserFile(
  filePath: string,
  bucketName: string = 'profiles'
): Promise<boolean> {
  try {
    // Extract just the path (remove any base URL)
    const path = filePath.includes('/')
      ? filePath.substring(filePath.indexOf(bucketName) + bucketName.length + 1)
      : filePath;
      
    const { error } = await supabaseClient.storage
      .from(bucketName)
      .remove([path]);
      
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in file deletion:', error);
    return false;
  }
}
