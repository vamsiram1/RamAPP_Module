import React, { useState, useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import styles from "./AcademicInformation.module.css";
 
import { academicFields, getAcademicLayout } from "./acedemicInformationFields";
import { renderField } from "../../../../utils/renderField";

import {
  useGetState,
  useGetDistrictByState,
  useGetSchoolType,
  useGetAllClgTypes,
  useGetSchoolNames,
  useGetClgNames,
} from "../../../../queries/saleApis/clgSaleApis";
 
// -----------------------
// Label / ID Helpers
// -----------------------
const stateLabel = (s) => s?.stateName ?? "";
const stateId = (s) => s?.stateId ?? null;
 
const districtLabel = (d) => d?.name ?? "";
const districtId = (d) => d?.id ?? null;
 
const schoolTypeLabel = (s) => s?.name ?? "";
const schoolTypeId = (s) => s?.id ?? null;
 
const collegeTypeLabel = (c) => c?.name ?? "";
const collegeTypeId = (c) => c?.id ?? null;
 
const schoolNameId = (s) => s?.id ?? null;
const schoolNameLabel = (s) => s?.name ?? "";
 
const clgNameId = (s) => s?.id ?? null;
const collegeNameLabel = (c) => c?.name ?? "";
 
// -----------------------
// Academic Component
// -----------------------
const AcademicInformation = ({ joiningClass }) => {
  const { values, setFieldValue } = useFormikContext();
  const [localValues, setLocalValues] = useState({});

  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);

  const [selectedSchoolType, setSelectedSchoolType] = useState(null);
  const [selectedClgType, setSelectedClgType] = useState(null);
 
  // -----------------------
  // Decide Flow
  // -----------------------
  // Use joiningClass from props or Formik values
  const currentJoiningClass = joiningClass || values.joiningClass || "";
  
  const isSchoolFlow =
    currentJoiningClass === "INTER1" || currentJoiningClass === "" || currentJoiningClass == null;

  const isCollegeFlow =
    currentJoiningClass === "INTER2" ||
    currentJoiningClass === "LONG_TERM" ||
    currentJoiningClass === "SHORT_TERM";
 
  // -----------------------
  // Fetch Data
  // -----------------------
  const { data: stateRaw = [] } = useGetState();
  const { data: districtRaw = [] } = useGetDistrictByState(selectedStateId);
  console.log("Districts :",districtRaw);
  const { data: schoolTypesRaw = [] } = useGetSchoolType(isSchoolFlow);
  console.log("School Types: ", schoolTypesRaw);
  const { data: schoolNamesRaw = [] } = useGetSchoolNames(
    selectedDistrictId,
    selectedSchoolType,
    isSchoolFlow
  );
 
  console.log("School Names: ", schoolNamesRaw);
 
  const { data: clgTypesRaw = [] } = useGetAllClgTypes(isCollegeFlow);
  console.log("College Types: ",clgTypesRaw);
  const { data: clgNamesRaw = [] } = useGetClgNames(
    selectedDistrictId,
    selectedClgType,
    isCollegeFlow
  );
  console.log("College Names: ", clgNamesRaw);
  // -----------------------
  // Build Options
  // -----------------------
  const stateOptions = useMemo(() => stateRaw.map(stateLabel), [stateRaw]);
  const districtOptions = useMemo(
    () => districtRaw.map(districtLabel),
    [districtRaw]
  );
 
  const schoolTypeOptions = useMemo(
    () => schoolTypesRaw.map(schoolTypeLabel),
    [schoolTypesRaw]
  );
  const schoolNameOptions = useMemo(
    () => schoolNamesRaw.map(schoolNameLabel),
    [schoolNamesRaw]
  );
 
  const clgTypeOptions = useMemo(
    () => clgTypesRaw.map(collegeTypeLabel),
    [clgTypesRaw]
  );
  const clgNameOptions = useMemo(
    () => clgNamesRaw.map(collegeNameLabel),
    [clgNamesRaw]
  );
 
  // -----------------------
  // Build Final Field Map
  // -----------------------
  const fieldMap = useMemo(() => {
    const map = {};
 
    academicFields.forEach((f) => {
      map[f.name] = { ...f };
 
      // STATE & DISTRICT
      if (f.name === "schoolState") map[f.name].options = stateOptions;
      if (f.name === "schoolDistrict") map[f.name].options = districtOptions;
        if (f.name === "clgState") map[f.name].options = stateOptions;
      if (f.name === "clgDistrict") map[f.name].options = districtOptions;
 
      // SCHOOL FLOW
      if (isSchoolFlow) {
        if (f.name === "schoolType") map[f.name].options = schoolTypeOptions;
        if (f.name === "schoolName") map[f.name].options = schoolNameOptions;
      }
 
      // COLLEGE FLOW
      if (isCollegeFlow) {
        if (f.name === "clgType") map[f.name].options = clgTypeOptions;
        if (f.name === "collegeName") map[f.name].options = clgNameOptions;
      }
    });
 
    return map;
  }, [
    academicFields,
    stateOptions,
    districtOptions,
    schoolTypeOptions,
    schoolNameOptions,
    clgTypeOptions,
    clgNameOptions,
    isSchoolFlow,
    isCollegeFlow,
  ]);
 
  // -----------------------
  // Handle Change
  // -----------------------
 
   // -------------------------
  const resetField = (nameArr) => {
    nameArr.forEach((n) => {
      setFieldValue(n, "");
      setLocalValues((prev) => ({ ...prev, [n]: "" }));
    });
  };

  const handleFieldChange = (field, value) => {
    setFieldValue(field, value);
    setLocalValues((prev) => ({ ...prev, [field]: value }));

    /** ================= STATE UPDATE ================= **/
    if (field === "schoolState" || field === "clgState") {
      const stObj = stateRaw.find((s) => stateLabel(s) === value);
      const stateIdValue = stateId(stObj);
      setSelectedStateId(stateIdValue);
      setSelectedDistrictId(null);

      // Store state IDs
      if (field === "schoolState" && stateIdValue) {
        setFieldValue("schoolStateId", stateIdValue);
      }
      if (field === "clgState" && stateIdValue) {
        setFieldValue("preCollegeStateId", stateIdValue);
      }

      resetField([
        "schoolDistrict",
        "clgDistrict",
        "schoolType",
        "clgType",
        "schoolName",
        "collegeName",
      ]);

      setSelectedSchoolType(null);
      setSelectedClgType(null);
      return;
    }

    /** ================= DISTRICT UPDATE ================= **/
    if (field === "schoolDistrict" || field === "clgDistrict") {
      const dObj = districtRaw.find((d) => districtLabel(d) === value);
      const districtIdValue = districtId(dObj);
      setSelectedDistrictId(districtIdValue);

      // Store district IDs
      if (field === "schoolDistrict" && districtIdValue) {
        setFieldValue("schoolDistrictId", districtIdValue);
      }
      if (field === "clgDistrict" && districtIdValue) {
        setFieldValue("preCollegeDistrictId", districtIdValue);
      }

      resetField(["schoolType", "clgType", "schoolName", "collegeName"]);

      setSelectedSchoolType(null);
      setSelectedClgType(null);
      return;
    }

    /** ================= SCHOOL TYPE UPDATE ================= **/
    if (field === "schoolType") {
      const stObj = schoolTypesRaw.find((s) => schoolTypeLabel(s) === value);
      const schoolTypeIdValue = schoolTypeId(stObj);
      setSelectedSchoolType(schoolTypeLabel(stObj));

      // Store school type ID
      if (schoolTypeIdValue) {
        setFieldValue("schoolTypeId", schoolTypeIdValue);
      }

      resetField(["schoolName"]);
      return;
    }

    /** ================= COLLEGE TYPE UPDATE ================= **/
    if (field === "clgType") {
      const cObj = clgTypesRaw.find((c) => collegeTypeLabel(c) === value);
      const collegeTypeIdValue = collegeTypeId(cObj);
      setSelectedClgType(collegeTypeIdValue);

      // Store college type ID
      if (collegeTypeIdValue) {
        setFieldValue("preCollegeTypeId", collegeTypeIdValue);
      }

      resetField(["collegeName"]);
      return;
    }
  };
 
  // Sync selectedStateId when schoolStateId or preCollegeStateId is set in Formik (for auto-population)
  // This triggers the API call to load districts
  useEffect(() => {
    const stateIdValue = values.schoolStateId || values.preCollegeStateId;
    if (stateIdValue && stateIdValue !== 0 && stateIdValue !== null && Number(stateIdValue) !== selectedStateId) {
      const numStateId = Number(stateIdValue);
      setSelectedStateId(numStateId);
      console.log("🔄 AcademicInfo: Set selectedStateId from Formik to", numStateId, "to trigger districts API");
    }
  }, [values.schoolStateId, values.preCollegeStateId, selectedStateId]);

  // Sync selectedDistrictId when schoolDistrictId or preCollegeDistrictId is set in Formik (for auto-population)
  // This triggers the API call to load school/college types and names
  useEffect(() => {
    const districtIdValue = values.schoolDistrictId || values.preCollegeDistrictId;
    if (districtIdValue && districtIdValue !== 0 && districtIdValue !== null && Number(districtIdValue) !== selectedDistrictId) {
      const numDistrictId = Number(districtIdValue);
      setSelectedDistrictId(numDistrictId);
      console.log("🔄 AcademicInfo: Set selectedDistrictId from Formik to", numDistrictId, "to trigger school/college types API");
    }
  }, [values.schoolDistrictId, values.preCollegeDistrictId, selectedDistrictId]);

  // Sync IDs when labels are present but IDs are missing (for pre-populated data)
  useEffect(() => {
    // Sync schoolStateId
    if (values.schoolState && (!values.schoolStateId || values.schoolStateId === 0)) {
      const stateObj = stateRaw.find((s) => stateLabel(s) === values.schoolState);
      if (stateObj) {
        const id = stateId(stateObj);
        if (id) {
          setFieldValue("schoolStateId", id);
          console.log("🔄 AcademicInfo: Synced schoolStateId:", id, "for schoolState:", values.schoolState);
        }
      }
    }
    
    // Sync schoolDistrictId
    if (values.schoolDistrict && (!values.schoolDistrictId || values.schoolDistrictId === 0)) {
      const districtObj = districtRaw.find((d) => districtLabel(d) === values.schoolDistrict);
      if (districtObj) {
        const id = districtId(districtObj);
        if (id) {
          setFieldValue("schoolDistrictId", id);
          console.log("🔄 AcademicInfo: Synced schoolDistrictId:", id, "for schoolDistrict:", values.schoolDistrict);
        }
      }
    }
    
    // Sync schoolTypeId
    if (values.schoolType && (!values.schoolTypeId || values.schoolTypeId === 0)) {
      const schoolTypeObj = schoolTypesRaw.find((s) => schoolTypeLabel(s) === values.schoolType);
      if (schoolTypeObj) {
        const id = schoolTypeId(schoolTypeObj);
        if (id) {
          setFieldValue("schoolTypeId", id);
          console.log("🔄 AcademicInfo: Synced schoolTypeId:", id, "for schoolType:", values.schoolType);
        }
      }
    }
    
    // Sync preCollegeStateId
    if (values.clgState && (!values.preCollegeStateId || values.preCollegeStateId === 0)) {
      const stateObj = stateRaw.find((s) => stateLabel(s) === values.clgState);
      if (stateObj) {
        const id = stateId(stateObj);
        if (id) {
          setFieldValue("preCollegeStateId", id);
          console.log("🔄 AcademicInfo: Synced preCollegeStateId:", id, "for clgState:", values.clgState);
        }
      }
    }
    
    // Sync preCollegeDistrictId
    if (values.clgDistrict && (!values.preCollegeDistrictId || values.preCollegeDistrictId === 0)) {
      const districtObj = districtRaw.find((d) => districtLabel(d) === values.clgDistrict);
      if (districtObj) {
        const id = districtId(districtObj);
        if (id) {
          setFieldValue("preCollegeDistrictId", id);
          console.log("🔄 AcademicInfo: Synced preCollegeDistrictId:", id, "for clgDistrict:", values.clgDistrict);
        }
      }
    }
    
    // Sync preCollegeTypeId
    if (values.clgType && (!values.preCollegeTypeId || values.preCollegeTypeId === 0)) {
      const clgTypeObj = clgTypesRaw.find((c) => collegeTypeLabel(c) === values.clgType);
      if (clgTypeObj) {
        const id = collegeTypeId(clgTypeObj);
        if (id) {
          setFieldValue("preCollegeTypeId", id);
          console.log("🔄 AcademicInfo: Synced preCollegeTypeId:", id, "for clgType:", values.clgType);
        }
      }
    }
  }, [
    values.schoolState, values.schoolStateId,
    values.schoolDistrict, values.schoolDistrictId,
    values.schoolType, values.schoolTypeId,
    values.clgState, values.preCollegeStateId,
    values.clgDistrict, values.preCollegeDistrictId,
    values.clgType, values.preCollegeTypeId,
    stateRaw, districtRaw, schoolTypesRaw, clgTypesRaw,
    setFieldValue
  ]);

  // -----------------------
  // Layout Based on Flow
  // -----------------------
  const layout = getAcademicLayout(currentJoiningClass);
 
  return (
    <div className={styles.clgAppSaleAcademicInfoWrapper}>
      <div className={styles.clgAppSaleAcademicInfoTop}>
        <p className={styles.clgAppSaleAcademicHeading}>Academic Information</p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>
 
      <div className={styles.clgAppSaleAcademicInfoBottom}>
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.clgAppSalerow}>
            {row.map((fname, colIndex) => (
              <div key={colIndex} className={styles.clgAppSaleFieldCell}>
                {fname
                  ? renderField(fname, fieldMap, {
                      value: values[fname] ?? localValues[fname] ?? "",
                      onChange: (e) => handleFieldChange(fname, e.target.value),
                    })
                  : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default AcademicInformation;
