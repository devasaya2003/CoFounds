import { UserProfile } from "../api";
import { CertificateUpdatePayload } from "./certificate/types";
import { EducationUpdatePayload } from "./education/types";
import { ProofOfWorkUpdatePayload } from "./proof-of-work/types";

export interface StatusMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface SkillsUpdatePayload {
  user_id: string;
  updated_skillset: Array<{ skill_id: string; skill_level: SkillLevel }>;
  new_skillset: Array<{ skill_id: string; skill_level: SkillLevel }>;
  deleted_skillset: string[];
}

export type SkillsFormData = {
  skillsUpdateData: SkillsUpdatePayload;
};

export type CertificateFormData = {
  certificatesUpdateData: CertificateUpdatePayload;
};

export type ProofOfWorkFormData = {
  proofOfWorkUpdateData: ProofOfWorkUpdatePayload;
};

export type FormDataState =
  | { type: 'personal-info'; data: Partial<UserProfile> }
  | { type: 'skills'; data: SkillsFormData }
  | { type: 'certificates'; data: CertificateFormData }
  | { type: 'proof-of-work'; data: ProofOfWorkUpdatePayload }
  | { type: 'education'; data: EducationUpdatePayload };
//   | { type: 'projects'; data: any }

export const VALID_TABS = [
  'personal-info', 
  'skills', 
  'education', 
  'projects', 
  'certificates', 
  'proof-of-work'
];