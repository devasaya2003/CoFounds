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
    <div key={index} className="mb-8 flex">
      <div className="flex-grow">
        <h3 className="text-lg font-medium">{exp.title}</h3>
        <p className="text-gray-700 mb-2">
          {exp.companyName !== "COF_PROOF_COMMUNITY" ? exp.companyName : ""}
        </p>
        {exp.description && (
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
        )}
      </div>
      <div className="mr-6 text-right flex-shrink-0">
        <p className="text-sm text-gray-500">
          {formatDate(exp.startedAt)} - {formatDate(exp.endAt)}
        </p>
      </div>
    </div>
  );
  
  return (
    <div className={`grid ${!useFullWidth ? 'md:grid-cols-2 gap-8' : 'grid-cols-1'} mb-12`}>
      {/* Proof of Work Section */}
      {workExperiences.length > 0 && (
        <section id="proof-of-work">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Proof of Work</h2>
          {workExperiences.map((exp, index) => renderExperienceItem(exp, index))}
        </section>
      )}
      
      {/* Proof of Community Section */}
      {communityExperiences.length > 0 && (
        <section id="proof-of-community">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Proof of Community</h2>
          {communityExperiences.map((exp, index) => renderExperienceItem(exp, index))}
        </section>
      )}
    </div>
  );
}