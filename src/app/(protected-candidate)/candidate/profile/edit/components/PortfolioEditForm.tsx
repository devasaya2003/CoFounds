'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PersonalInfoStep from '@/app/(protected-candidate)/candidate/app/on-boarding/components/steps/PersonalInfoStep';
import EducationStep from '@/app/(protected-candidate)/candidate/app/on-boarding/components/steps/EducationStep';
import CertificateStep from '@/app/(protected-candidate)/candidate/app/on-boarding/components/steps/CertificateStep';
import ProofOfWorkStep from '@/app/(protected-candidate)/candidate/app/on-boarding/components/steps/ProofOfWorkStep';
import ProjectStep from '@/app/(protected-candidate)/candidate/app/on-boarding/components/steps/ProjectStep';
import { UserProfile } from '../api';
import { OnboardingFormFields, DateField, Education, Certificate, ProofOfWork, Project } from '@/types/candidate_onboarding';
import { SkillWithLevel } from '@/types/shared';

interface PortfolioEditFormProps {
  userData: UserProfile;
  onSave: (formData: Partial<UserProfile>) => Promise<void>;
  isSaving: boolean;
}

// Helper function to convert ISO date to DateField format
const isoToDateField = (isoDate: string | null): DateField => {
  if (!isoDate) return { year: '', month: '', day: '' };
  
  const date = new Date(isoDate);
  return {
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    day: date.getDate().toString().padStart(2, '0')
  };
};

// Helper function to convert DateField to ISO date
const dateFieldToIso = (dateField: DateField): string | null => {
  if (!dateField.year || !dateField.month || !dateField.day) return null;
  
  try {
    const date = new Date(
      parseInt(dateField.year),
      parseInt(dateField.month) - 1,
      parseInt(dateField.day)
    );
    return date.toISOString();
  } catch (e) {
    console.error('Invalid date:', dateField);
    return null;
  }
};

export default function PortfolioEditForm({ userData, onSave, isSaving }: PortfolioEditFormProps) {
  const [activeSection, setActiveSection] = useState('personal');
  const [formChanged, setFormChanged] = useState(false);
  
  // Map API data to form format
  const mapApiToFormData = (data: UserProfile): OnboardingFormFields => {
    return {
      userName: data.userName || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      description: data.description || '',
      dateOfBirth: { year: '', month: '', day: '' }, // Default value
      
      // Map skills to expected format
      skills: (data.skillset || []).map(item => ({
        id: item.id,
        name: item.skill.name,
        level: (item.skillLevel || 'intermediate') as 'beginner' | 'intermediate' | 'advanced'
      })),
      
      // Map education to expected format
      education: (data.education || []).map(edu => ({
        id: edu.id,
        institution: edu.eduFrom,
        degree: edu.degree.name,
        startDate: isoToDateField(edu.startedAt),
        endDate: isoToDateField(edu.endAt),
        currentlyStudying: !edu.endAt
      })),
      
      // Map certificates to expected format
      certificates: (data.certificates || []).map(cert => ({
        id: cert.id,
        title: cert.title,
        description: cert.description || '',
        startDate: isoToDateField(cert.startedAt),
        endDate: isoToDateField(cert.endAt),
        fileUrl: cert.filePath || '',
        externalUrl: cert.link || '',
        currentlyPursuing: !cert.endAt
      })),
      
      // Map experience to expected format
      proofsOfWork: (data.experience || []).map(exp => ({
        id: exp.id,
        title: exp.title,
        company_name: exp.companyName,
        description: exp.description || '',
        startDate: isoToDateField(exp.startedAt),
        endDate: isoToDateField(exp.endAt),
        currentlyWorking: !exp.endAt,
        isCommunityWork: false // Not in API, default value
      })),
      
      // Map projects to expected format
      projects: (data.projects || []).map(proj => ({
        id: proj.id,
        title: proj.title,
        description: proj.description || '',
        projectLink: proj.link || '',
        startDate: isoToDateField(proj.startedAt),
        endDate: isoToDateField(proj.endAt),
        currentlyBuilding: !proj.endAt
      }))
    };
  };
  
  // Convert to form format
  const formData = mapApiToFormData(userData);
  
  // Set up form
  const form = useForm<OnboardingFormFields>({
    defaultValues: formData,
    mode: 'onChange'
  });
  
  const { register, watch, setValue, getValues, formState: { errors, isDirty } } = form;
  
  // Track form changes
  useEffect(() => {
    setFormChanged(isDirty);
  }, [isDirty]);
  
  // Update form values when userData changes
  useEffect(() => {
    const mappedData = mapApiToFormData(userData);
    Object.entries(mappedData).forEach(([key, value]) => {
      setValue(key as keyof OnboardingFormFields, value as any);
    });
  }, [userData, setValue]);
  
  // Handler for section saving
  const handleSectionSave = async () => {
    if (!formChanged) return;
    
    const currentValues = getValues();
    let updatedData: Partial<UserProfile> = {};
    
    // Convert form values to API format based on active section
    if (activeSection === 'personal') {
      // Get new skills and existing skills
      const newSkills = currentValues.skills.filter(s => typeof s.id === 'string' && s.id.startsWith('temp-'));
      const existingSkills = currentValues.skills.filter(s => !(typeof s.id === 'string' && s.id.startsWith('temp-')));
      
      // Find existing skillset items in userData to preserve structure
      const existingUserSkillset = userData.skillset || [];
      
      updatedData = {
        firstName: currentValues.firstName,
        lastName: currentValues.lastName,
        description: currentValues.description,
        // Map existing skills preserving createdAt/updatedAt, add new skills
        skillset: [
          // Map existing skills with preserved structure but updated values
          ...existingSkills.map(skill => {
            const originalSkill = existingUserSkillset.find(s => s.id === skill.id);
            return {
              id: skill.id,
              skill: {
                id: originalSkill?.skill.id || '',
                name: skill.name,
                createdAt: originalSkill?.skill.createdAt || new Date().toISOString(),
                updatedAt: originalSkill?.skill.updatedAt || new Date().toISOString()
              },
              skillLevel: skill.level,
              createdAt: originalSkill?.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }),
          // Add new skills with necessary structure
          ...newSkills.map(skill => ({
            id: undefined as any, // Remove ID for new skills
            skill: {
              id: '', // Backend will generate ID
              name: skill.name,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            skillLevel: skill.level,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
        ]
      };
    } 
    else if (activeSection === 'education') {
      updatedData = {
        education: currentValues.education.map(edu => ({
          id: typeof edu.id === 'string' && edu.id.startsWith('temp-') ? undefined : edu.id,
          eduFrom: edu.institution,
          degree: { name: edu.degree },
          startedAt: dateFieldToIso(edu.startDate),
          endAt: edu.currentlyStudying ? null : dateFieldToIso(edu.endDate || { year: '', month: '', day: '' })
        }))
      };
    }
    else if (activeSection === 'certificates') {
      updatedData = {
        certificates: currentValues.certificates.map(cert => ({
          id: typeof cert.id === 'string' && cert.id.startsWith('temp-') ? undefined : cert.id,
          title: cert.title,
          description: cert.description,
          filePath: cert.fileUrl,
          link: cert.externalUrl,
          startedAt: dateFieldToIso(cert.startDate),
          endAt: cert.endDate ? null : dateFieldToIso(cert.endDate || { year: '', month: '', day: '' })
        }))
      };
    }
    else if (activeSection === 'experience') {
      updatedData = {
        experience: currentValues.proofsOfWork.map(exp => ({
          id: typeof exp.id === 'string' && exp.id.startsWith('temp-') ? undefined : exp.id,
          title: exp.title,
          companyName: exp.company_name,
          description: exp.description,
          startedAt: dateFieldToIso(exp.startDate),
          endAt: exp.endDate ? null : dateFieldToIso(exp.endDate || { year: '', month: '', day: '' })
        }))
      };
    }
    else if (activeSection === 'projects') {
      updatedData = {
        projects: currentValues.projects.map(proj => ({
          id: typeof proj.id === 'string' && proj.id.startsWith('temp-') ? undefined : proj.id,
          title: proj.title,
          description: proj.description,
          link: proj.projectLink,
          startedAt: dateFieldToIso(proj.startDate),
          endAt: proj.endDate ? null : dateFieldToIso(proj.endDate || { year: '', month: '', day: '' })
        }))
      };
    }
    
    try {
      await onSave(updatedData);
      setFormChanged(false);
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };
  
  // Create functions to handle form items
  
  // Education handlers
  const handleAddEducation = () => {
    const education = getValues('education') || [];
    const newEducation: Education = {
      id: `temp-${Date.now()}`,
      institution: '',
      degree: '',
      startDate: { year: '', month: '', day: '' },
      endDate: { year: '', month: '', day: '' },
      currentlyStudying: false
    };
    
    setValue('education', [...education, newEducation]);
    setFormChanged(true);
  };
  
  const handleRemoveEducation = (id: string) => {
    const education = getValues('education') || [];
    setValue('education', education.filter(edu => edu.id !== id));
    setFormChanged(true);
  };
  
  const handleUpdateEducation = (id: string, updates: Partial<Education>) => {
    const education = getValues('education') || [];
    const index = education.findIndex(edu => edu.id === id);
    
    if (index !== -1) {
      const updatedEducation = [...education];
      updatedEducation[index] = { ...updatedEducation[index], ...updates };
      setValue('education', updatedEducation);
      setFormChanged(true);
    }
  };
  
  // Certificate handlers
  const handleAddCertificate = () => {
    const certificates = getValues('certificates') || [];
    const newCertificate: Certificate = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      startDate: { year: '', month: '', day: '' },
      endDate: { year: '', month: '', day: '' },
      fileUrl: '',
      externalUrl: '',
    };
    
    setValue('certificates', [...certificates, newCertificate]);
    setFormChanged(true);
  };
  
  const handleRemoveCertificate = (id: string) => {
    const certificates = getValues('certificates') || [];
    setValue('certificates', certificates.filter(cert => cert.id !== id));
    setFormChanged(true);
  };
  
  const handleUpdateCertificate = (id: string, updates: Partial<Certificate>) => {
    const certificates = getValues('certificates') || [];
    const index = certificates.findIndex(cert => cert.id === id);
    
    if (index !== -1) {
      const updatedCertificates = [...certificates];
      updatedCertificates[index] = { ...updatedCertificates[index], ...updates };
      setValue('certificates', updatedCertificates);
      setFormChanged(true);
    }
  };
  
  // Experience handlers
  const handleAddExperience = () => {
    const proofsOfWork = getValues('proofsOfWork') || [];
    const newExperience: ProofOfWork = {
      id: `temp-${Date.now()}`,
      title: '',
      company_name: '',
      description: '',
      startDate: { year: '', month: '', day: '' },
      endDate: { year: '', month: '', day: '' },
      currentlyWorking: false,
      isCommunityWork: false
    };
    
    setValue('proofsOfWork', [...proofsOfWork, newExperience]);
    setFormChanged(true);
  };
  
  const handleRemoveExperience = (id: string) => {
    const proofsOfWork = getValues('proofsOfWork') || [];
    setValue('proofsOfWork', proofsOfWork.filter(exp => exp.id !== id));
    setFormChanged(true);
  };
  
  const handleUpdateExperience = (id: string, updates: Partial<ProofOfWork>) => {
    const proofsOfWork = getValues('proofsOfWork') || [];
    const index = proofsOfWork.findIndex(exp => exp.id === id);
    
    if (index !== -1) {
      const updatedExperience = [...proofsOfWork];
      updatedExperience[index] = { ...updatedExperience[index], ...updates };
      setValue('proofsOfWork', updatedExperience);
      setFormChanged(true);
    }
  };
  
  // Project handlers
  const handleAddProject = () => {
    const projects = getValues('projects') || [];
    const newProject: Project = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      projectLink: '',
      startDate: { year: '', month: '', day: '' },
      endDate: { year: '', month: '', day: '' },
      currentlyBuilding: false
    };
    
    setValue('projects', [...projects, newProject]);
    setFormChanged(true);
  };
  
  const handleRemoveProject = (id: string) => {
    const projects = getValues('projects') || [];
    setValue('projects', projects.filter(proj => proj.id !== id));
    setFormChanged(true);
  };
  
  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    const projects = getValues('projects') || [];
    const index = projects.findIndex(proj => proj.id === id);
    
    if (index !== -1) {
      const updatedProjects = [...projects];
      updatedProjects[index] = { ...updatedProjects[index], ...updates };
      setValue('projects', updatedProjects);
      setFormChanged(true);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Section navigation */}
      <div className="px-6 py-4 border-b">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          <button
            onClick={() => {
              if (formChanged) handleSectionSave();
              setActiveSection('personal');
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              activeSection === 'personal' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Personal Info
          </button>
          
          <button
            onClick={() => {
              if (formChanged) handleSectionSave();
              setActiveSection('experience');
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              activeSection === 'experience' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Experience
          </button>
          
          <button
            onClick={() => {
              if (formChanged) handleSectionSave();
              setActiveSection('education');
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              activeSection === 'education' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Education
          </button>
          
          <button
            onClick={() => {
              if (formChanged) handleSectionSave();
              setActiveSection('projects');
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              activeSection === 'projects' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Projects
          </button>
          
          <button
            onClick={() => {
              if (formChanged) handleSectionSave();
              setActiveSection('certificates');
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              activeSection === 'certificates' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Certificates
          </button>
        </nav>
      </div>
      
      {/* Active form section */}
      <div className="p-6">
        {activeSection === 'personal' && (
          <PersonalInfoStep
            formState={{
              firstName: getValues('firstName') || '',
              lastName: getValues('lastName') || '',
              description: getValues('description') || '',
              skills: getValues('skills') || [],
              dateOfBirth: getValues('dateOfBirth') || { year: '', month: '', day: '' }
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={handleSectionSave}
            isSubmitting={isSaving}
          />
        )}
        
        {activeSection === 'education' && (
          <EducationStep
            formState={{
              education: getValues('education') || []
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={handleSectionSave}
            onPreviousStep={() => {}}
            onAddEducation={handleAddEducation}
            onRemoveEducation={handleRemoveEducation}
            onUpdateEducation={handleUpdateEducation}
            isSubmitting={isSaving}
          />
        )}
        
        {activeSection === 'certificates' && (
          <CertificateStep
            formState={{
              certificates: getValues('certificates') || []
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={handleSectionSave}
            onPreviousStep={() => {}}
            onAddCertificate={handleAddCertificate}
            onRemoveCertificate={handleRemoveCertificate}
            onUpdateCertificate={handleUpdateCertificate}
            isSubmitting={isSaving}
          />
        )}
        
        {activeSection === 'experience' && (
          <ProofOfWorkStep
            formState={{
              proofsOfWork: getValues('proofsOfWork') || []
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={handleSectionSave}
            onPreviousStep={() => {}}
            onAddProofOfWork={handleAddExperience}
            onRemoveProofOfWork={handleRemoveExperience}
            onUpdateProofOfWork={handleUpdateExperience}
            isSubmitting={isSaving}
          />
        )}
        
        {activeSection === 'projects' && (
          <ProjectStep
            formState={{
              projects: getValues('projects') || []
            }}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            onNextStep={handleSectionSave}
            onPreviousStep={() => {}}
            onAddProject={handleAddProject}
            onRemoveProject={handleRemoveProject}
            onUpdateProject={handleUpdateProject}
            isSubmitting={isSaving}
          />
        )}
        
        {/* Section actions */}
        {formChanged && (
          <div className="border-t mt-8 pt-6 flex justify-end">
            <button
              onClick={handleSectionSave}
              disabled={isSaving}
              className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save This Section'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}