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

        useEffect(() => {
            if (profile && profile.certificates) {
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
                setOriginalCertificates(JSON.parse(JSON.stringify(formattedCerts)));
            }
        }, [profile, currentYear]);

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

        const handleAddCertificate = () => {
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
                noExpiryDate: false
            };

            setCertificates([...certificates, newCertificate]);
        };

        const handleRemoveCertificate = (id: string) => {
            if (id.startsWith('temp-')) {
                setCertificates(certificates.filter(cert => cert.id !== id));
            } else {
                setCertificates(certificates.filter(cert => cert.id !== id));
                setDeletedCertificates([...deletedCertificates, id]);
            }
        };

        const handleUpdateCertificate = (id: string, updates: Partial<Certificate>) => {
            setCertificates(certificates.map(cert =>
                cert.id === id ? { ...cert, ...updates } : cert
            ));
        };

        const resetForm = useCallback(() => {
            setCertificates(JSON.parse(JSON.stringify(originalCertificates)));
            setDeletedCertificates([]);
        }, [originalCertificates]);

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

        const EmptyState = () => (
            <div className="text-center py-10 bg-gray-50 rounded-md border border-dashed border-gray-300">
                <h3 className="font-medium text-lg mb-2">No certificates added yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Showcase your qualifications and credentials to stand out to potential employers.
                </p>
                <Button
                    onClick={handleAddCertificate}
                    variant="outline"
                    className="flex items-center mx-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Certificate
                </Button>
            </div>
        );

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold">Your Certificates</h2>
                        <p className="text-gray-600">
                            Add and manage your professional certifications and credentials.
                        </p>
                    </div>
                    {certificates.length > 0 && certificates.length < MAX_CERTIFICATES && (
                        <Button
                            onClick={handleAddCertificate}
                            variant="outline"
                            className="flex items-center"
                            size="sm"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Certificate ({MAX_CERTIFICATES - certificates.length} left)
                        </Button>
                    )}
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

                                    <div className="flex justify-center mt-6">
                                        {certificates.length < MAX_CERTIFICATES ? (
                                            <Button
                                                onClick={handleAddCertificate}
                                                variant="outline"
                                                className="flex items-center"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Another Certificate ({MAX_CERTIFICATES - certificates.length} remaining)
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