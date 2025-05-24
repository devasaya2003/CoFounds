'use client';

import { Loader2, X } from 'lucide-react';
import PaginatedDegreeSelector from '@/components/DegreeSelector/PaginatedDegreeSelector';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';
import { EducationFormData } from './state';

interface EducationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: EducationFormData;
  editingId: string | null;
  isSubmitting: boolean;
  errors: Record<string, string>;
  handleInputChange: (field: string, value: unknown) => void;
  handleCurrentlyStudyingToggle: (value: boolean) => void;
  handleDegreeSelect: (degreeId: string, degreeName: string) => void;
  handleClearDegree: () => void;
  handleSaveEducation: () => Promise<void>; // Make sure this is Promise<void>
  handleCancelEdit: () => void;
}

export function EducationFormModal({
  isOpen,
  onClose,
  formData,
  editingId,
  isSubmitting,
  errors,
  handleInputChange,
  handleCurrentlyStudyingToggle,
  handleDegreeSelect,
  handleClearDegree,
  handleSaveEducation,
  handleCancelEdit
}: EducationFormModalProps) {

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleSubmit = async () => {
    try {
      await handleSaveEducation();
      // Close the modal upon successful save
      onClose();
    } catch (error) {
      // Error handling is done in the state hook
      console.error('Error saving education:', error);
    }
  };
  
  const handleClose = () => {
    if (!isSubmitting) {
      handleCancelEdit();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingId ? 'Edit Education' : 'Add Education'}
          </h2>
          <button 
            type="button" 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Institution Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                placeholder="e.g. Harvard University"
                className={`w-full px-3 py-2 bg-white border ${errors.institution ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors`}
              />
              {errors.institution && (
                <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
              )}
            </div>
            
            {/* Degree Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree <span className="text-red-500">*</span>
              </label>
              <PaginatedDegreeSelector
                selectedDegree={formData.degreeId}
                onDegreeSelect={handleDegreeSelect}
                onClear={handleClearDegree}
                error={errors.degree}
                fetchAll={true}
              />
            </div>
            
            {/* Date Range with Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <DatePicker
                  date={formData.startDate || undefined}
                  setDate={(date) => handleInputChange('startDate', date)}
                  label="Start Date *"
                  error={errors.startDate}
                />
              </div>
              
              {/* End Date */}
              <div className="space-y-3">
                <DatePicker
                  date={formData.endDate || undefined}
                  setDate={(date) => handleInputChange('endDate', date)}
                  label={`End Date ${!formData.isCurrentlyStudying ? '*' : ''}`}
                  disabled={formData.isCurrentlyStudying}
                  error={errors.endDate}
                />
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isCurrentlyStudying}
                    onCheckedChange={handleCurrentlyStudyingToggle}
                  />
                  <label className="text-sm text-gray-600">
                    I am currently studying here
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </span>
            ) : (
              editingId ? 'Update Education' : 'Add Education'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Add this new component for delete confirmation
interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  education: EducationFormData | null;
  isDeleting: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  education,
  isDeleting
}: DeleteConfirmationProps) {
  // Close dialog on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen || !education) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete your education at <span className="font-medium">{education.institution}</span> for <span className="font-medium">{education.degreeName}</span>?
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </span>
            ) : (
              'Yes, Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
