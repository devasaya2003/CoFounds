'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useCallback, useTransition, useRef } from 'react';
import { Plus, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/redux/hooks';
import dynamic from 'next/dynamic';
import { formatDateForApi, generateTempId } from './proof-of-work/utils';
import {
    ProofOfWork,
    ProofOfWorkFormProps,
    ProofOfWorkFormRef,
    ProofOfWorkUpdatePayload
} from './proof-of-work/types';

const ProofOfWorkItem = dynamic(() => import('./proof-of-work/ProofOfWorkItem'), {
    ssr: false,
    loading: () => <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 animate-pulse h-40"></div>
});

const EmptyState = dynamic(() => import('./proof-of-work/EmptyState'), {
    ssr: false
});

const ProofOfWorkForm = forwardRef<ProofOfWorkFormRef, ProofOfWorkFormProps>(
    ({ profile, onChange, onSaveData }, ref) => {
        const [workExperiences, setWorkExperiences] = useState<ProofOfWork[]>([]);
        const [originalWorkExperiences, setOriginalWorkExperiences] = useState<ProofOfWork[]>([]);
        const [deletedWorkExperiences, setDeletedWorkExperiences] = useState<string[]>([]);
        const [isPending, startTransition] = useTransition();
        const [lastAddedId, setLastAddedId] = useState<string | null>(null);
        const [isInitializing, setIsInitializing] = useState(true);

        const [readyExperiences, setReadyExperiences] = useState<Set<string>>(new Set());
        const [allContentReady, setAllContentReady] = useState(false);

        const workExperienceRefs = useRef<Map<string, HTMLDivElement>>(new Map());
        const containerRef = useRef<HTMLDivElement>(null);

        const { user } = useAppSelector((state) => state.auth);
        const currentYear = new Date().getFullYear();

        useEffect(() => {
            if (profile?.experience) {
                setReadyExperiences(new Set());
                setAllContentReady(false);

                const formattedExperiences = profile.experience.map(exp => {
                    const startDate = exp.startedAt ? {
                        year: new Date(exp.startedAt).getFullYear().toString(),
                        month: (new Date(exp.startedAt).getMonth() + 1).toString().padStart(2, '0'),
                        day: new Date(exp.startedAt).getDate().toString().padStart(2, '0')
                    } : {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01'
                    };

                    const currentlyWorking = exp.endAt === null;

                    const endDate = !currentlyWorking && exp.endAt ? {
                        year: new Date(exp.endAt).getFullYear().toString(),
                        month: (new Date(exp.endAt).getMonth() + 1).toString().padStart(2, '0'),
                        day: new Date(exp.endAt).getDate().toString().padStart(2, '0')
                    } : null;

                    const isCommunityWork = exp.companyName === 'COF_PROOF_COMMUNITY';

                    return {
                        id: exp.id,
                        title: exp.title || '',
                        company: isCommunityWork ? '' : (exp.companyName || ''),
                        description: exp.description || '',
                        startDate,
                        endDate,
                        userId: exp.userId,
                        isCommunityWork,
                        currentlyWorking
                    };
                });

                const deepCopy = formattedExperiences.map(exp => ({
                    ...exp,
                    startDate: exp.startDate ? { ...exp.startDate } : {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01'
                    },
                    endDate: exp.currentlyWorking ? null : (exp.endDate ? { ...exp.endDate } : {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01'
                    }),
                    description: exp.description ? String(exp.description) : ''
                }));

                setWorkExperiences(formattedExperiences);
                setOriginalWorkExperiences(deepCopy);

                if (formattedExperiences.length === 0) {
                    setAllContentReady(true);
                }

                if (isInitializing) {
                    setIsInitializing(false);
                }
            } else {
                setIsInitializing(false);
                setAllContentReady(true);
            }
        }, [profile, currentYear, isInitializing]);

        const handleContentReady = useCallback((experienceId: string) => {
            setReadyExperiences(prev => {
                const newSet = new Set(prev);
                newSet.add(experienceId);
                return newSet;
            });
        }, []);

        useEffect(() => {
            if (workExperiences.length > 0 && readyExperiences.size === workExperiences.length) {
                setAllContentReady(true);
            }
        }, [workExperiences, readyExperiences]);

        const handleAddWorkExperience = useCallback(() => {
            startTransition(() => {
                const newId = generateTempId();
                const newWorkExperience: ProofOfWork = {
                    id: newId,
                    title: '',
                    company: '',
                    description: '',
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
                    isCommunityWork: false,
                    currentlyWorking: false
                };

                setWorkExperiences(prevExps => [...prevExps, newWorkExperience]);
                setLastAddedId(newId);

                if (onChange && !isInitializing) {
                    onChange(true);
                }
            });
        }, [currentYear, onChange, isInitializing]);

        useEffect(() => {
            if (lastAddedId && !isPending) {
                const experienceElement = workExperienceRefs.current.get(lastAddedId);
                if (experienceElement) {
                    setTimeout(() => {
                        experienceElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 100);
                    setLastAddedId(null);
                }
            }
        }, [lastAddedId, isPending]);

        const handleRemoveWorkExperience = useCallback((id: string) => {
            setWorkExperiences(prevExps => prevExps.filter(exp => exp.id !== id));

            if (!id.startsWith('temp-')) {
                setDeletedWorkExperiences(prev => [...prev, id]);
            }

            if (onChange && !isInitializing) {
                onChange(true);
            }
        }, [onChange, isInitializing]);

        const handleUpdateWorkExperience = useCallback((id: string, updates: Partial<ProofOfWork>) => {
            setWorkExperiences(prevExps =>
                prevExps.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
            );

            if (onChange && !isInitializing) {
                onChange(true);
            }
        }, [onChange, isInitializing]);

        useEffect(() => {
            if (!isInitializing && allContentReady && onChange) {
                const hasDeletedExperiences = deletedWorkExperiences.length > 0;

                const hasNewExperiences = workExperiences.some(exp => exp.id.startsWith('temp-'));

                const hasModifiedExperiences = workExperiences.some(exp => {
                    if (exp.id.startsWith('temp-')) return false;

                    const originalExp = originalWorkExperiences.find(oe => oe.id === exp.id);
                    if (!originalExp) return false;

                    const normalizeDescription = (desc: string | null) => desc?.trim() || '';

                    return (
                        exp.title !== originalExp.title ||
                        exp.company !== originalExp.company ||
                        normalizeDescription(exp.description) !== normalizeDescription(originalExp.description) ||
                        exp.isCommunityWork !== originalExp.isCommunityWork ||
                        exp.currentlyWorking !== originalExp.currentlyWorking ||
                        JSON.stringify(exp.startDate) !== JSON.stringify(originalExp.startDate) ||
                        JSON.stringify(exp.endDate) !== JSON.stringify(originalExp.endDate)
                    );
                });

                const hasChanges = hasDeletedExperiences || hasNewExperiences || hasModifiedExperiences;

                onChange(hasChanges);
            }
        }, [isInitializing, allContentReady, onChange, workExperiences, originalWorkExperiences, deletedWorkExperiences]);

        const resetForm = useCallback(() => {
            setWorkExperiences(originalWorkExperiences.map(exp => {
                return {
                    ...exp,
                    startDate: exp.startDate ? { ...exp.startDate } : {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01'
                    },
                    endDate: exp.currentlyWorking ? null : (exp.endDate ? { ...exp.endDate } : {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01'
                    })
                };
            }));
            setDeletedWorkExperiences([]);

            if (onChange) {
                onChange(false);
            }
        }, [originalWorkExperiences, onChange, currentYear]);

        const saveForm = useCallback(() => {
            const newExperiences = workExperiences
                .filter(exp => exp.id.startsWith('temp-'))
                .map(exp => ({
                    title: exp.title,
                    company: exp.isCommunityWork ? 'COF_PROOF_COMMUNITY' : exp.company,
                    description: exp.description || null,
                    started_at: formatDateForApi(exp.startDate),
                    end_at: exp.currentlyWorking ? null : (exp.endDate ? formatDateForApi(exp.endDate) : null),
                    is_community_work: exp.isCommunityWork
                }));

            const updatedExperiences = workExperiences
                .filter(exp => {
                    if (exp.id.startsWith('temp-')) return false;

                    const originalExp = originalWorkExperiences.find(oe => oe.id === exp.id);
                    if (!originalExp) return false;

                    return (
                        exp.title !== originalExp.title ||
                        exp.company !== originalExp.company ||
                        exp.description !== originalExp.description ||
                        exp.isCommunityWork !== originalExp.isCommunityWork ||
                        exp.currentlyWorking !== originalExp.currentlyWorking ||
                        JSON.stringify(exp.startDate) !== JSON.stringify(originalExp.startDate) ||
                        JSON.stringify(exp.endDate) !== JSON.stringify(originalExp.endDate)
                    );
                })
                .map(exp => ({
                    id: exp.id,
                    title: exp.title,
                    company: exp.isCommunityWork ? 'COF_PROOF_COMMUNITY' : exp.company,
                    description: exp.description || null,
                    started_at: formatDateForApi(exp.startDate),
                    end_at: exp.currentlyWorking ? null : (exp.endDate ? formatDateForApi(exp.endDate) : null),
                    is_community_work: exp.isCommunityWork
                }));

            const payload: ProofOfWorkUpdatePayload = {
                user_id: user?.id || '',
                new_experiences: newExperiences,
                updated_experiences: updatedExperiences,
                deleted_experiences: deletedWorkExperiences
            };

            onSaveData({ proofOfWorkUpdateData: payload });
        }, [workExperiences, originalWorkExperiences, deletedWorkExperiences, onSaveData, user?.id]);

        useImperativeHandle(ref, () => ({
            resetForm,
            saveForm
        }));

        const setWorkExperienceRef = useCallback((id: string, element: HTMLDivElement | null) => {
            if (element) {
                workExperienceRefs.current.set(id, element);
            } else {
                workExperienceRefs.current.delete(id);
            }
        }, []);

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold">Your Work Experience</h2>
                        <p className="text-gray-600">
                            Add your work experience and community contributions to showcase your professional journey.
                        </p>
                    </div>
                    {workExperiences.length > 0 && (
                        <Button
                            onClick={handleAddWorkExperience}
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
                                    Add Experience
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-6" ref={containerRef}>
                            {workExperiences.length === 0 ? (
                                <EmptyState onAddProofOfWork={handleAddWorkExperience} />
                            ) : (
                                <div className="space-y-6">
                                    {workExperiences.map((experience, index) => (
                                        <div
                                            key={experience.id}
                                            ref={(el) => setWorkExperienceRef(experience.id, el)}
                                            className={`transition-opacity duration-300 ${lastAddedId === experience.id && isPending
                                                ? 'opacity-70'
                                                : 'opacity-100'
                                                }`}
                                        >
                                            <ProofOfWorkItem
                                                proofOfWork={experience}
                                                index={index}
                                                onUpdate={handleUpdateWorkExperience}
                                                onRemove={handleRemoveWorkExperience}
                                                onContentReady={handleContentReady}
                                            />
                                        </div>
                                    ))}

                                    <div className="flex justify-center mt-6">
                                        <Button
                                            onClick={handleAddWorkExperience}
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
                                                    Add Another Experience
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {isPending && (
                                <div className="fixed bottom-6 right-6 bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center z-50">
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Adding experience...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-2 text-sm text-gray-500 flex items-center bg-blue-50 p-3 rounded-md">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    <p>
                        <strong>Pro tip:</strong> Add community work like speaking engagements, events you've organized, or open-source projects to showcase your broader impact.
                    </p>
                </div>
            </div>
        );
    }
);

ProofOfWorkForm.displayName = "ProofOfWorkForm";
export default ProofOfWorkForm;
export type { ProofOfWorkFormRef } from './proof-of-work/types';