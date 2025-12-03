import React, { useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import styles from "./PersonalInformation.module.css";

import {
  personalInfoFields,
  personalInfoFastSaleFieldsLayout,
} from "./personalInformationFields";

import UploadPicture from "../../../../widgets/UploadPicture/UploadPicture";
import { renderField } from "../../../../utils/renderField";

// API Hooks
import {
  useGetQuota,
  useGetEmployeesForSale,
  useGetAdmissionType,
} from "../../../../queries/saleApis/clgSaleApis";

import {toTitleCase} from "../../../../utils/toTitleCase";

const PersonalInformationClgFastSale = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext();

  // ============ API DATA FETCH ============ //
  const { data: quotaData } = useGetQuota();
  const { data: employeesData } = useGetEmployeesForSale();
  const { data: admissionData } = useGetAdmissionType();

  // Create ID maps for dropdowns
  const quotaNameToId = useMemo(() => {
    const map = new Map();
    quotaData?.forEach((q) => {
      const name = q.name || q.quotaName || q.quota_name;
      const id = q.id || q.quotaId || q.quota_id;
      if (name && id) {
        map.set(name, id);
      }
    });
    return map;
  }, [quotaData]);

  const admissionTypeNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(admissionData)) {
      admissionData.forEach((a) => {
        // Handle different possible field names from API
        const originalName = a.name || a.admissionTypeName || a.admission_type_name || a.typeName;
        const id = a.id || a.admissionTypeId || a.admission_type_id || a.typeId;
        if (originalName && id !== undefined && id !== null) {
          // Store original name
          map.set(originalName, id);
          // Store title-cased version (since options are displayed with toTitleCase)
          const titleCaseName = toTitleCase(originalName);
          map.set(titleCaseName, id);
          // Also add case-insensitive versions for robustness
          if (typeof originalName === 'string') {
            map.set(originalName.toLowerCase(), id);
            map.set(originalName.toUpperCase(), id);
            map.set(originalName.charAt(0).toUpperCase() + originalName.slice(1).toLowerCase(), id);
          }
        }
      });
      console.log("📋 Admission Type Name to ID Map:", Array.from(map.entries()));
      console.log("📋 Admission Data from API:", admissionData);
    }
    return map;
  }, [admissionData]);

  // ============ BUILD FIELD MAP ============ //
  const fieldMap = useMemo(() => {
    return personalInfoFields.reduce((acc, f) => {
      let field = { ...f };

      if (f.name === "quotaAdmissionReferredBy") {
        field.options = Array.isArray(quotaData) ? quotaData.map((q) => q.name) : [];
      }

      if (f.name === "employeeId") {
        field.options = Array.isArray(employeesData) ? employeesData.map((emp) => toTitleCase(emp.name)) : [];
      }

      if (f.name === "admissionType") {
        // Store both original and title-cased versions in the map
        if (Array.isArray(admissionData)) {
          admissionData.forEach((a) => {
            const originalName = a.name || a.admissionTypeName || a.admission_type_name;
            const titleCaseName = toTitleCase(originalName);
            const id = a.id || a.admissionTypeId || a.admission_type_id;
            if (originalName && id) {
              // Store both original and title-cased versions
              admissionTypeNameToId.set(originalName, id);
              admissionTypeNameToId.set(titleCaseName, id);
            }
          });
        }
        field.options = Array.isArray(admissionData) ? admissionData.map((a) => toTitleCase(a.name)) : [];
      }

      acc[f.name] = field;
      return acc;
    }, {});
  }, [quotaData, employeesData, admissionData]);

  // ============ STAFF LOGIC ============ //
  const isStaff =
    values.quotaAdmissionReferredBy === "Staff" ||
    values.quotaAdmissionReferredBy === "Staff children";

  // Clean up employeeId if not Staff - use useEffect to prevent infinite loops
  useEffect(() => {
    if (!isStaff && values.employeeId) {
      setFieldValue("employeeId", "");
    }
  }, [isStaff, values.employeeId, setFieldValue]);

  // Store genderId when gender changes
  useEffect(() => {
    if (values.gender) {
      const genderMap = new Map([
        ["MALE", 1],
        ["FEMALE", 2],
        ["Male", 1],
        ["Female", 2],
        ["Other", 3],
      ]);
      const genderId = genderMap.get(values.gender);
      if (genderId !== undefined && genderId !== null) {
        console.log(`✅ Setting genderId: ${genderId} for gender: ${values.gender}`);
        setFieldValue("genderId", genderId);
      }
    } else {
      // Clear genderId if gender is cleared
      if (values.genderId) {
        console.log(`🔄 Clearing genderId because gender is empty`);
        setFieldValue("genderId", null);
      }
    }
  }, [values.gender, setFieldValue]);

  // Store quotaId when quotaAdmissionReferredBy changes
  useEffect(() => {
    if (values.quotaAdmissionReferredBy && quotaNameToId.has(values.quotaAdmissionReferredBy)) {
      const id = quotaNameToId.get(values.quotaAdmissionReferredBy);
      console.log(`✅ Setting quotaId: ${id} for quota: ${values.quotaAdmissionReferredBy}`);
      setFieldValue("quotaId", id);
    } else if (!values.quotaAdmissionReferredBy && values.quotaId) {
      // Clear quotaId if quota is cleared
      console.log(`🔄 Clearing quotaId because quotaAdmissionReferredBy is empty`);
      setFieldValue("quotaId", null);
    }
  }, [values.quotaAdmissionReferredBy, quotaNameToId, setFieldValue]);

  // Store appTypeId when admissionType changes
  useEffect(() => {
    if (values.admissionType) {
      // Try exact match first
      let id = admissionTypeNameToId.get(values.admissionType);
      
      // If not found, try title-cased version (since options are displayed with toTitleCase)
      if (id === undefined && typeof values.admissionType === 'string') {
        const titleCasedValue = toTitleCase(values.admissionType);
        id = admissionTypeNameToId.get(titleCasedValue);
      }
      
      // If still not found, try case-insensitive match
      if (id === undefined && typeof values.admissionType === 'string') {
        id = admissionTypeNameToId.get(values.admissionType.toLowerCase()) ||
             admissionTypeNameToId.get(values.admissionType.toUpperCase()) ||
             admissionTypeNameToId.get(values.admissionType.charAt(0).toUpperCase() + values.admissionType.slice(1).toLowerCase());
      }
      
      if (id !== undefined && id !== null) {
        console.log(`✅ Setting appTypeId: ${id} for admissionType: ${values.admissionType}`);
        setFieldValue("appTypeId", id);
      } else {
        console.error(`❌ ERROR: Could not find appTypeId for admissionType: "${values.admissionType}"`);
        console.error(`❌ Available admission types in map:`, Array.from(admissionTypeNameToId.keys()));
        console.error(`❌ Admission Data from API:`, admissionData);
      }
    } else if (!values.admissionType && values.appTypeId) {
      // Clear appTypeId if admissionType is cleared
      console.log(`🔄 Clearing appTypeId because admissionType is empty`);
      setFieldValue("appTypeId", null);
    }
  }, [values.admissionType, admissionTypeNameToId, admissionData, setFieldValue]);

  // Sync IDs when labels are present but IDs are missing (for pre-populated data)
  useEffect(() => {
    // Sync quotaId
    if (values.quotaAdmissionReferredBy && (!values.quotaId || values.quotaId === 0) && quotaNameToId.has(values.quotaAdmissionReferredBy)) {
      const id = quotaNameToId.get(values.quotaAdmissionReferredBy);
      console.log(`🔄 Syncing quotaId: ${id} for quotaAdmissionReferredBy: ${values.quotaAdmissionReferredBy}`);
      setFieldValue("quotaId", id);
    }
    
    // Sync appTypeId
    if (values.admissionType && (!values.appTypeId || values.appTypeId === 0)) {
      // Try exact match first
      let id = admissionTypeNameToId.get(values.admissionType);
      
      // If not found, try title-cased version (since options are displayed with toTitleCase)
      if (id === undefined && typeof values.admissionType === 'string') {
        const titleCasedValue = toTitleCase(values.admissionType);
        id = admissionTypeNameToId.get(titleCasedValue);
      }
      
      // If still not found, try case-insensitive match
      if (id === undefined && typeof values.admissionType === 'string') {
        id = admissionTypeNameToId.get(values.admissionType.toLowerCase()) ||
             admissionTypeNameToId.get(values.admissionType.toUpperCase()) ||
             admissionTypeNameToId.get(values.admissionType.charAt(0).toUpperCase() + values.admissionType.slice(1).toLowerCase());
      }
      
      if (id !== undefined && id !== null) {
        console.log(`🔄 Syncing appTypeId: ${id} for admissionType: ${values.admissionType}`);
        setFieldValue("appTypeId", id);
      } else {
        console.error(`❌ ERROR: Could not sync appTypeId for admissionType: "${values.admissionType}"`);
        console.error(`❌ Available admission types:`, Array.from(admissionTypeNameToId.keys()));
        console.error(`❌ Admission Data from API:`, admissionData);
      }
    }
  }, [values.quotaAdmissionReferredBy, values.quotaId, values.admissionType, values.appTypeId, quotaNameToId, admissionTypeNameToId, setFieldValue]);

  // ============ DYNAMIC LAYOUT LOGIC ============ //
  const dynamicLayout = [
    personalInfoFastSaleFieldsLayout[0], // row1
    personalInfoFastSaleFieldsLayout[1], // row2
    personalInfoFastSaleFieldsLayout[2], // row3

    // row4 dynamic
    isStaff
      ? { id: "row4", fields: ["employeeId", "admissionType"] }
      : { id: "row4", fields: ["admissionType", "", ""] },
  ];

  return (
    <div className={styles.clgAppSalePersonalInforWrapper}>
      {/* Header */}
      <div className={styles.clgAppSalePersonalInfoTop}>
        <p className={styles.clgAppSalePersonalInfoHeading}>
          Personal Information
        </p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      {/* Form Fields */}
      <div className={styles.clgAppSalePersonalInfoBottom}>
        {dynamicLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => (
              <div key={fname} className={styles.clgAppSaleFieldCell}>
                {fname &&
                  renderField(fname, fieldMap, {
                    value: values[fname] ?? "",
                    onChange: (e) => {
                      const selectedValue = e.target.value;
                      console.log(`🔄 Personal Field ${fname} changed to:`, selectedValue);
                      setFieldValue(fname, selectedValue);
                      
                      // Store IDs when dropdowns are selected
                      if (fname === "quotaAdmissionReferredBy") {
                        if (quotaNameToId.has(selectedValue)) {
                          const id = quotaNameToId.get(selectedValue);
                          console.log(`✅ Storing quotaId: ${id} for quota: ${selectedValue}`);
                          setFieldValue("quotaId", id);
                        } else {
                          console.warn(`⚠️ quotaNameToId map does not have key: "${selectedValue}"`);
                        }
                      } else if (fname === "admissionType") {
                        // Try exact match first
                        let id = admissionTypeNameToId.get(selectedValue);
                        
                        // If not found, try title-cased version (since options are displayed with toTitleCase)
                        if (id === undefined && typeof selectedValue === 'string') {
                          const titleCasedValue = toTitleCase(selectedValue);
                          id = admissionTypeNameToId.get(titleCasedValue);
                        }
                        
                        // If still not found, try case-insensitive match
                        if (id === undefined && typeof selectedValue === 'string') {
                          id = admissionTypeNameToId.get(selectedValue.toLowerCase()) ||
                               admissionTypeNameToId.get(selectedValue.toUpperCase()) ||
                               admissionTypeNameToId.get(selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1).toLowerCase());
                        }
                        
                        if (id !== undefined && id !== null) {
                          console.log(`✅ Storing appTypeId: ${id} for admissionType: ${selectedValue}`);
                          setFieldValue("appTypeId", id);
                        } else {
                          console.error(`❌ ERROR: admissionTypeNameToId map does not have key: "${selectedValue}"`);
                          console.error(`❌ Available keys:`, Array.from(admissionTypeNameToId.keys()));
                          console.error(`❌ Admission Data from API:`, admissionData);
                          console.error(`❌ Selected value type:`, typeof selectedValue);
                        }
                      }
                    },
                    error: touched[fname] && errors[fname],
                  })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Upload Photo */}
      <div className={styles.clgAppSaleUploadPictureWrapper}>
        <UploadPicture />
      </div>
    </div>
  );
};

export default PersonalInformationClgFastSale;
