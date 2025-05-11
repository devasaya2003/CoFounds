"use client";

import { useCallback } from "react";
import { Tabs } from "@/components/ui/tabs";
import { StatusAlert } from "../StatusAlert";
import { CompletionGuide } from "../CompletionGuide";
import { useFormManagement } from "../../hooks/form";
import { SkillsUpdatePayload } from "../types";
import { UserProfile } from "../../api";
import TabList from "./TabList";
import TabContent from "./TabContent";
import FormActions from "./FormActions";

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
  // Get all form management functionality
  const formManagement = useFormManagement(
    defaultTab,
    profileData,
    refetchProfile
  );

  const {
    activeTab,
    handleTabChange,
    statusMessage,
    hasUnsavedChanges,
    setFormData
  } = formManagement;

  // Handler for skills data
  const handleSkillsData = useCallback((data: SkillsUpdatePayload) => {
    setFormData({
      type: 'skills',
      data: {
        skillsUpdateData: {
          user_id: formManagement.userId,
          updated_skillset: data.updated_skillset,
          new_skillset: data.new_skillset,
          deleted_skillset: data.deleted_skillset
        }
      }
    });
  }, [formManagement.userId, setFormData]);
  
  // Handler for certificate data
  const handleCertificateData = useCallback((data: any) => {
    setFormData({
      type: 'certificates',
      data
    });
  }, [setFormData]);

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

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabList 
          activeTab={activeTab}
          hasUnsavedChanges={hasUnsavedChanges}
          handleTabChange={handleTabChange}
          isNewUser={isNewUser}
          profileData={profileData}
        />

        <TabContent 
          formManagement={formManagement}
          profileData={profileData}
          renderJsonData={renderJsonData}
          handleSkillsData={handleSkillsData}
          handleCertificateData={handleCertificateData}
        />
      </Tabs>

      <FormActions 
        formManagement={formManagement}
        isNewUser={isNewUser}
      />
    </div>
  );
}