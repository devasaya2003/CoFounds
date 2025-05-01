'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { Alert } from '@/components/ui/alert';
import { Certificate } from "@/types/candidate_onboarding";
import { CertificatesStepProps, CertificateFieldErrors } from '../types';
import CertificateForm from './CertificateForm';
import { addCertificate, removeCertificate, updateCertificate } from '@/redux/slices/candidateOnboardingSlice';

export default function CertificateStep({
  formState,
  errors,
  register,
  watch,
  setValue,
  onNextStep,
  onPreviousStep,
  onAddCertificate,
  onRemoveCertificate,
  onUpdateCertificate,
  maxCertificateEntries = 10,
  isSubmitting = false 
}: CertificatesStepProps) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const certificates = watch('certificates') || [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const generateTempId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleAddCertificate = () => {
    
    if (isSubmitting) return;
    
    if (certificates.length < maxCertificateEntries) {
      const newCertificate: Certificate = {
        id: generateTempId(),
        title: '',
        description: '',
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
        fileUrl: '',
        externalUrl: '',
      };

      setValue('certificates', [...certificates, newCertificate]);
      dispatch(addCertificate(newCertificate));
      onAddCertificate();
    }
  };

  const handleRemoveCertificate = (id: string) => {
    
    if (isSubmitting) return;
    
    const updatedCertificates = certificates.filter(cert => cert.id !== id);
    setValue('certificates', updatedCertificates);
    dispatch(removeCertificate(id));
    onRemoveCertificate(id);
  };

  const handleUpdateCertificate = (id: string, updates: Partial<Certificate>) => {
    
    if (isSubmitting) return;
    
    const updatedCertificates = certificates.map(cert =>
      cert.id === id ? { ...cert, ...updates } : cert
    );
    setValue('certificates', updatedCertificates);
    dispatch(updateCertificate({ id, updates }));
    onUpdateCertificate(id, updates);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Certificates</h2>
        <p className="text-gray-600">Add your certifications and credentials.</p>
      </div>

      {error && (
        <Alert key="error-alert" variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </Alert>
      )}

      {certificates.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No certificates added yet.</p>
          <button
            type="button"
            onClick={handleAddCertificate}
            disabled={isSubmitting}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center mx-auto ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Certificate
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {certificates.map((certificate, index) => (
            <CertificateForm
              key={certificate.id}
              certificate={certificate}
              index={index}
              register={register}
              watch={watch}
              setValue={setValue}
              onRemove={() => handleRemoveCertificate(certificate.id)}
              onUpdate={(updates) => handleUpdateCertificate(certificate.id, updates)}
              years={years}
              months={months}
              days={days}
              errors={errors.certificates?.[index] as CertificateFieldErrors}
              disabled={isSubmitting} 
            />
          ))}

          {certificates.length < maxCertificateEntries && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAddCertificate}
                disabled={isSubmitting}
                className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Another Certificate ({certificates.length}/{maxCertificateEntries})
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4 mt-6">
        <button
          type="button"
          className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={onPreviousStep}
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous Step
        </button>

        <button
          type="button"
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={onNextStep}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              Next Step
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}