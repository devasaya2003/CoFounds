export interface Story {
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
}

export const stories: Story[] = [
  {
    title: "From Freelancer to Lead Designer in 3 Months",
    excerpt: "How David leveraged his portfolio and community connections to land his dream role.",
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "David Miller",
    date: "Oct 12, 2023"
  },
  {
    title: "Breaking Into Tech Without a CS Degree",
    excerpt: "Emma's journey from marketing to software engineering through project-based learning.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Emma Roberts",
    date: "Sep 5, 2023"
  },
  {
    title: "How I Doubled My Salary in One Year",
    excerpt: "John shares the exact strategy he used to rapidly advance his career in product management.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "John Doe",
    date: "Aug 22, 2023"
  }
];