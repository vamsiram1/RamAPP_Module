import React, { useState, useEffect } from "react";
import SchoolOverviewTopSection from "../../../../widgets/ApplicationSaleAndConTopSection/ApplicationSaleAndConfTopSec.jsx";
import SchoolSaleConfParentInfo from "../../../../components/sale-and-confirm/ConfirmationFormComponents/SCHOOL-SALE-CONFIRMATION/school-sale-and-conformation-form/school-sale&conf-parent-information/SchoolSaleConfParentInfo.jsx";
import SchoolSaleConfSiblingInfo from "../../../../components/sale-and-confirm/ConfirmationFormComponents/SCHOOL-SALE-CONFIRMATION/school-sale-and-conformation-form/school-sale&conf-sibling-info/SchoolSaleConfSiblingInfo.jsx";
import Button from "../../../../widgets/Button/Button";
import styles from "./SchoolSaleConfFormsCont.module.css";
import SchoolSaleConfAcadeInfo from "../../../../components/sale-and-confirm/ConfirmationFormComponents/SCHOOL-SALE-CONFIRMATION/school-sale-and-conformation-form/school-sale&conf-academic-info/SchoolSaleConfAcadeInfo.jsx";
import SchoolSaleConfLangInfo from "../../../../components/sale-and-confirm/ConfirmationFormComponents/SCHOOL-SALE-CONFIRMATION/school-sale-and-conformation-form/school-sale&conf-language-info/SchoolSaleConfLangInfo.jsx";
import SchoolSaleConfConceInfo from "../../../../components/sale-and-confirm/ConfirmationFormComponents/SCHOOL-SALE-CONFIRMATION/school-sale-and-conformation-form/school-sale&conf-concestion-info/SchoolSaleConfConceInfo.jsx";
import ButtonRightArrow from '../../../../assets/application-status/school-sale-conf-assets/ButtonRightArrow';
import Snackbar from "../../../../widgets/Snackbar/Snackbar.jsx";
import useParentValidation from "../../../../components/sale-and-confirm/ConfirmationFormComponents/SCHOOL-SALE-CONFIRMATION/school-sale-and-conformation-form/school-sale&conf-parent-information/hooks/useParentValidation";
import { validateConcessionInfo } from "../../../../components/sale-and-confirm/ConfirmationFormComponents/SCHOOL-SALE-CONFIRMATION/school-sale-and-conformation-form/school-sale&conf-academic-info/utils/academicValidation";
import { useOrientations } from "../../../../components/sale-and-confirm/ConfirmationFormComponents/SCHOOL-SALE-CONFIRMATION/school-sale-and-conformation-form/school-sale&conf-academic-info/hooks/SchoolAcedemic";

const SchoolSaleConfFormsCont = ({ onBack, onProceedToPayment, detailsObject, overviewData }) => {
  const [formData, setFormData] = useState({
    // Father Info
    fatherName: "",
    fatherPhone: "",
    fatherEmail: "",
    fatherSector: "",
    fatherOccupation: "",
    fatherOtherOccupation: "",
    
    // Mother Info
    motherName: "",
    motherPhone: "",
    motherEmail: "",
    motherSector: "",
    motherOccupation: "",
    motherOtherOccupation: "",
    
    // Academic Info
    orientationName: "",
    orientationId: "", // Store orientation ID for backend
    orientationFee: "",
    scoreAppNo: "",
    scoreMarks: "",
    foodType: "",
    bloodGroup: "",
    caste: "",
    religion: "",
    
    // Language Info
    firstLanguage: "",
    secondLanguage: "",
    thirdLanguage: "",
    
    // Concession Info
    admissionConcession: "",
    admissionConcessionTypeId: "", // Concession type ID for "Admission Fee"
    tuitionConcession: "",
    tuitionConcessionTypeId: "", // Concession type ID for "Tuition Fee"
    referredBy: "",
    concessionDescription: "",
    concessionReason: "",
    authorizedBy: "",
  });

  // Get orientations hook to extract orientation ID from name
  const branchId = overviewData?.branchId;
  const joiningClassId = overviewData?.joiningClassId;
  const { getOrientationIdByLabel, loading: orientationsLoading } = useOrientations(joiningClassId, branchId);

  // Auto-populate form fields from overviewData when available
  useEffect(() => {
    if (overviewData) {
      setFormData((prev) => ({
        ...prev,
        // Parent Info
        fatherName: overviewData.parentInfo?.fatherName || "",
        fatherPhone: overviewData.parentInfo?.phoneNumber || "",
        
        // Academic Info - Auto-populate orientation name and ID
        orientationName: overviewData.orientationName || "",
        // Extract orientationId from overviewData if available
        orientationId: overviewData.orientationId || overviewData.orientation_id || overviewData.courseId || overviewData.course_id || "",
        // You can also auto-populate other fields if available in overviewData
        // orientationFee: overviewData.orientationFee || "",
      }));
    }
  }, [overviewData]);

  // Sync orientationId when orientationName is auto-populated but orientationId is missing
  useEffect(() => {
    if (
      formData.orientationName && 
      !formData.orientationId && 
      !orientationsLoading && 
      getOrientationIdByLabel
    ) {
      const orientationId = getOrientationIdByLabel(formData.orientationName);
      if (orientationId !== undefined) {
        console.log("🔄 Syncing orientationId:", orientationId, "for orientationName:", formData.orientationName);
        setFormData((prev) => ({
          ...prev,
          orientationId: orientationId,
        }));
      }
    }
  }, [formData.orientationName, formData.orientationId, orientationsLoading, getOrientationIdByLabel]);

  // Separate state for siblings array
  const [siblings, setSiblings] = useState([]);

  // Parent validation hook
  const { snackbar, closeSnackbar, validateAndShowErrors } = useParentValidation();

  // Validation errors state for inline display
  const [validationErrors, setValidationErrors] = useState({});

  // Real-time validation for concession amounts and related fields
  useEffect(() => {
    const concessionErrors = validateConcessionInfo(formData);
    
    // Update errors for concession-related fields
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      
      // Clear previous concession-related errors
      delete newErrors.admissionConcession;
      delete newErrors.tuitionConcession;
      delete newErrors.referredBy;
      delete newErrors.concessionReason;
      delete newErrors.authorizedBy;
      
      // Add new errors if validation fails
      if (concessionErrors.admissionConcession) {
        newErrors.admissionConcession = concessionErrors.admissionConcession;
      }
      if (concessionErrors.tuitionConcession) {
        newErrors.tuitionConcession = concessionErrors.tuitionConcession;
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
      
      return newErrors;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.orientationFee, formData.admissionConcession, formData.tuitionConcession, formData.referredBy, formData.concessionReason, formData.authorizedBy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for the field being changed (only if it's not a concession-related field)
    // Concession-related errors are handled by useEffect above
    if (validationErrors[name] && 
        name !== 'orientationFee' && 
        name !== 'admissionConcession' && 
        name !== 'tuitionConcession' &&
        name !== 'referredBy' &&
        name !== 'concessionReason' &&
        name !== 'authorizedBy') {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSiblingChange = (id, field, value) => {
    setSiblings((prev) =>
      prev.map((sibling) =>
        sibling.id === id ? { ...sibling, [field]: value } : sibling
      )
    );
    
    // Clear error for the sibling field being changed
    const errorKey = `sibling_${id}_${field === 'siblingName' ? 'name' : field === 'siblingRelation' ? 'relation' : field === 'siblingClass' ? 'class' : field === 'siblingSchool' ? 'school' : field}`;
    if (validationErrors[errorKey]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleAddSibling = () => {
    const newSibling = {
      id: Date.now(),
      siblingName: "",
      siblingRelation: "",
      siblingClass: "",
      siblingSchool: "",
    };
    setSiblings((prev) => [...prev, newSibling]);
  };

  const handleClearSibling = (id) => {
    setSiblings((prev) =>
      prev.map((sibling) =>
        sibling.id === id
          ? {
              ...sibling,
              siblingName: "",
              siblingRelation: "",
              siblingClass: "",
              siblingSchool: "",
            }
          : sibling
      )
    );
  };

  const handleDeleteSibling = (id) => {
    setSiblings((prev) => prev.filter((sibling) => sibling.id !== id));
  };

  const handleUploadAnnexure = () => {
    console.log("Upload Annexure");
  };

  const handleProceedToPayment = () => {
    // Validate parent and sibling information before proceeding
    const validationResult = validateAndShowErrors(formData, siblings);
    
    if (!validationResult.isValid) {
      // Store validation errors for inline display
      setValidationErrors(validationResult.errors);
      
      // Scroll to first error field
      if (validationResult.firstErrorField) {
        // Handle sibling field errors (format: sibling_${id}_fieldName)
        if (validationResult.firstErrorField.startsWith('sibling_')) {
          // Extract field name from error key (e.g., "sibling_123_name" -> "siblingName")
          const parts = validationResult.firstErrorField.split('_');
          const fieldName = parts[parts.length - 1]; // Get last part (name, relation, class, school)
          
          // Map field names to actual input names
          const fieldNameMap = {
            'name': 'siblingName',
            'relation': 'siblingRelation',
            'class': 'siblingClass',
            'school': 'siblingSchool'
          };
          
          const actualFieldName = fieldNameMap[fieldName] || fieldName;
          const errorElement = document.querySelector(`[name="${actualFieldName}"]`);
          
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus();
          }
        } else {
          // Handle parent field errors
          const errorElement = document.querySelector(`[name="${validationResult.firstErrorField}"]`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus();
          }
        }
      }
      return;
    }

    // Clear errors if validation passes
    setValidationErrors({});
    
    console.log("Proceed to payment", formData, siblings);
    if (onProceedToPayment) {
      // Pass form data and siblings to parent container
      onProceedToPayment(formData, siblings);
    }
  };

  return (
    <div className={styles.container}>
      <SchoolOverviewTopSection step={2} onBack={onBack} title="Application Sale & Confirmation" detailsObject={detailsObject} />

      <div className={styles.formContainer}>
        <SchoolSaleConfParentInfo 
          formData={formData} 
          onChange={handleChange}
          errors={validationErrors}
        />
        
        <SchoolSaleConfSiblingInfo 
          siblings={siblings}
          onSiblingChange={handleSiblingChange}
          onAddSibling={handleAddSibling}
          onClearSibling={handleClearSibling}
          onDeleteSibling={handleDeleteSibling}
          onUploadAnnexure={handleUploadAnnexure}
          errors={validationErrors}
        />

        <SchoolSaleConfAcadeInfo
          formData={formData}
          onChange={handleChange}
          overviewData={overviewData}
          errors={validationErrors}
        />

        <SchoolSaleConfLangInfo
          formData={formData}
          onChange={handleChange}
        />

        <SchoolSaleConfConceInfo
          formData={formData}
          onChange={handleChange}
          errors={validationErrors}
        />

        {/* Bottom Action Button */}
        <div className={styles.bottomActions}>
          <Button
            buttonname="Proceed to payment"
            righticon={
              <ButtonRightArrow/>
            }
            variant="primary"
            width="220px"
            onClick={handleProceedToPayment}
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

export default SchoolSaleConfFormsCont;

