'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Experience {
  title: string;
  companyName: string;
  description: string | null;
  startedAt: string | Date;
  endAt: string | Date | null;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

function getFirstWords(text: string, wordCount = 10) {
  if (!text) return '';

  const strippedText = stripHtml(text);

  const words = strippedText.split(/\s+/).slice(0, wordCount);

  return words.join(' ') + '...';
}

function formatDate(date: string | Date | null): string {
  if (!date) {
    return 'Present';
  }
  return new Date(date).getFullYear().toString();
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  
  if (!experiences || experiences.length === 0) return null;
  
  const toggleExpand = (index: number) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };

  const isExpanded = (index: number): boolean => {
    return expandedItems.has(index);
  };

  return (
    <section id="experience" className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        Experience
      </h2>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-sm overflow-hidden"
          >
            <div 
              className="flex justify-between items-baseline p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-800">{exp.title}
                  {exp.companyName === "COF_PROOF_COMMUNITY"
                    ? <></>
                    : <span className="text-gray-600"> at {exp.companyName}</span>
                  }
                </h3>
                {!isExpanded(index) && exp.description && (
                  <p className="text-gray-600 mt-2 truncate">
                    {getFirstWords(exp.description)}
                  </p>
                )}
              </div>
              <div className="flex items-center ml-4 flex-shrink-0">
                <div className="text-sm text-gray-500 whitespace-nowrap mr-3">
                  {exp.companyName === "COF_PROOF_COMMUNITY"
                    ? "Currently Building"
                    : `${formatDate(exp.startedAt)} - ${formatDate(exp.endAt)}`}
                </div>
                {isExpanded(index) ? 
                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                }
              </div>
            </div>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded(index) ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {exp.description && (
                <div className="p-4 pt-0 border-t border-gray-100">
                  <div 
                    className="prose prose-sm max-w-none text-gray-600" 
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}