import { useState, useCallback } from "react";
import { FormDataState, StatusMessage } from "../../components/types";
import { updatePersonalInfo, updateSkills, updateCertificates, UserProfile } from "../../api";
import { PersonalInfoFormRef } from "../../components/PersonalInfoForm";
import { SkillsFormRef } from "../../components/SkillsForm";
import { CertificateFormRef } from "../../components/CertificateForm";

export function useFormSubmission(
  formData: FormDataState | null,
  resetFormData: () => void,
  personalFormRef: React.RefObject<PersonalInfoFormRef>,
  skillsFormRef: React.RefObject<SkillsFormRef>,
  certificateFormRef: React.RefObject<CertificateFormRef>,
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
    }

    if (formData) {
      setShowConfirmDialog(true);
    }
  }, [activeTab, formData, personalFormRef, skillsFormRef, certificateFormRef]);

  const handleCancelChanges = useCallback(() => {
    if (activeTab === "personal-info" && personalFormRef.current) {
      personalFormRef.current.resetForm();
    } else if (activeTab === "skills" && skillsFormRef.current) {
      skillsFormRef.current.resetForm();
    } else if (activeTab === "certificates" && certificateFormRef.current) {
      certificateFormRef.current.resetForm();
    }

    resetFormData();
    setStatusMessage({
      type: "info",
      message: "Changes discarded."
    });
  }, [activeTab, personalFormRef, skillsFormRef, certificateFormRef, resetFormData, setStatusMessage]);

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
          break;
        case 'skills':
          await updateSkills(formData.data.skillsUpdateData);
          updatedProfile = await refetchProfile();
          break;
        case 'certificates':
          await updateCertificates(formData.data.certificatesUpdateData);
          updatedProfile = await refetchProfile();
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
  }, [formData, handleSubmitSuccess, refetchProfile, setStatusMessage]);

  return {
    isSubmitting,
    showConfirmDialog,
    setShowConfirmDialog,
    handleSaveClick,
    handleCancelChanges,
    handleConfirmSave
  };
}