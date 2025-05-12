import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Banner from './components/Banner';
import ProfileHeader from './components/ProfileHeader';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import CertificatesSection from './components/CertificatesSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import BuildPortfolioButton from './components/BuildPortfolioButton';
import { getUserPortfolio } from '@/backend/functions/portfolio/get_user_portfolio';

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

async function getPortfolio(username: string): Promise<PortfolioResponse> {
  try {
    console.log(`Fetching portfolio directly from database for: ${username}`);

    const result = await getUserPortfolio(username);

    console.log(`Database query result success: ${result.success}`);

    if (result.success && result.data) {
      const transformedData: Portfolio = {
        ...result.data,
        experience: result.data.experience.map(exp => ({
          ...exp,
          startedAt: exp.startedAt || new Date().toISOString(),
          endAt: exp.endAt
        })),
        education: result.data.education.map(edu => ({
          ...edu,
          startedAt: edu.startedAt || new Date().toISOString(),
          endAt: edu.endAt,
          eduFrom: edu.eduFrom || ''
        })),
        projects: result.data.projects.map(proj => ({
          ...proj,
          startedAt: proj.startedAt || new Date().toISOString(),
          endAt: proj.endAt
        }))
      };

      return {
        success: true,
        data: transformedData
      };
    }

    return result as PortfolioResponse;
  } catch (error) {
    console.error('Error fetching portfolio from database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch portfolio'
    };
  }
}

export async function generateMetadata({ params }: PortfolioParams): Promise<Metadata> {
  const { username } = await params;
  const portfolioResult = await getPortfolio(username);

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
  const portfolioResult = await getPortfolio(username);

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
      <nav className="bg-white shadow sticky top-0 left-0 right-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <span className="ml-3 font-medium text-gray-800">
              {portfolio.firstName} {portfolio.lastName}
            </span>
          </div>
          <div className="flex space-x-6 overflow-x-auto">
            <Link href="#about" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">About</Link>
            
            {portfolio.skillset && portfolio.skillset.length > 0 && (
              <Link href="#skills" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">Skills</Link>
            )}
            
            {portfolio.experience && portfolio.experience.length > 0 && (
              <Link href="#proof-of-work" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">Proof of Work</Link>
            )}
            
            {portfolio.certificates && portfolio.certificates.length > 0 && (
              <Link href="#certificates" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">Certificates</Link>
            )}
            
            {portfolio.projects && portfolio.projects.length > 0 && (
              <Link href="#projects" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">Projects</Link>
            )}
            
            {portfolio.education && portfolio.education.length > 0 && (
              <Link href="#education" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">Education</Link>
            )}
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
        {/* 1. About section */}
        <AboutSection description={portfolio.description} />

        {/* 2. Skills section */}
        <SkillsSection skills={portfolio.skillset} />

        {/* 3. Experience Section (Proof of Work) */}
        <ExperienceSection experiences={portfolio.experience} formatDate={(date) => formatDate(date, 'experience')} />

        {/* 4. Certificates Section */}
        <CertificatesSection certificates={portfolio.certificates} formatDate={(date) => formatDate(date, 'experience')} />

        {/* 5. Projects Section */}
        <ProjectsSection projects={portfolio.projects} formatDate={(date) => formatDate(date, 'project')} />

        {/* 6. Education Section */}
        <EducationSection education={portfolio.education} formatDate={(date) => formatDate(date, 'education')} />
      </main>

      <footer className="bg-white border-t py-6">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} {portfolio.firstName} {portfolio.lastName}. All rights reserved.
          </div>
          <BuildPortfolioButton />
        </div>
      </footer>
    </div>
  );
}