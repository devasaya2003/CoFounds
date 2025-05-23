"use client";

import { useCallback } from "react";
import { Tabs } from "@/components/ui/tabs";
import { StatusAlert } from "../StatusAlert";
import { CompletionGuide } from "../CompletionGuide";
import { useFormManagement } from "../../hooks/form";
import { CertificateFormData, SkillsUpdatePayload, ProofOfWorkFormData } from "../types";
import { UserProfile } from "../../api";
import { EducationUpdatePayload } from "../education/types";
import { ProjectUpdatePayload } from "../project/types";
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
  const handleCertificateData = useCallback((data: CertificateFormData) => {
    setFormData({
      type: 'certificates',
      data
    });
  }, [setFormData]);

  // Handler for proof of work data
  const handleProofOfWorkData = useCallback((data: ProofOfWorkFormData) => {
    setFormData({
      type: 'proof-of-work',
      data: data.proofOfWorkUpdateData
    });
  }, [setFormData]);

  // Add handler for education data
  const handleEducationData = useCallback((data: { educationUpdateData: EducationUpdatePayload }) => {
    setFormData({
      type: 'education',
      data: data.educationUpdateData
    });
  }, [setFormData]);

  // Add handler for project data
  const handleProjectData = useCallback((data: { projectsUpdateData: ProjectUpdatePayload }) => {
    setFormData({
      type: 'projects',
      data: data.projectsUpdateData
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
          handleProofOfWorkChange={formManagement.handleProofOfWorkChange}
          handleProofOfWorkData={handleProofOfWorkData}
          handleEducationChange={formManagement.handleEducationChange}
          handleEducationData={handleEducationData}
          handleProjectChange={formManagement.handleProjectChange}
          handleProjectData={handleProjectData}
        />
      </Tabs>

      <FormActions 
        formManagement={formManagement}
        isNewUser={isNewUser}
      />
    </div>
  );
}