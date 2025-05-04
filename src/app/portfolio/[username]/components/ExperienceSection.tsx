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
  
  return (
    <section id="experience" className="mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Experience</h2>
      {experiences.map((exp, index) => (
        <div key={index} className="mb-8 flex">
          <div className="flex-grow">
            <h3 className="text-lg font-medium">{exp.title}</h3>
            <p className="text-gray-700 mb-2">{exp.companyName}</p>
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
      ))}
    </section>
  );
}