import React from "react";
import Inputbox from "../../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../../widgets/Dropdown/Dropdown";
import styles from "./SchoolSaleConfAcadeInfo.module.css";
import useSchoolAcademicFormState from "./hooks/useSchoolAcademicFormState";

const SchoolSaleConfAcadeInfo = ({ formData, onChange, overviewData, errors = {} }) => {
  const state = useSchoolAcademicFormState({ formData, onChange, overviewData });

  /**
   * Handler for Score App No input - only allows numbers and max 12 digits
   */
  const handleScoreAppNoChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    // Limit to 12 digits
    const limitedDigits = digitsOnly.slice(0, 12);
    
    // Create a new event with the filtered value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: limitedDigits,
      },
    };
    
    onChange(filteredEvent);
  };

  /**
   * Handler for Score Marks input - only allows numbers and max 3 digits
   */
  const handleScoreMarksChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    // Limit to 3 digits
    const limitedDigits = digitsOnly.slice(0, 3);
    
    // Create a new event with the filtered value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: limitedDigits,
      },
    };
    
    onChange(filteredEvent);
  };

  return (
    <div className={styles.section}>
      {/* Title */}
      <div className={styles.headerRow}>
        <span className={styles.sectionTitle}>Academic Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Row 1 */}
      <div className={styles.formGrid}>
        <Dropdown
          dropdownname="Orientation Name"
          name="orientationName"
          results={state.orientationsLoading ? [] : state.orientationOptions}
          value={state.getOrientationDisplayValue(formData.orientationName)}
          onChange={state.handleOrientationChange}
          disabled={state.orientationsLoading || !state.branchId || !state.joiningClassId}
        />

        <div>
          <Inputbox
            label="Orientation Fee"
            name="orientationFee"
            placeholder="0.0"
            value={formData.orientationFee}
            onChange={onChange}
          />
          {errors.orientationFee && (
            <span className={styles.errorMessage}>{errors.orientationFee}</span>
          )}
        </div>

        <Inputbox
          label="Score App No"
          name="scoreAppNo"
          placeholder="Enter score app No"
          value={formData.scoreAppNo}
          onChange={handleScoreAppNoChange}
          type="tel"
        />
      </div>

      {/* Row 2 */}
      <div className={styles.formGrid}>
        <Inputbox
          label="Score Marks"
          name="scoreMarks"
          placeholder="Enter marks"
          value={formData.scoreMarks}
          onChange={handleScoreMarksChange}
          type="tel"
        />

        <Dropdown
          dropdownname="Food Type"
          name="foodType"
          results={state.foodTypesLoading ? [] : state.foodTypeOptions}
          value={state.getFoodTypeDisplayValue(formData.foodType)}
          onChange={state.handleFoodTypeChange}
          disabled={state.foodTypesLoading}
        />

        <Dropdown
          dropdownname="Blood Group"
          name="bloodGroup"
          results={state.bloodGroupsLoading ? [] : state.bloodGroupOptions}
          value={state.getBloodGroupDisplayValue(formData.bloodGroup)}
          onChange={state.handleBloodGroupChange}
          disabled={state.bloodGroupsLoading}
        />
      </div>

      {/* Row 3 */}
      <div className={styles.formGrid}>
        <Dropdown
          dropdownname="Caste"
          name="caste"
          results={state.castesLoading ? [] : state.casteOptions}
          value={state.getCasteDisplayValue(formData.caste)}
          onChange={state.handleCasteChange}
          disabled={state.castesLoading}
        />

        <Dropdown
          dropdownname="Religion"
          name="religion"
          results={state.religionsLoading ? [] : state.religionOptions}
          value={state.getReligionDisplayValue(formData.religion)}
          onChange={state.handleReligionChange}
          disabled={state.religionsLoading}
        />
      </div>
    </div>
  );
};

export default SchoolSaleConfAcadeInfo;


