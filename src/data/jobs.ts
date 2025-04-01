export interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  isNew?: boolean;
  color: string;
}

export const jobs: Job[] = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    salary: "$120k - $150k",
    tags: ["React", "TypeScript", "5+ Years"],
    isNew: true,
    color: "bg-accent-blue"
  },
  {
    title: "Product Designer",
    company: "DesignMasters",
    location: "New York",
    salary: "$90k - $120k",
    tags: ["Figma", "UI/UX", "Product Design"],
    color: "bg-accent-purple"
  },
  {
    title: "Backend Engineer",
    company: "ServerLogic",
    location: "San Francisco",
    salary: "$130k - $160k",
    tags: ["Node.js", "AWS", "Database"],
    color: "bg-accent-green"
  },
  {
    title: "Marketing Manager",
    company: "GrowthPulse",
    location: "Remote",
    salary: "$85k - $110k",
    tags: ["Growth", "Strategy", "Analytics"],
    color: "bg-accent-pink"
  }
];