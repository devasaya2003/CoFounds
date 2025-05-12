'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useCallback, useTransition, useRef, useMemo } from 'react';
import { Plus, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/redux/hooks';
import dynamic from 'next/dynamic';
import { formatDateForApi, generateTempId } from './education/utils';
import {
    Education,
    EducationFormProps,
    EducationFormRef,
    EducationUpdatePayload,
    MAX_EDUCATION_ENTRIES
} from './education/types';

const EducationItem = dynamic(() => import('./education/EducationItem'), {
    ssr: false,
    loading: () => <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 animate-pulse h-40"></div>
});

const EmptyState = dynamic(() => import('./education/EmptyState'), {
    ssr: false
});

const EducationForm = forwardRef<EducationFormRef, EducationFormProps>(
    ({ profile, onChange, onSaveData }, ref) => {
        const [educationEntries, setEducationEntries] = useState<Education[]>([]);
        const [originalEducationEntries, setOriginalEducationEntries] = useState<Education[]>([]);
        const [deletedEducationEntries, setDeletedEducationEntries] = useState<string[]>([]);
        const [isPending, startTransition] = useTransition(); 
        const [lastAddedId, setLastAddedId] = useState<string | null>(null);
        const [isInitializing, setIsInitializing] = useState(true);
                
        const educationRefs = useRef<Map<string, HTMLDivElement>>(new Map());        
        const containerRef = useRef<HTMLDivElement>(null);

        // Store degrees data in state for use in education form
        const [degrees, setDegrees] = useState<{ id: string, name: string }[]>([]);
        const [isLoadingDegrees, setIsLoadingDegrees] = useState(false);

        const { user } = useAppSelector((state) => state.auth);
        const currentYear = new Date().getFullYear();

        // Pre-generate values for date selectors
        const years = useMemo(() => 
            Array.from({ length: 70 }, (_, i) => (currentYear - i).toString()),
        [currentYear]);
        
        const months = useMemo(() => [
            { value: '01', label: 'January' }, { value: '02', label: 'February' },
            { value: '03', label: 'March' }, { value: '04', label: 'April' },
            { value: '05', label: 'May' }, { value: '06', label: 'June' },
            { value: '07', label: 'July' }, { value: '08', label: 'August' },
            { value: '09', label: 'September' }, { value: '10', label: 'October' },
            { value: '11', label: 'November' }, { value: '12', label: 'December' }
        ], []);

        // Initialize education entries from profile data
        useEffect(() => {
            if (profile?.education) {
                const formattedEducation = profile.education.map(edu => {
                    const startDate = edu.startedAt ? {
                        year: new Date(edu.startedAt).getFullYear().toString(),
                        month: (new Date(edu.startedAt).getMonth() + 1).toString().padStart(2, '0'),
                        day: new Date(edu.startedAt).getDate().toString().padStart(2, '0')
                    } : {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01'
                    };

                    const currentlyStudying = edu.endAt === null;

                    const endDate = !currentlyStudying && edu.endAt ? {
                        year: new Date(edu.endAt).getFullYear().toString(),
                        month: (new Date(edu.endAt).getMonth() + 1).toString().padStart(2, '0'),
                        day: new Date(edu.endAt).getDate().toString().padStart(2, '0')
                    } : null;

                    return {
                        id: edu.id,
                        institution: edu.eduFrom || '',
                        degree: edu.degreeId || '',
                        degreeName: edu.degree?.name || '',
                        startDate,
                        endDate,
                        userId: edu.userId,
                        currentlyStudying
                    };
                });

                // Create a deep copy for original state
                const deepCopy = formattedEducation.map(edu => ({
                    ...edu,
                    startDate: edu.startDate ? { ...edu.startDate } : {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01'
                    },
                    endDate: edu.currentlyStudying ? null : (edu.endDate ? { ...edu.endDate } : {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01'
                    })
                }));

                setEducationEntries(formattedEducation);
                setOriginalEducationEntries(deepCopy);

                if (isInitializing) {
                    setIsInitializing(false);
                }
            } else {
                setIsInitializing(false);
            }
        }, [profile, currentYear, isInitializing]);

        // Handle adding a new education entry
        const handleAddEducation = useCallback(() => {
            if (educationEntries.length >= MAX_EDUCATION_ENTRIES) {
                return;
            }

            startTransition(() => {
                const newId = generateTempId();
                const newEducation: Education = {
                    id: newId,
                    institution: '',
                    degree: '',
                    degreeName: '',
                    startDate: {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01',
                    },
                    endDate: {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01',
                    },
                    currentlyStudying: false
                };

                setEducationEntries(prevEdu => [...prevEdu, newEducation]);
                setLastAddedId(newId);
                                
                if (onChange && !isInitializing) {
                    onChange(true);
                }
            });
        }, [educationEntries.length, currentYear, onChange, isInitializing]);
        
        // Scroll to newly added education entry
        useEffect(() => {
            if (lastAddedId && !isPending) {
                const educationElement = educationRefs.current.get(lastAddedId);
                if (educationElement) {                    
                    setTimeout(() => {
                        educationElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 100);
                    setLastAddedId(null); 
                }
            }
        }, [lastAddedId, isPending]);

        // Handle removing an education entry
        const handleRemoveEducation = useCallback((id: string) => {
            setEducationEntries(prevEdu => prevEdu.filter(edu => edu.id !== id));

            if (!id.startsWith('temp-')) {
                setDeletedEducationEntries(prev => [...prev, id]);
            }
            
            if (onChange && !isInitializing) {
                onChange(true);
            }
        }, [onChange, isInitializing]);

        // Handle updating an education entry
        const handleUpdateEducation = useCallback((id: string, updates: Partial<Education>) => {
            setEducationEntries(prevEdu =>
                prevEdu.map(edu => edu.id === id ? { ...edu, ...updates } : edu)
            );
            
            if (onChange && !isInitializing) {
                onChange(true);
            }
        }, [onChange, isInitializing]);

        // Track form changes to notify parent component
        useEffect(() => {
            if (!isInitializing && onChange) {                
                const hasDeletedEducation = deletedEducationEntries.length > 0;
                                
                const hasNewEducation = educationEntries.some(edu => edu.id.startsWith('temp-'));
                                
                const hasModifiedEducation = educationEntries.some(edu => {                    
                    if (edu.id.startsWith('temp-')) return false;
                                        
                    const originalEdu = originalEducationEntries.find(oe => oe.id === edu.id);
                    if (!originalEdu) return false;
                                        
                    return (
                        edu.institution !== originalEdu.institution ||
                        edu.degree !== originalEdu.degree ||
                        edu.currentlyStudying !== originalEdu.currentlyStudying ||
                        JSON.stringify(edu.startDate) !== JSON.stringify(originalEdu.startDate) ||
                        JSON.stringify(edu.endDate) !== JSON.stringify(originalEdu.endDate)
                    );
                });
                
                const hasChanges = hasDeletedEducation || hasNewEducation || hasModifiedEducation;
                                
                if (!hasChanges) {                    
                    onChange(false);
                } else {                    
                    onChange(true);
                }
            }
        }, [isInitializing, onChange, educationEntries, originalEducationEntries, deletedEducationEntries]);

        // Reset form to original state
        const resetForm = useCallback(() => {
            setEducationEntries(originalEducationEntries.map(edu => ({ 
                ...edu,
                startDate: edu.startDate ? { ...edu.startDate } : {
                    year: currentYear.toString(),
                    month: '01',
                    day: '01'
                },
                endDate: edu.currentlyStudying ? null : (edu.endDate ? { ...edu.endDate } : {
                    year: currentYear.toString(),
                    month: '01',
                    day: '01'
                })
            })));
            setDeletedEducationEntries([]);
            
            if (onChange) {
                onChange(false);
            }
        }, [originalEducationEntries, onChange, currentYear]);

        // Save form data
        const saveForm = useCallback(() => {
            const newEducation = educationEntries
                .filter(edu => edu.id.startsWith('temp-'))
                .map(edu => ({
                    institution: edu.institution,
                    degree_id: edu.degree,
                    started_at: formatDateForApi(edu.startDate),
                    end_at: edu.currentlyStudying ? null : (edu.endDate ? formatDateForApi(edu.endDate) : null)
                }));

            const updatedEducation = educationEntries
                .filter(edu => {
                    if (edu.id.startsWith('temp-')) return false;

                    const originalEdu = originalEducationEntries.find(oe => oe.id === edu.id);
                    if (!originalEdu) return false;

                    return (
                        edu.institution !== originalEdu.institution ||
                        edu.degree !== originalEdu.degree ||
                        edu.currentlyStudying !== originalEdu.currentlyStudying ||
                        JSON.stringify(edu.startDate) !== JSON.stringify(originalEdu.startDate) ||
                        JSON.stringify(edu.endDate) !== JSON.stringify(originalEdu.endDate)
                    );
                })
                .map(edu => ({
                    id: edu.id,
                    institution: edu.institution,
                    degree_id: edu.degree,
                    started_at: formatDateForApi(edu.startDate),
                    end_at: edu.currentlyStudying ? null : (edu.endDate ? formatDateForApi(edu.endDate) : null)
                }));

            const payload: EducationUpdatePayload = {
                user_id: user?.id || '',
                new_education: newEducation,
                updated_education: updatedEducation,
                deleted_education: deletedEducationEntries
            };

            onSaveData({ educationUpdateData: payload });
        }, [educationEntries, originalEducationEntries, deletedEducationEntries, onSaveData, user?.id]);

        // Expose methods to parent component
        useImperativeHandle(ref, () => ({
            resetForm,
            saveForm
        }));
        
        // Set reference to education element for scrolling
        const setEducationRef = useCallback((id: string, element: HTMLDivElement | null) => {
            if (element) {
                educationRefs.current.set(id, element);
            } else {
                educationRefs.current.delete(id);
            }
        }, []);

        const remainingEducation = MAX_EDUCATION_ENTRIES - educationEntries.length;

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold">Your Education</h2>
                        <p className="text-gray-600">
                            Add and manage your educational background.
                        </p>
                    </div>
                    {educationEntries.length > 0 && remainingEducation > 0 && (
                        <Button
                            onClick={handleAddEducation}
                            variant="outline"
                            className="flex items-center"
                            size="sm"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Education ({remainingEducation} left)
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-6" ref={containerRef}>
                            {educationEntries.length === 0 ? (
                                <EmptyState onAddEducation={handleAddEducation} />
                            ) : (
                                <div className="space-y-6">
                                    {educationEntries.map((education, index) => (
                                        <div 
                                            key={education.id}
                                            ref={(el) => setEducationRef(education.id, el)}
                                            className={`transition-opacity duration-300 ${
                                                lastAddedId === education.id && isPending 
                                                    ? 'opacity-70' 
                                                    : 'opacity-100'
                                            }`}
                                        >
                                            <EducationItem
                                                education={education}
                                                index={index}
                                                onUpdate={handleUpdateEducation}
                                                onRemove={handleRemoveEducation}
                                                years={years}
                                                months={months}
                                                degrees={degrees}
                                                isLoadingDegrees={isLoadingDegrees}
                                            />
                                        </div>
                                    ))}

                                    <div className="flex justify-center mt-6">
                                        {remainingEducation > 0 ? (
                                            <Button
                                                onClick={handleAddEducation}
                                                variant="outline"
                                                className="flex items-center"
                                                disabled={isPending}
                                            >
                                                {isPending ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                        Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Add Another Education ({remainingEducation} remaining)
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <div className="flex items-center bg-amber-50 text-amber-700 px-4 py-2 rounded-md">
                                                <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                                                <p className="text-sm">
                                                    Maximum of {MAX_EDUCATION_ENTRIES} education entries allowed. Consider removing less relevant ones.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {/* Loading indicator when adding a new education entry */}
                            {isPending && (
                                <div className="fixed bottom-6 right-6 bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center z-50">
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Adding education...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
);

EducationForm.displayName = "EducationForm";
export default EducationForm;