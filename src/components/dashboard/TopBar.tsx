import { useState } from 'react';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';

interface ProfileOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  divider?: boolean;
  href?: string; // For direct links
}

interface TopBarProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
  dashboardTitle: string;
  userName: string;
  profileOptions: ProfileOption[];
}

export default function TopBar({ 
  activeView, 
  onViewChange,
  dashboardTitle,
  userName,
  profileOptions
}: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  
  const handleProfileOption = (optionId: string) => {
    if (onViewChange) {
      onViewChange(optionId);
    }
    setProfileOpen(false);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">{dashboardTitle}</h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <span>{userName}</span>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                {profileOptions.map((option, index) => (
                  <div key={option.id}>
                    {option.divider && index > 0 && <hr className="my-1" />}
                    {option.href ? (
                      <Link href={option.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center">
                          {option.icon}
                          {option.label}
                        </div>
                      </Link>
                    ) : (
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          activeView === option.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => handleProfileOption(option.id)}
                      >
                        <div className="flex items-center">
                          {option.icon}
                          {option.label}
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}