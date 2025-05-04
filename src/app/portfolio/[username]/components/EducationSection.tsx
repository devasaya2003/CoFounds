interface Education {
  eduFrom: string;
  degree: {
    name: string;
  };
  startedAt: string | Date;
  endAt: string | Date | null;
}

interface EducationSectionProps {
  education: Education[];
  formatDate: (date: string | Date | null) => string;
}

export default function EducationSection({ education, formatDate }: EducationSectionProps) {
  if (!education || education.length === 0) return null;
  
  return (
    <section id="education" className="mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Education</h2>
      
      {/* Added grid layout with 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((edu, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium">{edu.degree.name}</h3>
            <p className="text-gray-600 mt-1">{edu.eduFrom}</p>
            <p className="text-sm text-gray-500 mt-2">
              {formatDate(edu.startedAt)} - {formatDate(edu.endAt)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}