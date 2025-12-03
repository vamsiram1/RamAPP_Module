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
 * Validates college concession information
 * Each year's concession (1st year and 2nd year) individually cannot exceed orientation fee
 * @param {Object} formData - Form data containing concession information
 * @param {Object} academicFormData - Academic form data containing orientation fee (courseFee)
 * @returns {Object} - Object with validation errors { fieldName: errorMessage }
 */
export function validateCollegeConcessionInfo(formData, academicFormData) {
  const errors = {};

  // Get orientation fee from academicFormData
  const orientationFee = safeToNumber(academicFormData?.courseFee || academicFormData?.orientationFee || 0);
  
  // Get concession amounts
  const firstYearConcession = safeToNumber(formData?.firstYearConcession || 0);
  const secondYearConcession = safeToNumber(formData?.secondYearConcession || 0);

  // If orientation fee is not provided, we can't validate
  if (orientationFee <= 0) {
    // Don't validate concessions if orientation fee is missing
    return errors;
  }

  // Validate 1st Year Concession individually
  if (firstYearConcession > orientationFee) {
    errors.firstYearConcession = `1st Year Concession (${firstYearConcession}) cannot exceed orientation fee (${orientationFee})`;
  }

  // Validate 2nd Year Concession individually
  if (secondYearConcession > orientationFee) {
    errors.secondYearConcession = `2nd Year Concession (${secondYearConcession}) cannot exceed orientation fee (${orientationFee})`;
  }

  // Check if any concession amount is entered, make referredBy, concessionReason, and authorizedBy mandatory
  const hasConcessionAmount = firstYearConcession > 0 || secondYearConcession > 0;

  if (hasConcessionAmount) {
    const referredBy = safeTrim(formData?.referredBy);
    const concessionReason = safeTrim(formData?.concessionReason);
    const authorizedBy = safeTrim(formData?.authorizedBy);

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

  // Validate "Concession Written on Application" - Concession Amount
  // Limit: Orientation Fee - 1st Year Concession
  if (formData?.concessionWrittenOnApplication) {
    const concessionAmount = safeToNumber(formData?.concessionAmount || 0);
    
    if (orientationFee > 0) {
      const availableAmount = orientationFee - firstYearConcession;
      
      if (concessionAmount > availableAmount) {
        errors.concessionAmount = `Concession Amount (${concessionAmount}) cannot exceed available amount (${availableAmount} = Orientation Fee ${orientationFee} - 1st Year Concession ${firstYearConcession})`;
      }
    }
  }

  return errors;
}

/**
 * Checks if college concession information is valid
 * @param {Object} formData - Form data containing concession information
 * @param {Object} academicFormData - Academic form data containing orientation fee
 * @returns {boolean} - True if valid, false otherwise
 */
export function isCollegeConcessionInfoValid(formData, academicFormData) {
  const errors = validateCollegeConcessionInfo(formData, academicFormData);
  return Object.keys(errors).length === 0;
}

