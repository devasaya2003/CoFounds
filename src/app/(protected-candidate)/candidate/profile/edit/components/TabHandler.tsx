"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserProfile,
  updatePersonalInfo,
  updateSkills,
  updateEducation,
  updateProjects,
  updateCertificates,
  updateExperience
} from "../api";
import PersonalInfoForm, { PersonalInfoFormRef } from "./PersonalInfoForm";
import SkillsForm, { SkillsFormRef } from "./SkillsForm";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, XCircle, Loader2, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppSelector } from "@/redux/hooks";

interface TabHandlerProps {
  defaultTab: string;
  renderJsonData: (data: unknown) => React.ReactElement;
  profileData: UserProfile;
  refetchProfile: () => Promise<UserProfile | null>;
  isRefetching?: boolean;
  isNewUser?: boolean; // Add this new prop
}

interface StatusMessage {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface SkillsUpdatePayload {
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

type PersonalInfoFormData = Partial<UserProfile>;
type SkillsFormData = {
  skillsUpdateData: {
    user_id: string;
    updated_skillset: Array<{ skill_id: string; skill_level: string }>;
    new_skillset: Array<{ skill_id: string; skill_level: string }>;
    deleted_skillset: string[];
  };
};

type FormDataState =
  | { type: 'personal-info'; data: PersonalInfoFormData }
  | { type: 'skills'; data: SkillsFormData }
  | { type: 'other' };

const VALID_TABS = [
  "personal-info",
  "skills",
  "education",
  "projects",
  "certificates",
  "experience"
];

export default function TabHandler({ 
  defaultTab, 
  renderJsonData, 
  profileData, 
  refetchProfile, 
  isRefetching,
  isNewUser = false 
}: TabHandlerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || "";

  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const tabParam = searchParams?.get('tab');
  const isValidTab = tabParam && VALID_TABS.includes(tabParam);
  const [activeTab, setActiveTab] = useState(isValidTab ? tabParam : defaultTab);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const personalFormRef = useRef<PersonalInfoFormRef>(null);
  const skillsFormRef = useRef<SkillsFormRef>(null);

  const [activeForm, setActiveForm] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormDataState | null>(null);

  useEffect(() => {
    if (pathname === "/candidate/profile/edit" && (!tabParam || !VALID_TABS.includes(tabParam))) {
      router.push(`/candidate/profile/edit?tab=${defaultTab}`);
    }
  }, [pathname, router, tabParam, defaultTab]);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleTabChange = (value: string) => {
    if (hasUnsavedChanges) {
      setStatusMessage({
        type: "warning",
        message: "Please save or cancel your changes before switching tabs."
      });
      return;
    }

    setActiveTab(value);
    router.push(`/candidate/profile/edit?tab=${value}`);
  };

  const handleSaveClick = () => {
    if (activeTab === "personal-info" && personalFormRef.current) {
      personalFormRef.current.saveForm();
    } else if (activeTab === "skills" && skillsFormRef.current) {
      skillsFormRef.current.saveForm();
    }

    if (formData) {
      setShowConfirmDialog(true);
    }
  };

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
          case "other":
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

  const handleCancelChanges = () => {
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
  };

  const handlePersonalInfoChange = (hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
    if (hasChanges) {
      setActiveForm("personal-info");
    } else if (activeForm === "personal-info") {
      setActiveForm(null);
    }
  };

  const handlePersonalInfoData = (data: Partial<UserProfile>) => {
    setFormData({
      type: 'personal-info',
      data
    });
  };

  const handleSkillsChange = (hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
    if (hasChanges) {
      setActiveForm("skills");
    } else if (activeForm === "skills") {
      setActiveForm(null);
    }
  };

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

  const getStatusStyles = (type: StatusMessage['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          className: "bg-green-50 border-green-200 text-green-800"
        };
      case 'error':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          className: "bg-red-50 border-red-200 text-red-800"
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
          className: "bg-amber-50 border-amber-200 text-amber-800"
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
          className: "bg-blue-50 border-blue-200 text-blue-800"
        };
    }
  };

  // Add completion tracking
  const isPersonalInfoComplete = Boolean(
    profileData.firstName && 
    profileData.lastName
  );
  
  const hasSkills = profileData.skillset && profileData.skillset.length > 0;
  
  // Render guide banner if new user
  const renderCompletionGuide = () => {
    if (!isNewUser) return null;
    
    return (
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="font-medium mb-2">Profile Completion Guide:</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            {isPersonalInfoComplete ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            )}
            <span className={isPersonalInfoComplete ? "text-green-700" : "text-amber-700"}>
              Personal Information {isPersonalInfoComplete ? "(Completed)" : "(Required)"}
            </span>
          </li>
          <li className="flex items-center">
            {hasSkills ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            )}
            <span className={hasSkills ? "text-green-700" : "text-amber-700"}>
              Skills {hasSkills ? "(Completed)" : "(Recommended)"}
            </span>
          </li>
          <li className="flex items-center opacity-75">
            <span className="h-5 w-5 mr-2">•</span>
            <span>Education (Optional)</span>
          </li>
          <li className="flex items-center opacity-75">
            <span className="h-5 w-5 mr-2">•</span>
            <span>Projects (Optional)</span>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Status message alert */}
      {statusMessage && (
        <div className="mb-4">
          <Alert className={getStatusStyles(statusMessage.type).className}>
            <div className="flex items-center">
              {getStatusStyles(statusMessage.type).icon}
              <AlertDescription className="ml-2">{statusMessage.message}</AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {/* Add refetching indicator */}
      {isRefetching && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-2" />
          <span className="text-blue-700 text-sm">Refreshing profile data...</span>
        </div>
      )}

      {hasUnsavedChanges && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
          <span className="text-amber-700">
            You have unsaved changes. Please save or cancel your changes before switching tabs.
          </span>
        </div>
      )}

      {/* Add completion guide for new users */}
      {renderCompletionGuide()}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save your changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes to your profile? Don't worry, you can
              always come back and update your information anytime if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveChanges}
              disabled={isSubmitting}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : "Yes, Save Changes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-6 w-full mb-8">
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="skills" disabled={hasUnsavedChanges}>Skills</TabsTrigger>
          <TabsTrigger value="education" disabled={hasUnsavedChanges}>Education</TabsTrigger>
          <TabsTrigger value="projects" disabled={hasUnsavedChanges}>Projects</TabsTrigger>
          <TabsTrigger value="certificates" disabled={hasUnsavedChanges}>Certificates</TabsTrigger>
          <TabsTrigger value="experience" disabled={hasUnsavedChanges}>Experience</TabsTrigger>
        </TabsList>

        <TabsContent value="personal-info">
          <PersonalInfoForm
            ref={personalFormRef}
            profile={profileData}
            onChange={handlePersonalInfoChange}
            onSaveData={handlePersonalInfoData}
          />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsForm
            ref={skillsFormRef}
            profile={profileData}
            onChange={handleSkillsChange}
            onSaveData={handleSkillsData}
          />
        </TabsContent>

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

        <TabsContent value="certificates">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Certificates Data</h2>
            <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
            {renderJsonData(profileData.certificates)}
          </div>
        </TabsContent>

        <TabsContent value="experience">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Experience Data</h2>
            <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
            {renderJsonData(profileData.experience)}
          </div>
        </TabsContent>
      </Tabs>

      {hasUnsavedChanges && (
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancelChanges}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      {/* Add a "Continue to Dashboard" button for new users when minimum is complete */}
      {isNewUser && isPersonalInfoComplete && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => router.push('/candidate/app')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {hasSkills ? "Continue to Dashboard" : "Continue (Adding Skills Recommended)"}
          </Button>
        </div>
      )}
    </div>
  );
}