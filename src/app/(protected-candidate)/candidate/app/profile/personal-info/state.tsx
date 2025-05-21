'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUserData } from '@/redux/slices/authSlice';
import { formatDateToYMD, formatYMDtoISODate } from './utils';

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
    
  const initialValues = useRef({
    firstName: '',
    lastName: '',
    profileImage: null as string | null,
    dob: {
      year: '',
      month: '',
      day: ''
    },
    description: '',
  });
    
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
    
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
    
  const [description, setDescription] = useState<string>('');
  const [descriptionLoaded, setDescriptionLoaded] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
    
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
    
  useEffect(() => {
    if (candidateData) {      
      setFirstName(candidateData.firstName || '');
      setLastName(candidateData.lastName || '');
      setDescription(candidateData.description || '');
      setProfileImage(candidateData.profileImage || null);
            
      initialValues.current = {
        firstName: candidateData.firstName || '',
        lastName: candidateData.lastName || '',
        profileImage: candidateData.profileImage || null,
        description: candidateData.description || '',
        dob: { year: '', month: '', day: '' }
      };
            
      if (candidateData.dob) {
        const { year, month, day } = formatDateToYMD(candidateData.dob);
        setYear(year);
        setMonth(month);
        setDay(day);
                
        initialValues.current.dob = { year, month, day };
      }
    }
  }, [candidateData]);
  
  const hasFormChanged = useMemo(() => {    
    if (selectedFile) return true;
    
    const currentValues = {
      firstName,
      lastName,
      profileImage,
      description,
      dob: { year, month, day }
    };
    
    return !isEqual(currentValues, initialValues.current);
  }, [firstName, lastName, profileImage, description, year, month, day, selectedFile]);
  
  useEffect(() => {
    setFormChanged(hasFormChanged);
  }, [hasFormChanged]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  
  const handleDescriptionChange = useCallback((html: string) => {
    setDescription(html);
  }, []);
  
  const handleYearChange = useCallback((value: string) => {
    setYear(value);
  }, []);
  
  const handleMonthChange = useCallback((value: string) => {
    setMonth(value);
  }, []);
  
  const handleDayChange = useCallback((value: string) => {
    setDay(value);
  }, []);
    
  const handleShowEditor = useCallback(() => {
    setShowEditor(true);
  }, []);
    
  const handleContentReady = useCallback(() => {
    setDescriptionLoaded(true);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        
    if (!hasFormChanged) {
      return;
    }
    
    setIsSubmitting(true);
    setSaveSuccess(false);
    
    try {      
      const dob = formatYMDtoISODate(year, month, day);
            
      let profileImageUrl = profileImage;
      if (selectedFile) {
        setUploadingImage(true);                
        await new Promise(resolve => setTimeout(resolve, 1000));
        profileImageUrl = previewUrl;
        setUploadingImage(false);
      }
            
      await dispatch(updateUserData({
        firstName,
        lastName,
        description,
        dob,
        profileImage: profileImageUrl,
      }));
            
      setFormChanged(false);
      setSaveSuccess(true);
            
      initialValues.current = {
        firstName,
        lastName,
        profileImage: profileImageUrl,
        description,
        dob: { year, month, day }
      };
            
      setSelectedFile(null);
            
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
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
    year,
    month,
    day,
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
    handleYearChange,
    handleMonthChange,
    handleDayChange,
    handleDescriptionChange,
    handleShowEditor,
    handleContentReady,
    handleSubmit
  };
}
