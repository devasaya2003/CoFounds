import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "../../api";

interface TabListProps {
  activeTab: string;
  hasUnsavedChanges: boolean;
  handleTabChange: (tab: string) => boolean;
  isNewUser?: boolean;
  profileData: UserProfile;
}

export default function TabList({ 
  activeTab, 
  hasUnsavedChanges, 
  handleTabChange, 
  isNewUser = false,
  profileData
}: TabListProps) {
  return (
    <TabsList className="grid grid-cols-6 w-full mb-8">
      <TabsTrigger 
        value="personal-info"
        disabled={hasUnsavedChanges && activeTab !== "personal-info"}
      >
        Personal Info
      </TabsTrigger>
      
      <TabsTrigger 
        value="skills"
        disabled={hasUnsavedChanges && activeTab !== "skills"}
      >
        Skills
      </TabsTrigger>
      
      <TabsTrigger 
        value="education"
        disabled={hasUnsavedChanges && activeTab !== "education"}
      >
        Education
      </TabsTrigger>
      
      <TabsTrigger 
        value="projects"
        disabled={hasUnsavedChanges && activeTab !== "projects"}
      >
        Projects
      </TabsTrigger>
      
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
      
      <TabsTrigger 
        value="experience"
        disabled={hasUnsavedChanges && activeTab !== "experience"}
      >
        Experience
      </TabsTrigger>
    </TabsList>
  );
}