/**
 * Utility functions for authentication-related validations
 */

/**
 * Validates an email address
 * @param email Email address to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "Email is required";
  }
  
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Please enter a valid email address";
  }
  
  return undefined;
};

/**
 * Validates a password
 * @param password Password to validate
 * @param minLength Minimum length requirement (default: 8)
 * @returns Error message if invalid, undefined if valid
 */
export const validatePassword = (password: string, minLength = 8): string | undefined => {
  if (!password) {
    return "Password is required";
  }
  
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }
  
  return undefined;
};

/**
 * Validates that two passwords match
 * @param password Main password
 * @param confirmPassword Confirmation password
 * @returns Error message if they don't match, undefined if they match
 */
export const validatePasswordsMatch = (password: string, confirmPassword: string): string | undefined => {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  
  return undefined;
};

/**
 * Validates that terms have been agreed to
 * @param agreed Boolean indicating if terms were agreed to
 * @returns Error message if not agreed, undefined if agreed
 */
export const validateTermsAgreement = (agreed: boolean): string | undefined => {
  if (!agreed) {
    return "You must agree to the Terms and Privacy Policy";
  }
  
  return undefined;
};

/**
 * Validates a signup form
 * @param formData Form data with email, password, confirmPassword
 * @param agreedToTerms Boolean indicating if terms were agreed to
 * @returns Object with validation errors and isValid flag
 */
export const validateSignupForm = (
  formData: { email: string; password: string; confirmPassword: string },
  agreedToTerms: boolean
): { errors: Record<string, string | undefined>; isValid: boolean } => {
  const errors: Record<string, string | undefined> = {
    email: validateEmail(formData.email),
    password: validatePassword(formData.password),
    confirmPassword: validatePasswordsMatch(formData.password, formData.confirmPassword),
    terms: validateTermsAgreement(agreedToTerms)
  };
  
  // Check if there are any errors
  const isValid = Object.values(errors).every(error => error === undefined);
  
  return { errors, isValid };
};

/**
 * Validates a signin form
 * @param email Email address
 * @param password Password
 * @returns Object with validation errors and isValid flag
 */
export const validateSigninForm = (
  email: string,
  password: string
): { errors: Record<string, string | undefined>; isValid: boolean } => {
  const errors: Record<string, string | undefined> = {
    email: validateEmail(email),
    password: password ? undefined : "Password is required"
  };
  
  // Check if there are any errors
  const isValid = Object.values(errors).every(error => error === undefined);
  
  return { errors, isValid };
};