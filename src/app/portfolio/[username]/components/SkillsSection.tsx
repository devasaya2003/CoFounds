import React from 'react';

interface Skill {
  skill: {
    name: string;
  };
  skillLevel: string | null;
}

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) return null;
  
  return (
    <section id="skills" className="mb-12">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skillItem, index) => (
          <div key={index} className="bg-gray-100 border border-gray-200 rounded-md px-3 py-1 text-sm">
            {skillItem.skill?.name} {skillItem.skillLevel && <span className="text-xs text-gray-500 capitalize">• {skillItem.skillLevel}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}