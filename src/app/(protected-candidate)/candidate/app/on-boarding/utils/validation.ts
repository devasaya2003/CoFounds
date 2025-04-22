import { OnboardingFormFields } from '../components/types';

// Define a type for the degree
interface Degree {
  id: string;
  name: string;
}

// Updated to accept degrees as a parameter
export function validateStep(
  step: number, 
  formData: OnboardingFormFields,
  degreesData?: Degree[] // Optional parameter for degrees
): { isValid: boolean; errors: string[] } {
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
        // Keep validation for required fields in each entry
        educations.forEach((edu, index) => {
          if (!edu.institution) errors.push(`Institution is required for education #${index + 1}`);
          if (!edu.degree) errors.push(`Degree is required for education #${index + 1}`);
          if (!edu.startDate || !edu.startDate.year || !edu.startDate.month) 
            errors.push(`Start date is required for education #${index + 1}`);
          if (!edu.currentlyStudying && (!edu.endDate || !edu.endDate.year || !edu.endDate.month))
            errors.push(`End date is required for education #${index + 1}`);
        });
      }
      break;
    case 4:
      // Certificate validation
      const certificates = formData.certificates || [];
      
      // Certificates are optional, but if added they should have required fields
      if (certificates.length > 0) {
        certificates.forEach((cert, index) => {
          if (!cert.title) errors.push(`Title is required for certificate #${index + 1}`);
          if (!cert.description) errors.push(`Description is required for certificate #${index + 1}`);
          if (!cert.startDate) errors.push(`Issue date is required for certificate #${index + 1}`);
          
          // Require either a file upload or external URL
          if (!cert.fileUrl && !cert.externalUrl) {
            errors.push(`Either upload a file or provide a URL for certificate #${index + 1}`);
          }
        });
      }
      break;
    case 5:
      // Proof of Work validation
      const proofsOfWork = formData.proofsOfWork || [];
      
      // At least one proof of work is required
      if (proofsOfWork.length === 0) {
        errors.push("At least one proof of work entry is required");
      } else {
        // Validate each entry
        proofsOfWork.forEach((pow, index) => {
          if (!pow.title) errors.push(`Title is required for entry #${index + 1}`);
          if (!pow.description) errors.push(`Description is required for entry #${index + 1}`);
          
          // Only validate company name if it's not community work
          if (!pow.isCommunityWork && !pow.company_name) {
            errors.push(`Company name is required for entry #${index + 1}`);
          }
          
          // Validate dates
          if (!pow.startDate || !pow.startDate.year || !pow.startDate.month) {
            errors.push(`Start date is required for entry #${index + 1}`);
          }
          
          if (!pow.currentlyWorking && (!pow.endDate || !pow.endDate.year || !pow.endDate.month)) {
            errors.push(`End date is required for entry #${index + 1}`);
          }
        });
      }
      break;
    case 6:
      // Project validation
      const projects = formData.projects || [];
      
      // Projects are optional
      if (projects.length > 0) {
        // Validate each project
        projects.forEach((project, index) => {
          if (!project.title) errors.push(`Title is required for project #${index + 1}`);
          if (!project.description) errors.push(`Description is required for project #${index + 1}`);
          
          // Validate dates
          if (!project.startDate || !project.startDate.year || !project.startDate.month) {
            errors.push(`Start date is required for project #${index + 1}`);
          }
          
          if (!project.currentlyBuilding && (!project.endDate || !project.endDate.year || !project.endDate.month)) {
            errors.push(`End date is required for project #${index + 1}`);
          }
        });
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}