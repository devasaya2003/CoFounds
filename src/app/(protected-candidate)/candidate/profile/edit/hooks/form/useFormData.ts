import { useState, useCallback } from "react";
import { FormDataState } from "../../components/types";
import { UserProfile } from "../../api";
import { useAppSelector } from "@/redux/hooks";
import { ProofOfWorkUpdatePayload } from "../../components/proof-of-work/types";

export function useFormData() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataState | null>(null);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || "";

  // Handler for personal info changes
  const handlePersonalInfoChange = useCallback((hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
    if (hasChanges) {
      setActiveForm("personal-info");
    } else if (activeForm === "personal-info") {
      setActiveForm(null);
    }
  }, [activeForm]);

  // Handler for personal info data
  const handlePersonalInfoData = useCallback((data: Partial<UserProfile>) => {
    setFormData({
      type: 'personal-info',
      data
    });
  }, []);

  // Handler for skills changes
  const handleSkillsChange = useCallback((hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
    if (hasChanges) {
      setActiveForm("skills");
    } else if (activeForm === "skills") {
      setActiveForm(null);
    }
  }, [activeForm]);

  // Handler for certificate changes
  const handleCertificateChange = useCallback((hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
    if (hasChanges) {
      setActiveForm("certificates");
    } else if (activeForm === "certificates") {
      setActiveForm(null);
    }
  }, [activeForm]);

  // Handler for proof of work changes
  const handleProofOfWorkChange = useCallback((hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
    if (hasChanges) {
      setActiveForm("proof-of-work");
    } else if (activeForm === "proof-of-work") {
      setActiveForm(null);
    }
  }, [activeForm]);

  // Handler for proof of work data
  const handleProofOfWorkData = useCallback((data: { proofOfWorkUpdateData: ProofOfWorkUpdatePayload }) => {
    setFormData({
      type: 'proof-of-work',
      data: data.proofOfWorkUpdateData
    });
  }, []);

  // Reset form data
  const resetFormData = useCallback(() => {
    setFormData(null);
    setHasUnsavedChanges(false);
    setActiveForm(null);
  }, []);

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    formData,
    setFormData,
    activeForm,
    userId,
    handlePersonalInfoChange,
    handlePersonalInfoData,
    handleSkillsChange,
    handleCertificateChange,
    handleProofOfWorkChange,
    handleProofOfWorkData,
    resetFormData
  };
}