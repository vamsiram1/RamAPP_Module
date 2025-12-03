import React, { useState, useEffect, useCallback } from 'react';
import CollegeAcademicConfForms from '../../../../components/sale-and-confirm/ConfirmationFormComponents/COLLEGE-SALE-CONFIRMATION/college-application-conf/college-academic-conf/CollegeOrientInfoForms.jsx';
import CollegeConceInfoForms from '../../../../components/sale-and-confirm/ConfirmationFormComponents/COLLEGE-SALE-CONFIRMATION/college-application-conf/college-conce-info-forms/CollegeConceInfoForms.jsx';
import ApplicationSaleAndConfTopSec from '../../../../widgets/ApplicationSaleAndConTopSection/ApplicationSaleAndConfTopSec.jsx';
import Button from '../../../../widgets/Button/Button';
import ButtonRightArrow from '../../../../assets/application-status/school-sale-conf-assets/ButtonRightArrow';
import Snackbar from '../../../../widgets/Snackbar/Snackbar.jsx';
import { validateCollegeConcessionInfo } from '../../../../components/sale-and-confirm/ConfirmationFormComponents/COLLEGE-SALE-CONFIRMATION/college-application-conf/college-conce-info-forms/utils/collegeConcessionValidation';
import styles from './CollegeAppConfContainer.module.css';

const CollegeAppConfContainer = ({ onBack, onProceedToPayment, detailsObject, overviewData }) => {
  // Form data state for college application confirmation
  const [formData, setFormData] = useState({
    // Academic Year Info (from widget) - will be auto-populated
    academicYear: "",
    academicYearId: "",
    // Concession Info
    firstYearConcession: "",
    firstYearConcessionTypeId: "", // Concession type ID for "1st year"
    secondYearConcession: "",
    secondYearConcessionTypeId: "", // Concession type ID for "2nd year"
    referredBy: "",
    description: "",
    authorizedBy: "",
    concessionReason: "",
    concessionWrittenOnApplication: false,
    concessionAmount: "",
    concessionReferredBy: "",
    reason: "",
  });

  // State to store academic form data (orientation info)
  const [academicFormData, setAcademicFormData] = useState({
    cityId: null,
    branchId: null,
    joiningClassId: null,
    orientationId: null,
    courseNameId: null,
    studentTypeId: null,
    courseFee: null, // Orientation fee
  });

  // Validation errors state for inline display
  const [validationErrors, setValidationErrors] = useState({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "error",
  });

  // Dynamic auto-population utility function
  const autoPopulateFormFields = (overviewData, formData, academicFormData, setFormData, setAcademicFormData) => {
    if (!overviewData) return;

    console.log('🔄 Starting dynamic auto-population with overviewData:', overviewData);

    // Define field mapping between overview and form fields
    const formFieldMappings = {
      // Academic/Orientation fields - populate academicFormData
      academicFields: {
        'cityName': 'selectedCityName',
        'cityId': 'cityId',
        'branchName': 'selectedBranchName',
        'campusName': 'selectedBranchName',
        'branchId': 'branchId',
        'campusId': 'branchId',
        'className': 'selectedClassName', 
        'joiningClassName': 'selectedClassName',
        'classId': 'joiningClassId',
        'joiningClassId': 'joiningClassId',
        'orientationName': 'selectedCourseName',
        'courseName': 'selectedCourseName',
        'orientationId': 'orientationId',
        'courseId': 'orientationId',
        'studentTypeName': 'selectedStudentType',
        'studentTypeId': 'studentTypeId',
        'orientationStartDate': 'courseStartDate',
        'courseStartDate': 'courseStartDate',
        'orientationEndDate': 'courseEndDate', 
        'courseEndDate': 'courseEndDate',
        'orientationFee': 'courseFee',
        'courseFee': 'courseFee'
      },
      // General form fields - populate formData
      generalFields: {
        'academicYear': 'academicYear',
        'academicYearId': 'academicYearId',
        'academicYearName': 'academicYear'
      }
    };

    // Auto-populate general form fields
    const updatedFormData = { ...formData };
    let formDataChanged = false;

    Object.entries(formFieldMappings.generalFields).forEach(([overviewField, formField]) => {
      if (overviewData[overviewField] !== undefined && overviewData[overviewField] !== null && overviewData[overviewField] !== '') {
        if (updatedFormData[formField] !== overviewData[overviewField]) {
          updatedFormData[formField] = overviewData[overviewField];
          formDataChanged = true;
          console.log(`✅ Auto-populated ${formField}:`, overviewData[overviewField]);
        }
      }
    });

    if (formDataChanged) {
      setFormData(updatedFormData);
    }

    // Auto-populate academic form fields (for the orientation form)
    const updatedAcademicFormData = { ...academicFormData };
    let academicDataChanged = false;

    Object.entries(formFieldMappings.academicFields).forEach(([overviewField, formField]) => {
      if (overviewData[overviewField] !== undefined && overviewData[overviewField] !== null && overviewData[overviewField] !== '') {
        if (updatedAcademicFormData[formField] !== overviewData[overviewField]) {
          updatedAcademicFormData[formField] = overviewData[overviewField];
          academicDataChanged = true;
          console.log(`✅ Auto-populated academic ${formField}:`, overviewData[overviewField]);
        }
      }
    });

    if (academicDataChanged) {
      setAcademicFormData(updatedAcademicFormData);
    }
  };

  // Auto-populate academic year and ID when detailsObject is available
  useEffect(() => {
    if (detailsObject?.academicYear || detailsObject?.academicYearId) {
      setFormData((prev) => ({
        ...prev,
        academicYear: detailsObject?.academicYear || prev.academicYear,
        academicYearId: detailsObject?.academicYearId || prev.academicYearId,
      }));
      console.log('✅ Auto-populated Academic Year:', detailsObject?.academicYear);
      console.log('✅ Auto-populated Academic Year ID:', detailsObject?.academicYearId);
    }
  }, [detailsObject?.academicYear, detailsObject?.academicYearId]);

  // Dynamic auto-population when overviewData is available
  useEffect(() => {
    autoPopulateFormFields(overviewData, formData, academicFormData, setFormData, setAcademicFormData);
  }, [overviewData]); // Only depend on overviewData to avoid infinite loops

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error for the field being changed (only if it's not a concession-related field)
    // Concession-related errors are handled by useEffect above
    if (validationErrors[name] && 
        name !== 'firstYearConcession' && 
        name !== 'secondYearConcession' &&
        name !== 'referredBy' &&
        name !== 'concessionReason' &&
        name !== 'authorizedBy' &&
        name !== 'concessionAmount') {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Callback to update academic form data from CollegeOrientInfoForms
  const handleAcademicFormDataChange = useCallback((data) => {
    setAcademicFormData((prev) => {
      // Only update if data actually changed to prevent infinite loops
      const hasChanges = 
        prev.cityId !== data.cityId ||
        prev.branchId !== data.branchId ||
        prev.joiningClassId !== data.joiningClassId ||
        prev.orientationId !== data.orientationId ||
        prev.courseNameId !== data.courseNameId ||
        prev.studentTypeId !== data.studentTypeId ||
        prev.courseFee !== data.courseFee;
      
      if (hasChanges) {
        return { ...prev, ...data };
      }
      return prev;
    });
  }, []);

  // Real-time validation for concession amounts
  useEffect(() => {
    const concessionErrors = validateCollegeConcessionInfo(formData, academicFormData);
    
    // Update errors for concession-related fields
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      
      // Clear previous concession-related errors
      delete newErrors.firstYearConcession;
      delete newErrors.secondYearConcession;
      delete newErrors.referredBy;
      delete newErrors.concessionReason;
      delete newErrors.authorizedBy;
      delete newErrors.concessionAmount;
      
      // Add new errors if validation fails
      if (concessionErrors.firstYearConcession) {
        newErrors.firstYearConcession = concessionErrors.firstYearConcession;
      }
      if (concessionErrors.secondYearConcession) {
        newErrors.secondYearConcession = concessionErrors.secondYearConcession;
      }
      if (concessionErrors.referredBy) {
        newErrors.referredBy = concessionErrors.referredBy;
      }
      if (concessionErrors.concessionReason) {
        newErrors.concessionReason = concessionErrors.concessionReason;
      }
      if (concessionErrors.authorizedBy) {
        newErrors.authorizedBy = concessionErrors.authorizedBy;
      }
      if (concessionErrors.concessionAmount) {
        newErrors.concessionAmount = concessionErrors.concessionAmount;
      }
      
      // Show snackbar with first error if any errors exist
      if (Object.keys(concessionErrors).length > 0) {
        const firstErrorKey = Object.keys(concessionErrors)[0];
        const firstErrorMessage = concessionErrors[firstErrorKey];
        setSnackbar({
          open: true,
          message: firstErrorMessage,
          type: "error",
        });
      } else {
        // Clear snackbar if validation passes (only for concession errors)
        // Check if current snackbar message is about concession error
        if (snackbar.open && snackbar.message && (
          snackbar.message.includes("cannot exceed") ||
          snackbar.message.includes("is required when concession")
        )) {
          closeSnackbar();
        }
      }
      
      return newErrors;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.firstYearConcession, formData.secondYearConcession, formData.referredBy, formData.concessionReason, formData.authorizedBy, formData.concessionWrittenOnApplication, formData.concessionAmount, academicFormData.courseFee]);

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleProceedToPaymentClick = () => {
    // Validate concession information before proceeding
    const concessionErrors = validateCollegeConcessionInfo(formData, academicFormData);
    
    if (Object.keys(concessionErrors).length > 0) {
      // Store validation errors for inline display
      setValidationErrors(concessionErrors);
      
      // Show snackbar with first error
      const firstErrorKey = Object.keys(concessionErrors)[0];
      const firstErrorMessage = concessionErrors[firstErrorKey];
      setSnackbar({
        open: true,
        message: firstErrorMessage,
        type: "error",
      });
      
      // Scroll to first error field
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      
      return;
    }

    // Clear errors if validation passes
    setValidationErrors({});
    closeSnackbar();
    
    console.log("🔍 ===== PROCEEDING TO PAYMENT ======");
    console.log("Form Data (Concession Info):", formData);
    console.log("Academic Form Data (Orientation Info):", academicFormData);
    console.log("  - First Year Concession:", formData.firstYearConcession);
    console.log("  - First Year Concession Type ID:", formData.firstYearConcessionTypeId);
    console.log("  - Second Year Concession:", formData.secondYearConcession);
    console.log("  - Second Year Concession Type ID:", formData.secondYearConcessionTypeId);
    console.log("  - Concession Reason:", formData.concessionReason);
    console.log("  - Authorized By:", formData.authorizedBy);
    console.log("  - Referred By:", formData.referredBy);
    console.log("=====================================");
    
    if (onProceedToPayment) {
      // Pass form data and academic form data to parent
      onProceedToPayment(formData, academicFormData);
    }
  };

  return (
    <div className={styles.container}>
      <ApplicationSaleAndConfTopSec step={2} onBack={onBack}  title="Application Confirmation"  detailsObject={detailsObject}/>
      
      <div className={styles.contentContainer}>
        <CollegeAcademicConfForms 
          academicYear={detailsObject?.academicYear}
          academicYearId={detailsObject?.academicYearId}
          onDataChange={handleAcademicFormDataChange}
          overviewData={overviewData}
          prePopulatedData={academicFormData}
        />
        <CollegeConceInfoForms 
          formData={formData} 
          onChange={handleChange}
          academicYear={detailsObject?.academicYear}
          academicYearId={detailsObject?.academicYearId}
          overviewData={overviewData}
          errors={validationErrors}
        />

        {/* Bottom Action Buttons */}
        <div className={styles.bottomActions}>
          <Button
            buttonname="Proceed to payment"
            righticon={<ButtonRightArrow />}
            variant="primary"
            width="220px"
            onClick={handleProceedToPaymentClick}
          />
        </div>
      </div>

      {/* Snackbar for validation errors */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </div>
  );
};

export default CollegeAppConfContainer;
