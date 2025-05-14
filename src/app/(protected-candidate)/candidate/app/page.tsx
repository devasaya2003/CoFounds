'use client';

import { useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/dashboard/SearchBar";
import Pagination from "@/components/dashboard/Pagination";

// Define the dummy jobs data
const dummyJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    companyName: 'TechCorp',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
    salary: '$120,000 - $150,000',
    postedAt: '2025-04-28',
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS']
  },
  {
    id: '2',
    title: 'Backend Engineer',
    companyName: 'DataSystems',
    location: 'Remote',
    employmentType: 'Full-time',
    salary: '$110,000 - $140,000',
    postedAt: '2025-04-30',
    skills: ['Node.js', 'Express', 'MongoDB', 'AWS']
  },
  {
    id: '3',
    title: 'Product Manager',
    companyName: 'InnovateCo',
    location: 'New York, NY',
    employmentType: 'Full-time',
    salary: '$130,000 - $160,000',
    postedAt: '2025-05-01',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Roadmapping']
  },
  {
    id: '4',
    title: 'UI/UX Designer',
    companyName: 'DesignHub',
    location: 'Chicago, IL',
    employmentType: 'Contract',
    salary: '$90,000 - $120,000',
    postedAt: '2025-05-02',
    skills: ['Figma', 'User Testing', 'Wireframing', 'Design Systems']
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    companyName: 'CloudTech',
    location: 'Seattle, WA',
    employmentType: 'Full-time',
    salary: '$125,000 - $155,000',
    postedAt: '2025-05-03',
    skills: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform']
  },
  {
    id: '6',
    title: 'Data Scientist',
    companyName: 'AnalyticsPro',
    location: 'Boston, MA',
    employmentType: 'Full-time',
    salary: '$140,000 - $170,000',
    postedAt: '2025-05-01',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization']
  },
  {
    id: '7',
    title: 'Mobile Developer',
    companyName: 'AppWorks',
    location: 'Austin, TX',
    employmentType: 'Full-time',
    salary: '$100,000 - $130,000',
    postedAt: '2025-04-29',
    skills: ['React Native', 'iOS', 'Android', 'Firebase']
  },
  {
    id: '8',
    title: 'QA Engineer',
    companyName: 'QualityTech',
    location: 'Denver, CO',
    employmentType: 'Full-time',
    salary: '$90,000 - $115,000',
    postedAt: '2025-05-02',
    skills: ['Automated Testing', 'Selenium', 'Test Planning', 'QA Methodologies']
  },
  {
    id: '9',
    title: 'Technical Writer',
    companyName: 'DocuSystems',
    location: 'Remote',
    employmentType: 'Part-time',
    salary: '$70,000 - $90,000',
    postedAt: '2025-05-03',
    skills: ['Technical Documentation', 'API Documentation', 'Markdown', 'Content Management']
  }
];

export default function CandidateDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Search and pagination handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Filter jobs based on search
  const filteredJobs = dummyJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const jobsPerPage = 3;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      
      {currentJobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {currentJobs.map(job => (
              <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                  <p className="text-indigo-600 font-medium mb-2">{job.companyName}</p>
                  <p className="text-gray-600 mb-3">{job.location} • {job.employmentType}</p>
                  <p className="text-gray-700 mb-4">{job.salary}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Posted: {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                    <Link 
                      href={`/jobs/${job.id}`} 
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center mt-6">
          <p className="text-xl text-gray-600">No jobs match your search</p>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
        </div>
      )}
    </>
  );
}