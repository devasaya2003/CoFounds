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
    title: "Frontend Intern",
    company: "Cofounds",
    location: "Remote",
    salary: "₹5000",
    tags: ["React", "TypeScript", "NextJS"],
    isNew: true,
    color: "bg-accent-blue"
  },
  {
    title: "Web Designer",
    company: "Cofounds",
    location: "Remote",
    salary: "₹5000",
    tags: ["Figma"],
    isNew: true,
    color: "bg-accent-blue"
  },
];