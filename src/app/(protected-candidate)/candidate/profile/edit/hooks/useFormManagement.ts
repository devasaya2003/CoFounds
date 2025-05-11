import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StatusMessage, FormDataState, VALID_TABS } from "../components/types";
import { PersonalInfoFormRef } from "../components/PersonalInfoForm";
import { SkillsFormRef } from "../components/SkillsForm";
import { updatePersonalInfo, updateSkills, UserProfile } from "../api";
import { useAppSelector } from "@/redux/hooks";

export function useFormManagement(
    defaultTab: string,
    profileData: UserProfile,
    refetchProfile: () => Promise<UserProfile | null>
) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { user } = useAppSelector((state) => state.auth);
    const userId = useMemo(() => user?.id || "", [user?.id]);

    const tabParam = useMemo(() => searchParams?.get('tab'), [searchParams]);
    const isValidTab = useMemo(() =>
        tabParam && VALID_TABS.includes(tabParam),
        [tabParam]
    );

    const hasInitializedTab = useRef<boolean>(false);

    const [activeTab, setActiveTab] = useState<string>(
        isValidTab && tabParam ? tabParam : defaultTab
    );

    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormDataState | null>(null);
    const [activeForm, setActiveForm] = useState<string | null>(null);

    const personalFormRef = useRef<PersonalInfoFormRef>(null);
    const skillsFormRef = useRef<SkillsFormRef>(null);

    useEffect(() => {
        if (!statusMessage) return;

        const timer = setTimeout(() => {
            setStatusMessage(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [statusMessage]);

    useEffect(() => {
        if (hasInitializedTab.current) return;

        if (isValidTab && tabParam) {
            setActiveTab(tabParam);
        } else if (!isValidTab && !hasInitializedTab.current) {
            router.push(`/candidate/profile/edit?tab=${defaultTab}`);
        }

        hasInitializedTab.current = true;
    }, [defaultTab, isValidTab, router, tabParam]);

    const handleTabChange = useCallback((value: string) => {
        if (hasUnsavedChanges) {
            setStatusMessage({
                type: "warning",
                message: "Please save or cancel your changes before switching tabs."
            });
            return;
        }

        // Only update active tab locally if already on the path
        setActiveTab(value);
        
        // Only update URL if necessary to minimize re-renders
        if (value !== tabParam) {
            // Use a more controlled approach to URL updates
            const url = new URL(window.location.href);
            url.searchParams.set('tab', value);
            
            // Use history.replaceState to avoid full navigation
            window.history.replaceState({}, '', url.toString());
        }
    }, [hasUnsavedChanges, tabParam]);

    const handleSaveClick = useCallback(() => {
        if (activeTab === "personal-info" && personalFormRef.current) {
            personalFormRef.current.saveForm();
        } else if (activeTab === "skills" && skillsFormRef.current) {
            skillsFormRef.current.saveForm();
        }

        if (formData) {
            setShowConfirmDialog(true);
        }
    }, [activeTab, formData, personalFormRef, skillsFormRef]);

    const handleCancelChanges = useCallback(() => {
        if (activeTab === "personal-info" && personalFormRef.current) {
            personalFormRef.current.resetForm();
        } else if (activeTab === "skills" && skillsFormRef.current) {
            skillsFormRef.current.resetForm();
        }

        setHasUnsavedChanges(false);
        setFormData(null);
        setStatusMessage({
            type: "info",
            message: "Changes discarded."
        });
    }, [activeTab, personalFormRef, skillsFormRef]);

    const handlePersonalInfoChange = useCallback((hasChanges: boolean) => {
        setHasUnsavedChanges(hasChanges);
        if (hasChanges) {
            setActiveForm("personal-info");
        } else if (activeForm === "personal-info") {
            setActiveForm(null);
        }
    }, [activeForm]);

    const handlePersonalInfoData = useCallback((data: Partial<UserProfile>) => {
        setFormData({
            type: 'personal-info',
            data
        });
    }, []);

    const handleSkillsChange = useCallback((hasChanges: boolean) => {
        setHasUnsavedChanges(hasChanges);
        if (hasChanges) {
            setActiveForm("skills");
        } else if (activeForm === "skills") {
            setActiveForm(null);
        }
    }, [activeForm]);

    const isPersonalInfoComplete = useMemo(() =>
        Boolean(profileData.firstName && profileData.lastName),
        [profileData.firstName, profileData.lastName]
    );

    const hasSkills = useMemo(() =>
        Boolean(profileData.skillset && profileData.skillset.length > 0),
        [profileData.skillset]
    );

    // Add a success handler after form submission
    const handleSubmitSuccess = useCallback((updatedProfile: UserProfile) => {
        // 1. Reset the form data
        setFormData(null);
        
        // 2. Reset unsaved changes flag
        setHasUnsavedChanges(false);
        
        // 3. Hide confirmation dialog if shown
        setShowConfirmDialog(false);
        
        // 4. Show success message
        setStatusMessage({
            type: "success",
            message: "Changes saved successfully."
        });
        
        // 5. Close any dialogs
        setIsSubmitting(false);
    }, []);

    // Update your save handler
    const handleConfirmSave = useCallback(async () => {
        setIsSubmitting(true);
        
        try {
            if (!formData) {
                throw new Error("No form data to save");
            }
            
            let updatedProfile;
            
            if (formData.type === 'personal-info') {
                updatedProfile = await updatePersonalInfo(formData.data);
                updatedProfile = await refetchProfile();
            } else if (formData.type === 'skills') {
                updatedProfile = await updateSkills(formData.data.skillsUpdateData);
                updatedProfile = await refetchProfile();
            }
            
            if (updatedProfile) {
                handleSubmitSuccess(updatedProfile);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            setStatusMessage({
                type: "error",
                message: "Failed to save changes. Please try again."
            });
        } finally {
            setIsSubmitting(false);
            setShowConfirmDialog(false);
        }
    }, [formData, handleSubmitSuccess, refetchProfile]);

    return {
        activeTab,
        statusMessage,
        setStatusMessage,
        showConfirmDialog,
        setShowConfirmDialog,
        hasUnsavedChanges,
        isSubmitting,
        setIsSubmitting,
        formData,
        setFormData,
        personalFormRef,
        skillsFormRef,
        userId,
        handleTabChange,
        handleSaveClick,
        handleCancelChanges,
        handlePersonalInfoChange,
        handlePersonalInfoData,
        handleSkillsChange,
        isPersonalInfoComplete,
        hasSkills,
        setHasUnsavedChanges,
        handleConfirmSave
    };
}