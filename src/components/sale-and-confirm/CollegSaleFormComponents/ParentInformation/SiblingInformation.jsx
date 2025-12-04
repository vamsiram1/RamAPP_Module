import React, { useState, useMemo } from "react";
import { useFormikContext } from "formik";
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
  const { values, setFieldValue } = useFormikContext();
  
  const [localValues, setLocalValues] = useState({
    fullName: "",
    relationType: "",
    relationTypeId: null,
    selectClass: "",
    classId: null,
    schoolName: "",
  });

  const setLocalFieldValue = (field, value) => {
    setLocalValues((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch dropdown values
  const { data: relationData } = useGetRelationTypes();
  const { data: classData } = useGetAllClasses();
  console.log("Class:", classData);

  // Create maps for name-to-ID conversion
  const relationNameToId = useMemo(() => {
    const map = new Map();
    const relationArray = Array.isArray(relationData?.data) 
      ? relationData.data 
      : (Array.isArray(relationData) ? relationData : []);
    relationArray.forEach((r) => {
      const name = r.name || r.relationName || r.label || '';
      if (name && r.id) {
        map.set(name, r.id);
      }
    });
    return map;
  }, [relationData]);

  const classNameToId = useMemo(() => {
    const map = new Map();
    const classArray = Array.isArray(classData?.data) 
      ? classData.data 
      : (Array.isArray(classData) ? classData : []);
    classArray.forEach((c) => {
      const name = c.name || c.className || c.label || '';
      if (name && c.id) {
        map.set(name, c.id);
      }
    });
    return map;
  }, [classData]);

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
    setLocalValues({
      fullName: "",
      relationType: "",
      relationTypeId: null,
      selectClass: "",
      classId: null,
      schoolName: "",
    });
  };

  // Add sibling to Formik siblings array
  const handleAddSibling = () => {
    // Validate that at least fullName is filled
    if (!localValues.fullName || !localValues.fullName.trim()) {
      alert("Please enter sibling's full name");
      return;
    }

    // Get IDs for relation and class
    const relationTypeId = relationNameToId.get(localValues.relationType) || null;
    const classId = classNameToId.get(localValues.selectClass) || null;

    // Create sibling object
    const newSibling = {
      fullName: localValues.fullName,
      relationType: localValues.relationType,
      relationTypeId: relationTypeId,
      selectClass: localValues.selectClass,
      classId: classId,
      schoolName: localValues.schoolName,
    };

    // Add to Formik siblings array
    const currentSiblings = values.siblings || [];
    setFieldValue("siblings", [...currentSiblings, newSibling]);

    console.log("✅ Added sibling to form:", newSibling);
    console.log("📋 Total siblings:", [...currentSiblings, newSibling].length);

    // Clear local values for next sibling
    handleClear();
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
                    value: localValues[fname] ?? "",
                    onChange: (e) => {
                      const value = e.target.value;
                      setLocalFieldValue(fname, value);
                      
                      // Store IDs when dropdown values change
                      if (fname === "relationType" && relationNameToId.has(value)) {
                        setLocalFieldValue("relationTypeId", relationNameToId.get(value));
                      }
                      if (fname === "selectClass" && classNameToId.has(value)) {
                        setLocalFieldValue("classId", classNameToId.get(value));
                      }
                    },
                  })}
              </div>
            ))}

            {/* Buttons on the right */}
            <div className={styles.siblingButtons}>
              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddSibling}
              >
                Add
              </button>

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
