'use client';

import { useSocialLinksForm, CandidateLink } from './state';
import { LinkForm, LinksList, SubmitButtonWithStatus } from './components';
import { useRef } from 'react';

export default function LinksPage() {
  const formRef = useRef<HTMLDivElement>(null);
  
  const {    
    candidateLinks,
    isLoading,
        
    selectedPlatform,
    linkUrl,
    formChanged,
    isSubmitting,
    saveSuccess,
    editingLink,
        
    setSelectedPlatform,
    setLinkUrl,
    handleAddLink,
    handleDeleteLink,
    handleSubmit,
    handleEditLink,
    handleCancelEdit,
    handleResetAll
  } = useSocialLinksForm();
  
  const handleEditWithScroll = (link: CandidateLink) => {
    handleEditLink(link);    
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 10);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-5 sm:p-6 mb-10">
      <h1 className="text-2xl font-bold mb-6">Social Links</h1>
      
      <div className="space-y-6">
        {/* Add Links Form */}
        <div ref={formRef}>
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            {editingLink ? 'Edit Social Link' : 'Add your social link'}
          </h2>
          <LinkForm 
            selectedPlatform={selectedPlatform}
            linkUrl={linkUrl}
            setSelectedPlatform={setSelectedPlatform}
            setLinkUrl={setLinkUrl}
            handleAddLink={handleAddLink}
            editingLink={editingLink}
            handleCancelEdit={handleCancelEdit}
          />
        </div>
        
        {/* Links List */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-3">My Social Links</h2>
          <LinksList 
            links={candidateLinks} 
            isLoading={isLoading}
            onDeleteLink={handleDeleteLink}
            onEditLink={handleEditWithScroll}
          />
        </div>
        
        {/* Submit Button */}
        <form onSubmit={handleSubmit}>
          <SubmitButtonWithStatus
            isSubmitting={isSubmitting}
            saveSuccess={saveSuccess}
            formChanged={formChanged}
            onCancel={handleResetAll}
          />
        </form>
      </div>
    </div>
  );
}
