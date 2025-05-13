import { GraduationCap } from 'lucide-react';

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
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
        <GraduationCap size={18} className="text-indigo-600" />
        Education
      </h2>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <div 
              key={index} 
              className="border border-gray-100 rounded-lg overflow-hidden flex flex-col
                        bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-all duration-300"
            >
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-gray-800">{edu.degree.name}</h3>
                </div>
                
                <p className="text-gray-700 mb-3">{edu.eduFrom}</p>
                
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-200 mr-2"></span>
                  {formatDate(edu.startedAt)}
                  {edu.endAt ? ` - ${formatDate(edu.endAt)}` : ` - Present`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}