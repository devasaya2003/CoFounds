// Common skill type for use across the application
export interface Skill {
  id: string;
  name: string;
}

export interface SkillWithLevel extends Skill {
  level: 'beginner' | 'intermediate' | 'advanced';
}

// Level options for dropdown
export const skillLevelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' }, 
  { value: 'advanced', label: 'Advanced' }
];