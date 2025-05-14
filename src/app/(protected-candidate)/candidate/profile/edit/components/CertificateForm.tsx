'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useCallback, useTransition, useRef } from 'react';
import { Plus, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/redux/hooks';
import dynamic from 'next/dynamic';
import { formatDateForApi, generateTempId } from './certificate/utils';
import {
    Certificate,
    CertificateFormProps,
    CertificateFormRef,
    CertificateUpdatePayload,
    MAX_CERTIFICATES
} from './certificate/types';

const CertificateItem = dynamic(() => import('./certificate/CertificateItem'), {
    ssr: false,
    loading: () => <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 animate-pulse h-40"></div>
});

const EmptyState = dynamic(() => import('./certificate/EmptyState'), {
    ssr: false
});

const CertificateForm = forwardRef<CertificateFormRef, CertificateFormProps>(
    ({ profile, onChange, onSaveData }, ref) => {
        const [certificates, setCertificates] = useState<Certificate[]>([]);
        const [originalCertificates, setOriginalCertificates] = useState<Certificate[]>([]);
        const [deletedCertificates, setDeletedCertificates] = useState<string[]>([]);
        const [isPending, startTransition] = useTransition(); 
        const [lastAddedId, setLastAddedId] = useState<string | null>(null);
        const [isInitializing, setIsInitializing] = useState(true);
        const [readyCertificates, setReadyCertificates] = useState<Set<string>>(new Set());
        const [allContentReady, setAllContentReady] = useState(false);
                
        const certificateRefs = useRef<Map<string, HTMLDivElement>>(new Map());        
        const containerRef = useRef<HTMLDivElement>(null);

        const { user } = useAppSelector((state) => state.auth);
        const currentYear = new Date().getFullYear();

        useEffect(() => {
            if (profile?.certificates) {
                setReadyCertificates(new Set());
                setAllContentReady(false);
                
                const formattedCerts = profile.certificates.map(cert => {
                    const startDate = cert.startedAt ? {
                        year: new Date(cert.startedAt).getFullYear().toString(),
                        month: (new Date(cert.startedAt).getMonth() + 1).toString().padStart(2, '0'),
                        day: new Date(cert.startedAt).getDate().toString().padStart(2, '0')
                    } : {
                        year: currentYear.toString(),
                        month: '01',
                        day: '01'
                    };

                    const hasNoExpiryDate = cert.endAt === null;

                    const endDate = !hasNoExpiryDate && cert.endAt ? {
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
                        userId: cert.userId,
                        noExpiryDate: hasNoExpiryDate
                    };
                });

                setCertificates(formattedCerts);
                setOriginalCertificates(formattedCerts.map(cert => ({ 
                    ...cert,
                    startDate: { ...cert.startDate },
                    endDate: { ...cert.endDate },
                    description: cert.description ? String(cert.description) : ''
                })));
                
                if (formattedCerts.length === 0) {
                    setAllContentReady(true);
                }
                                
                if (isInitializing) {
                    setIsInitializing(false);
                }
            } else {                
                setIsInitializing(false);
                setAllContentReady(true);
            }
        }, [profile, currentYear, isInitializing]);

        const handleContentReady = useCallback((certificateId: string) => {
            setReadyCertificates(prev => {
                const newSet = new Set(prev);
                newSet.add(certificateId);
                return newSet;
            });
        }, []);
        
        useEffect(() => {
            if (certificates.length > 0 && readyCertificates.size === certificates.length) {
                setAllContentReady(true);
            }
        }, [certificates, readyCertificates]);

        const handleAddCertificate = useCallback(() => {
            if (certificates.length >= MAX_CERTIFICATES) {
                return;
            }

            startTransition(() => {
                const newId = generateTempId();
                const newCertificate: Certificate = {
                    id: newId,
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
                    noExpiryDate: false
                };

                setCertificates(prevCerts => [...prevCerts, newCertificate]);
                setLastAddedId(newId);
                                
                if (onChange && !isInitializing) {
                    onChange(true);
                }
            });
        }, [certificates.length, currentYear, onChange, isInitializing]);
        
        useEffect(() => {
            if (lastAddedId && !isPending) {
                const certificateElement = certificateRefs.current.get(lastAddedId);
                if (certificateElement) {                    
                    setTimeout(() => {
                        certificateElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 100);                    setLastAddedId(null); 
                }
            }
        }, [lastAddedId, isPending]);

        const handleRemoveCertificate = useCallback((id: string) => {
            setCertificates(prevCerts => prevCerts.filter(cert => cert.id !== id));

            if (!id.startsWith('temp-')) {
                setDeletedCertificates(prev => [...prev, id]);
            }
            
            if (onChange && !isInitializing) {
                onChange(true);
            }
        }, [onChange, isInitializing]);

        useEffect(() => {
            if (!isInitializing && allContentReady && onChange) {                
                const hasDeletedCertificates = deletedCertificates.length > 0;
                                
                const hasNewCertificates = certificates.some(cert => cert.id.startsWith('temp-'));
                                
                const hasModifiedCertificates = certificates.some(cert => {                    
                    if (cert.id.startsWith('temp-')) return false;
                                        
                    const originalCert = originalCertificates.find(oc => oc.id === cert.id);
                    if (!originalCert) return false;
                    
                    const normalizeDescription = (desc: string | null) => desc?.trim() || '';
                                        
                    return (
                        cert.title !== originalCert.title ||
                        normalizeDescription(cert.description) !== normalizeDescription(originalCert.description) ||
                        cert.link !== originalCert.link ||
                        cert.noExpiryDate !== originalCert.noExpiryDate ||
                        JSON.stringify(cert.startDate) !== JSON.stringify(originalCert.startDate) ||
                        JSON.stringify(cert.endDate) !== JSON.stringify(originalCert.endDate)
                    );
                });
                
                const hasChanges = hasDeletedCertificates || hasNewCertificates || hasModifiedCertificates;
                                
                if (!hasChanges) {                    
                    onChange(false);
                } else {                    
                    onChange(true);
                }
            }
        }, [isInitializing, allContentReady, onChange, certificates, originalCertificates, deletedCertificates]);

        const handleUpdateCertificate = useCallback((id: string, updates: Partial<Certificate>) => {
            setCertificates(prevCerts =>
                prevCerts.map(cert => cert.id === id ? { ...cert, ...updates } : cert)
            );
            
            if (onChange && !isInitializing) {
                onChange(true);
            }
        }, [onChange, isInitializing]);

        const resetForm = useCallback(() => {
            setCertificates(originalCertificates.map(cert => ({ ...cert })));
            setDeletedCertificates([]);
            
            if (onChange) {
                onChange(false);
            }
        }, [originalCertificates, onChange]);

        const saveForm = useCallback(() => {
            const newCertificates = certificates
                .filter(cert => cert.id.startsWith('temp-'))
                .map(cert => ({
                    title: cert.title,
                    description: cert.description || null,
                    started_at: formatDateForApi(cert.startDate),
                    end_at: cert.noExpiryDate ? null : formatDateForApi(cert.endDate !== null ? cert.endDate : undefined),
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
                        cert.noExpiryDate !== originalCert.noExpiryDate ||
                        JSON.stringify(cert.startDate) !== JSON.stringify(originalCert.startDate) ||
                        JSON.stringify(cert.endDate) !== JSON.stringify(originalCert.endDate)
                    );
                })
                .map(cert => ({
                    id: cert.id,
                    title: cert.title,
                    description: cert.description || null,
                    started_at: formatDateForApi(cert.startDate),
                    end_at: cert.noExpiryDate ? null : formatDateForApi(cert.endDate !== null ? cert.endDate : undefined),
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

        useImperativeHandle(ref, () => ({
            resetForm,
            saveForm
        }));
        
        const setCertificateRef = useCallback((id: string, element: HTMLDivElement | null) => {
            if (element) {
                certificateRefs.current.set(id, element);
            } else {
                certificateRefs.current.delete(id);
            }
        }, []);

        const remainingCertificates = MAX_CERTIFICATES - certificates.length;

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold">Your Certificates</h2>
                        <p className="text-gray-600">
                            Add and manage your professional certifications and credentials.
                        </p>
                    </div>
                    {certificates.length > 0 && remainingCertificates > 0 && (
                        <Button
                            onClick={handleAddCertificate}
                            variant="outline"
                            className="flex items-center"
                            size="sm"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Certificate ({remainingCertificates} left)
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-6" ref={containerRef}>
                            {certificates.length === 0 ? (
                                <EmptyState onAddCertificate={handleAddCertificate} />
                            ) : (
                                <div className="space-y-6">
                                    {certificates.map((certificate, index) => (
                                        <div 
                                            key={certificate.id}
                                            ref={(el) => setCertificateRef(certificate.id, el)}
                                            className={`transition-opacity duration-300 ${
                                                lastAddedId === certificate.id && isPending 
                                                    ? 'opacity-70' 
                                                    : 'opacity-100'
                                            }`}
                                        >
                                            <CertificateItem
                                                certificate={certificate}
                                                index={index}
                                                onUpdate={handleUpdateCertificate}
                                                onRemove={handleRemoveCertificate}
                                                onContentReady={handleContentReady}
                                            />
                                        </div>
                                    ))}

                                    <div className="flex justify-center mt-6">
                                        {remainingCertificates > 0 ? (
                                            <Button
                                                onClick={handleAddCertificate}
                                                variant="outline"
                                                className="flex items-center"
                                                disabled={isPending}
                                            >
                                                {isPending ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                        Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Add Another Certificate ({remainingCertificates} remaining)
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <div className="flex items-center bg-amber-50 text-amber-700 px-4 py-2 rounded-md">
                                                <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                                                <p className="text-sm">
                                                    Maximum of {MAX_CERTIFICATES} certificates allowed. Consider removing less relevant ones.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {isPending && (
                                <div className="fixed bottom-6 right-6 bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center z-50">
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Adding certificate...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-2 text-sm text-gray-500 flex items-center bg-blue-50 p-3 rounded-md">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    <p>
                        <strong>Coming soon:</strong> File uploads for certificate attachments will be available in the next update.
                    </p>
                </div>
            </div>
        );
    }
);

CertificateForm.displayName = "CertificateForm";
export default CertificateForm;
export type { CertificateFormRef } from './certificate/types';