'use client';

import { useEducationForm } from './state';
import { Loader2, CheckCircle, X, Pencil, Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { EducationFormModal, DeleteConfirmationDialog } from './components';
import { useState } from 'react';
import { EducationFormData } from './state';

export default function EducationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<EducationFormData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const {
    educationList,
    formData,
    editingId,
    isSubmitting,
    isLoading,
    saveSuccess,
    errors,
    
    handleInputChange,
    handleCurrentlyStudyingToggle,
    handleDegreeSelect,
    handleClearDegree,
    handleEditEducation,
    handleCancelEdit,
    handleDirectSave,
handleDirectDelete 
  } = useEducationForm();
  
  const handleOpenAddModal = () => {
handleCancelEdit(); 
    setIsModalOpen(true);
  };
    
  const handleOpenEditModal = (id: string) => {
    handleEditEducation(id);
    setIsModalOpen(true);
  };
    
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleShowDeleteConfirmation = (id: string) => {
    const education = educationList.find(edu => edu.id === id);
    if (education) {
      setEducationToDelete(education);
      setIsDeleteConfirmOpen(true);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (educationToDelete && educationToDelete.id) {
      setIsDeleting(true);
      try {        
        await handleDirectDelete(educationToDelete.id);
      } catch (error) {
        console.error('Error deleting education:', error);
      } finally {
        setIsDeleting(false);
        setIsDeleteConfirmOpen(false);
        setEducationToDelete(null);
      }
    }
  };
  
  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setEducationToDelete(null);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-5 sm:p-6 mb-10">
      {/* Header with Add button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Education</h1>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </button>
      </div>
      
      {/* Education List */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          </div>
        ) : educationList.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
            <p className="text-gray-500">No education added yet. Click the "Add Education" button to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {educationList.map((edu) => (
              <div key={edu.id} className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{edu.degreeName}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {edu.startDate ? format(new Date(edu.startDate), 'MMM yyyy') : 'Unknown'} 
                        {' - '}
                        {edu.isCurrentlyStudying 
                          ? 'Present' 
                          : edu.endDate 
                            ? format(new Date(edu.endDate), 'MMM yyyy')
                            : 'Unknown'
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(edu.id!)}
                      className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
                      title="Edit education"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleShowDeleteConfirmation(edu.id!)}
                      className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600"
                      title="Delete education"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed bottom-4 right-4 flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md shadow-md">
          <CheckCircle className="w-5 h-5 mr-1.5" />
          <span>Education saved successfully!</span>
        </div>
      )}
      
      {/* Education Form Modal */}
      <EducationFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        editingId={editingId}
        isSubmitting={isSubmitting}
        errors={errors}
        handleInputChange={handleInputChange}
        handleCurrentlyStudyingToggle={handleCurrentlyStudyingToggle}
        handleDegreeSelect={handleDegreeSelect}
        handleClearDegree={handleClearDegree}
        handleSaveEducation={handleDirectSave}
        handleCancelEdit={handleCancelEdit}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        education={educationToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
