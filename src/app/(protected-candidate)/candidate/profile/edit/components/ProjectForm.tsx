'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useCallback, useTransition, useRef } from 'react';
import { Plus, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/redux/hooks';
import dynamic from 'next/dynamic';
import { formatDateForApi, generateTempId } from './project/utils';
import {
    Project,
    ProjectFormProps,
    ProjectFormRef,
    ProjectUpdatePayload,
    MAX_PROJECTS
} from './project/types';

const ProjectItem = dynamic(() => import('./project/ProjectItem'), {
    ssr: false,
    loading: () => <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 animate-pulse h-40"></div>
});

const EmptyState = dynamic(() => import('./project/EmptyState'), {
    ssr: false
});

const ProjectForm = forwardRef<ProjectFormRef, ProjectFormProps>(
    ({ profile, onChange, onSaveData }, ref) => {
        const [projects, setProjects] = useState<Project[]>([]);
        const [originalProjects, setOriginalProjects] = useState<Project[]>([]);
        const [deletedProjects, setDeletedProjects] = useState<string[]>([]);
        const [isPending, startTransition] = useTransition(); 
        const [lastAddedId, setLastAddedId] = useState<string | null>(null);
        const [isInitializing, setIsInitializing] = useState(true);
        const [readyProjects, setReadyProjects] = useState<Set<string>>(new Set());
        const [allContentReady, setAllContentReady] = useState(false);
                
        const projectRefs = useRef<Map<string, HTMLDivElement>>(new Map());        
        const containerRef = useRef<HTMLDivElement>(null);

        const { user } = useAppSelector((state) => state.auth);
        const currentYear = new Date().getFullYear();

        // Pre-generate values for date selectors
        const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());
        
        const months = [
            { value: '01', label: 'January' }, { value: '02', label: 'February' },
            { value: '03', label: 'March' }, { value: '04', label: 'April' },
            { value: '05', label: 'May' }, { value: '06', label: 'June' },
            { value: '07', label: 'July' }, { value: '08', label: 'August' },
            { value: '09', label: 'September' }, { value: '10', label: 'October' },
            { value: '11', label: 'November' }, { value: '12', label: 'December' }
        ];

        // Initialize projects from profile data
        useEffect(() => {
            if (profile?.projects) {
                setReadyProjects(new Set());
                setAllContentReady(false);

                const formattedProjects = profile.projects.map(proj => {
                    const startDate = proj.startedAt ? {
                        year: new Date(proj.startedAt).getFullYear().toString(),
                        month: (new Date(proj.startedAt).getMonth() + 1).toString().padStart(2, '0'),
                        day: new Date(proj.startedAt).getDate().toString().padStart(2, '0')
                    } : {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01'
                    };

                    const currentlyBuilding = proj.endAt === null;

                    const endDate = !currentlyBuilding && proj.endAt ? {
                        year: new Date(proj.endAt).getFullYear().toString(),
                        month: (new Date(proj.endAt).getMonth() + 1).toString().padStart(2, '0'),
                        day: new Date(proj.endAt).getDate().toString().padStart(2, '0')
                    } : null;

                    return {
                        id: proj.id,
                        title: proj.title || '',
                        description: proj.description || null,
                        link: proj.link || null,
                        startDate,
                        endDate,
                        userId: proj.userId,
                        currentlyBuilding
                    };
                });

                setProjects(formattedProjects);
                
                // Create a deep copy for original state
                const deepCopy = formattedProjects.map(proj => ({
                    ...proj,
                    startDate: { ...proj.startDate },
                    endDate: proj.endDate ? { ...proj.endDate } : null,
                    description: proj.description ? String(proj.description) : null
                }));
                setOriginalProjects(deepCopy);

                if (formattedProjects.length === 0) {
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

        // Handle adding a new project
        const handleAddProject = useCallback(() => {
            if (projects.length >= MAX_PROJECTS) {
                return;
            }

            startTransition(() => {
                const newId = generateTempId();
                const newProject: Project = {
                    id: newId,
                    title: '',
                    description: null,
                    link: null,
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
                    currentlyBuilding: false
                };

                setProjects(prevProjects => [...prevProjects, newProject]);
                setLastAddedId(newId);
                                
                if (onChange && !isInitializing) {
                    onChange(true);
                }
            });
        }, [projects.length, currentYear, onChange, isInitializing]);
        
        // Scroll to newly added project
        useEffect(() => {
            if (lastAddedId && !isPending) {
                const projectElement = projectRefs.current.get(lastAddedId);
                if (projectElement) {                    
                    setTimeout(() => {
                        projectElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 100);
                    setLastAddedId(null); 
                }
            }
        }, [lastAddedId, isPending]);

        // Handle removing a project
        const handleRemoveProject = useCallback((id: string) => {
            setProjects(prevProjects => prevProjects.filter(proj => proj.id !== id));

            if (!id.startsWith('temp-')) {
                setDeletedProjects(prev => [...prev, id]);
            }
            
            if (onChange && !isInitializing) {
                onChange(true);
            }
        }, [onChange, isInitializing]);

        // Handle updating a project
        const handleUpdateProject = useCallback((id: string, updates: Partial<Project>) => {
            setProjects(prevProjects =>
                prevProjects.map(proj => proj.id === id ? { ...proj, ...updates } : proj)
            );
            
            if (onChange && !isInitializing) {
                onChange(true);
            }
        }, [onChange, isInitializing]);

        // Handle when a project's content is ready
        const handleContentReady = useCallback((projectId: string) => {
            setReadyProjects(prev => {
                const newSet = new Set(prev);
                newSet.add(projectId);
                return newSet;
            });
        }, []);

        // Check if all projects have their content ready
        useEffect(() => {
            if (projects.length > 0 && readyProjects.size === projects.length) {
                setAllContentReady(true);
            }
        }, [projects, readyProjects]);

        // Track form changes to notify parent component
        useEffect(() => {
            if (!isInitializing && allContentReady && onChange) {                
                const hasDeletedProjects = deletedProjects.length > 0;
                                
                const hasNewProjects = projects.some(proj => proj.id.startsWith('temp-'));
                                
                const hasModifiedProjects = projects.some(proj => {                    
                    if (proj.id.startsWith('temp-')) return false;
                                        
                    const originalProj = originalProjects.find(op => op.id === proj.id);
                    if (!originalProj) return false;

                    const normalizeDescription = (desc: string | null) => desc?.trim() || '';
                                        
                    return (
                        proj.title !== originalProj.title ||
                        normalizeDescription(proj.description) !== normalizeDescription(originalProj.description) ||
                        proj.link !== originalProj.link ||
                        proj.currentlyBuilding !== originalProj.currentlyBuilding ||
                        JSON.stringify(proj.startDate) !== JSON.stringify(originalProj.startDate) ||
                        JSON.stringify(proj.endDate) !== JSON.stringify(originalProj.endDate)
                    );
                });
                
                const hasChanges = hasDeletedProjects || hasNewProjects || hasModifiedProjects;
                                
                onChange(hasChanges);
            }
        }, [isInitializing, onChange, projects, originalProjects, deletedProjects, allContentReady]);

        // Reset form to original state
        const resetForm = useCallback(() => {
            // Create deep copies to avoid reference issues
            const deepCopy = originalProjects.map(proj => ({
                ...proj,
                startDate: { ...proj.startDate },
                endDate: proj.endDate ? { ...proj.endDate } : null
            }));
            
            setProjects(deepCopy);
            setDeletedProjects([]);
            
            if (onChange) {
                onChange(false);
            }
        }, [originalProjects, onChange]);

        // Save form data
        const saveForm = useCallback(() => {
            const newProjects = projects
                .filter(proj => proj.id.startsWith('temp-'))
                .map(proj => ({
                    title: proj.title,
                    description: proj.description,
                    link: proj.link,
                    started_at: formatDateForApi(proj.startDate),
                    end_at: proj.currentlyBuilding ? null : (proj.endDate ? formatDateForApi(proj.endDate) : null)
                }));

            const updatedProjects = projects
                .filter(proj => {
                    if (proj.id.startsWith('temp-')) return false;

                    const originalProj = originalProjects.find(op => op.id === proj.id);
                    if (!originalProj) return false;

                    return (
                        proj.title !== originalProj.title ||
                        proj.description !== originalProj.description ||
                        proj.link !== originalProj.link ||
                        proj.currentlyBuilding !== originalProj.currentlyBuilding ||
                        JSON.stringify(proj.startDate) !== JSON.stringify(originalProj.startDate) ||
                        JSON.stringify(proj.endDate) !== JSON.stringify(originalProj.endDate)
                    );
                })
                .map(proj => ({
                    id: proj.id,
                    title: proj.title,
                    description: proj.description,
                    link: proj.link,
                    started_at: formatDateForApi(proj.startDate),
                    end_at: proj.currentlyBuilding ? null : (proj.endDate ? formatDateForApi(proj.endDate) : null)
                }));

            const payload: ProjectUpdatePayload = {
                user_id: user?.id || '',
                new_projects: newProjects,
                updated_projects: updatedProjects,
                deleted_projects: deletedProjects
            };

            onSaveData({ projectsUpdateData: payload });
        }, [projects, originalProjects, deletedProjects, onSaveData, user?.id]);

        // Expose methods to parent component
        useImperativeHandle(ref, () => ({
            resetForm,
            saveForm
        }));
        
        // Set reference to project element for scrolling
        const setProjectRef = useCallback((id: string, element: HTMLDivElement | null) => {
            if (element) {
                projectRefs.current.set(id, element);
            } else {
                projectRefs.current.delete(id);
            }
        }, []);

        const remainingProjects = MAX_PROJECTS - projects.length;

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold">Your Projects</h2>
                        <p className="text-gray-600">
                            Showcase your portfolio by adding projects you've worked on.
                        </p>
                    </div>
                    {projects.length > 0 && remainingProjects > 0 && (
                        <Button
                            onClick={handleAddProject}
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
                                    Add Project ({remainingProjects} left)
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-6" ref={containerRef}>
                            {projects.length === 0 ? (
                                <EmptyState onAddProject={handleAddProject} />
                            ) : (
                                <div className="space-y-6">
                                    {projects.map((project, index) => (
                                        <div 
                                            key={project.id}
                                            ref={(el) => setProjectRef(project.id, el)}
                                            className={`transition-opacity duration-300 ${
                                                lastAddedId === project.id && isPending 
                                                    ? 'opacity-70' 
                                                    : 'opacity-100'
                                            }`}
                                        >
                                            <ProjectItem
                                                project={project}
                                                index={index}
                                                onUpdate={handleUpdateProject}
                                                onRemove={handleRemoveProject}
                                                years={years}
                                                months={months}
                                                onContentReady={handleContentReady}
                                            />
                                        </div>
                                    ))}

                                    <div className="flex justify-center mt-6">
                                        {remainingProjects > 0 ? (
                                            <Button
                                                onClick={handleAddProject}
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
                                                        Add Another Project ({remainingProjects} remaining)
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <div className="flex items-center bg-amber-50 text-amber-700 px-4 py-2 rounded-md">
                                                <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                                                <p className="text-sm">
                                                    Maximum of {MAX_PROJECTS} projects allowed. Consider removing less relevant ones.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {/* Loading indicator when adding a new project */}
                            {isPending && (
                                <div className="fixed bottom-6 right-6 bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center z-50">
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Adding project...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
);

ProjectForm.displayName = "ProjectForm";
export default ProjectForm;
export type { ProjectFormRef } from './project/types';