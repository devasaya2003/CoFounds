import { User } from 'lucide-react';

interface AboutSectionProps {
  description: string | null;
}

export default function AboutSection({ description }: AboutSectionProps) {
  if (!description) return null;
  
  return (
    <section id="about" className="mb-12">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
        <User size={18} className="text-indigo-600" />
        About
      </h2>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </section>
  );
}