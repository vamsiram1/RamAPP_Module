import { useState, useCallback } from "react";
import { validateParentInfo } from "../utils/parentValidation";
import { validateSiblings } from "../../school-sale&conf-sibling-info/utils/siblingValidation";
import { validateAcademicInfo, validateConcessionInfo } from "../../school-sale&conf-academic-info/utils/academicValidation";

/**
 * Hook for managing parent, sibling, academic, and concession information validation with snackbar notifications
 * @returns {Object} - Object containing validation functions and snackbar state
 */
export default function useParentValidation() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "error", // 'error', 'success', 'warning', 'info'
  });

  /**
   * Show snackbar message
   */
  const showSnackbar = useCallback((message, type = "error") => {
    setSnackbar({
      open: true,
      message,
      type,
    });
  }, []);

  /**
   * Close snackbar
   */
  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  /**
   * Validate parent, sibling, academic, and concession information and show snackbar if errors exist
   * @param {Object} formData - Form data to validate
   * @param {Array} siblings - Siblings array to validate
   * @returns {Object} - Object with isValid flag and errors object
   */
  const validateAndShowErrors = useCallback(
    (formData, siblings = []) => {
      // Validate parent information
      const parentErrors = validateParentInfo(formData);
      
      // Validate siblings information
      const siblingErrors = validateSiblings(siblings);
      
      // Validate academic information
      const academicErrors = validateAcademicInfo(formData);
      
      // Validate concession information
      const concessionErrors = validateConcessionInfo(formData);
      
      // Combine all errors
      const allErrors = { 
        ...parentErrors, 
        ...siblingErrors, 
        ...academicErrors, 
        ...concessionErrors 
      };

      if (Object.keys(allErrors).length > 0) {
        // Get the first error message to show in snackbar
        const firstErrorKey = Object.keys(allErrors)[0];
        const firstErrorMessage = allErrors[firstErrorKey];

        // Show snackbar with first error
        showSnackbar(firstErrorMessage, "error");

        // Return validation result
        return {
          isValid: false,
          errors: allErrors,
          firstErrorField: firstErrorKey,
        };
      }

      // Clear snackbar if validation passes
      closeSnackbar();

      return {
        isValid: true,
        errors: {},
        firstErrorField: null,
      };
    },
    [showSnackbar, closeSnackbar]
  );

  return {
    snackbar,
    showSnackbar,
    closeSnackbar,
    validateAndShowErrors,
  };
}

