import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";

export default function TopBar() {
  const { userName, companyName } = useAppSelector(state => state.recruiter);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {companyName} Recruiter Dashboard
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, <span className="font-semibold">{userName || 'Recruiter'}</span>
          </span>
          <Link 
            href="/recruiter/app/company-profile" 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Company Profile
          </Link>
          <Link 
            href="/recruiter/app/your-profile" 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Your Profile
          </Link>
        </div>
      </div>
    </header>
  );
}