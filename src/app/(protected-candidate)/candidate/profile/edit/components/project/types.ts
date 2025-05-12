import { UserProfile } from "../../api";

export interface ProjectDate {
    year: string;
    month: string;
    day: string;
}

export interface Project {
    id: string;
    title: string;
    description: string | null;
    link: string | null;
    startDate: ProjectDate;
    endDate: ProjectDate | null;
    userId?: string;
    currentlyBuilding: boolean;
}

export interface ProjectFormProps {
    profile: UserProfile;
    onChange: (hasChanges: boolean) => void;
    onSaveData: (data: { projectsUpdateData: ProjectUpdatePayload }) => void;
}

export interface ProjectFormRef {
    resetForm: () => void;
    saveForm: () => void;
}

export interface ProjectUpdatePayload {
    user_id: string;
    new_projects: {
        title: string;
        description: string | null;
        link: string | null;
        started_at: string | null;
        end_at: string | null;
    }[];
    updated_projects: {
        id: string;
        title: string;
        description: string | null;
        link: string | null;
        started_at: string | null;
        end_at: string | null;
    }[];
    deleted_projects: string[];
}

export const MAX_PROJECTS = 5;