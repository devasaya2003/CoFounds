import { AlertCircle, CheckCircle } from "lucide-react";
import { UserProfile } from "../api";

interface CompletionGuideProps {
  profileData: UserProfile;
  isNewUser: boolean;
}

export function CompletionGuide({ profileData, isNewUser }: CompletionGuideProps) {
  if (!isNewUser) return null;
  
  const isPersonalInfoComplete = Boolean(
    profileData.firstName && 
    profileData.lastName
  );
  
  const hasSkills = profileData.skillset && profileData.skillset.length > 0;
  
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
}