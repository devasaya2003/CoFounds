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
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TabHandlerProps {
    defaultTab: string;
    renderJsonData: (data: unknown) => React.ReactElement;
    profileData: UserProfile;
    refetchProfile: () => Promise<UserProfile | null>;
    isRefetching?: boolean;
}

interface StatusMessage {
    type: "success" | "error" | "info" | "warning";
    message: string;
}

export default function TabHandler({ defaultTab, renderJsonData, profileData, refetchProfile, isRefetching }: TabHandlerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
    
  const tabParam = searchParams?.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || defaultTab);
    
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
    
  const personalFormRef = useRef<PersonalInfoFormRef>(null);
    
  const [activeForm, setActiveForm] = useState<string | null>(null);
    
  const [formData, setFormData] = useState<Partial<UserProfile> | null>(null);
    
  useEffect(() => {
    if (pathname === "/candidate/profile/edit" && !tabParam) {
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
    
  const handleSaveChanges = async () => {
    try {
      setIsSubmitting(true);
            
      if (activeTab === "personal-info" && personalFormRef.current) {
        personalFormRef.current.saveForm();
      }
            
      if (formData) {
        // Use the specific update function based on the active tab
        let result;
        
        switch (activeTab) {
          case "personal-info":
            result = await updatePersonalInfo(formData);
            break;
          case "skills":
            result = await updateSkills(formData.skillset ?? []);
            break;
          case "education":
            result = await updateEducation(formData.education ?? []);
            break;
          case "projects":
            result = await updateProjects(formData.projects ?? []);
            break;
          case "certificates":
            result = await updateCertificates(formData.certificates ?? []);
            break;
          case "experience":
            result = await updateExperience(formData.experience ?? []);
            break;
          default:
            console.warn('Unknown tab type for save:', activeTab);
        }
        
        // Show success message
        setStatusMessage({
          type: "success", 
          message: "Changes saved successfully!"
        });
        
        // Refetch the profile data after successful save
        await refetchProfile();
        
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
    setFormData(data);
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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Skills Data</h2>
            <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
            {renderJsonData(profileData.skillset)}
          </div>
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
            onClick={handleSaveChanges}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}