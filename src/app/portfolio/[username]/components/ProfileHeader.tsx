import { Mail } from 'lucide-react';

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
      {/* Profile avatar with gradient - positioned to overlap */}
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 md:left-4 md:translate-x-0 
                     w-40 h-40 rounded-full border-4 border-white 
                     bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                     shadow-lg z-10">                      
      </div>
      
      {/* Text content - positioned below the banner */}
      <div className="pt-24 md:pt-6 md:pl-48 pb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center md:text-left">
          {firstName || ''} {lastName || ''}
        </h1>
        <p className="text-lg text-gray-600 mb-1 text-center md:text-left">
          {companyName === "COF_PROOF_COMMUNITY"
            ? `Working on ${title}`
            : `${title}${companyName ? ` at ${companyName}` : ""}`}
        </p>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start text-sm text-gray-600 gap-x-6 gap-y-2">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-1" /> {email}
          </div>
        </div>
      </div>
    </div>
  );
}