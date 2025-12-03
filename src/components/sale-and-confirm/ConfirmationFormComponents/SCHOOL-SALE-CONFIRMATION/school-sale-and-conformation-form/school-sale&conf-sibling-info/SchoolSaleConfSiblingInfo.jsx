import React from "react";
import Inputbox from "../../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../../widgets/Dropdown/Dropdown";
import Button from "../../../../../../widgets/Button/Button";
import styles from "./SchoolSaleConfSiblingInfo.module.css";
import UploadIcon from "../../../../../../assets/application-status/school-sale-conf-assets/UploadIcon";
import PlusIcon from "../../../../../../assets/application-status/school-sale-conf-assets/PlusIcon";
import { useRelationTypes, useClasses } from "./hooks/SchoolSiblings";

const SchoolSaleConfSiblingInfo = ({
  siblings,
  onSiblingChange,
  onAddSibling,
  onClearSibling,
  onDeleteSibling,
  onUploadAnnexure,
  errors = {},
}) => {
  // Fetch relation types from API
  const {
    relationOptions,
    getRelationTypeIdByName,
    getRelationTypeNameById,
    loading: relationTypesLoading,
  } = useRelationTypes();

  // Fetch classes from API
  const {
    classOptions,
    getClassIdByName,
    getClassNameById,
    loading: classesLoading,
  } = useClasses();

  // Handle relation type change - convert name to ID before storing
  const handleRelationTypeChange = (siblingId) => (e) => {
    const selectedName = e.target.value;
    const relationTypeId = getRelationTypeIdByName(selectedName);

    // Store the ID instead of the name
    const value = relationTypeId !== undefined ? relationTypeId : selectedName; // Fallback to name if ID not found
    onSiblingChange(siblingId, "siblingRelation", value);
  };

  // Get display value for relation type (convert ID to name if needed)
  const getRelationTypeDisplayValue = (relationValue) => {
    if (!relationValue) return "";
    // If it's already a name (string that exists in options), return it
    if (relationOptions.includes(relationValue)) {
      return relationValue;
    }
    // Otherwise, try to convert ID to name
    const name = getRelationTypeNameById(relationValue);
    return name || relationValue;
  };

  // Handle class change - convert name/label to ID before storing
  const handleClassChange = (siblingId) => (e) => {
    const selectedName = e.target.value;
    const classId = getClassIdByName(selectedName);

    // Store the ID instead of the name
    const value = classId !== undefined ? classId : selectedName; // Fallback to name if ID not found
    onSiblingChange(siblingId, "siblingClass", value);
  };

  // Get display value for class (convert ID to name/label if needed)
  const getClassDisplayValue = (classValue) => {
    if (!classValue) return "";
    // If it's already a name (string that exists in options), return it
    if (classOptions.includes(classValue)) {
      return classValue;
    }
    // Otherwise, try to convert ID to name
    const name = getClassNameById(classValue);
    return name || classValue;
  };

  /**
   * Handler for name input - only allows alphabets and spaces
   */
  const handleNameChange = (siblingId) => (e) => {
    const { value } = e.target;
    // Remove any non-alphabetic characters (keep only letters and spaces)
    const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, "");
    onSiblingChange(siblingId, "siblingName", alphabetsOnly);
  };

  /**
   * Handler for organization name input - only allows alphabets and spaces
   */
  const handleOrganizationNameChange = (siblingId) => (e) => {
    const { value } = e.target;
    // Remove any non-alphabetic characters (keep only letters and spaces)
    const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, "");
    onSiblingChange(siblingId, "siblingSchool", alphabetsOnly);
  };

  /**
   * Get error message for a specific sibling field
   */
  const getSiblingError = (siblingId, fieldName) => {
    const errorKey = `sibling_${siblingId}_${fieldName}`;
    return errors[errorKey] || null;
  };

  return (
    <div className={styles.section}>
      {/* Main Header - Only shown once */}
      {siblings.length > 0 && (
        <div className={styles.mainHeaderRow}>
          <span className={styles.mainTitle}>Sibling Information</span>
          <div className={styles.line}></div>
        </div>
      )}

      {/* Render each sibling card */}
      {siblings.map((sibling, index) => (
        <div key={sibling.id} className={styles.siblingCard}>
          {/* Card Header with Clear and Delete buttons */}
          <div className={styles.cardHeaderRow}>
            <span className={styles.siblingNumber}>Sibling {index + 1}</span>

            <div className={styles.siblingActions}>
              <button
                className={styles.clearBtn}
                onClick={() => onClearSibling(sibling.id)}
              >
                Clear
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => onDeleteSibling(sibling.id)}
              >
                ?
              </button>
            </div>
          </div>

          {/* Row 1 (3 boxes) */}
          <div className={styles.formGrid3}>
            <div>
              <Inputbox
                label="Full Name"
                name="siblingName"
                placeholder="Enter Full Name"
                value={sibling.siblingName}
                onChange={handleNameChange(sibling.id)}
              />
              {getSiblingError(sibling.id, "name") && (
                <span className={styles.errorMessage}>{getSiblingError(sibling.id, "name")}</span>
              )}
            </div>

            <div>
              <Dropdown
                dropdownname="Relation Type"
                name="siblingRelation"
                results={relationTypesLoading ? [] : relationOptions}
                value={getRelationTypeDisplayValue(sibling.siblingRelation)}
                onChange={handleRelationTypeChange(sibling.id)}
                disabled={relationTypesLoading}
              />
              {getSiblingError(sibling.id, "relation") && (
                <span className={styles.errorMessage}>{getSiblingError(sibling.id, "relation")}</span>
              )}
            </div>

            <div>
              <Dropdown
                dropdownname="Select Class"
                name="siblingClass"
                results={classesLoading ? [] : classOptions}
                value={getClassDisplayValue(sibling.siblingClass)}
                onChange={handleClassChange(sibling.id)}
                disabled={classesLoading}
              />
              {getSiblingError(sibling.id, "class") && (
                <span className={styles.errorMessage}>{getSiblingError(sibling.id, "class")}</span>
              )}
            </div>
          </div>

          {/* Row 2 (Organization Name) */}
          <div className={styles.formGrid1}>
            <div>
              <Inputbox
                label="Organization Name"
                name="siblingSchool"
                value={sibling.siblingSchool}
                placeholder="Enter Organization Name"
                onChange={handleOrganizationNameChange(sibling.id)}
              />
              {getSiblingError(sibling.id, "school") && (
                <span className={styles.errorMessage}>{getSiblingError(sibling.id, "school")}</span>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Buttons Row */}
      <div className={styles.buttonGrid}>
        <Button
          buttonname="Upload Annexure"
          variant="secondary"
          onClick={onUploadAnnexure}
          lefticon={<UploadIcon />}
        />

        <Button
          buttonname="Add Another Sibling"
          variant="outline"
          onClick={onAddSibling}
          lefticon={<PlusIcon />}
        />
      </div>
    </div>
  );
};

export default SchoolSaleConfSiblingInfo;
