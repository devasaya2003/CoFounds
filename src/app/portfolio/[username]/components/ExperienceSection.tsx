import { Briefcase, Heart } from 'lucide-react';

interface Experience {
  title: string;
  companyName: string;
  description: string | null;
  startedAt: string | Date;
  endAt: string | Date | null;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  formatDate: (date: string | Date | null) => string;
}

export default function ExperienceSection({ experiences, formatDate }: ExperienceSectionProps) {
  if (!experiences || experiences.length === 0) return null;
  
  // Split experiences into work and community
  const workExperiences = experiences.filter(exp => exp.companyName !== "COF_PROOF_COMMUNITY");
  const communityExperiences = experiences.filter(exp => exp.companyName === "COF_PROOF_COMMUNITY");
  
  // If either section is empty, don't use grid layout
  const useFullWidth = workExperiences.length === 0 || communityExperiences.length === 0;
  
  const renderExperienceItem = (exp: Experience, index: number) => (
    <div key={index} className="mb-6 last:mb-0">
      <div className="flex flex-col md:flex-row md:items-start gap-3">
        <div className="flex-grow order-2 md:order-1">
          <h3 className="text-lg font-medium text-gray-800">{exp.title}</h3>
          {exp.companyName !== "COF_PROOF_COMMUNITY" && (
            <p className="text-gray-700 mb-2 font-medium">
              {exp.companyName}
            </p>
          )}
          {exp.description && (
            <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: exp.description }} />
          )}
        </div>
        <div className="order-1 md:order-2 flex-shrink-0 text-sm text-gray-500 md:text-right">
          {formatDate(exp.startedAt)} - {formatDate(exp.endAt)}
        </div>
      </div>
      
      <div className="mt-4 border-b border-gray-100 last:border-0"></div>
    </div>
  );
  
  return (
    <section id="proof-of-work" className="mb-12">
      <div className={`grid ${!useFullWidth ? 'md:grid-cols-2 gap-8' : 'grid-cols-1'}`}>
        {/* Proof of Work Section */}
        {workExperiences.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-600" />
              Proof of Work
            </h2>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              {workExperiences.map((exp, index) => renderExperienceItem(exp, index))}
            </div>
          </div>
        )}
        
        {/* Proof of Community Section */}
        {communityExperiences.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
              <Heart size={18} className="text-indigo-600" />
              Proof of Community
            </h2>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              {communityExperiences.map((exp, index) => renderExperienceItem(exp, index))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}