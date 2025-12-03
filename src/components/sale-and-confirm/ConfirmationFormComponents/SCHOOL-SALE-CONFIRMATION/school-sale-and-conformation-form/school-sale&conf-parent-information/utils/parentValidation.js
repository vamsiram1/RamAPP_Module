/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number validation regex
 * - Must start with 6, 7, 8, or 9
 * - Must be exactly 10 digits
 */
const PHONE_REGEX = /^[6-9]\d{9}$/;

/**
 * Safely converts value to string and trims it
 * @param {any} value - Value to convert and trim
 * @returns {string} - Trimmed string or empty string
 */
function safeTrim(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export function isValidEmail(email) {
  if (!email) return false;
  const emailStr = safeTrim(email);
  if (!emailStr) return false;
  return EMAIL_REGEX.test(emailStr);
}

/**
 * Validates phone number format
 * Phone number must:
 * - Start with 6, 7, 8, or 9
 * - Be exactly 10 digits
 * @param {string|number} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const phoneStr = safeTrim(phone);
  if (!phoneStr) return false;
  // Remove any spaces, dashes, or other characters to get only digits
  const digitsOnly = phoneStr.replace(/\D/g, "");
  // Check if it matches the pattern: starts with 6-9 and is exactly 10 digits
  return PHONE_REGEX.test(digitsOnly);
}

/**
 * Validates parent information
 * @param {Object} formData - Form data containing parent information
 * @returns {Object} - Object with validation errors { fieldName: errorMessage }
 */
export function validateParentInfo(formData) {
  const errors = {};

  // Safely get trimmed values
  const fatherName = safeTrim(formData.fatherName);
  const fatherPhone = safeTrim(formData.fatherPhone);
  const fatherEmail = safeTrim(formData.fatherEmail);
  const motherName = safeTrim(formData.motherName);
  const motherPhone = safeTrim(formData.motherPhone);
  const motherEmail = safeTrim(formData.motherEmail);

  // Validate Father Information
  if (fatherName) {
    // If father name is entered, phone and email are required
    if (!fatherPhone) {
      errors.fatherPhone = "Phone number is required when father name is provided";
    } else if (!isValidPhone(fatherPhone)) {
      errors.fatherPhone = "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits";
    }
    
    if (!fatherEmail) {
      errors.fatherEmail = "Email is required when father name is provided";
    } else if (!isValidEmail(fatherEmail)) {
      errors.fatherEmail = "Please enter a valid email address";
    }
  }

  // Validate Mother Information
  if (motherName) {
    // If mother name is entered, phone and email are required
    if (!motherPhone) {
      errors.motherPhone = "Phone number is required when mother name is provided";
    } else if (!isValidPhone(motherPhone)) {
      errors.motherPhone = "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits";
    }
    
    if (!motherEmail) {
      errors.motherEmail = "Email is required when mother name is provided";
    } else if (!isValidEmail(motherEmail)) {
      errors.motherEmail = "Please enter a valid email address";
    }
  }

  // Also validate phone number format even if name is not provided (if phone is entered)
  if (fatherPhone && !isValidPhone(fatherPhone)) {
    errors.fatherPhone = "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits";
  }

  if (motherPhone && !isValidPhone(motherPhone)) {
    errors.motherPhone = "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits";
  }

  // Also validate email format even if name is not provided (if email is entered)
  if (fatherEmail && !isValidEmail(fatherEmail)) {
    errors.fatherEmail = "Please enter a valid email address";
  }

  if (motherEmail && !isValidEmail(motherEmail)) {
    errors.motherEmail = "Please enter a valid email address";
  }

  return errors;
}

/**
 * Checks if parent information is valid
 * @param {Object} formData - Form data containing parent information
 * @returns {boolean} - True if valid, false otherwise
 */
export function isParentInfoValid(formData) {
  const errors = validateParentInfo(formData);
  return Object.keys(errors).length === 0;
}

