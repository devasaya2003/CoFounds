'use client';

import React, { ChangeEvent, memo, useCallback, Suspense, lazy, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import DateSelector from '@/components/DateSelector/DateSelector';
import { ProofOfWork } from './types';
import { generateYears, generateMonths, generateDays } from './utils';

// Lazy-load the markdown editor since it's heavy
const MarkdownEditor = lazy(() => import('@/components/RichTextEditor/RichTextEditor'));

// Pre-generate these values once to avoid regenerating them for each proof of work
const years = generateYears();
const months = generateMonths();
const days = generateDays();

interface ProofOfWorkItemProps {
    proofOfWork: ProofOfWork;
    index: number;
    onUpdate: (id: string, updates: Partial<ProofOfWork>) => void;
    onRemove: (id: string) => void;
}

const ProofOfWorkItem = memo(({
    proofOfWork,
    index,
    onUpdate,
    onRemove
}: ProofOfWorkItemProps) => {
    // Add debounce ref for description updates
    const descriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const currentlyWorking = proofOfWork.currentlyWorking;
    const isCommunityWork = proofOfWork.isCommunityWork;

    const handleRemove = useCallback(() => {
        onRemove(proofOfWork.id);
    }, [proofOfWork.id, onRemove]);

    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onUpdate(proofOfWork.id, { title: e.target.value });
    }, [proofOfWork.id, onUpdate]);

    const handleCompanyChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onUpdate(proofOfWork.id, { company: e.target.value });
    }, [proofOfWork.id, onUpdate]);

    // IMPORTANT FIX: Debounce the markdown editor updates
    const handleDescriptionChange = useCallback((value: string) => {
        if (descriptionTimeoutRef.current) {
            clearTimeout(descriptionTimeoutRef.current);
        }

        descriptionTimeoutRef.current = setTimeout(() => {
            onUpdate(proofOfWork.id, { description: value });
        }, 300); // 300ms debounce time
    }, [proofOfWork.id, onUpdate]);

    const handleCommunityWorkChange = useCallback((checked: boolean) => {
        onUpdate(proofOfWork.id, { 
            isCommunityWork: checked,
            company: checked ? '' : proofOfWork.company
        });
    }, [proofOfWork.id, proofOfWork.company, onUpdate]);

    const handleCurrentlyWorkingChange = useCallback((checked: boolean) => {
        onUpdate(proofOfWork.id, { 
            currentlyWorking: checked,
            endDate: checked ? null : {
                year: new Date().getFullYear().toString(),
                month: '01',
                day: '01'
            }
        });
    }, [proofOfWork.id, onUpdate]);

    // Clean up any pending timeouts
    useEffect(() => {
        return () => {
            if (descriptionTimeoutRef.current) {
                clearTimeout(descriptionTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="p-6 border border-gray-200 rounded-lg relative bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                type="button"
                onClick={handleRemove}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove work experience"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="flex items-center mb-4">
                <Checkbox
                    id={`community-work-${proofOfWork.id}`}
                    checked={isCommunityWork}
                    onCheckedChange={handleCommunityWorkChange}
                />
                <Label
                    htmlFor={`community-work-${proofOfWork.id}`}
                    className="ml-2 text-sm font-medium"
                >
                    This is community work (public speaking, organizing events, open source, etc.)
                </Label>
            </div>

            <div className="mb-5">
                <Label htmlFor={`work-${index}-title`} className="text-sm font-medium block mb-2">
                    Title<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                    id={`work-${index}-title`}
                    placeholder="Enter job title or role"
                    value={proofOfWork.title}
                    onChange={handleTitleChange}
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {!isCommunityWork && (
                <div className="mb-5">
                    <Label htmlFor={`work-${index}-company`} className="text-sm font-medium block mb-2">
                        Company<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                        id={`work-${index}-company`}
                        placeholder="Enter company name"
                        value={proofOfWork.company}
                        onChange={handleCompanyChange}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            )}

            <div className="mb-5">
                <Label htmlFor={`work-${index}-description`} className="text-sm font-medium block mb-2">
                    Description<span className="text-red-500 ml-1">*</span>
                </Label>
                <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse rounded"></div>}>
                    <MarkdownEditor
                        initialValue={proofOfWork.description || ''}
                        onChange={handleDescriptionChange}
                    />
                </Suspense>
                <p className="text-xs text-gray-500 mt-1">
                    Describe your responsibilities, achievements, and the impact of your work.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div>
                    <Label className="text-sm font-medium block mb-2">
                        Start Date<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <DateSelector
                        years={years}
                        months={months}
                        selectedYear={proofOfWork.startDate.year}
                        selectedMonth={proofOfWork.startDate.month}
                        selectedDay={proofOfWork.startDate.day}
                        onYearChange={(year) => {
                            onUpdate(proofOfWork.id, {
                                startDate: { ...proofOfWork.startDate, year }
                            });
                        }}
                        onMonthChange={(month) => {
                            onUpdate(proofOfWork.id, {
                                startDate: { ...proofOfWork.startDate, month }
                            });
                        }}
                        onDayChange={(day) => {
                            onUpdate(proofOfWork.id, {
                                startDate: { ...proofOfWork.startDate, day }
                            });
                        }}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">
                            End Date
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`currently-working-${proofOfWork.id}`}
                                checked={currentlyWorking}
                                onCheckedChange={handleCurrentlyWorkingChange}
                            />
                            <Label
                                htmlFor={`currently-working-${proofOfWork.id}`}
                                className="text-xs cursor-pointer"
                            >
                                I am currently working here
                            </Label>
                        </div>
                    </div>

                    {!currentlyWorking ? (
                        <DateSelector
                            years={years}
                            months={months}
                            selectedYear={proofOfWork.endDate?.year || ""}
                            selectedMonth={proofOfWork.endDate?.month || ""}
                            selectedDay={proofOfWork.endDate?.day || ""}
                            onYearChange={(year) => {
                                onUpdate(proofOfWork.id, {
                                    endDate: { ...(proofOfWork.endDate || { year: "", month: "", day: "" }), year }
                                });
                            }}
                            onMonthChange={(month) => {
                                onUpdate(proofOfWork.id, {
                                    endDate: { ...(proofOfWork.endDate || { year: "", month: "", day: "" }), month }
                                });
                            }}
                            onDayChange={(day) => {
                                onUpdate(proofOfWork.id, {
                                    endDate: { ...(proofOfWork.endDate || { year: "", month: "", day: "" }), day }
                                });
                            }}
                        />
                    ) : (
                        <div className="text-sm text-gray-500 italic border border-dashed border-gray-200 rounded p-2 bg-gray-50 text-center">
                            Present
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

ProofOfWorkItem.displayName = "ProofOfWorkItem";
export default ProofOfWorkItem;