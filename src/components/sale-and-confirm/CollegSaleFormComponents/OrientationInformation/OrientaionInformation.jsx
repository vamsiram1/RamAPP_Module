import React, { useMemo, useEffect, useState } from "react";
import styles from "./OrientationInformation.module.css";
 
import {
  orientationInfoFields,
  orientationInfoFieldsLayout,
} from "./orientationInfoFields";
 
import { renderField } from "../../../../utils/renderField";

// API Hooks
import {
  useGetAllCities,
  useGetCampuesByCity,
  useGetClassesByCampus,
  useGetOrientationByClass,
  useGetStudentTypeByClass,
  useGetOrientationDatesAndFee,
} from "../../../../queries/saleApis/clgSaleApis";

import { formatToDDMMYYYY } from "../../../../utils/dateConverter";
import {formatFee} from "../../../../utils/feeFormat";

import { useFormikContext } from "formik";
import {toTitleCase} from "../../../../utils/toTitleCase";
 
// =======================
// LABEL + ID Helpers
// =======================
const cityLabel = (c) => c?.name ?? "";
const cityId = (c) => c?.id ?? null;
 
const campusLabel = (c) => c?.name ?? "";
const campusId = (c) => c?.id ?? null;
 
const classLabel = (c) => c?.className ?? "";
const classId = (c) => c?.classId ?? null;
 
const orientationLabel = (o) => o?.name ?? "";
const orientationId = (o) => o?.id ?? null;
 
const studentTypeLabel = (s) => s?.name ?? "";
const studentTypeId = (s) => s?.id ?? null;
 
const asArray = (v) => (Array.isArray(v) ? v : []);
 
const OrientationInformation = () => {
  const { values, setFieldValue } = useFormikContext();
 
  // Selected IDs
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedOrientationId, setSelectedOrientationId] = useState(null);
 
  // API calls
  const { data: citiesRaw = [] } = useGetAllCities();
  const { data: campusesRaw } = useGetCampuesByCity(selectedCityId);
  const { data: classesRaw } = useGetClassesByCampus(selectedCampusId);
  console.log("Classes: ",classesRaw);
  const { data: orientationRaw } = useGetOrientationByClass(
    selectedClassId,
    selectedCampusId
  );
  const { data: studentTypeRaw } = useGetStudentTypeByClass(
    selectedCampusId,
    selectedClassId
  );
  const { data: orientationExtra } = useGetOrientationDatesAndFee(
    selectedOrientationId
  );
  console.log("OrientationExtra 1: ", orientationExtra);
  // Normalize API results
  const cities = useMemo(() => asArray(citiesRaw), [citiesRaw]);
  const campuses = useMemo(() => asArray(campusesRaw), [campusesRaw]);
  const classes = useMemo(() => asArray(classesRaw), [classesRaw]);
  const orientations = useMemo(() => asArray(orientationRaw), [orientationRaw]);
  const studentTypes = useMemo(() => asArray(studentTypeRaw), [studentTypeRaw]);
 
  // Label lists
  const cityNames = useMemo(() => cities.map(cityLabel), [cities]);
  const campusNames = useMemo(() => campuses.map(campusLabel), [campuses]);
  const classNames = useMemo(() => classes.map(classLabel), [classes]);
  const orientationNames = useMemo(
    () => orientations.map(orientationLabel),
    [orientations]
  );
  const studentTypeNames = useMemo(
    () => studentTypes.map(studentTypeLabel),
    [studentTypes]
  );
 
  // Reverse maps: label → ID
  const cityNameToId = useMemo(() => {
    const m = new Map();
    cities.forEach((c) => m.set(cityLabel(c), cityId(c)));
    return m;
  }, [cities]);
 
  const campusNameToId = useMemo(() => {
    const m = new Map();
    campuses.forEach((c) => m.set(campusLabel(c), campusId(c)));
    return m;
  }, [campuses]);
 
  const classNameToId = useMemo(() => {
    const m = new Map();
    classes.forEach((c) => m.set(classLabel(c), classId(c)));
    return m;
  }, [classes]);
 
  const orientationNameToId = useMemo(() => {
    const m = new Map();
    orientations.forEach((o) => m.set(orientationLabel(o), orientationId(o)));
    return m;
  }, [orientations]);
 
  const studentTypeNameToId = useMemo(() => {
    const m = new Map();
    studentTypes.forEach((s) => m.set(studentTypeLabel(s), studentTypeId(s)));
    return m;
  }, [studentTypes]);
 
  // ==============================
  // Handle UI Change (Cascading)
  // ==============================
 const onValuesChange = (vals) => {
  console.log("UI Change:", vals);
 
  /** ================= CITY UPDATE ================== **/
  if (vals.city && cityNameToId.has(vals.city)) {
    const ctId = cityNameToId.get(vals.city);

    if (ctId !== selectedCityId) {
      setSelectedCityId(ctId);
      // Store cityId in Formik
      setFieldValue("cityId", ctId);

      // RESET CHILD FORM FIELDS
      setFieldValue("campusName", "");
      setFieldValue("joiningClass", "");
      setFieldValue("orientationName", "");
      setFieldValue("studentType", "");
      setFieldValue("orientationStartDate", "");
      setFieldValue("orientationEndDate", "");
      setFieldValue("orientationFee", "");

      // RESET CHILD STATES AND IDs
      setSelectedCampusId(null);
      setSelectedClassId(null);
      setSelectedOrientationId(null);
      setFieldValue("campusId", null);
      setFieldValue("branchId", null);
      setFieldValue("classId", null);
      setFieldValue("joiningClassId", null);
      setFieldValue("orientationId", null);
      setFieldValue("studentTypeId", null);
    }
  }
 
  /** ================= CAMPUS UPDATE ================== **/
  if (vals.campusName && campusNameToId.has(vals.campusName)) {
    const cpId = campusNameToId.get(vals.campusName);

    if (cpId !== selectedCampusId) {
      setSelectedCampusId(cpId);
      // Store campusId and branchId in Formik
      setFieldValue("campusId", cpId);
      setFieldValue("branchId", cpId);

      // RESET CHILD FORM FIELDS
      setFieldValue("joiningClass", "");
      setFieldValue("orientationName", "");
      setFieldValue("studentType", "");
      setFieldValue("orientationStartDate", "");
      setFieldValue("orientationEndDate", "");
      setFieldValue("orientationFee", "");

      // RESET CHILD STATES AND IDs
      setSelectedClassId(null);
      setSelectedOrientationId(null);
      setFieldValue("classId", null);
      setFieldValue("joiningClassId", null);
      setFieldValue("orientationId", null);
      setFieldValue("studentTypeId", null);
    }
  }
 
  /** ================= CLASS UPDATE ================== **/
  if (vals.joiningClass && classNameToId.has(vals.joiningClass)) {
    const clId = classNameToId.get(vals.joiningClass);

    if (clId !== selectedClassId) {
      setSelectedClassId(clId);
      // Store classId and joiningClassId in Formik
      setFieldValue("classId", clId);
      setFieldValue("joiningClassId", clId);
      console.log(`✅ Stored classId: ${clId} and joiningClassId: ${clId} for joiningClass: ${vals.joiningClass}`);

      // RESET CHILD FORM FIELDS
      setFieldValue("orientationName", "");
      setFieldValue("studentType", "");
      setFieldValue("orientationStartDate", "");
      setFieldValue("orientationEndDate", "");
      setFieldValue("orientationFee", "");

      // RESET CHILD STATE AND IDs
      setSelectedOrientationId(null);
      setFieldValue("orientationId", null);
      setFieldValue("studentTypeId", null);
    }
  }
 
  /** ================= ORIENTATION UPDATE ================== **/
  if (vals.orientationName && orientationNameToId.has(vals.orientationName)) {
    const oId = orientationNameToId.get(vals.orientationName);
    if (oId !== selectedOrientationId) {
      setSelectedOrientationId(oId);
      // Store orientationId in Formik
      setFieldValue("orientationId", oId);
    }
  }

  /** ================= STUDENT TYPE UPDATE ================== **/
  if (vals.studentType && studentTypeNameToId.has(vals.studentType)) {
    const stId = studentTypeNameToId.get(vals.studentType);
    // Store studentTypeId in Formik
    setFieldValue("studentTypeId", stId);
  }
};
 
 
  // ========================================
  // Auto-fill dates + fee using formatter
  // ========================================
  useEffect(() => {
    if (orientationExtra) {
      const o = orientationExtra;
      console.log("O orientation values: ", o);
      setFieldValue("orientationStartDate", formatToDDMMYYYY(o.startDate));
      setFieldValue("orientationEndDate", formatToDDMMYYYY(o.endDate));
      setFieldValue("orientationFee", formatFee(o.fee));
    }
  }, [orientationExtra]);

  // Sync selectedCityId when cityId is set in Formik (for auto-population)
  // This triggers the API call to load branches
  useEffect(() => {
    const cityIdValue = values.cityId;
    if (cityIdValue && cityIdValue !== 0 && cityIdValue !== null && Number(cityIdValue) !== selectedCityId) {
      const numCityId = Number(cityIdValue);
      setSelectedCityId(numCityId);
      console.log("🔄 OrientationInfo: Set selectedCityId from Formik to", numCityId, "to trigger branch API");
    }
  }, [values.cityId, selectedCityId]);

  // Sync selectedCampusId when campusId or branchId is set in Formik (for auto-population)
  // This triggers the API call to load classes
  useEffect(() => {
    const campusIdValue = values.campusId || values.branchId;
    if (campusIdValue && campusIdValue !== 0 && campusIdValue !== null && Number(campusIdValue) !== selectedCampusId) {
      const numCampusId = Number(campusIdValue);
      setSelectedCampusId(numCampusId);
      console.log("🔄 OrientationInfo: Set selectedCampusId from Formik to", numCampusId, "to trigger classes API");
    }
  }, [values.campusId, values.branchId, selectedCampusId]);

  // Sync selectedClassId when classId or joiningClassId is set in Formik (for auto-population)
  // This triggers the API call to load orientations
  useEffect(() => {
    const classIdValue = values.classId || values.joiningClassId;
    if (classIdValue && classIdValue !== 0 && classIdValue !== null && Number(classIdValue) !== selectedClassId) {
      const numClassId = Number(classIdValue);
      setSelectedClassId(numClassId);
      console.log("🔄 OrientationInfo: Set selectedClassId from Formik to", numClassId, "to trigger orientations API");
    }
  }, [values.classId, values.joiningClassId, selectedClassId]);

  // Sync selectedOrientationId when orientationId is set in Formik (for auto-population)
  // This triggers the API call to load orientation dates and fee
  useEffect(() => {
    const orientationIdValue = values.orientationId;
    if (orientationIdValue && orientationIdValue !== 0 && orientationIdValue !== null && Number(orientationIdValue) !== selectedOrientationId) {
      const numOrientationId = Number(orientationIdValue);
      setSelectedOrientationId(numOrientationId);
      console.log("🔄 OrientationInfo: Set selectedOrientationId from Formik to", numOrientationId, "to trigger orientation dates/fee API");
    }
  }, [values.orientationId, selectedOrientationId]);

  // Sync IDs when labels are present but IDs are missing (for pre-populated data)
  useEffect(() => {
    // Sync cityId
    if (values.city && (!values.cityId || values.cityId === 0) && cityNameToId.has(values.city)) {
      const id = cityNameToId.get(values.city);
      setFieldValue("cityId", id);
    }
    
    // Sync campusId and branchId
    if (values.campusName && (!values.campusId || values.campusId === 0) && campusNameToId.has(values.campusName)) {
      const id = campusNameToId.get(values.campusName);
      setFieldValue("campusId", id);
      setFieldValue("branchId", id);
    }
    
    // Sync classId and joiningClassId
    if (values.joiningClass && (!values.classId || values.classId === 0) && classNameToId.has(values.joiningClass)) {
      const id = classNameToId.get(values.joiningClass);
      setFieldValue("classId", id);
      setFieldValue("joiningClassId", id);
    }
    
    // Sync orientationId
    if (values.orientationName && (!values.orientationId || values.orientationId === 0) && orientationNameToId.has(values.orientationName)) {
      const id = orientationNameToId.get(values.orientationName);
      setFieldValue("orientationId", id);
    }
    
    // Sync studentTypeId
    if (values.studentType && (!values.studentTypeId || values.studentTypeId === 0) && studentTypeNameToId.has(values.studentType)) {
      const id = studentTypeNameToId.get(values.studentType);
      setFieldValue("studentTypeId", id);
    }
  }, [values.city, values.cityId, values.campusName, values.campusId, values.joiningClass, values.classId, values.orientationName, values.orientationId, values.studentType, values.studentTypeId, cityNameToId, campusNameToId, classNameToId, orientationNameToId, studentTypeNameToId, setFieldValue]);
 
  // Final dropdown options
  const dynamicOptions = useMemo(
    () => ({
      city: cityNames,
      campusName: campusNames,
      joiningClass: classNames,
      orientationName: orientationNames,
      studentType: studentTypeNames,
    }),
    [cityNames, campusNames, classNames, orientationNames, studentTypeNames]
  );
 
  // Build final field map
  const fieldMap = useMemo(() => {
    const fm = {};
    orientationInfoFields.forEach((field) => {
      fm[field.name] = {
        ...field,
        options: dynamicOptions[field.name] || field.options || [],
      };
    });
    return fm;
  }, [dynamicOptions]);
 
  return (
    <div className={styles.clgAppSaleOrientationWrapper}>
      <div className={styles.clgAppSaleOrientationInfoTop}>
        <p className={styles.clgAppSaleOrientationHeading}>
          Orientation Information
        </p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>
 
      <div className={styles.clgAppSaleOrientationInfoBottom}>
        {orientationInfoFieldsLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => (
              <div key={fname} className={styles.clgAppSaleFieldCell}>
                {renderField(fname, fieldMap, {
                  value: values[fname] ?? "",
                  onChange: (e) => {
                    setFieldValue(fname, e.target.value);
 
                    // ❌ do NOT cascade for readOnly fields
                    if (fieldMap[fname]?.readOnly) return;
 
                    onValuesChange({ ...values, [fname]: e.target.value });
                  },
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default OrientationInformation;
 
