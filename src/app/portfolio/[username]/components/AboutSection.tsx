import { User } from 'lucide-react';

interface AboutSectionProps {
  description: string | null;
}

export default function AboutSection({ description }: AboutSectionProps) {
  if (!description) return null;
  
  return (
    <section id="about" className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        About
      </h2>
      
      <div className="rounded-lg border border-gray-200 shadow-sm p-5">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </section>
  );
}