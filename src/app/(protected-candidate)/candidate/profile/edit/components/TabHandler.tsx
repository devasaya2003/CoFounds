"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserProfile,
  updatePersonalInfo,
  updateSkills
} from "../api";
import PersonalInfoForm from "./PersonalInfoForm";
import SkillsForm from "./SkillsForm";
import CertificateForm, { CertificateFormRef } from "./CertificateForm";
import { StatusAlert } from "./StatusAlert";
import { CompletionGuide } from "./CompletionGuide";
import { ConfirmDialog } from "./ConfirmDialog";
import { FormActions } from "./FormActions";
import { useFormManagement } from "../hooks/useFormManagement";
import { SkillsUpdatePayload } from "./types";

interface TabHandlerProps {
  defaultTab: string;
  renderJsonData: (data: unknown) => React.ReactElement;
  profileData: UserProfile;
  refetchProfile: () => Promise<UserProfile | null>;
  isRefetching?: boolean;
  isNewUser?: boolean;
}

export default function TabHandler({ 
  defaultTab, 
  renderJsonData, 
  profileData, 
  refetchProfile, 
  isRefetching = false,
  isNewUser = false 
}: TabHandlerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
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
    setHasUnsavedChanges
  } = useFormManagement(
    defaultTab,
    profileData,
    refetchProfile
  );

  const certificateFormRef = useRef<CertificateFormRef>(null);

  const formRefs = {
    personalFormRef,
    skillsFormRef,
    certificateFormRef
  };

  const [certificateChanges, setCertificateChanges] = useState(false);
  const handleCertificateChange = useCallback((hasChanges: boolean) => {
    setCertificateChanges(hasChanges);
  }, []);

  const handleCertificateData = useCallback((data: any) => {
    // Handle certificate form data
  }, []);

  // Set up route handling
  useEffect(() => {
    if (pathname === "/candidate/profile/edit" && !searchParams?.has('tab')) {
      handleTabChange(defaultTab);
    }
  }, [pathname, defaultTab, handleTabChange, searchParams]);
  
  // Handler for skills data
  const handleSkillsData = (data: SkillsUpdatePayload) => {
    setFormData({
      type: 'skills',
      data: {
        skillsUpdateData: {
          user_id: userId,
          updated_skillset: data.updated_skillset,
          new_skillset: data.new_skillset,
          deleted_skillset: data.deleted_skillset
        }
      }
    });
  };
  
  // Handler for save confirmation
  const handleSaveChanges = async () => {
    try {
      setIsSubmitting(true);

      if (formData) {
        let result;

        switch (formData.type) {
          case "personal-info":
            result = await updatePersonalInfo(formData.data);
            break;
          case "skills":
            result = await updateSkills(formData.data.skillsUpdateData);
            break;
          default:
            console.warn('Unknown form data type for save:', formData);
        }

        setStatusMessage({
          type: "success",
          message: "Changes saved successfully!"
        });

        await refetchProfile();

        if (activeTab === "skills" && skillsFormRef.current) {
          skillsFormRef.current.resetForm();
        } else if (activeTab === "personal-info" && personalFormRef.current) {
          personalFormRef.current.resetForm();
        }

        setHasUnsavedChanges(false);
        setFormData(null);
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
      setStatusMessage({
        type: "error",
        message: "Failed to save changes. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <StatusAlert 
        status={statusMessage}
        isRefetching={isRefetching}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <CompletionGuide 
        profileData={profileData}
        isNewUser={isNewUser}
      />

      <ConfirmDialog 
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleSaveChanges}
        isSubmitting={isSubmitting}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-6 w-full mb-8">
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="skills" disabled={hasUnsavedChanges}>Skills</TabsTrigger>
          <TabsTrigger value="education" disabled={hasUnsavedChanges}>Education</TabsTrigger>
          <TabsTrigger value="projects" disabled={hasUnsavedChanges}>Projects</TabsTrigger>
          <TabsTrigger 
            value="certificates" 
            className="gap-2"
            disabled={hasUnsavedChanges && activeTab !== "certificates"}
          >
            <span>Certificates</span>
            {isNewUser && !profileData.certificates?.length && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                Optional
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="experience" disabled={hasUnsavedChanges}>Experience</TabsTrigger>
        </TabsList>

        <TabsContent value="personal-info">
          <PersonalInfoForm
            ref={personalFormRef}
            profile={profileData}
            onChange={handlePersonalInfoChange}
            onSaveData={handlePersonalInfoData}
            key={`personal-info-${JSON.stringify(profileData)}`}
          />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsForm
            ref={skillsFormRef}
            profile={profileData}
            onChange={handleSkillsChange}
            onSaveData={handleSkillsData}
            key={`skills-${JSON.stringify(profileData.skillset)}`}
          />
        </TabsContent>

        {/* Simple content tabs - these will be replaced with actual forms later */}
        <TabsContent value="education">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Education Data</h2>
            <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
            {renderJsonData(profileData.education)}
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Projects Data</h2>
            <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
            {renderJsonData(profileData.projects)}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="py-6 space-y-6">
          <CertificateForm
            ref={certificateFormRef}
            profile={profileData}
            onChange={handleCertificateChange}
            onSaveData={handleCertificateData}
          />
        </TabsContent>

        <TabsContent value="experience">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Experience Data</h2>
            <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
            {renderJsonData(profileData.experience)}
          </div>
        </TabsContent>
      </Tabs>

      <FormActions 
        hasUnsavedChanges={hasUnsavedChanges}
        isSubmitting={isSubmitting}
        onSave={handleSaveClick}
        onCancel={handleCancelChanges}
        isNewUser={isNewUser}
        isMinimumComplete={isPersonalInfoComplete}
        hasSkills={hasSkills}
      />
    </div>
  );
}