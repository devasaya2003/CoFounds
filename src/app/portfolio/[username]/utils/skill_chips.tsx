export interface Skill {
    skill: {
      name: string;
    };
    skillLevel: string | null;
  }

export const skillLevelToValue = (level: string | null): number => {
    switch (level?.toLowerCase()) {
      case 'advanced':
        return 90;
      case 'intermediate':
        return 60;
      case 'beginner':
        return 30;
      default:
        return 20;
    }
  };

export function renderTopSkills(skills: Skill[], level: string = 'advanced', limit: number = 3) {
  const filteredSkills = skills
    .filter(skill => skill.skillLevel?.toLowerCase() === level.toLowerCase())
    .sort((a, b) => skillLevelToValue(b.skillLevel) - skillLevelToValue(a.skillLevel))
    .slice(0, limit);

  if (filteredSkills.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {filteredSkills.map((skillItem, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm shadow-sm
                   flex items-center flex-wrap gap-x-1.5"
        >
          <span className="font-medium">
            {skillItem.skill?.name}
          </span>
        </div>
      ))}
    </div>
  );
}