import { OnboardingFormFields } from '../components/types';


interface Degree {
  id: string;
  name: string;
}


export function validateStep(
  step: number,
  formData: OnboardingFormFields,
  degreesData?: Degree[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (!formData.userName) errors.push("Username is required");
      break;
    case 2:
      if (!formData.firstName) errors.push("First name is required");
      if (!formData.lastName) errors.push("Last name is required");
      if (!formData.description) errors.push("Description is required");
      if (!(formData.skills || []).length) errors.push("At least one skill is required");


      const dob = formData.dateOfBirth;
      if (!dob || !dob.year || !dob.month || !dob.day) {
        errors.push("Date of birth is required");
      } else {

        const dobDate = new Date(`${dob.year}-${dob.month}-${dob.day}`);
        if (isNaN(dobDate.getTime())) {
          errors.push("Invalid date of birth");
        } else {

          const today = new Date();
          const minAgeDate = new Date(
            today.getFullYear() - 13,
            today.getMonth(),
            today.getDate()
          );

          if (dobDate > minAgeDate) {
            errors.push("You must be at least 13 years old to register");
          }


          if (dobDate > today) {
            errors.push("Date of birth cannot be in the future");
          }
        }
      }
      break;
    case 3:

      const educations = formData.education || [];
      if (educations.length === 0) {
        errors.push("At least one education entry is required");
      } else {

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

      const certificates = formData.certificates || [];


      if (certificates.length > 0) {
        certificates.forEach((cert, index) => {
          if (!cert.title) errors.push(`Title is required for certificate #${index + 1}`);
          if (!cert.description) errors.push(`Description is required for certificate #${index + 1}`);
          if (!cert.startDate) errors.push(`Issue date is required for certificate #${index + 1}`);


          if (!cert.fileUrl && !cert.externalUrl) {
            errors.push(`Either upload a file or provide a URL for certificate #${index + 1}`);
          }
        });
      }
      break;
    case 5:

      const proofsOfWork = formData.proofsOfWork || [];


      if (proofsOfWork.length === 0) {
        errors.push("At least one proof of work entry is required");
      } else {

        proofsOfWork.forEach((pow, index) => {
          if (!pow.title) errors.push(`Title is required for entry #${index + 1}`);
          if (!pow.description) errors.push(`Description is required for entry #${index + 1}`);


          if (!pow.isCommunityWork && !pow.company_name) {
            errors.push(`Company name is required for entry #${index + 1}`);
          }


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

      const projects = formData.projects || [];


      if (projects.length > 0) {

        projects.forEach((project, index) => {
          if (!project.title) errors.push(`Title is required for project #${index + 1}`);
          if (!project.description) errors.push(`Description is required for project #${index + 1}`);


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