import React, { useEffect, useRef } from "react";
import Inputbox from "../../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../../widgets/Dropdown/Dropdown";
import styles from "./CollegeConceInfoForms.module.css";
import useCollegeConcessionFormState from "./hooks/useCollegeConcessionFormState";
import ButtonRightArrow from "../../../../../../assets/application-status/school-sale-conf-assets/ButtonRightArrow";

const CollegeConceInfoForms = ({ formData, onChange, academicYear, academicYearId, overviewData, errors = {} }) => {
  const state = useCollegeConcessionFormState({ formData, onChange, academicYear, academicYearId, overviewData });

  // Track if user has manually edited any Concession Written on Application fields
  const userEdited = useRef({});

  useEffect(() => {
    // Only auto-populate if user hasn't edited
    if (!userEdited.current.concessionAmount && overviewData?.concessionAmount && formData?.concessionAmount !== overviewData.concessionAmount) {
      onChange({ target: { name: "concessionAmount", value: overviewData.concessionAmount } });
    }
    if (!userEdited.current.concessionReferredBy && overviewData?.concessionReferredBy && formData?.concessionReferredBy !== overviewData.concessionReferredBy) {
      onChange({ target: { name: "concessionReferredBy", value: overviewData.concessionReferredBy } });
    }
    if (!userEdited.current.reason && overviewData?.reason && formData?.reason !== overviewData.reason) {
      onChange({ target: { name: "reason", value: overviewData.reason } });
    }
  }, [overviewData]);

  // Mark user edit on change
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    userEdited.current[name] = true;
    
    // For concessionAmount, filter to numbers only
    if (name === 'concessionAmount') {
      const digitsOnly = value.replace(/\D/g, "");
      const filteredEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: digitsOnly,
        },
      };
      onChange(filteredEvent);
    } else {
      onChange(e);
    }
  };

  return (
    <div className={styles.section}>
      {/* Title */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Concession Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Row 1 */}
      <div className={styles.grid}>
        <div>
          <Inputbox
            label="1st Year Concession"
            name="firstYearConcession"
            placeholder="Enter 1st Year Concession"
            value={formData?.firstYearConcession || ""}
            onChange={state.handleFirstYearConcessionChange}
            type="tel"
          />
          {errors.firstYearConcession && (
            <span className={styles.errorMessage}>{errors.firstYearConcession}</span>
          )}
        </div>

        <div>
          <Inputbox
            label="2nd Year Concession"
            name="secondYearConcession"
            placeholder="Enter 2nd Year Concession"
            value={formData?.secondYearConcession || ""}
            onChange={state.handleSecondYearConcessionChange}
            type="tel"
          />
          {errors.secondYearConcession && (
            <span className={styles.errorMessage}>{errors.secondYearConcession}</span>
          )}
        </div>

        <div>
          <Dropdown
            dropdownname="Referred By"
            name="referredBy"
            results={state.dropdownOptions}
            onChange={state.handleReferredByChange}
            value={state.selectedReferredBy || state.getReferredByDisplayValue(formData?.referredBy)}
          />
          {errors.referredBy && (
            <span className={styles.errorMessage}>{errors.referredBy}</span>
          )}
        </div>
      </div>

      {/* Row 2 */}
      <div className={styles.grid}>
        <Inputbox
          label="Description"
          name="description"
          placeholder="Enter Description"
          value={formData?.description || ""}
          onChange={onChange}
        />

        <div>
          <Dropdown
            dropdownname="Authorized By"
            name="authorizedBy"
            results={state.dropdownOptions}
            onChange={state.handleAuthorizedByChange}
            value={state.selectedAuthorizedBy || state.getAuthorizedByDisplayValue(formData?.authorizedBy)}
          />
          {errors.authorizedBy && (
            <span className={styles.errorMessage}>{errors.authorizedBy}</span>
          )}
        </div>

        <div>
          <Dropdown
            dropdownname="Concession Reason *"
            name="concessionReason"
            results={state.concessionReasonOptions}
            onChange={state.handleConcessionReasonChange}
            value={state.selectedConcessionReason || state.getConcessionReasonDisplayValue(formData?.concessionReason)}
          />
          {errors.concessionReason && (
            <span className={styles.errorMessage}>{errors.concessionReason}</span>
          )}
        </div>
      </div>

      {/* Concession Written on Application Section - Only show when overview has valid concession data */}
  {/* Always show Concession Written on Application fields, auto-populate but allow editing */}
  <>
    <div className={styles.checkboxRow}>
      <label className={styles.checkboxLabel}>
        <input 
          type="checkbox" 
          className={styles.checkbox}
          checked={!!formData?.concessionWrittenOnApplication}
          onChange={state.handleCheckboxChange}
        />
        <span>Concession Written on Application</span>
      </label>
      <div className={styles.line}></div>
    </div>
    {!!formData?.concessionWrittenOnApplication && (
      <div className={styles.grid}>
        <div>
          <Inputbox
            label="Concession Amount"
            name="concessionAmount"
            placeholder="Enter Concession Amount"
            value={formData?.concessionAmount || overviewData?.concessionAmount || "10,000"}
            onChange={handleFieldChange}
            type="tel"
          />
          {errors.concessionAmount && (
            <span className={styles.errorMessage}>{errors.concessionAmount}</span>
          )}
        </div>
        <Dropdown
          dropdownname="Concession Referred By"
          name="concessionReferredBy"
          results={state.dropdownOptions}
          onChange={state.handleConcessionReferredByChange}
          value={state.selectedConcessionReferredBy || formData?.concessionReferredBy || overviewData?.concessionReferredBy || ""}
        />
        <Inputbox
          label="Reason"
          name="reason"
          placeholder="Enter Reason"
          value={formData?.reason || overviewData?.reason || "Special Concession"}
          onChange={handleFieldChange}
        />
      </div>
    )}
  </>
    </div>
  );
};

export default CollegeConceInfoForms;
