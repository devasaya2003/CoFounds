import { useRef } from "react";
import { PersonalInfoFormRef } from "../../components/PersonalInfoForm";
import { SkillsFormRef } from "../../components/SkillsForm";
import { CertificateFormRef } from "../../components/CertificateForm";
import { ProofOfWorkFormRef } from "../../components/ProofOfWorkForm";
import { EducationFormRef } from "../../components/education/types";
import { ProjectFormRef } from "../../components/ProjectForm"; // Add this import

export function useFormRefs() {
  const personalFormRef = useRef<PersonalInfoFormRef>(null);
  const skillsFormRef = useRef<SkillsFormRef>(null);
  const certificateFormRef = useRef<CertificateFormRef>(null);
  const proofOfWorkFormRef = useRef<ProofOfWorkFormRef>(null);
  const educationFormRef = useRef<EducationFormRef>(null);
  const projectFormRef = useRef<ProjectFormRef>(null); // Add this line

  return {
    personalFormRef,
    skillsFormRef,
    certificateFormRef,
    proofOfWorkFormRef,
    educationFormRef,
    projectFormRef // Add this line
  };
}