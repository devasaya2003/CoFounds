import { ExternalLink } from 'lucide-react';
import AuroraEffect from '@/components/ui/AuroraEffect';

interface Project {
  title: string;
  description: string | null;
  link: string | null;
  startedAt: string | Date;
  endAt: string | Date | null;
}

interface ProjectsSectionProps {
  projects: Project[];
  formatDate: (date: string | Date | null) => string; 
}

export default function ProjectsSection({ projects, formatDate }: ProjectsSectionProps) {
  
  
  if (!projects || projects.length === 0) return null;
  
  return (
    <section id="projects" className="mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => {
          return (
            <div key={index} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <AuroraEffect 
                className="h-48" 
                random={true} 
                size='small'
              >
              </AuroraEffect>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  {project.link && (
                    <a 
                      href={project.link} 
                      className="ml-4 flex items-center text-blue-600 text-sm hover:text-blue-800"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mb-3">
                  {formatDate(project.startedAt)} - {formatDate(project.endAt)}
                </p>
                
                {project.description && (
                  <div 
                    className="prose prose-sm max-w-none mb-4" 
                    dangerouslySetInnerHTML={{ 
                      __html: project.description.split('</h1>')[1] || project.description 
                    }} 
                  />
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
          );
        })}
      </div>
    </section>
  );
}