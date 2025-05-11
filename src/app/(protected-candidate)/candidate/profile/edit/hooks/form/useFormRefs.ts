import { useRef } from "react";
import { PersonalInfoFormRef } from "../../components/PersonalInfoForm";
import { SkillsFormRef } from "../../components/SkillsForm";
import { CertificateFormRef } from "../../components/CertificateForm";

export function useFormRefs() {
  const personalFormRef = useRef<PersonalInfoFormRef>(null);
  const skillsFormRef = useRef<SkillsFormRef>(null);
  const certificateFormRef = useRef<CertificateFormRef>(null);

  return {
    personalFormRef,
    skillsFormRef,
    certificateFormRef
  };
}