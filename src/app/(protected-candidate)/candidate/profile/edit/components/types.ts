import { UserProfile } from "../api";

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
  certificatesUpdateData: {
    user_id: string;
    new_certificates: Array<{
      title: string;
      description: string | null;
      started_at: string | null;
      end_at: string | null;
      link: string | null;
    }>;
    updated_certificates: Array<{
      id: string;
      title: string;
      description: string | null;
      started_at: string | null;
      end_at: string | null;
      link: string | null;
    }>;
    deleted_certificates: string[];
  };
};

export type FormDataState =
  | { type: 'personal-info'; data: Partial<UserProfile> }
  | { type: 'skills'; data: SkillsFormData }
  | { type: 'certificates'; data: CertificateFormData };
//   | { type: 'education'; data: any }
//   | { type: 'projects'; data: any }
//   | { type: 'experience'; data: any };

export const VALID_TABS = [
  'personal-info', 
  'skills', 
  'education', 
  'projects', 
  'certificates', 
  'experience'
];