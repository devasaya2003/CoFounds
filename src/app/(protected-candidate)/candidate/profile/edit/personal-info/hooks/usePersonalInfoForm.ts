'use client';

import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { fetchWithAuth_GET } from '@/utils/api';
import { VALIDATE_USERNAME } from '@/utils/regex_utils/regex_validations';
import { getPersonalInfo, updatePersonalInfo, PersonalInfoData } from '../personal_info_api';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';

export interface UsernameCheckResponse {
    valid: boolean;
    available: boolean;
    message: string;
}

export interface DateParts {
    year: string;
    month: string;
    day: string;
}

export interface PersonalInfoFormState {
    firstName: string;
    lastName: string;
    userName: string;
    description: string;
    dob: DateParts | null;
    profileImage: string | null;
    isUploading: boolean;
}

export interface PersonalInfoFormData {
    firstName: string;
    lastName: string;
    userName?: string;
    description: string;
    dob?: string | null;
    profileImage?: string | null;
}

export function usePersonalInfoForm(initialData: PersonalInfoData) {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const userId = user?.id || initialData.id;

    const [isLoading, setIsLoading] = useState(false);
    const [formState, setFormState] = useState<PersonalInfoFormState>({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        userName: initialData.userName || '',
        description: initialData.description || '',
        dob: initialData.dob
            ? {
                year: initialData.dob.getFullYear().toString(),
                month: (initialData.dob.getMonth() + 1).toString().padStart(2, '0'),
                day: initialData.dob.getDate().toString().padStart(2, '0'),
            }
            : null,
        profileImage: initialData.profileImage || null,
        isUploading: false,
    });

    const [originalState, setOriginalState] = useState<PersonalInfoFormState>({ ...formState });

    const [usernameValidation, setUsernameValidation] = useState({
        isChecking: false,
        isAvailable: null as boolean | null,
        validationMessage: '',
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        const loadUserData = async () => {
            if (!userId) return;

            setIsLoading(true);
            try {
                const userData = await getPersonalInfo(userId);

                // Make sure description is properly sanitized and not null
                const sanitizedDescription = userData.description || '';

                const newFormState: PersonalInfoFormState = {
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    userName: userData.userName || '',
                    description: sanitizedDescription,
                    dob: userData.dob
                        ? {
                            year: userData.dob.getFullYear().toString(),
                            month: (userData.dob.getMonth() + 1).toString().padStart(2, '0'),
                            day: userData.dob.getDate().toString().padStart(2, '0'),
                        }
                        : null,
                    profileImage: userData.profileImage || null,
                    isUploading: false,
                };

                // Short delay to ensure DOM is ready before updating state
                setTimeout(() => {
                    setFormState(newFormState);
                    setOriginalState(newFormState);
                    setIsLoading(false);
                }, 300);
            } catch (error) {
                console.error('Failed to load user data:', error);
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [userId]);

    const checkUsernameImmediate = useCallback(async (username: string) => {        
        if (initialData.userName) {
            return;
        }

        if (!username || username.length < 3 || username.length > 8) {
            setUsernameValidation({
                isChecking: false,
                isAvailable: null,
                validationMessage: 'Username must be between 3-8 characters',
            });
            return;
        }

        if (username.toLowerCase() === 'www') {
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                validationMessage: '"www" cannot be used as a username',
            });
            return;
        }

        if (!VALIDATE_USERNAME(username)) {
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                validationMessage: 'Username must be 3-8 characters, lowercase letters and numbers only, with hyphens or underscores only in the middle',
            });
            return;
        }

        try {
            const data = await fetchWithAuth_GET<UsernameCheckResponse>(`/api/v1/candidate/check-user/${username}`);

            setUsernameValidation({
                isChecking: false,
                isAvailable: data.available,
                validationMessage: data.message,
            });
        } catch (error) {
            console.error('Error checking username:', error);
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                validationMessage: 'Failed to check username availability.',
            });
        }
    }, [initialData.userName]);

    const checkUsername = useCallback((username: string) => {
        const debouncedCheck = debounce((value: string) => {
            setUsernameValidation(prev => ({ ...prev, isChecking: true }));
            checkUsernameImmediate(value);
        }, 500);
        
        debouncedCheck(username);
        
        return () => debouncedCheck.cancel();
    }, [checkUsernameImmediate]);

    const updateFormState = useCallback(<T extends keyof PersonalInfoFormState>(
        field: T, 
        value: PersonalInfoFormState[T]
    ) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleInputChange = useCallback(<T extends keyof PersonalInfoFormState>(
        field: T, 
        value: PersonalInfoFormState[T]
    ) => {        
        if (field === 'userName' && initialData.userName) {
            return;
        }

        updateFormState(field, value);

        if (field === 'userName' && typeof value === 'string' && value.length >= 3) {
            checkUsername(value);
        }
    }, [updateFormState, checkUsername, initialData.userName]);

    const handleDateChange = useCallback((type: 'year' | 'month' | 'day', value: string) => {
        setFormState(prev => ({
            ...prev,
            dob: {
                ...(prev.dob || { year: '', month: '', day: '' }),
                [type]: value
            }
        }));
    }, []);

    const handleImageChange = useCallback((file: File | null) => {
        if (!file) return;

        setFormState(prev => ({ ...prev, isUploading: true }));

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormState(prev => ({
                ...prev,
                profileImage: reader.result as string,
                isUploading: false
            }));
        };
        reader.readAsDataURL(file);
    }, []);

    useEffect(() => {
        const hasFormChanges =
            formState.firstName !== originalState.firstName ||
            formState.lastName !== originalState.lastName ||
            formState.description !== originalState.description ||
            JSON.stringify(formState.dob) !== JSON.stringify(originalState.dob) ||
            formState.profileImage !== originalState.profileImage;
        
        const hasUsernameChanges = !initialData.userName &&
            formState.userName !== originalState.userName;

        setHasChanges(hasFormChanges || hasUsernameChanges);
    }, [formState, originalState, initialData.userName]);

    const prepareFormData = useCallback((): PersonalInfoData => {
        const data: PersonalInfoData = {
            id: userId,
            email: initialData.email,
            firstName: formState.firstName,
            lastName: formState.lastName,
            description: formState.description,
            profileImage: formState.profileImage,
        };
        
        if (!initialData.userName && formState.userName && usernameValidation.isAvailable) {
            data.userName = formState.userName;
        } else {
            data.userName = initialData.userName;
        }
        
        if (formState.dob && formState.dob.year && formState.dob.month && formState.dob.day) {
            data.dob = new Date(`${formState.dob.year}-${formState.dob.month}-${formState.dob.day}T00:00:00.000Z`);
        } else {
            data.dob = null;
        }

        return data;
    }, [formState, userId, initialData.email, initialData.userName, usernameValidation.isAvailable]);

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true);

        try {
            const formData = prepareFormData();
            
            const updatedData = await updatePersonalInfo(formData);
            
            const newFormState: PersonalInfoFormState = {
                firstName: updatedData.firstName || '',
                lastName: updatedData.lastName || '',
                userName: updatedData.userName || '',
                description: updatedData.description || '',
                dob: updatedData.dob
                    ? {
                        year: updatedData.dob.getFullYear().toString(),
                        month: (updatedData.dob.getMonth() + 1).toString().padStart(2, '0'),
                        day: updatedData.dob.getDate().toString().padStart(2, '0'),
                    }
                    : null,
                profileImage: updatedData.profileImage || null,
                isUploading: false,
            };

            setFormState(newFormState);
            setOriginalState(newFormState);
            setHasChanges(false);
            
            // Convert Date object to string for Redux
            const dobString = updatedData.dob ? updatedData.dob.toISOString() : null;
            
            dispatch({
                type: 'auth/updateUserData',
                payload: {
                    firstName: updatedData.firstName,
                    lastName: updatedData.lastName,
                    userName: updatedData.userName,
                    description: updatedData.description,
                    dob: dobString, // Use string instead of Date object
                    profileImage: updatedData.profileImage
                }
            });

            return { success: true, data: updatedData };
        } catch (error) {
            console.error('Error submitting form:', error);
            return { success: false, error };
        } finally {
            setIsSubmitting(false);
        }
    }, [prepareFormData, dispatch]);

    const resetForm = useCallback(() => {
        setFormState({ ...originalState });
        setUsernameValidation({
            isChecking: false,
            isAvailable: null,
            validationMessage: '',
        });
    }, [originalState]);

    const isUsernameEditable = !initialData.userName;

    return {
        formState,
        usernameValidation,
        hasChanges,
        isSubmitting,
        isLoading,
        isUsernameEditable,
        email: initialData.email,
        handleInputChange,
        handleDateChange,
        handleImageChange,
        handleSubmit,
        resetForm
    };
}
