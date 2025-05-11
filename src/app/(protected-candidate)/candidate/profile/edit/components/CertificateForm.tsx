'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/redux/hooks';
import CertificateItem from './certificate/CertificateItem';
import { formatDateForApi, generateTempId } from './certificate/utils';
import { 
  Certificate, 
  CertificateFormProps, 
  CertificateFormRef, 
  CertificateUpdatePayload,
  MAX_CERTIFICATES
} from './certificate/types';

const CertificateForm = forwardRef<CertificateFormRef, CertificateFormProps>(
  ({ profile, onChange, onSaveData }, ref) => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [originalCertificates, setOriginalCertificates] = useState<Certificate[]>([]);
    const [deletedCertificates, setDeletedCertificates] = useState<string[]>([]);
    
    const { user } = useAppSelector((state) => state.auth);
    const currentYear = new Date().getFullYear();

    // Initialize from profile data
    useEffect(() => {
      if (profile && profile.certificates) {
        const formattedCerts = profile.certificates.map(cert => {
          // Parse dates from DB format to form format
          const startDate = cert.startedAt ? {
            year: new Date(cert.startedAt).getFullYear().toString(),
            month: (new Date(cert.startedAt).getMonth() + 1).toString().padStart(2, '0'),
            day: new Date(cert.startedAt).getDate().toString().padStart(2, '0')
          } : {
            year: currentYear.toString(),
            month: '01',
            day: '01'
          };
          
          const endDate = cert.endAt ? {
            year: new Date(cert.endAt).getFullYear().toString(),
            month: (new Date(cert.endAt).getMonth() + 1).toString().padStart(2, '0'),
            day: new Date(cert.endAt).getDate().toString().padStart(2, '0')
          } : {
            year: currentYear.toString(),
            month: '01',
            day: '01'
          };
          
          return {
            id: cert.id,
            title: cert.title || '',
            description: cert.description || '',
            startDate,
            endDate,
            link: cert.link || '',
            userId: cert.userId
          };
        });
        setCertificates(formattedCerts);
        setOriginalCertificates(JSON.parse(JSON.stringify(formattedCerts)));
      }
    }, [profile, currentYear]);
    
    // Check for changes
    const hasFormChanges = useCallback(() => {
      if (deletedCertificates.length > 0) return true;
      
      if (certificates.length !== originalCertificates.length) return true;
      
      const newCertificates = certificates.filter(cert => !cert.id || cert.id.startsWith('temp-'));
      if (newCertificates.length > 0) return true;
      
      for (const origCert of originalCertificates) {
        const currentCert = certificates.find(c => c.id === origCert.id);
        if (!currentCert) return true;
        
        if (
          currentCert.title !== origCert.title ||
          currentCert.description !== origCert.description ||
          currentCert.link !== origCert.link ||
          JSON.stringify(currentCert.startDate) !== JSON.stringify(origCert.startDate) ||
          JSON.stringify(currentCert.endDate) !== JSON.stringify(origCert.endDate)
        ) {
          return true;
        }
      }
      
      return false;
    }, [certificates, originalCertificates, deletedCertificates]);

    useEffect(() => {
      const hasChanges = hasFormChanges();
      onChange(hasChanges);
    }, [certificates, deletedCertificates, hasFormChanges, onChange]);

    // Add a new certificate
    const handleAddCertificate = () => {
      // Check if we've reached the maximum number of certificates
      if (certificates.length >= MAX_CERTIFICATES) {
        return;
      }
      
      const newCertificate: Certificate = {
        id: generateTempId(),
        title: '',
        description: null,
        startDate: {
          year: currentYear.toString(),
          month: '01',
          day: '01',
        },
        endDate: {
          year: currentYear.toString(),
          month: '01',
          day: '01',
        },
        link: '',
      };
      
      setCertificates([...certificates, newCertificate]);
    };

    // Remove a certificate
    const handleRemoveCertificate = (id: string) => {
      if (id.startsWith('temp-')) {
        setCertificates(certificates.filter(cert => cert.id !== id));
      } else {
        setCertificates(certificates.filter(cert => cert.id !== id));
        setDeletedCertificates([...deletedCertificates, id]);
      }
    };

    // Update certificate fields
    const handleUpdateCertificate = (id: string, updates: Partial<Certificate>) => {
      setCertificates(certificates.map(cert =>
        cert.id === id ? { ...cert, ...updates } : cert
      ));
    };

    // Reset form to original state
    const resetForm = useCallback(() => {
      setCertificates(JSON.parse(JSON.stringify(originalCertificates)));
      setDeletedCertificates([]);
    }, [originalCertificates]);

    // Prepare data for submission
    const saveForm = useCallback(() => {
      const newCertificates = certificates
        .filter(cert => cert.id.startsWith('temp-'))
        .map(cert => ({
          title: cert.title,
          description: cert.description || null,
          started_at: formatDateForApi(cert.startDate),
          end_at: formatDateForApi(cert.endDate),
          link: cert.link || null
        }));
      
      const updatedCertificates = certificates
        .filter(cert => {
          if (cert.id.startsWith('temp-')) return false;
          
          const originalCert = originalCertificates.find(oc => oc.id === cert.id);
          if (!originalCert) return false;
          
          return (
            cert.title !== originalCert.title ||
            cert.description !== originalCert.description ||
            cert.link !== originalCert.link ||
            JSON.stringify(cert.startDate) !== JSON.stringify(originalCert.startDate) ||
            JSON.stringify(cert.endDate) !== JSON.stringify(originalCert.endDate)
          );
        })
        .map(cert => ({
          id: cert.id,
          title: cert.title,
          description: cert.description || null,
          started_at: formatDateForApi(cert.startDate),
          end_at: formatDateForApi(cert.endDate),
          link: cert.link || null
        }));
      
      const payload: CertificateUpdatePayload = {
        user_id: user?.id || '',
        new_certificates: newCertificates,
        updated_certificates: updatedCertificates,
        deleted_certificates: deletedCertificates
      };
      
      onSaveData({ certificatesUpdateData: payload });
    }, [certificates, originalCertificates, deletedCertificates, onSaveData, user?.id]);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      resetForm,
      saveForm
    }));

    // Empty state component
    const EmptyState = () => (
      <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
        <p className="text-gray-500 mb-4">No certificates added yet.</p>
        <Button 
          onClick={handleAddCertificate}
          variant="outline"
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Certificate
        </Button>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Your Certificates</h2>
          <p className="text-gray-600">
            Add and manage your certificates and credentials to showcase your qualifications.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {certificates.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-6">
                  {certificates.map((certificate, index) => (
                    <CertificateItem
                      key={certificate.id}
                      certificate={certificate}
                      index={index}
                      onUpdate={handleUpdateCertificate}
                      onRemove={handleRemoveCertificate}
                    />
                  ))}
                  
                  <div className="flex justify-center mt-4">
                    {certificates.length < MAX_CERTIFICATES ? (
                      <Button 
                        onClick={handleAddCertificate} 
                        variant="outline"
                        className="flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Another Certificate
                      </Button>
                    ) : (
                      <p className="text-amber-600 text-sm">
                        Maximum of {MAX_CERTIFICATES} certificates allowed.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          <p>
            <strong>Coming soon:</strong> File uploads for certificates will be available in the next update.
          </p>
        </div>
      </div>
    );
  }
);

CertificateForm.displayName = "CertificateForm";
export default CertificateForm;
export type { CertificateFormRef } from './certificate/types';