'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { Alert } from '@/components/ui/alert';
import { Project } from "@/types/candidate_onboarding";
import { ProjectStepProps } from '../types';
import ProjectForm from './ProjectForm';
import { addProject, removeProject, updateProject } from '@/redux/slices/candidateOnboardingSlice';

export default function ProjectStep({
  formState,
  errors,
  register,
  watch,
  setValue,
  onNextStep,
  onPreviousStep,
  onAddProject,
  onRemoveProject,
  onUpdateProject,
}: ProjectStepProps) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const projects = watch('projects') || [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const generateTempId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: generateTempId(),
      title: '',
      projectLink: '',
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
      currentlyBuilding: false,
    };

    setValue('projects', [...projects, newProject]);
    dispatch(addProject(newProject));
    onAddProject();
  };

  const handleRemoveProject = (id: string) => {
    const updatedProjects = projects.filter(proj => proj.id !== id);
    setValue('projects', updatedProjects);
    dispatch(removeProject(id));
    onRemoveProject(id);
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(proj =>
      proj.id === id ? { ...proj, ...updates } : proj
    );
    
    setValue('projects', updatedProjects);
    dispatch(updateProject({ id, updates }));
    onUpdateProject(id, updates);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Projects</h2>
        <p className="text-gray-600">Add details about your personal or professional projects.</p>
      </div>

      {error && (
        <Alert key="error-alert" variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </Alert>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No projects added yet.</p>
          <button
            type="button"
            onClick={handleAddProject}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project, index) => (
            <ProjectForm
              key={project.id}
              project={project}
              index={index}
              register={register}
              watch={watch}
              setValue={setValue}
              onRemove={() => handleRemoveProject(project.id)}
              onUpdate={(updates) => handleUpdateProject(project.id, updates)}
              years={years}
              months={months}
              days={days}
              errors={errors.projects?.[index]}
            />
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddProject}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Another Project
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4 mt-6">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          onClick={onPreviousStep}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous Step
        </button>

        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          onClick={onNextStep}
        >
          Submit
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}