import React, { useState, useMemo } from "react";
import styles from "./SiblingInformation.module.css";

import {
  siblingsInformationFields,
  siblingFieldsLayout,
} from "./parentInformationFields";

import { renderField } from "../../../../utils/renderField";

// API Hooks
import {
  useGetRelationTypes,
  useGetAllClasses
} from "../../../../queries/saleApis/clgSaleApis";

const SiblingInformation = ({onClose}) => {
  const [values, setValues] = useState({
    fullName: "",
    relationType: "",
    selectClass: "",
    schoolName: "",
  });

  const setFieldValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch dropdown values
  const { data: relationData } = useGetRelationTypes();
  const { data: classData } = useGetAllClasses();
  console.log("Class:", classData);

  // Build field map with API values - memoized to prevent unnecessary recalculations
  const fieldMap = useMemo(() => {
    return siblingsInformationFields.reduce((acc, f) => {
      let field = { ...f };

      if (f.name === "relationType") {
        // Handle different possible response structures: relationData.data or relationData
        const relationArray = Array.isArray(relationData?.data) 
          ? relationData.data 
          : (Array.isArray(relationData) ? relationData : []);
        field.options = relationArray.map((r) => r.name || r.relationName || r.label || '');
      }

      if (f.name === "selectClass") {
        // Handle different possible response structures: classData.data or classData
        // Note: getAllClasses already normalizes to array, but check both for safety
        const classArray = Array.isArray(classData?.data) 
          ? classData.data 
          : (Array.isArray(classData) ? classData : []);
        field.options = classArray.map((c) => c.name || c.className || c.label || '');
      }

      acc[f.name] = field;
      return acc;
    }, {});
  }, [relationData, classData]);

  // Clear sibling fields
  const handleClear = () => {
    setValues({
      fullName: "",
      relationType: "",
      selectClass: "",
      schoolName: "",
    });
  };

  return (
    <div className={styles.siblingInformationWrapper}>
      <div className={styles.clgAppSaleParentsInfoTop}>
        <p className={styles.clgAppSaleParentsHeading}>Sibling Information</p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      <div className={styles.siblingsFieldsWrapper}>
        <p className={styles.siblingTitle}>Sibling 1</p>

        {siblingFieldsLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => (
              <div key={fname} className={styles.clgAppSaleFieldCell}>
                {fname &&
                  renderField(fname, fieldMap, {
                    value: values[fname] ?? "",
                    onChange: (e) => setFieldValue(fname, e.target.value),
                  })}
              </div>
            ))}

            {/* Buttons on the right */}
            <div className={styles.siblingButtons}>
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
              >
                Clear
              </button>

              <button
                type="button"
                className={styles.siblingsCloseButton}
                onClick={onClose}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiblingInformation;
