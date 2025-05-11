import { useState, useCallback } from "react";
import { FormDataState, StatusMessage } from "../../components/types";
import { updatePersonalInfo, updateSkills, updateCertificates, UserProfile } from "../../api";

export function useFormSubmission(
  formData: FormDataState | null,
  resetFormData: () => void,
  personalFormRef: React.RefObject<any>,
  skillsFormRef: React.RefObject<any>,
  certificateFormRef: React.RefObject<any>,
  activeTab: string,
  refetchProfile: () => Promise<UserProfile | null>,
  setStatusMessage: (message: StatusMessage | null) => void
) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  // Handle save button click
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

  // Handle cancel changes
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

  // Handle form submission success
  const handleSubmitSuccess = useCallback(() => {
    resetFormData();
    setShowConfirmDialog(false);
    setStatusMessage({
      type: "success",
      message: "Changes saved successfully."
    });
    setIsSubmitting(false);
  }, [resetFormData, setStatusMessage]);

  // Confirm and save changes
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
          console.warn('Unknown form type:', formData.type);
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