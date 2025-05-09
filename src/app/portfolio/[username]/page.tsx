import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Banner from './components/Banner';
import ProfileHeader from './components/ProfileHeader';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import BuildPortfolioButton from './components/BuildPortfolioButton';
import { headers } from 'next/headers';

type PortfolioParams = {
  params: Promise<{ username: string }>;
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
    eduFrom: string;
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

function formatDate(date: string | Date | null, context: 'experience' | 'education' | 'project' = 'experience'): string {
  if (!date) {
    
    switch (context) {
      case 'project':
        return 'Currently Building';
      case 'experience':
      case 'education':
      default:
        return 'Present';
    }
  }
  return new Date(date).getFullYear().toString();
}

async function fetchPortfolio(username: string): Promise<PortfolioResponse> {
  try {    
    const headersList = await headers();
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = headersList.get('host') || 'cofounds.in';
        
    const url = `${protocol}://${host}/api/portfolio/${username}`;
    console.log(`Fetching portfolio from: ${url}`);
    
    const res = await fetch(url, {
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
  const { username } = await params;
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

export default async function PortfolioPage({ params }: PortfolioParams) {
  const { username } = await params;
  const portfolioResult = await fetchPortfolio(username);
  
  if (!portfolioResult.success || !portfolioResult.data) {
    notFound();
  }
  
  const portfolio = portfolioResult.data;
  
  const currentJob = portfolio.experience && portfolio.experience.length > 0 
    ? portfolio.experience[0] 
    : { title: '', companyName: '', startedAt: '', endAt: null, description: null };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow absolute top-0 left-0 right-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <span className="ml-3 font-medium text-gray-800">
              {portfolio.firstName} {portfolio.lastName}
            </span>
          </div>
          <div className="flex space-x-6">
            <Link href="#about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="#experience" className="text-gray-600 hover:text-gray-900">Experience</Link>
            <Link href="#projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
          </div>
        </div>
      </nav>

      {/* Banner */}
      <Banner />
      
      {/* Profile Header (overlaps banner) */}
      <ProfileHeader 
        firstName={portfolio.firstName} 
        lastName={portfolio.lastName}
        title={currentJob.title}
        companyName={currentJob.companyName}
        email={portfolio.email}
      />

      <main className="max-w-5xl mx-auto px-4 py-12 mt-24">
        {/* About section */}
        <AboutSection description={portfolio.description} />
        
        {/* Skills section */}
        <SkillsSection skills={portfolio.skillset} />

        {/* Experience Section */}
        <ExperienceSection experiences={portfolio.experience} formatDate={(date) => formatDate(date, 'experience')} />
        
        {/* Education Section */}
        <EducationSection education={portfolio.education} formatDate={(date) => formatDate(date, 'education')} />

        {/* Projects Section */}
        <ProjectsSection projects={portfolio.projects} formatDate={(date) => formatDate(date, 'project')} />

        {/* Build your own portfolio button */}
        <BuildPortfolioButton />
      </main>

      <footer className="bg-white border-t py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {portfolio.firstName} {portfolio.lastName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}