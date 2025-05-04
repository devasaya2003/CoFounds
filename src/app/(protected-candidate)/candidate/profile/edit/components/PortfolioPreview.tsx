'use client';

import { useAppSelector } from '@/redux/hooks';
import Banner from '@/app/portfolio/[username]/components/Banner';
import ProfileHeader from '@/app/portfolio/[username]/components/ProfileHeader';
import AboutSection from '@/app/portfolio/[username]/components/AboutSection';
import SkillsSection from '@/app/portfolio/[username]/components/SkillsSection';
import ExperienceSection from '@/app/portfolio/[username]/components/ExperienceSection';
import ProjectsSection from '@/app/portfolio/[username]/components/ProjectsSection';
import EducationSection from '@/app/portfolio/[username]/components/EducationSection';

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
  if (date instanceof Date) {
    return date.getFullYear().toString();
  }
  return new Date(date).getFullYear().toString();
}

export default function PortfolioPreview() {
  const portfolio = useAppSelector(state => state.portfolioEdit);
  
  const currentJob = portfolio.experience && portfolio.experience.length > 0 
    ? portfolio.experience[0] 
    : { title: '', companyName: '', startedAt: '', endAt: null, description: null };
  
  return (
    <div className="min-h-screen bg-gray-50">
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
      </main>
    </div>
  );
}