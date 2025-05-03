import { useState } from 'react';
import Link from 'next/link';
import { UserCircle, Building, LogOut } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';

interface TopBarProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export default function TopBar({ activeView, onViewChange }: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { firstName, lastName, companyName } = useAppSelector(state => state.recruiter);
  
  const handleProfileOption = (view: string) => {
    if (onViewChange) {
      onViewChange(view);
    }
    setProfileOpen(false);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">{companyName} Recruiter Dashboard</h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <span>{firstName && lastName ? `${firstName} ${lastName}` : 'User'}</span>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    activeView === 'your-profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleProfileOption('your-profile')}
                >
                  <div className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Your Profile
                  </div>
                </button>
                
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    activeView === 'company-profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleProfileOption('company-profile')}
                >
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    Company Profile
                  </div>
                </button>
                
                <hr className="my-1" />
                
                <Link href="/auth/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}