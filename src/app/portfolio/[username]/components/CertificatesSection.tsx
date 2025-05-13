import { Award, ExternalLink } from 'lucide-react';

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
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
        <Award size={18} className="text-indigo-600" />
        Certificates
      </h2>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((certificate, index) => (
            <div 
              key={index} 
              className="border border-gray-100 rounded-lg overflow-hidden flex flex-col 
                        bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-all duration-300"
            >
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{certificate.title}</h3>
                  {certificate.link && (
                    <a 
                      href={certificate.link} 
                      className="ml-3 flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full 
                                text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="View certificate"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mb-3 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-200 mr-2"></span>
                  {formatDate(certificate.startedAt)}
                  {certificate.endAt && ` - ${formatDate(certificate.endAt)}`}
                </p>
                
                {certificate.description && (
                  <div 
                    className="prose prose-sm max-w-none text-gray-600 mb-4" 
                    dangerouslySetInnerHTML={{ 
                      __html: certificate.description.split('</h1>')[1] || certificate.description 
                    }} 
                  />
                )}
                
                {certificate.link && (
                  <a 
                    href={certificate.link} 
                    className="mt-auto inline-flex items-center text-indigo-600 text-sm font-medium 
                              hover:text-indigo-800 group"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Certificate 
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}