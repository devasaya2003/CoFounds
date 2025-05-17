import { Mail } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps {
  firstName: string | null;
  lastName: string | null;
  title: string;
  companyName: string;
  email: string;
}

export default function ProfileHeader({ firstName, lastName, title, companyName, email }: ProfileHeaderProps) {
  return (
    <div className="relative max-w-5xl mx-auto px-4">
      {/* Profile section with side-by-side layout */}
      <div className="flex items-start">
        {/* Profile avatar with image - positioned to overlap banner */}
        <div className="relative -top-16 
                      w-32 h-32 rounded-full border-4 border-white bg-white
                      shadow-md z-10 overflow-hidden mr-6">
          <Image 
            src="/images/profile-placeholder.png"
            alt="Profile"
            width={128}
            height={128}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        
        {/* Text content - positioned to the right of the image */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {firstName || ''} {lastName || ''}
          </h1>
          <p className="text-md text-gray-600 mb-2">
            {companyName === "COF_PROOF_COMMUNITY"
              ? `Working on ${title}`
              : `${title}${companyName ? ` at ${companyName}` : ""}`}
          </p>
          
          <div className="flex items-center text-sm text-gray-600">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" /> {email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}