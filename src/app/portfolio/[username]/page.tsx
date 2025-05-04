import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Mail, Phone, Calendar, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';

type PortfolioParams = {
  params: {
    username: string;
  };
};

interface Portfolio {
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  email: string;
  description: string | null;
  skillset: Array<{
    skill: {
      name: string;
    };
    skillLevel: string | null;
  }>;
  experience: Array<{
    title: string;
    companyName: string;
    description: string | null;
    startedAt: string | Date;
    endAt: string | Date | null;
  }>;
  education: Array<{
    degree: {
      name: string;
    };
    startedAt: string | Date;
    endAt: string | Date | null;
  }>;
  projects: Array<{
    title: string;
    description: string | null;
    link: string | null;
    startedAt: string | Date;
    endAt: string | Date | null;
  }>;
  certificates: Array<{
    title: string;
    description: string | null;
    filePath: string | null;
    link: string | null;
    startedAt: string | Date | null;
    endAt: string | Date | null;
  }>;
}

interface PortfolioResponse {
  success: boolean;
  data?: Portfolio;
  error?: string;
}

async function fetchPortfolio(username: string): Promise<PortfolioResponse> {
  try {    
    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
    
    const res = await fetch(`${baseUrl}/api/portfolio/${username}`, {
      cache: 'no-store',
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch portfolio: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch portfolio'
    };
  }
}

export async function generateMetadata({ params }: PortfolioParams): Promise<Metadata> {
  const { username } = params;
  const portfolioResult = await fetchPortfolio(username);
  
  if (portfolioResult.success && portfolioResult.data) {
    const portfolio = portfolioResult.data;
    return {
      title: `${portfolio.firstName || ''} ${portfolio.lastName || ''} - Portfolio`,
      description: 'Professional Portfolio'
    };
  }
  
  return {
    title: 'Portfolio Not Found',
    description: 'The requested portfolio could not be found.'
  };
}

function formatDate(date: string | Date | null): string {
  if (!date) return 'Present';
  return new Date(date).getFullYear().toString();
}

export default async function PortfolioPage({ params }: PortfolioParams) {
  const { username } = params;
  const portfolioResult = await fetchPortfolio(username);
  
  if (!portfolioResult.success || !portfolioResult.data) {
    notFound();
  }
    
  const portfolio = portfolioResult.data;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Placeholder for logo/avatar - replace with gradient for now */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <span className="ml-3 font-medium text-gray-800">
              {portfolio.firstName} {portfolio.lastName}
            </span>
          </div>
          <div className="flex space-x-6">
            <Link href="#about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="#experience" className="text-gray-600 hover:text-gray-900">Experience</Link>
            <Link href="#projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
            <Link href="#contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center">
          {/* Avatar section - replace with gradient for now */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 mb-6 md:mb-0 md:mr-8 flex-shrink-0"></div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {portfolio.firstName} {portfolio.lastName}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {portfolio.experience && portfolio.experience.length > 0 ? portfolio.experience[0].title : ''} 
              {portfolio.experience && portfolio.experience.length > 0 && portfolio.experience[0].companyName ? ` at ${portfolio.experience[0].companyName}` : ''}
            </p>
            
            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-6 gap-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" /> {portfolio.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* About section */}
        <section id="about" className="mb-12">
          {portfolio.description && (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: portfolio.description }} />
          )}
        </section>
        
        {/* Skills section */}
        {portfolio.skillset && portfolio.skillset.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skillset.map((skillItem, index) => (
                <div key={index} className="bg-gray-100 border border-gray-200 rounded-md px-3 py-1 text-sm">
                  {skillItem.skill?.name} {skillItem.skillLevel && <span className="text-xs text-gray-500">• {skillItem.skillLevel}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <section id="experience" className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Experience</h2>
            {portfolio.experience.map((exp, index) => (
              <div key={index} className="mb-8 flex">
                <div className="mr-6 text-right w-24 flex-shrink-0">
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startedAt)} - {formatDate(exp.endAt)}
                  </p>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium">{exp.title}</h3>
                  <p className="text-gray-700 mb-2">{exp.companyName}</p>
                  {exp.description && (
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
        
        {/* Education Section */}
        {portfolio.education && portfolio.education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Education</h2>
            {portfolio.education.map((edu, index) => (
              <div key={index} className="mb-6 flex">
                <div className="mr-6 text-right w-24 flex-shrink-0">
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.startedAt)} - {formatDate(edu.endAt)}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{edu.degree.name}</h3>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects Section */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section id="projects" className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-md overflow-hidden flex flex-col">
                  {/* Project image placeholder - replace with gradient for now */}
                  <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-medium mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(project.startedAt)} - {formatDate(project.endAt)}
                    </p>
                    {project.description && (
                      <div className="prose prose-sm max-w-none mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: project.description.split('</h1>')[1] || project.description }} />
                    )}
                    {project.link && (
                      <a 
                        href={project.link} 
                        className="mt-auto inline-flex items-center text-blue-600 text-sm hover:text-blue-800"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Project <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Contact</h2>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {portfolio.firstName} {portfolio.lastName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}