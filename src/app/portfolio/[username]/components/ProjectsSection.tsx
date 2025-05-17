'use client';

import { ExternalLink, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Project {
  title: string;
  description: string | null;
  link: string | null;
  startedAt: string | Date;
  endAt: string | Date | null;
}

interface ProjectsSectionProps {
  projects: Project[];
}

const gradients = [
  "h-44 w-full bg-gradient-to-r from-blue-200 to-cyan-200",
  "h-44 w-full bg-gradient-to-r from-violet-200 to-pink-200",
  "h-44 w-full bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#6366f1] via-[#a5b4fc] to-[#e0e7ff]",
  "h-44 w-full bg-gradient-to-r from-[#f59e0b] via-[#fcd34d] to-[#fef9c3]",
  "h-44 w-full bg-gradient-to-tr from-[#be185d] via-[#f472b6] to-[#fbcfe8]",
  "h-44 w-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#9d174d] via-[#d946ef] to-[#f0abfc]",
];

// Helper function to get gradient by index with cycling
function getGradientByIndex(index: number) {
  return gradients[index % gradients.length];
}

// Helper function to strip HTML tags
function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

// Get the first 10 words of text
function getFirstWords(text: string, wordCount = 10) {
  if (!text) return '';
  
  // Strip HTML tags first
  const strippedText = stripHtml(text);
  
  // Split by whitespace and get specified number of words
  const words = strippedText.split(/\s+/).slice(0, wordCount);
  
  // Join words and add ellipsis
  return words.join(' ') + '...';
}

// Internal date formatter for projects
function formatProjectDate(date: string | Date | null): string {
  if (!date) {
    return 'Currently Building';
  }
  return new Date(date).getFullYear().toString();
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Handle modal opening and closing with animation
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
      // Small delay to allow animation to start after DOM update
      setTimeout(() => setIsModalVisible(true), 10);
    } else {
      document.body.style.overflow = 'auto';
      setIsModalVisible(false);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeProject]);
  
  // Handle modal close with animation
  const closeModal = () => {
    setIsModalVisible(false);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => setActiveProject(null), 300);
  };
  
  if (!projects || projects.length === 0) return null;
  
  return (
    <>
      <section id="projects" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Projects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div 
              key={project.title} 
              className="rounded-sm overflow-hidden bg-white border border-gray-200 relative flex flex-col cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveProject(project)}
            >
              {/* Project image placeholder with index-based gradient */}
              <div className={getGradientByIndex(index)}>
              </div>
              
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{project.title}</h3>
                
                {project.description && (
                  <p className="text-gray-600 text-sm mb-2">
                    {getFirstWords(project.description)}
                  </p>
                )}
              </div>
              
              {/* Link button at bottom right */}
              {project.link && (
                <div className="p-4 pt-0 flex justify-end">
                  <a 
                    href={project.link} 
                    className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevent modal from opening when clicking the link
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Project Details Modal with animation */}
      {activeProject && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-50 p-4 flex items-center justify-center ${
            isModalVisible ? "bg-opacity-50" : "bg-opacity-0"
          }`}
          onClick={closeModal}
        >
          <div 
            className={`bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl transition-all duration-300 ease-in-out ${
              isModalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{activeProject.title}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-500">
                {formatProjectDate(activeProject.startedAt)} - {formatProjectDate(activeProject.endAt)}
              </p>
            </div>
            
            {activeProject.description && (
              <div className="border-t border-gray-200 pt-4">
                <div 
                  className="prose prose-sm max-w-none" 
                  dangerouslySetInnerHTML={{ __html: activeProject.description }} 
                />
              </div>
            )}
            
            {activeProject.link && (
              <div className="mt-6 flex justify-end">
                <a 
                  href={activeProject.link} 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Project <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}