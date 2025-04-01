export interface Testimonial {
  content: string;
  author: string;
  position: string;
  rating: number;
  imageUrl: string;
}

export const testimonials: Testimonial[] = [
  {
    content: "Joining this community was the best career decision I've made. Within weeks, I had multiple interviews lined up with top companies.",
    author: "Sarah Johnson",
    position: "Product Designer at Stripe",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    content: "What sets Cofounds apart is the quality of the network. Every connection I've made has been valuable for my professional growth.",
    author: "Michael Chen",
    position: "Full Stack Developer",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    content: "The focus on proof of work makes all the difference. I found a job that truly values my skills rather than just my resume.",
    author: "Jessica Williams",
    position: "UX Researcher",
    rating: 4,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  }
];