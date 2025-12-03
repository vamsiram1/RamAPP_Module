import React, { useMemo, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import styles from "./OrientationInformation.module.css";
 
import {
  orientationInfoFieldsForSchool,
  orientationInfoFieldsLayoutForSchool
} from "./orientationFieldsForSchool";
 
import { renderField } from "../../../../utils/renderField";

// API Hooks
import {
  useGetClassesByCampus,
  useGetOrientationByClass,
  useGetStudentTypeByClass,
  useGetBranchFeeByCampus,
} from "../../../../queries/saleApis/clgSaleApis";

// Helper functions
const asArray = (v) => (Array.isArray(v) ? v : []);

const classLabel = (c) => c?.className || c?.name || c?.label || "";
const classId = (c) => c?.classId || c?.id || null;

const orientationLabel = (o) => o?.name || o?.label || "";
const orientationId = (o) => o?.id || null;

const studentTypeLabel = (s) => s?.name || s?.label || "";
const studentTypeId = (s) => s?.id || null;
 
const OrientationInformationForSchool = ({ 
  initialAcademicYear,
  initialAcademicYearId,
  initialCampusName,
  initialCampusId,
  initialCityName,
  initialCityId
}) => {
  const { values, setFieldValue } = useFormikContext();

  // Initialize selectedCampusId from props or Formik values
  const [selectedCampusId, setSelectedCampusId] = useState(() => {
    const campusId = initialCampusId || values.campusId || values.branchId;
    return campusId ? Number(campusId) : null;
  });
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedOrientationId, setSelectedOrientationId] = useState(null);

  // Use effective campus ID to ensure API calls work even if state updates are delayed
  const effectiveCampusId = selectedCampusId || initialCampusId || values.campusId || values.branchId;

  // API calls - use effectiveCampusId to ensure consistent API calls
  const { data: classesRaw } = useGetClassesByCampus(effectiveCampusId ? Number(effectiveCampusId) : null);
  const { data: orientationRaw } = useGetOrientationByClass(
    selectedClassId,
    effectiveCampusId ? Number(effectiveCampusId) : null
  );
  const { data: studentTypeRaw } = useGetStudentTypeByClass(
    effectiveCampusId ? Number(effectiveCampusId) : null,
    selectedClassId
  );
  const { data: branchFeeData } = useGetBranchFeeByCampus(effectiveCampusId ? Number(effectiveCampusId) : null);

  // Normalize API results
  const classes = useMemo(() => asArray(classesRaw), [classesRaw]);
  const orientations = useMemo(() => asArray(orientationRaw), [orientationRaw]);
  const studentTypes = useMemo(() => asArray(studentTypeRaw), [studentTypeRaw]);

  // Create name-to-ID maps for dropdowns
  const classNameToId = useMemo(() => {
    const m = new Map();
    classes.forEach((c) => {
      const label = classLabel(c);
      const id = classId(c);
      if (label && id) {
        m.set(label, id);
      }
    });
    return m;
  }, [classes]);

  const orientationNameToId = useMemo(() => {
    const m = new Map();
    orientations.forEach((o) => {
      const label = orientationLabel(o);
      const id = orientationId(o);
      if (label && id) {
        m.set(label, id);
      }
    });
    return m;
  }, [orientations]);

  const studentTypeNameToId = useMemo(() => {
    const m = new Map();
    studentTypes.forEach((s) => {
      const label = studentTypeLabel(s);
      const id = studentTypeId(s);
      if (label && id) {
        m.set(label, id);
      }
    });
    return m;
  }, [studentTypes]);

  // Initialize selectedCampusId when initialCampusId or values change
  useEffect(() => {
    const campusId = initialCampusId || values.campusId || values.branchId;
    if (campusId && Number(campusId) !== selectedCampusId) {
      const numCampusId = Number(campusId);
      setSelectedCampusId(numCampusId);
      console.log("🔄 OrientationInfo: Set selectedCampusId to", numCampusId);
    }
  }, [initialCampusId, values.campusId, values.branchId, selectedCampusId]);

  // Sync selectedClassId when classId or joiningClassId is set in Formik
  useEffect(() => {
    const classIdValue = values.classId || values.joiningClassId;
    if (classIdValue && Number(classIdValue) !== selectedClassId) {
      const numClassId = Number(classIdValue);
      setSelectedClassId(numClassId);
      console.log("🔄 OrientationInfo: Set selectedClassId to", numClassId);
    }
  }, [values.classId, values.joiningClassId, selectedClassId]);

  // Sync selectedOrientationId when orientationId is set in Formik
  useEffect(() => {
    const orientationIdValue = values.orientationId;
    if (orientationIdValue && Number(orientationIdValue) !== selectedOrientationId) {
      const numOrientationId = Number(orientationIdValue);
      setSelectedOrientationId(numOrientationId);
      console.log("🔄 OrientationInfo: Set selectedOrientationId to", numOrientationId);
    }
  }, [values.orientationId, selectedOrientationId]);

  // Auto-populate branch fee when branch is selected
  useEffect(() => {
    if (branchFeeData && (branchFeeData.fee || branchFeeData)) {
      const fee = branchFeeData.fee || branchFeeData;
      if (fee && !values.orientationFee) {
        setFieldValue("orientationFee", fee);
      }
    }
  }, [branchFeeData, values.orientationFee, setFieldValue]);

  // Ensure IDs are stored when they're set directly (from auto-population)
  // This ensures IDs from overviewData are properly stored in Formik
  useEffect(() => {
    // If classId or joiningClassId is set but selectedClassId is not, sync it
    const classIdValue = values.classId || values.joiningClassId;
    if (classIdValue && classIdValue !== 0 && classIdValue !== null && Number(classIdValue) !== selectedClassId) {
      setSelectedClassId(Number(classIdValue));
      // Ensure both classId and joiningClassId are set
      if (values.classId && !values.joiningClassId) {
        setFieldValue("joiningClassId", values.classId);
      }
      if (values.joiningClassId && !values.classId) {
        setFieldValue("classId", values.joiningClassId);
      }
      console.log("✅ OrientationInfo: Synced selectedClassId from Formik values:", classIdValue);
    }

    // If orientationId is set but selectedOrientationId is not, sync it
    if (values.orientationId && values.orientationId !== 0 && values.orientationId !== null && Number(values.orientationId) !== selectedOrientationId) {
      setSelectedOrientationId(Number(values.orientationId));
      console.log("✅ OrientationInfo: Synced selectedOrientationId from Formik values:", values.orientationId);
    }

    // Ensure campusId and branchId are both set when one is set
    if (values.campusId && values.campusId !== 0 && values.campusId !== null && !values.branchId) {
      setFieldValue("branchId", values.campusId);
      console.log("✅ OrientationInfo: Set branchId from campusId:", values.campusId);
    }
    if (values.branchId && values.branchId !== 0 && values.branchId !== null && !values.campusId) {
      setFieldValue("campusId", values.branchId);
      console.log("✅ OrientationInfo: Set campusId from branchId:", values.branchId);
    }
  }, [values.classId, values.joiningClassId, values.orientationId, values.campusId, values.branchId, selectedClassId, selectedOrientationId, setFieldValue]);

  // Create field map with dynamic options
  const fieldMap = useMemo(() => {
    const map = orientationInfoFieldsForSchool.reduce((acc, f) => {
      let field = { ...f };
      
      // Set dynamic options for dropdowns
      if (f.name === "joiningClass") {
        field.options = classes.map(classLabel);
      } else if (f.name === "orientationName") {
        field.options = orientations.map(orientationLabel);
      } else if (f.name === "studentType") {
        field.options = studentTypes.map(studentTypeLabel);
      }
      
      acc[f.name] = field;
      return acc;
    }, {});
    return map;
  }, [classes, orientations, studentTypes]);

  // Handle field changes and store IDs
  const handleFieldChange = (fieldName, value) => {
    setFieldValue(fieldName, value);

    // Store IDs when dropdowns are selected
    if (fieldName === "joiningClass" && classNameToId.has(value)) {
      const id = classNameToId.get(value);
      setSelectedClassId(id);
      setFieldValue("classId", id);
      setFieldValue("joiningClassId", id);
      console.log(`✅ Stored classId: ${id} and joiningClassId: ${id} for joiningClass: ${value}`);
      
      // Reset child fields
      setFieldValue("orientationName", "");
      setFieldValue("studentType", "");
      setFieldValue("orientationId", null);
      setFieldValue("studentTypeId", null);
      setSelectedOrientationId(null);
    } else if (fieldName === "orientationName" && orientationNameToId.has(value)) {
      const id = orientationNameToId.get(value);
      setSelectedOrientationId(id);
      setFieldValue("orientationId", id);
      console.log(`✅ Stored orientationId: ${id} for orientationName: ${value}`);
    } else if (fieldName === "studentType" && studentTypeNameToId.has(value)) {
      const id = studentTypeNameToId.get(value);
      setFieldValue("studentTypeId", id);
      console.log(`✅ Stored studentTypeId: ${id} for studentType: ${value}`);
    }
  };

  // Sync IDs when labels are present but IDs are missing (for auto-populated data)
  // This runs after API data is loaded to ensure IDs are synced
  useEffect(() => {
    // Only sync if we have API data loaded
    if (classes.length === 0 && orientations.length === 0 && studentTypes.length === 0) {
      return; // Wait for API data to load
    }

    // Sync classId and joiningClassId from joiningClass label
    if (values.joiningClass && (!values.classId || values.classId === 0 || values.classId === null)) {
      // Try exact match first
      if (classNameToId.has(values.joiningClass)) {
        const id = classNameToId.get(values.joiningClass);
        setSelectedClassId(id);
        setFieldValue("classId", id);
        setFieldValue("joiningClassId", id);
        console.log(`🔄 Synced classId: ${id} for joiningClass: ${values.joiningClass}`);
      } else {
        // Try case-insensitive match
        const joiningClassUpper = String(values.joiningClass).toUpperCase().trim();
        for (const [key, id] of classNameToId.entries()) {
          if (String(key).toUpperCase().trim() === joiningClassUpper) {
            setSelectedClassId(id);
            setFieldValue("classId", id);
            setFieldValue("joiningClassId", id);
            console.log(`🔄 Synced classId (case-insensitive): ${id} for joiningClass: ${values.joiningClass}`);
            break;
          }
        }
      }
    }
    
    // Sync orientationId from orientationName label
    if (values.orientationName && (!values.orientationId || values.orientationId === 0 || values.orientationId === null)) {
      // Try exact match first
      if (orientationNameToId.has(values.orientationName)) {
        const id = orientationNameToId.get(values.orientationName);
        setSelectedOrientationId(id);
        setFieldValue("orientationId", id);
        console.log(`🔄 Synced orientationId: ${id} for orientationName: ${values.orientationName}`);
      } else {
        // Try case-insensitive match
        const orientationNameUpper = String(values.orientationName).toUpperCase().trim();
        for (const [key, id] of orientationNameToId.entries()) {
          if (String(key).toUpperCase().trim() === orientationNameUpper) {
            setSelectedOrientationId(id);
            setFieldValue("orientationId", id);
            console.log(`🔄 Synced orientationId (case-insensitive): ${id} for orientationName: ${values.orientationName}`);
            break;
          }
        }
      }
    }
    
    // Sync studentTypeId from studentType label
    if (values.studentType && (!values.studentTypeId || values.studentTypeId === 0 || values.studentTypeId === null)) {
      // Try exact match first
      if (studentTypeNameToId.has(values.studentType)) {
        const id = studentTypeNameToId.get(values.studentType);
        setFieldValue("studentTypeId", id);
        console.log(`🔄 Synced studentTypeId: ${id} for studentType: ${values.studentType}`);
      } else {
        // Try case-insensitive match
        const studentTypeUpper = String(values.studentType).toUpperCase().trim();
        for (const [key, id] of studentTypeNameToId.entries()) {
          if (String(key).toUpperCase().trim() === studentTypeUpper) {
            setFieldValue("studentTypeId", id);
            console.log(`🔄 Synced studentTypeId (case-insensitive): ${id} for studentType: ${values.studentType}`);
            break;
          }
        }
      }
    }
  }, [
    values.joiningClass, 
    values.classId, 
    values.joiningClassId,
    values.orientationName, 
    values.orientationId, 
    values.studentType, 
    values.studentTypeId, 
    classNameToId, 
    orientationNameToId, 
    studentTypeNameToId, 
    setFieldValue,
    classes.length,
    orientations.length,
    studentTypes.length
  ]);

  return (
    <div className={styles.clgAppSaleOrientationWrapper}>
      <div className={styles.clgAppSaleOrientationInfoTop}>
        <p className={styles.clgAppSaleOrientationHeading}>
          Orientation Information
        </p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>
 
      <div className={styles.clgAppSaleOrientationInfoBottom}>
        {orientationInfoFieldsLayoutForSchool.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname, idx) => (
              <div key={idx} className={styles.clgAppSaleFieldCell}>
                {fname !== "" && renderField(fname, fieldMap, {
                  value: values[fname] ?? "",
                  onChange: (e) => handleFieldChange(fname, e.target.value)
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default OrientationInformationForSchool;
 
