'use client';

import React, { ChangeEvent, memo, useCallback, useMemo, Suspense, lazy } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import DateSelector from '@/components/DateSelector/DateSelector';
import { Project } from './types';

// Lazy-load the markdown editor since it's heavy
const MarkdownEditor = lazy(() => import('@/components/RichTextEditor/RichTextEditor'));

interface ProjectItemProps {
    project: Project;
    index: number;
    onUpdate: (id: string, updates: Partial<Project>) => void;
    onRemove: (id: string) => void;
    years: string[];
    months: { value: string; label: string }[];
    onContentReady?: (id: string) => void; // New prop
}

const ProjectItem = memo(({
    project,
    index,
    onUpdate,
    onRemove,
    years,
    months,
    onContentReady,
}: ProjectItemProps) => {
    const currentlyBuilding = project.currentlyBuilding;

    // Memoize default dates to avoid recreating on each render
    const defaultEndDate = useMemo(() => ({
        year: new Date().getFullYear().toString(),
        month: '01',
        day: '01'
    }), []);

    const handleRemove = useCallback(() => {
        onRemove(project.id);
    }, [project.id, onRemove]);

    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onUpdate(project.id, { title: e.target.value });
    }, [project.id, onUpdate]);

    const handleLinkChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onUpdate(project.id, { link: e.target.value });
    }, [project.id, onUpdate]);

    const handleDescriptionChange = useCallback((value: string) => {
        onUpdate(project.id, { description: value });
    }, [project.id, onUpdate]);

    const handleCurrentlyBuildingChange = useCallback((checked: boolean) => {
        onUpdate(project.id, { 
            currentlyBuilding: checked,
            endDate: checked ? null : defaultEndDate
        });
    }, [project.id, onUpdate, defaultEndDate]);

    // Create reusable date change handlers
    const handleStartDateChange = useCallback((field: string, value: string) => {
        onUpdate(project.id, {
            startDate: { ...project.startDate, [field]: value }
        });
    }, [project.id, project.startDate, onUpdate]);

    const handleEndDateChange = useCallback((field: string, value: string) => {
        const updatedEndDate = project.endDate ? 
            { ...project.endDate, [field]: value } : 
            { year: "", month: "", day: "", [field]: value };
        
        onUpdate(project.id, { endDate: updatedEndDate });
    }, [project.id, project.endDate, onUpdate]);

    return (
        <div className="p-6 border border-gray-200 rounded-lg relative bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                type="button"
                onClick={handleRemove}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove project"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="mb-5">
                <Label htmlFor={`project-${index}-title`} className="text-sm font-medium block mb-2">
                    Project Title<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                    id={`project-${index}-title`}
                    placeholder="Enter project title"
                    value={project.title}
                    onChange={handleTitleChange}
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                />
            </div>

            <div className="mb-5">
                <Label htmlFor={`project-${index}-link`} className="text-sm font-medium block mb-2">
                    Project Link (GitHub, Demo, etc.)
                </Label>
                <Input
                    id={`project-${index}-link`}
                    placeholder="https://github.com/yourusername/project"
                    value={project.link || ''}
                    onChange={handleLinkChange}
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                />
            </div>

            <div className="mb-5">
                <Label htmlFor={`project-${index}-description`} className="text-sm font-medium block mb-2">
                    Description<span className="text-red-500 ml-1">*</span>
                </Label>
                <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse rounded"></div>}>
                    <MarkdownEditor
                        initialValue={project.description || ''}
                        onChange={handleDescriptionChange}
                        onContentReady={() => onContentReady?.(project.id)}
                    />
                </Suspense>
                <p className="text-xs text-gray-500 mt-1">
                    Describe your project, technologies used, and your role in development.
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
                        selectedYear={project.startDate.year}
                        selectedMonth={project.startDate.month}
                        selectedDay={project.startDate.day}
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
                                id={`currently-building-${project.id}`}
                                checked={currentlyBuilding}
                                onCheckedChange={handleCurrentlyBuildingChange}
                            />
                            <Label
                                htmlFor={`currently-building-${project.id}`}
                                className="text-xs cursor-pointer"
                            >
                                I am currently building this project
                            </Label>
                        </div>
                    </div>

                    {!currentlyBuilding ? (
                        <DateSelector
                            years={years}
                            months={months}
                            selectedYear={project.endDate?.year || ""}
                            selectedMonth={project.endDate?.month || ""}
                            selectedDay={project.endDate?.day || ""}
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

ProjectItem.displayName = "ProjectItem";
export default ProjectItem;