import { UserExperience } from '@prisma/client';
import { UserProfile } from '../../api';

export interface ProofOfWorkDate {
  year: string;
  month: string;
  day: string;
}

export interface ProofOfWork {
  id: string;
  title: string;
  company: string;
  description: string | null;
  startDate: ProofOfWorkDate;
  endDate: ProofOfWorkDate | null;
  isCommunityWork: boolean;
  currentlyWorking: boolean;
  userId?: string;
}

export interface ProofOfWorkFormProps {
  profile: UserProfile;
  onChange: (hasChanges: boolean) => void;
  onSaveData: (data: { proofOfWorkUpdateData: ProofOfWorkUpdatePayload }) => void;
}

export interface ProofOfWorkFormRef {
  resetForm: () => void;
  saveForm: () => void;
}

export interface ProofOfWorkUpdatePayload {
  user_id: string;
  new_experiences: Array<{
    title: string;
    company: string | null;
    description: string | null;
    started_at: string | null;
    end_at: string | null;
    is_community_work: boolean;
  }>;
  updated_experiences: Array<{
    id: string;
    title: string;
    company: string | null;
    description: string | null;
    started_at: string | null;
    end_at: string | null;
    is_community_work: boolean;
  }>;
  deleted_experiences: string[];
}