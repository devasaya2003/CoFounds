import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Banner from './components/Banner';
import ProfileHeader from './components/ProfileHeader';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import BuildPortfolioButton from './components/BuildPortfolioButton';
import { getUserPortfolio } from '@/backend/functions/portfolio/get_user_portfolio';
import Image from 'next/image';
import { renderTopSkills } from './utils/skill_chips';

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
  projects: Array<{
    title: string;
    description: string | null;
    link: string | null;
    startedAt: string | Date;
    endAt: string | Date | null;
  }>;
}

interface PortfolioResponse {
  success: boolean;
  data?: Portfolio;
  error?: string;
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
      {/* Navigation - Hidden on mobile, visible on md screens and up */}
      <nav className="hidden md:block bg-white shadow sticky top-0 left-0 right-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/images/profile-placeholder.png"
              alt="Profile"
              width={128}
              height={128}
              className="object-cover w-10 h-10 rounded-full"
              priority
            />
            <span className="pl-2 font-medium text-gray-800">
              {portfolio.firstName} {portfolio.lastName}
            </span>
          </div>
          <div className="flex space-x-6">
            <Link href="#about" className="text-gray-600 hover:text-gray-900">About</Link>
            {portfolio.experience && portfolio.experience.length > 0 && (
              <Link href="#experience" className="text-gray-600 hover:text-gray-900">Experience</Link>
            )}
            {portfolio.projects && portfolio.projects.length > 0 && (
              <Link href="#projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
            )}
            {portfolio.skillset && portfolio.skillset.length > 0 && (
              <Link href="#skills" className="text-gray-600 hover:text-gray-900">Skills</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Banner with username parameter */}
      <Banner username={username} />

      {/* Profile Header (overlaps banner) */}
      <ProfileHeader
        firstName={portfolio.firstName}
        lastName={portfolio.lastName}
        title={currentJob.title}
        companyName={currentJob.companyName}
        email={portfolio.email}
      />
      
      {/* Display top 3 advanced skills */}
      <div className="max-w-5xl mx-auto px-4">
        {portfolio.skillset && renderTopSkills(portfolio.skillset, 'advanced', 3)}
      </div>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {/* About section */}
        <AboutSection description={portfolio.description} />


        {/* Experience Section */}
        <ExperienceSection experiences={portfolio.experience} />

        {/* Projects Section */}
        <ProjectsSection projects={portfolio.projects} />
        
        {/* Skills section */}
        <SkillsSection skills={portfolio.skillset} />
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