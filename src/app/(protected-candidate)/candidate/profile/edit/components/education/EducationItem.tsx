'use client';

import React, { ChangeEvent, memo, useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import DateSelector from '@/components/DateSelector/DateSelector';
import PaginatedDegreeSelector from '@/components/DegreeSelector/PaginatedDegreeSelector';
import { Education } from './types';

interface EducationItemProps {
    education: Education;
    index: number;
    onUpdate: (id: string, updates: Partial<Education>) => void;
    onRemove: (id: string) => void;
    years: string[];
    months: { value: string; label: string }[];
    degrees: { id: string; name: string }[];
    isLoadingDegrees: boolean;
}

const EducationItem = memo(({
    education,
    index,
    onUpdate,
    onRemove,
    years,
    months,
    degrees,
    isLoadingDegrees
}: EducationItemProps) => {
    const currentlyStudying = education.currentlyStudying;

    // Memoize default dates to avoid recreating on each render
    const defaultEndDate = useMemo(() => ({
        year: new Date().getFullYear().toString(),
        month: '01',
        day: '01'
    }), []);

    const handleRemove = useCallback(() => {
        onRemove(education.id);
    }, [education.id, onRemove]);

    const handleInstitutionChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onUpdate(education.id, { institution: e.target.value });
    }, [education.id, onUpdate]);

    const handleDegreeChange = useCallback((degreeId: string, degreeName: string) => {
        onUpdate(education.id, { 
            degree: degreeId,
            degreeName: degreeName
        });
    }, [education.id, onUpdate]);

    const handleClearDegree = useCallback(() => {
        onUpdate(education.id, { 
            degree: '',
            degreeName: ''
        });
    }, [education.id, onUpdate]);

    const handleCurrentlyStudyingChange = useCallback((checked: boolean) => {
        onUpdate(education.id, { 
            currentlyStudying: checked,
            endDate: checked ? null : defaultEndDate
        });
    }, [education.id, onUpdate, defaultEndDate]);

    // Create reusable date change handlers
    const handleStartDateChange = useCallback((field: string, value: string) => {
        onUpdate(education.id, {
            startDate: { ...education.startDate, [field]: value }
        });
    }, [education.id, education.startDate, onUpdate]);

    const handleEndDateChange = useCallback((field: string, value: string) => {
        const updatedEndDate = education.endDate ? 
            { ...education.endDate, [field]: value } : 
            { year: "", month: "", day: "", [field]: value };
        
        onUpdate(education.id, { endDate: updatedEndDate });
    }, [education.id, education.endDate, onUpdate]);

    return (
        <div className="p-6 border border-gray-200 rounded-lg relative bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                type="button"
                onClick={handleRemove}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove education"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="mb-5">
                <Label htmlFor={`education-${index}-institution`} className="text-sm font-medium block mb-2">
                    Institution<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                    id={`education-${index}-institution`}
                    placeholder="Enter school or university name"
                    value={education.institution}
                    onChange={handleInstitutionChange}
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                />
            </div>

            <div className="mb-5">
                <Label htmlFor={`education-${index}-degree`} className="text-sm font-medium block mb-2">
                    Degree<span className="text-red-500 ml-1">*</span>
                </Label>
                <PaginatedDegreeSelector
                    selectedDegree={education.degree}
                    onDegreeSelect={handleDegreeChange}
                    onClear={handleClearDegree}
                    initialDegrees={degrees}
                    isLoading={isLoadingDegrees}
                    fetchAll={true} // Fetch all degrees at once
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div>
                    <Label className="text-sm font-medium block mb-2">
                        Start Date<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <DateSelector
                        years={years}
                        months={months}
                        selectedYear={education.startDate.year}
                        selectedMonth={education.startDate.month}
                        selectedDay={education.startDate.day}
                        onYearChange={(year) => handleStartDateChange('year', year)}
                        onMonthChange={(month) => handleStartDateChange('month', month)}
                        onDayChange={(day) => handleStartDateChange('day', day)}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">
                            End Date
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`currently-studying-${education.id}`}
                                checked={currentlyStudying}
                                onCheckedChange={handleCurrentlyStudyingChange}
                            />
                            <Label
                                htmlFor={`currently-studying-${education.id}`}
                                className="text-xs cursor-pointer"
                            >
                                I am currently studying here
                            </Label>
                        </div>
                    </div>

                    {!currentlyStudying ? (
                        <DateSelector
                            years={years}
                            months={months}
                            selectedYear={education.endDate?.year || ""}
                            selectedMonth={education.endDate?.month || ""}
                            selectedDay={education.endDate?.day || ""}
                            onYearChange={(year) => handleEndDateChange('year', year)}
                            onMonthChange={(month) => handleEndDateChange('month', month)}
                            onDayChange={(day) => handleEndDateChange('day', day)}
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

EducationItem.displayName = "EducationItem";
export default EducationItem;