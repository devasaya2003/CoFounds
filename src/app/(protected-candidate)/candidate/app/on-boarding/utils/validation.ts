import { OnboardingFormFields } from '../components/types';

export function validateStep(step: number, formData: OnboardingFormFields): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  switch(step) {
    case 1:
      if (!formData.userName) errors.push("Username is required");
      break;
    case 2:
      if (!formData.firstName) errors.push("First name is required");
      if (!formData.lastName) errors.push("Last name is required");
      if (!formData.description) errors.push("Description is required");
      if (!(formData.skills || []).length) errors.push("At least one skill is required");
      
      // Validate Date of Birth
      const dob = formData.dateOfBirth;
      if (!dob || !dob.year || !dob.month || !dob.day) {
        errors.push("Date of birth is required");
      } else {
        // Check if date is valid
        const dobDate = new Date(`${dob.year}-${dob.month}-${dob.day}`);
        if (isNaN(dobDate.getTime())) {
          errors.push("Invalid date of birth");
        } else {
          // Check if user is at least 13 years old
          const today = new Date();
          const minAgeDate = new Date(
            today.getFullYear() - 13,
            today.getMonth(),
            today.getDate()
          );
          
          if (dobDate > minAgeDate) {
            errors.push("You must be at least 13 years old to register");
          }
          
          // Also check if date is not in the future
          if (dobDate > today) {
            errors.push("Date of birth cannot be in the future");
          }
        }
      }
      break;
    case 3:
      // Check for at least one education entry with required fields
      const educations = formData.education || [];
      if (educations.length === 0) {
        errors.push("At least one education entry is required");
      } else {
        // Check if at least one entry is high school (10+2)
        const hasHighSchool = educations.some(edu => edu.degree === 'high_school');
        if (!hasHighSchool) {
          errors.push("10+2 or 12th Standard education is required");
        }

        // Check for required fields in each entry
        educations.forEach((edu, index) => {
          if (!edu.institution) errors.push(`Institution is required for education #${index + 1}`);
          if (!edu.degree) errors.push(`Degree is required for education #${index + 1}`);
          if (!edu.startDate) errors.push(`Start date is required for education #${index + 1}`);
          if (!edu.currentlyStudying && !edu.endDate) errors.push(`End date is required for education #${index + 1}`);
        });
      }
      break;
    case 4:
      // Certificate validation
      const certificates = formData.certificates || [];
      
      // If there are certificates, validate each one
      if (certificates.length > 0) {
        certificates.forEach((cert, index) => {
          if (!cert.title) errors.push(`Title is required for certificate #${index + 1}`);
          if (!cert.startDate) errors.push(`Issue date is required for certificate #${index + 1}`);
          // We don't require fileUrl/externalUrl as both are optional
        });
      }
      break;
    // Additional step validations will be added here...
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}