'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    fetchCandidateEducation,
    updateCandidateEducation
} from '@/redux/slices/candidateSlice';

export interface EducationFormData {
    id?: string;
    degreeId: string;
    degreeName: string;
    institution: string;
    startDate: Date | null;
    endDate: Date | null;
    isCurrentlyStudying: boolean;
}

export function useEducationForm() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { education, educationLoading, educationCount } = useAppSelector((state) => state.candidate);

    const [educationList, setEducationList] = useState<EducationFormData[]>([]);
    const [formData, setFormData] = useState<EducationFormData>({
        degreeId: '',
        degreeName: '',
        institution: '',
        startDate: null,
        endDate: null,
        isCurrentlyStudying: false
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [pendingChanges, setPendingChanges] = useState<{
        added: EducationFormData[];
        updated: EducationFormData[];
        deleted: string[];
    }>({
        added: [],
        updated: [],
        deleted: [],
    });

    const initialStateRef = useRef<{
        education: EducationFormData[];
    }>({ education: [] });

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCandidateEducation(user.id));
        }
    }, [dispatch, user?.id]);

    useEffect(() => {
        if (education) {
            const mappedEducation = education.map(edu => ({
                id: edu.id,
                degreeId: edu.degree.id,
                degreeName: edu.degree.name,
                institution: edu.eduFrom || '',
                startDate: edu.startedAt ? new Date(edu.startedAt) : null,
                endDate: edu.endAt ? new Date(edu.endAt) : null,
                isCurrentlyStudying: !edu.endAt
            }));

            setEducationList(mappedEducation);

            if (initialStateRef.current.education.length === 0) {
                initialStateRef.current.education = [...mappedEducation];
            }
        }
    }, [education]);

    useEffect(() => {
        setFormChanged(
            pendingChanges.added.length > 0 ||
            pendingChanges.updated.length > 0 ||
            pendingChanges.deleted.length > 0
        );
    }, [pendingChanges]);

    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.degreeId) {
            newErrors.degree = 'Please select a degree';
        }

        if (!formData.institution.trim()) {
            newErrors.institution = 'Institution name is required';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.isCurrentlyStudying && !formData.endDate) {
            newErrors.endDate = 'End date is required if not currently studying';
        }

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            newErrors.endDate = 'End date cannot be before start date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleInputChange = useCallback((field: string, value: unknown) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [errors]);

    const handleCurrentlyStudyingToggle = useCallback((value: boolean) => {
        setFormData(prev => ({
            ...prev,
            isCurrentlyStudying: value,
            endDate: value ? null : prev.endDate
        }));

        if (value && errors.endDate) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.endDate;
                return newErrors;
            });
        }
    }, [errors]);

    const handleDegreeSelect = useCallback((degreeId: string, degreeName: string) => {
        setFormData(prev => ({
            ...prev,
            degreeId,
            degreeName
        }));

        if (errors.degree) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.degree;
                return newErrors;
            });
        }
    }, [errors]);

    const handleClearDegree = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            degreeId: '',
            degreeName: ''
        }));
    }, []);

    const handleEditEducation = useCallback((id: string) => {
        const educationToEdit = educationList.find(edu => edu.id === id);
        if (educationToEdit) {
            setFormData({
                ...educationToEdit
            });
            setEditingId(id);
        }
    }, [educationList]);

    const resetForm = useCallback(() => {
        setFormData({
            degreeId: '',
            degreeName: '',
            institution: '',
            startDate: null,
            endDate: null,
            isCurrentlyStudying: false
        });
        setEditingId(null);
        setErrors({});
    }, []);

    const handleCancelEdit = useCallback(() => {
        resetForm();
    }, [resetForm]);

    const handleDeleteEducation = useCallback((id: string) => {
        if (!id.startsWith('temp-')) {
            setPendingChanges(prev => ({
                ...prev,
                deleted: [...prev.deleted, id],
                updated: prev.updated.filter(edu => edu.id !== id)
            }));
        } else {
            setPendingChanges(prev => ({
                ...prev,
                added: prev.added.filter(edu => edu.id !== id)
            }));
        }

        setEducationList(prev => prev.filter(edu => edu.id !== id));

        if (editingId === id) {
            resetForm();
        }
    }, [editingId, resetForm]);

    const handleAddEducation = useCallback(() => {
        if (!validateForm()) {
            return;
        }

        const tempId = `temp-${Date.now()}`;
        const newEducation = { ...formData, id: tempId };

        setPendingChanges(prev => ({
            ...prev,
            added: [...prev.added, newEducation]
        }));

        setEducationList(prev => [...prev, newEducation]);

        resetForm();
    }, [formData, resetForm, validateForm]);

    const handleUpdateEducation = useCallback(() => {
        if (!editingId || !validateForm()) {
            return;
        }

        const updatedEducation = { ...formData, id: editingId };

        const isTemporaryRecord = editingId.startsWith('temp-');

        if (isTemporaryRecord) {
            setPendingChanges(prev => ({
                ...prev,
                added: prev.added.map(edu =>
                    edu.id === editingId ? updatedEducation : edu
                )
            }));
        } else {
            const alreadyInUpdated = pendingChanges.updated.some(edu => edu.id === editingId);

            if (alreadyInUpdated) {
                setPendingChanges(prev => ({
                    ...prev,
                    updated: prev.updated.map(edu =>
                        edu.id === editingId ? updatedEducation : edu
                    )
                }));
            } else {
                setPendingChanges(prev => ({
                    ...prev,
                    updated: [...prev.updated, updatedEducation]
                }));
            }
        }

        setEducationList(prev =>
            prev.map(edu => edu.id === editingId ? updatedEducation : edu)
        );

        resetForm();
    }, [editingId, formData, pendingChanges.updated, resetForm, validateForm]);

    const handleDirectSave = async () => {
        if (!user?.id) return;

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            setSaveSuccess(false);

            const formatDate = (date: Date | null) => {
                if (!date) return null;
                return date.toISOString().split('T')[0];
            };

            let apiPayload;

            if (editingId) {
                if (editingId.startsWith('temp-')) {
                    apiPayload = {
                        userId: user.id,
                        newEducation: [{
                            degreeId: formData.degreeId,
                            eduFrom: formData.institution,
                            startedAt: formatDate(formData.startDate),
                            endAt: formData.isCurrentlyStudying ? null : formatDate(formData.endDate)
                        }]
                    };
                } else {
                    apiPayload = {
                        userId: user.id,
                        updatedEducation: [{
                            id: editingId,
                            degreeId: formData.degreeId,
                            eduFrom: formData.institution,
                            startedAt: formatDate(formData.startDate),
                            endAt: formData.isCurrentlyStudying ? null : formatDate(formData.endDate)
                        }]
                    };
                }
            } else {
                apiPayload = {
                    userId: user.id,
                    newEducation: [{
                        degreeId: formData.degreeId,
                        eduFrom: formData.institution,
                        startedAt: formatDate(formData.startDate),
                        endAt: formData.isCurrentlyStudying ? null : formatDate(formData.endDate)
                    }]
                };
            }

            await dispatch(updateCandidateEducation(apiPayload)).unwrap();

            await dispatch(fetchCandidateEducation(user.id));

            if (editingId) {
                if (!editingId.startsWith('temp-')) {
                    setPendingChanges(prev => ({
                        ...prev,
                        updated: prev.updated.filter(edu => edu.id !== editingId)
                    }));
                } else {
                    setPendingChanges(prev => ({
                        ...prev,
                        added: prev.added.filter(edu => edu.id !== editingId)
                    }));
                }
            }

            resetForm();

            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error saving education:', error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id || !formChanged) {
            return;
        }

        setIsSubmitting(true);
        setSaveSuccess(false);

        try {
            const formatDate = (date: Date | null) => {
                if (!date) return null;
                return date.toISOString().split('T')[0];
            };

            await dispatch(updateCandidateEducation({
                userId: user.id,
                newEducation: pendingChanges.added.map(edu => ({
                    degreeId: edu.degreeId,
                    eduFrom: edu.institution,
                    startedAt: formatDate(edu.startDate),
                    endAt: edu.isCurrentlyStudying ? null : formatDate(edu.endDate)
                })),
                updatedEducation: pendingChanges.updated.map(edu => ({
                    id: edu.id!,
                    degreeId: edu.degreeId,
                    eduFrom: edu.institution,
                    startedAt: formatDate(edu.startDate),
                    endAt: edu.isCurrentlyStudying ? null : formatDate(edu.endDate)
                })),
                deletedEducation: pendingChanges.deleted
            })).unwrap();

            await dispatch(fetchCandidateEducation(user.id));

            setPendingChanges({ added: [], updated: [], deleted: [] });
            setFormChanged(false);
            setSaveSuccess(true);

            if (education) {
                initialStateRef.current.education = education.map(edu => ({
                    id: edu.id,
                    degreeId: edu.degree.id,
                    degreeName: edu.degree.name,
                    institution: edu.eduFrom || '',
                    startDate: edu.startedAt ? new Date(edu.startedAt) : null,
                    endDate: edu.endAt ? new Date(edu.endAt) : null,
                    isCurrentlyStudying: !edu.endAt
                }));
            }

            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error updating education:', error);
            alert('Failed to update education. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetAll = useCallback(() => {
        setEducationList([...initialStateRef.current.education]);

        setPendingChanges({
            added: [],
            updated: [],
            deleted: [],
        });

        resetForm();
    }, [resetForm]);

    const handleDirectDelete = async (id: string) => {
        if (!user?.id) return;

        try {
            setIsSubmitting(true);
            setSaveSuccess(false);

            await dispatch(updateCandidateEducation({
                userId: user.id,
                deletedEducation: [id]
            })).unwrap();

            await dispatch(fetchCandidateEducation(user.id));

            setEducationList(prev => prev.filter(edu => edu.id !== id));

            if (editingId === id) {
                resetForm();
            }

            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Error deleting education:', error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        educationList,
        formData,
        editingId,
        isSubmitting,
        formChanged,
        saveSuccess,
        isLoading: educationLoading,
        errors,

        handleInputChange,
        handleCurrentlyStudyingToggle,
        handleDegreeSelect,
        handleClearDegree,
        handleEditEducation,
        handleAddEducation,
        handleUpdateEducation,
        handleCancelEdit,
        handleDeleteEducation,
        handleDirectSave,
        handleSubmit,
        handleResetAll,
        handleDirectDelete,
    };
}
