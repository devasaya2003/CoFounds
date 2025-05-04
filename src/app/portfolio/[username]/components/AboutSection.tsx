interface AboutSectionProps {
  description: string | null;
}

export default function AboutSection({ description }: AboutSectionProps) {
  if (!description) return null;
  
  return (
    <section id="about" className="mb-12">
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
    </section>
  );
}