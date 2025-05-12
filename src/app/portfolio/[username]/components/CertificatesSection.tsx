import { ExternalLink } from 'lucide-react';

interface Certificate {
  title: string;
  description: string | null;
  filePath: string | null;
  link: string | null;
  startedAt: string | Date | null;
  endAt: string | Date | null;
}

interface CertificatesSectionProps {
  certificates: Certificate[];
  formatDate: (date: string | Date | null) => string; 
}

export default function CertificatesSection({ certificates, formatDate }: CertificatesSectionProps) {
  if (!certificates || certificates.length === 0) return null;
  
  return (
    <section id="certificates" className="mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Certificates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {certificates.map((certificate, index) => (
          <div key={index} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{certificate.title}</h3>
                {certificate.link && (
                  <a 
                    href={certificate.link} 
                    className="ml-4 flex items-center text-blue-600 text-sm hover:text-blue-800"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              
              <p className="text-sm text-gray-500 mb-3">
                {formatDate(certificate.startedAt)} - {formatDate(certificate.endAt)}
              </p>
              
              {certificate.description && (
                <div 
                  className="prose prose-sm max-w-none mb-4" 
                  dangerouslySetInnerHTML={{ 
                    __html: certificate.description.split('</h1>')[1] || certificate.description 
                  }} 
                />
              )}
              
              {certificate.link && (
                <a 
                  href={certificate.link} 
                  className="mt-auto inline-flex items-center text-blue-600 text-sm hover:text-blue-800"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Certificate <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}