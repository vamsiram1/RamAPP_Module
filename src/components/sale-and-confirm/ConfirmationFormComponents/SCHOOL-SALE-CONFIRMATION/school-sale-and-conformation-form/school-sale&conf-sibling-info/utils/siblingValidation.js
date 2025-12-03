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
 * Validates siblings information
 * If any sibling exists, all fields for each sibling are mandatory
 * @param {Array} siblings - Array of sibling objects
 * @returns {Object} - Object with validation errors { siblingId_fieldName: errorMessage }
 */
export function validateSiblings(siblings) {
  const errors = {};

  // If no siblings, validation passes
  if (!siblings || siblings.length === 0) {
    return errors;
  }

  // Validate each sibling
  siblings.forEach((sibling, index) => {
    const siblingNumber = index + 1;
    const siblingName = safeTrim(sibling.siblingName);
    const siblingRelation = safeTrim(sibling.siblingRelation);
    const siblingClass = safeTrim(sibling.siblingClass);
    const siblingSchool = safeTrim(sibling.siblingSchool);

    // All fields are required for each sibling
    if (!siblingName) {
      errors[`sibling_${sibling.id}_name`] = `Sibling ${siblingNumber}: Full Name is required`;
    }

    if (!siblingRelation) {
      errors[`sibling_${sibling.id}_relation`] = `Sibling ${siblingNumber}: Relation Type is required`;
    }

    if (!siblingClass) {
      errors[`sibling_${sibling.id}_class`] = `Sibling ${siblingNumber}: Class is required`;
    }

    if (!siblingSchool) {
      errors[`sibling_${sibling.id}_school`] = `Sibling ${siblingNumber}: Organization Name is required`;
    }
  });

  return errors;
}

/**
 * Checks if siblings information is valid
 * @param {Array} siblings - Array of sibling objects
 * @returns {boolean} - True if valid, false otherwise
 */
export function isSiblingsValid(siblings) {
  const errors = validateSiblings(siblings);
  return Object.keys(errors).length === 0;
}

