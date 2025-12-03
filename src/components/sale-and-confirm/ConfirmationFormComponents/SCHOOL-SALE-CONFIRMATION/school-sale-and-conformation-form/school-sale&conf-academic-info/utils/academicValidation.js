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
 * Safely converts value to number
 * @param {any} value - Value to convert
 * @returns {number} - Number value or 0
 */
function safeToNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Validates academic information
 * @param {Object} formData - Form data containing academic information
 * @returns {Object} - Object with validation errors { fieldName: errorMessage }
 */
export function validateAcademicInfo(formData) {
  const errors = {};

  // Orientation Fee is required
  const orientationFee = safeTrim(formData.orientationFee);
  if (!orientationFee) {
    errors.orientationFee = "Orientation Fee is required";
  }

  return errors;
}

/**
 * Validates concession information against orientation fee
 * @param {Object} formData - Form data containing concession and academic information
 * @returns {Object} - Object with validation errors { fieldName: errorMessage }
 */
export function validateConcessionInfo(formData) {
  const errors = {};

  // Get orientation fee
  const orientationFee = safeToNumber(formData.orientationFee);
  
  // Get concession amounts
  const admissionConcession = safeToNumber(formData.admissionConcession);
  const tuitionConcession = safeToNumber(formData.tuitionConcession);
  
  // Check if any concession amount is entered
  const hasConcessionAmount = admissionConcession > 0 || tuitionConcession > 0;

  // If any concession amount is entered, make referredBy, concessionReason, and authorizedBy mandatory
  if (hasConcessionAmount) {
    const referredBy = safeTrim(formData.referredBy);
    const concessionReason = safeTrim(formData.concessionReason);
    const authorizedBy = safeTrim(formData.authorizedBy);

    if (!referredBy) {
      errors.referredBy = "Referred by is required when concession amount is entered";
    }

    if (!concessionReason) {
      errors.concessionReason = "Concession Reason is required when concession amount is entered";
    }

    if (!authorizedBy) {
      errors.authorizedBy = "Authorized by is required when concession amount is entered";
    }
  }

  // Calculate total concessions
  const totalConcessions = admissionConcession + tuitionConcession;

  // If orientation fee is not provided, we can't validate the amount
  if (orientationFee <= 0) {
    // Don't validate concession amounts if orientation fee is missing
    // The orientation fee validation will handle that error
    return errors;
  }

  // Check if total concessions exceed orientation fee
  if (totalConcessions > orientationFee) {
    errors.admissionConcession = `Total concessions (${totalConcessions}) cannot exceed orientation fee (${orientationFee})`;
    errors.tuitionConcession = `Total concessions (${totalConcessions}) cannot exceed orientation fee (${orientationFee})`;
  }

  return errors;
}

/**
 * Checks if academic information is valid
 * @param {Object} formData - Form data containing academic information
 * @returns {boolean} - True if valid, false otherwise
 */
export function isAcademicInfoValid(formData) {
  const errors = validateAcademicInfo(formData);
  return Object.keys(errors).length === 0;
}

/**
 * Checks if concession information is valid
 * @param {Object} formData - Form data containing concession and academic information
 * @returns {boolean} - True if valid, false otherwise
 */
export function isConcessionInfoValid(formData) {
  const errors = validateConcessionInfo(formData);
  return Object.keys(errors).length === 0;
}

