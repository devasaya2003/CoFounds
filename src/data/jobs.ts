export interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  isNew?: boolean;
  color: string;
  application_link: string;
}

export const jobs: Job[] = [
  {
    title: "Frontend Designer",
    company: "Cofounds",
    location: "Remote",
    salary: "₹5000",
    tags: ["React", "TypeScript", "Tailwind", "Business Logic"],
    isNew: true,
    color: "bg-accent-blue",
    application_link: "https://harmaj.notion.site/1ca340166253806fa58edc2f62ddf78f"
  },
  {
    title: "Graphic Design Intern",
    company: "Cofounds",
    location: "Remote",
    salary: "₹5000",
    tags: ["Figma", "Canva", "Design Tools", "Business Logic"],
    isNew: true,
    color: "bg-accent-blue",
    application_link: "https://harmaj.notion.site/1c9340166253805a8640d3950595f63e"
  },
];