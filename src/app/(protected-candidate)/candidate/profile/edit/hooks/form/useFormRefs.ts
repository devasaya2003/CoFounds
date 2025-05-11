import { useRef } from "react";
import { PersonalInfoFormRef } from "../../components/PersonalInfoForm";
import { SkillsFormRef } from "../../components/SkillsForm";
import { CertificateFormRef } from "../../components/CertificateForm";
import { ProofOfWorkFormRef } from "../../components/proof-of-work/types";

export function useFormRefs() {
  const personalFormRef = useRef<PersonalInfoFormRef>(null);
  const skillsFormRef = useRef<SkillsFormRef>(null);
  const certificateFormRef = useRef<CertificateFormRef>(null);
  const proofOfWorkFormRef = useRef<ProofOfWorkFormRef>(null);

  return {
    personalFormRef,
    skillsFormRef,
    certificateFormRef,
    proofOfWorkFormRef
  };
}