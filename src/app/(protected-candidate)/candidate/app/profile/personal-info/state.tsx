'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { uploadFile, deleteFile } from '@/utils/fileUpload';
import { updateCandidateProfile, fetchCandidateSummary } from '@/redux/slices/candidateSlice';

// Helper function to format date to ISO string with timezone adjustment
const formatDateToISOString = (date: Date | undefined): string | null => {
  if (!date) return null;
  
  // Create new date to avoid modifying the original
  const adjustedDate = new Date(date);
  
  // Set time to noon to avoid timezone issues
  adjustedDate.setHours(12, 0, 0, 0);
  
  // Format to ISO string and extract just the date portion
  const isoString = adjustedDate.toISOString();
  return isoString;
};

// Helper function to parse date string from API
const parseDateString = (dateString: string | null): Date | undefined => {
  if (!dateString) return undefined;
  try {
    // Create a new date and set to noon to avoid timezone issues
    const date = new Date(dateString);
    date.setHours(12, 0, 0, 0);
    return isNaN(date.getTime()) ? undefined : date;
  } catch (error) {
    console.error('Error parsing date:', error);
    return undefined;
  }
};

const isEqual = <T extends Record<string, unknown>>(obj1: T | null, obj2: T | null): boolean => {  
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null) return obj1 === obj2;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => {    
    const val1 = obj1[key as keyof T];
    const val2 = obj2[key as keyof T];
    
    if (typeof val1 === 'object' && typeof val2 === 'object') {      
      return isEqual(val1 as Record<string, unknown>, val2 as Record<string, unknown>);
    }
    return val1 === val2;
  });
};

export function usePersonalInfoForm() {
  const dispatch = useAppDispatch();
  const candidateData = useAppSelector((state) => state.candidate);
  const { user } = useAppSelector((state) => state.auth);
  
  const initialDataLoaded = useRef(false);
    
  const initialValues = useRef({
    firstName: '',
    lastName: '',
    profileImage: null as string | null,
    dob: undefined as Date | undefined,
    description: '',
  });
    
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
    
  const [dob, setDob] = useState<Date | undefined>(undefined);
    
  const [description, setDescription] = useState<string>('');
  const [descriptionLoaded, setDescriptionLoaded] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
    
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const candidateDataLoaded = useMemo(() => 
    Boolean(candidateData.userId) && !candidateData.isLoading,
  [candidateData.userId, candidateData.isLoading]);
    
  useEffect(() => {
    if (candidateDataLoaded && !initialDataLoaded.current) {
      setFirstName(candidateData.firstName || '');
      setLastName(candidateData.lastName || '');
      setDescription(candidateData.description || '');
      setProfileImage(candidateData.profileImage || null);
      
      if (candidateData.dob) {
        console.log("Setting DOB from candidateData:", candidateData.dob);
        const parsedDate = parseDateString(candidateData.dob);
        setDob(parsedDate);
      }
            
      initialValues.current = {
        firstName: candidateData.firstName || '',
        lastName: candidateData.lastName || '',
        profileImage: candidateData.profileImage || null,
        dob: candidateData.dob ? parseDateString(candidateData.dob) : undefined,
        description: candidateData.description || '',
      };
      
      initialDataLoaded.current = true;
    }
  }, [candidateDataLoaded, candidateData]);
  
  const hasFormChanged = useMemo(() => {    
    if (selectedFile) return true;
    
    const currentValues = {
      firstName,
      lastName,
      profileImage,
      dob,
      description,
    };
    
    if (
      (currentValues.dob && !initialValues.current.dob) || 
      (!currentValues.dob && initialValues.current.dob) ||
      (currentValues.dob && initialValues.current.dob && 
        currentValues.dob.getTime() !== initialValues.current.dob.getTime())
    ) {
      return true;
    }
    
    const valuesWithoutDate = {
      firstName: currentValues.firstName,
      lastName: currentValues.lastName,
      profileImage: currentValues.profileImage,
      description: currentValues.description
    };
    
    const initialValuesWithoutDate = {
      firstName: initialValues.current.firstName,
      lastName: initialValues.current.lastName,
      profileImage: initialValues.current.profileImage,
      description: initialValues.current.description
    };
    
    return !isEqual(valuesWithoutDate, initialValuesWithoutDate);
  }, [firstName, lastName, profileImage, description, dob, selectedFile]);
  
  useEffect(() => {
    setFormChanged(hasFormChanged);
  }, [hasFormChanged]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  
  const handleDescriptionChange = useCallback((html: string) => {
    setDescription(html);
  }, []);
  
  const handleShowEditor = useCallback(() => {
    setShowEditor(true);
  }, []);
    
  const handleContentReady = useCallback(() => {
    setDescriptionLoaded(true);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        
    if (!hasFormChanged || !user?.id) {
      return;
    }
    
    setIsSubmitting(true);
    setSaveSuccess(false);
    
    try {
      // Log the date being submitted for debugging
      console.log("Original DOB selected:", dob);
      
      const formattedDob = formatDateToISOString(dob);
      console.log("Formatted DOB for submission:", formattedDob);
            
      let profileImageUrl = profileImage;
      
      if (selectedFile && user?.id) {
        setUploadingImage(true);
        
        try {
          if (profileImage) {
            console.log("Deleting previous profile image:", profileImage);
            const deleteSuccess = await deleteFile(profileImage);
            
            if (!deleteSuccess) {
              console.warn("Failed to delete previous profile image. Continuing with upload.");
            }
          }
          
          profileImageUrl = await uploadFile(selectedFile, user.id, 'profile');
        } catch (uploadError) {
          console.error('Error handling profile image:', uploadError);
        } finally {
          setUploadingImage(false);
        }
      }
      
      await dispatch(updateCandidateProfile({
        userId: user.id,
        firstName,
        lastName,
        description,
        dob: formattedDob,
        profileImage: profileImageUrl,
      })).unwrap();
      
      await dispatch(fetchCandidateSummary(user.id));
      
      setFormChanged(false);
      setSaveSuccess(true);
      setSelectedFile(null);
      
      if (previewUrl && profileImageUrl !== previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      initialValues.current = {
        firstName,
        lastName,
        profileImage: profileImageUrl,
        description,
        dob,
      };
      
      const successTimer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      return () => clearTimeout(successTimer);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {    
    candidateData,
    firstName,
    lastName,
    profileImage,
    previewUrl,
    uploadingImage,
    dob,
    setDob,
    description,
    descriptionLoaded,
    showEditor,
    isSubmitting,
    formChanged, 
    saveSuccess,
        
    setFirstName: (val: string) => {
      setFirstName(val);
    },
    setLastName: (val: string) => {
      setLastName(val);
    },
    handleFileChange,
    handleDescriptionChange,
    handleShowEditor,
    handleContentReady,
    handleSubmit
  };
}
