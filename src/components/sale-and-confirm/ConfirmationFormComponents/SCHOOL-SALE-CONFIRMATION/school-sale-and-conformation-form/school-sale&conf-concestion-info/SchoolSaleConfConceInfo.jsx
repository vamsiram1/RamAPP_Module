import React from "react";
import Inputbox from "../../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../../widgets/Dropdown/Dropdown";
import styles from "./SchoolSaleConfConceInfo.module.css";
import { useEmployees, useConcessionReasons, useConcessionTypes } from "./hooks/SchoolConcession";

const SchoolSaleConfConceInfo = ({ formData, onChange, errors = {} }) => {
  // Fetch employees from API
  const { employeeOptions, getEmployeeIdByLabel, getEmployeeLabelById, loading: employeesLoading } = useEmployees();
  
  // Fetch concession reasons from API
  const { concessionReasonOptions, getConcessionReasonIdByLabel, getConcessionReasonLabelById, loading: concessionReasonsLoading } = useConcessionReasons();
  
  // Fetch concession types from API
  const { concessionTypeOptions, getConcessionTypeIdByLabel, getConcessionTypeLabelById, loading: concessionTypesLoading } = useConcessionTypes();

  // Handle employee change - convert "Label - ID" format to ID before storing
  const handleEmployeeChange = (fieldName) => (e) => {
    const selectedValue = e.target.value;
    
    // Try to get ID from the map (handles both "Label - ID" format and just label)
    let employeeId = getEmployeeIdByLabel(selectedValue);
    
    // If not found in map, try to extract ID from "Label - ID" format
    if (employeeId === undefined && selectedValue.includes(' - ')) {
      const parts = selectedValue.split(' - ');
      if (parts.length >= 2) {
        const extractedId = parts[parts.length - 1].trim();
        employeeId = extractedId;
      }
    }
    
    // Create a synthetic event with the ID value
    const syntheticEvent = {
      target: {
        name: fieldName,
        value: employeeId !== undefined ? employeeId : selectedValue // Fallback to selected value if ID not found
      }
    };
    
    onChange(syntheticEvent);
  };

  // Get display value for employee (convert ID to "Label - ID" format if needed)
  const getEmployeeDisplayValue = (employeeValue) => {
    if (!employeeValue) return "";
    
    // If it's already in "Label - ID" format and exists in options, return it
    if (employeeOptions.includes(employeeValue)) {
      return employeeValue;
    }
    
    // Otherwise, try to convert ID to "Label - ID" format
    const label = getEmployeeLabelById(employeeValue);
    return label || employeeValue;
  };

  // Handle concession reason change - convert label to ID before storing
  const handleConcessionReasonChange = (e) => {
    const selectedLabel = e.target.value;
    const reasonId = getConcessionReasonIdByLabel(selectedLabel);
    
    // Create a synthetic event with the ID value
    const syntheticEvent = {
      target: {
        name: "concessionReason",
        value: reasonId !== undefined ? reasonId : selectedLabel // Fallback to label if ID not found
      }
    };
    
    onChange(syntheticEvent);
  };

  // Get display value for concession reason (convert ID to label if needed)
  const getConcessionReasonDisplayValue = (reasonValue) => {
    if (!reasonValue) return "";
    // If it's already a label (string that exists in options), return it
    if (concessionReasonOptions.includes(reasonValue)) {
      return reasonValue;
    }
    // Otherwise, try to convert ID to label
    const label = getConcessionReasonLabelById(reasonValue);
    return label || reasonValue;
  };

  // Handle admission fee concession change - store both amount and type ID
  const handleAdmissionFeeConcessionChange = (e) => {
    const { name, value } = e.target;
    
    // Remove any non-digit characters (allow only numbers)
    const digitsOnly = value.replace(/\D/g, "");
    
    // Get the "Admission Fee" concession type ID
    const admissionFeeTypeId = getConcessionTypeIdByLabel("Admission Fee");
    
    // Log to console for debugging
    console.log('?? Admission Fee Concession Value:', digitsOnly);
    console.log('?? Admission Fee Concession Type ID:', admissionFeeTypeId);
    console.log('?? Full Details:', {
      field: 'admissionConcession',
      value: digitsOnly,
      concessionType: 'Admission Fee',
      concessionTypeId: admissionFeeTypeId
    });
    
    // Create a filtered event with only numeric value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: digitsOnly,
      },
    };
    
    // Update the form data with the concession amount
    onChange(filteredEvent);
    
    // Also store the concession type ID separately
    if (admissionFeeTypeId !== undefined) {
      const typeIdEvent = {
        target: {
          name: "admissionConcessionTypeId",
          value: admissionFeeTypeId
        }
      };
      onChange(typeIdEvent);
    }
  };

  // Handle tuition fee concession change - store both amount and type ID
  const handleTuitionFeeConcessionChange = (e) => {
    const { name, value } = e.target;
    
    // Remove any non-digit characters (allow only numbers)
    const digitsOnly = value.replace(/\D/g, "");
    
    // Get the "Tuition Fee" concession type ID
    const tuitionFeeTypeId = getConcessionTypeIdByLabel("Tuition Fee");
    
    // Log to console for debugging
    console.log('?? Tuition Fee Concession Value:', digitsOnly);
    console.log('?? Tuition Fee Concession Type ID:', tuitionFeeTypeId);
    console.log('?? Full Details:', {
      field: 'tuitionConcession',
      value: digitsOnly,
      concessionType: 'Tuition Fee',
      concessionTypeId: tuitionFeeTypeId
    });
    
    // Create a filtered event with only numeric value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: digitsOnly,
      },
    };
    
    // Update the form data with the concession amount
    onChange(filteredEvent);
    
    // Also store the concession type ID separately
    if (tuitionFeeTypeId !== undefined) {
      const typeIdEvent = {
        target: {
          name: "tuitionConcessionTypeId",
          value: tuitionFeeTypeId
        }
      };
      onChange(typeIdEvent);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <span className={styles.sectionTitle}>Concession Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Row 1 */}
      <div className={styles.formGrid3}>
        <div>
          <Inputbox
            label="Admission Fee Concession"
            name="admissionConcession"
            placeholder="Enter Concession amount"
            value={formData.admissionConcession}
            onChange={handleAdmissionFeeConcessionChange}
            type="tel"
          />
          {errors.admissionConcession && (
            <span className={styles.errorMessage}>{errors.admissionConcession}</span>
          )}
        </div>

        <div>
          <Inputbox
            label="Tuition Fee Concession"
            name="tuitionConcession"
            placeholder="Enter Concession Amount"
            value={formData.tuitionConcession}
            onChange={handleTuitionFeeConcessionChange}
            type="tel"
          />
          {errors.tuitionConcession && (
            <span className={styles.errorMessage}>{errors.tuitionConcession}</span>
          )}
        </div>

        <div>
          <Dropdown
            dropdownname="Referred by"
            name="referredBy"
            results={employeesLoading ? [] : employeeOptions}
            value={getEmployeeDisplayValue(formData.referredBy)}
            onChange={handleEmployeeChange("referredBy")}
            disabled={employeesLoading}
          />
          {errors.referredBy && (
            <span className={styles.errorMessage}>{errors.referredBy}</span>
          )}
        </div>
      </div>

      {/* Row 2 */}
      <div className={styles.formGrid3}>
        <Inputbox
          label="Description"
          name="concessionDescription"
          placeholder="Enter description"
          value={formData.concessionDescription}
          onChange={onChange}
        />

        <div>
          <Dropdown
            dropdownname="Concession Reason"
            name="concessionReason"
            results={concessionReasonsLoading ? [] : concessionReasonOptions}
            value={getConcessionReasonDisplayValue(formData.concessionReason)}
            onChange={handleConcessionReasonChange}
            disabled={concessionReasonsLoading}
          />
          {errors.concessionReason && (
            <span className={styles.errorMessage}>{errors.concessionReason}</span>
          )}
        </div>

        <div>
          <Dropdown
            dropdownname="Authorized by"
            name="authorizedBy"
            results={employeesLoading ? [] : employeeOptions}
            value={getEmployeeDisplayValue(formData.authorizedBy)}
            onChange={handleEmployeeChange("authorizedBy")}
            disabled={employeesLoading}
          />
          {errors.authorizedBy && (
            <span className={styles.errorMessage}>{errors.authorizedBy}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolSaleConfConceInfo;
