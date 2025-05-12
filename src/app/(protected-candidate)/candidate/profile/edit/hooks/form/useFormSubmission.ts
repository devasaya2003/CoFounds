import { useState, useCallback } from "react";
import { FormDataState, StatusMessage } from "../../components/types";
import { 
  updatePersonalInfo, 
  updateSkills, 
  updateCertificates, 
  updateProofOfWork, 
  updateEducation,
  updateProjects, // Add this import
  UserProfile 
} from "../../api";
import { PersonalInfoFormRef } from "../../components/PersonalInfoForm";
import { SkillsFormRef } from "../../components/SkillsForm";
import { CertificateFormRef } from "../../components/CertificateForm";
import { ProofOfWorkFormRef } from "../../components/proof-of-work/types";
import { EducationFormRef } from "../../components/education/types";
import { ProjectFormRef } from "../../components/ProjectForm"; // Add this import

export function useFormSubmission(
  formData: FormDataState | null,
  resetFormData: () => void,
  personalFormRef: React.RefObject<PersonalInfoFormRef>,
  skillsFormRef: React.RefObject<SkillsFormRef>,
  certificateFormRef: React.RefObject<CertificateFormRef>,
  proofOfWorkFormRef: React.RefObject<ProofOfWorkFormRef>,
  educationFormRef: React.RefObject<EducationFormRef>,
  projectFormRef: React.RefObject<ProjectFormRef>, // Add this parameter
  activeTab: string,
  refetchProfile: () => Promise<UserProfile | null>,
  setStatusMessage: (message: StatusMessage | null) => void
) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const handleSaveClick = useCallback(() => {
    if (activeTab === "personal-info" && personalFormRef.current) {
      personalFormRef.current.saveForm();
    } else if (activeTab === "skills" && skillsFormRef.current) {
      skillsFormRef.current.saveForm();
    } else if (activeTab === "certificates" && certificateFormRef.current) {
      certificateFormRef.current.saveForm();
    } else if (activeTab === "proof-of-work" && proofOfWorkFormRef.current) {
      proofOfWorkFormRef.current.saveForm();
    } else if (activeTab === "education" && educationFormRef.current) {
      educationFormRef.current.saveForm();
    } else if (activeTab === "projects" && projectFormRef.current) { // Add this condition
      projectFormRef.current.saveForm();
    }

    if (formData) {
      setShowConfirmDialog(true);
    }
  }, [activeTab, formData, personalFormRef, skillsFormRef, certificateFormRef, proofOfWorkFormRef, educationFormRef, projectFormRef]);

  const handleCancelChanges = useCallback(() => {
    if (activeTab === "personal-info" && personalFormRef.current) {
      personalFormRef.current.resetForm();
    } else if (activeTab === "skills" && skillsFormRef.current) {
      skillsFormRef.current.resetForm();
    } else if (activeTab === "certificates" && certificateFormRef.current) {
      certificateFormRef.current.resetForm();
    } else if (activeTab === "proof-of-work" && proofOfWorkFormRef.current) {
      proofOfWorkFormRef.current.resetForm();
    } else if (activeTab === "education" && educationFormRef.current) {
      educationFormRef.current.resetForm();
    } else if (activeTab === "projects" && projectFormRef.current) { // Add this condition
      projectFormRef.current.resetForm();
    }

    resetFormData();
    setStatusMessage({
      type: "info",
      message: "Changes discarded."
    });
  }, [activeTab, personalFormRef, skillsFormRef, certificateFormRef, proofOfWorkFormRef, educationFormRef, projectFormRef, resetFormData, setStatusMessage]);

  const handleSubmitSuccess = useCallback(() => {
    resetFormData();
    setShowConfirmDialog(false);
    setStatusMessage({
      type: "success",
      message: "Changes saved successfully."
    });
    setIsSubmitting(false);
  }, [resetFormData, setStatusMessage]);

  const handleConfirmSave = useCallback(async () => {
    setIsSubmitting(true);

    try {
      if (!formData) {
        throw new Error("No form data to save");
      }

      let updatedProfile;

      switch (formData.type) {
        case 'personal-info':
          await updatePersonalInfo(formData.data);
          updatedProfile = await refetchProfile();
          if (personalFormRef.current) {
            personalFormRef.current.resetForm();
          }
          break;
        case 'skills':
          await updateSkills(formData.data.skillsUpdateData);
          updatedProfile = await refetchProfile();
          if (skillsFormRef.current) {
            skillsFormRef.current.resetForm();
          }
          break;
        case 'certificates':
          await updateCertificates(formData.data.certificatesUpdateData);
          updatedProfile = await refetchProfile();
          if (certificateFormRef.current) {
            certificateFormRef.current.resetForm();
          }
          break;
        case 'proof-of-work':
          await updateProofOfWork(formData.data);
          updatedProfile = await refetchProfile();
          if (proofOfWorkFormRef.current) {
            proofOfWorkFormRef.current.resetForm();
          }
          break;
        case 'education':
          await updateEducation(formData.data);
          updatedProfile = await refetchProfile();
          if (educationFormRef.current) {
            educationFormRef.current.resetForm();
          }
          break;
        case 'projects': // Add this case
          await updateProjects(formData.data);
          updatedProfile = await refetchProfile();
          if (projectFormRef.current) {
            projectFormRef.current.resetForm();
          }
          break;
        default:
          console.warn('Unknown form:', formData);
      }

      if (updatedProfile) {
        handleSubmitSuccess();
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setStatusMessage({
        type: "error",
        message: "Failed to save changes. Please try again."
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  }, [formData, handleSubmitSuccess, refetchProfile, setStatusMessage, personalFormRef, skillsFormRef, certificateFormRef, proofOfWorkFormRef, educationFormRef, projectFormRef]);

  return {
    isSubmitting,
    showConfirmDialog,
    setShowConfirmDialog,
    handleSaveClick,
    handleCancelChanges,
    handleConfirmSave
  };
}