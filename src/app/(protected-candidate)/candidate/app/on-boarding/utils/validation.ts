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
    // Additional step validations will be added here...
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}