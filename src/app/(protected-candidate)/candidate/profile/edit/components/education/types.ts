import { UserProfile } from "../../api";

export interface EducationDate {
    year: string;
    month: string;
    day: string;
}

export interface Education {
    id: string;
    institution: string; // Maps to eduFrom in the database
    degree: string;     // Maps to degreeId
    degreeName: string; // For display purposes
    startDate: EducationDate;
    endDate: EducationDate | null;
    userId?: string;
    currentlyStudying: boolean;
    // Remove description as it's not in the database schema
}

export interface EducationFormProps {
    profile: UserProfile;
    onChange: (hasChanges: boolean) => void;
    onSaveData: (data: { educationUpdateData: EducationUpdatePayload }) => void;
}

export interface EducationFormRef {
    resetForm: () => void;
    saveForm: () => void;
}

export interface EducationUpdatePayload {
    user_id: string;
    new_education: {
        institution: string; // Maps to edu_from
        degree_id: string;  // Maps to degree_id
        started_at: string | null;
        end_at: string | null;
    }[];
    updated_education: {
        id: string;
        institution: string;
        degree_id: string;
        started_at: string | null;
        end_at: string | null;
    }[];
    deleted_education: string[];
}

export const MAX_EDUCATION_ENTRIES = 5;