'use client';

import { usePersonalInfoForm } from './state';
import {
  ProfileImageUploader,
  BasicInfoForm,
  BirthDatePicker,
  DescriptionEditorSection,
  SubmitButtonWithStatus
} from './components';

export default function PersonalInfoPage() {
  const {
    // Data
    candidateData,
    firstName,
    lastName,
    profileImage,
    previewUrl,
    uploadingImage,
    dob,
    setDob,
    description,
    descriptionLoaded,
    showEditor,
    isSubmitting,
    formChanged,
    saveSuccess,
    
    // Handlers
    setFirstName,
    setLastName,
    handleFileChange,
    handleDescriptionChange,
    handleShowEditor,
    handleContentReady,
    handleSubmit,
    handleResetForm
  } = usePersonalInfoForm();

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-5 sm:p-6 mb-10">
      <h1 className="text-2xl font-bold mb-6">Personal Information</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <ProfileImageUploader
          profileImage={profileImage}
          previewUrl={previewUrl}
          uploadingImage={uploadingImage}
          handleFileChange={handleFileChange}
        />
        
        {/* Basic Information */}
        <BasicInfoForm
          email={candidateData.email}
          userName={candidateData.userName}
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
        />
        
        {/* Date of Birth - Updated to use new component */}
        <BirthDatePicker
          dob={dob}
          setDob={setDob}
        />
        
        {/* Description Editor */}
        <DescriptionEditorSection
          description={description}
          showEditor={showEditor}
          descriptionLoaded={descriptionLoaded}
          handleDescriptionChange={handleDescriptionChange}
          handleShowEditor={handleShowEditor}
          handleContentReady={handleContentReady}
        />
        
        {/* Submit Button */}
        <SubmitButtonWithStatus
          isSubmitting={isSubmitting}
          formChanged={formChanged}
          saveSuccess={saveSuccess}
          onCancel={handleResetForm}
        />
      </form>
    </div>
  );
}
