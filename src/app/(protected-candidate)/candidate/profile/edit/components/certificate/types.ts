import { UserProfile } from '../../api';

export interface Certificate {
  id: string;
  title: string;
  description: string | null;
  startDate: {
    year: string;
    month: string;
    day: string;
  };
  endDate: {
    year: string;
    month: string;
    day: string;
  };
  link?: string;
  userId?: string;
}

export interface CertificateUpdatePayload {
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
}

export interface CertificateFormRef {
  resetForm: () => void;
  saveForm: () => void;
}

export interface CertificateFormProps {
  profile: UserProfile;
  onChange: (hasChanges: boolean) => void;
  onSaveData: (data: { certificatesUpdateData: CertificateUpdatePayload }) => void;
}

// Constants
export const MAX_CERTIFICATES = 10;