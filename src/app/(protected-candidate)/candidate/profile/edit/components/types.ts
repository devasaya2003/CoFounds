import { UserProfile } from "../api";

export interface StatusMessage {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export interface SkillsUpdatePayload {
  user_id?: string;
  updated_skillset: Array<{
    skill_id: string;
    skill_level: string;
  }>;
  new_skillset: Array<{
    skill_id: string;
    skill_level: string;
  }>;
  deleted_skillset: string[];
}

export type PersonalInfoFormData = Partial<UserProfile>;

export type SkillsFormData = {
  skillsUpdateData: {
    user_id: string;
    updated_skillset: Array<{ skill_id: string; skill_level: string }>;
    new_skillset: Array<{ skill_id: string; skill_level: string }>;
    deleted_skillset: string[];
  };
};

export type FormDataState =
  | { type: 'personal-info'; data: PersonalInfoFormData }
  | { type: 'skills'; data: SkillsFormData }
  | { type: 'other' };

export const VALID_TABS = [
  "personal-info",
  "skills",
  "education",
  "projects",
  "certificates",
  "experience"
];