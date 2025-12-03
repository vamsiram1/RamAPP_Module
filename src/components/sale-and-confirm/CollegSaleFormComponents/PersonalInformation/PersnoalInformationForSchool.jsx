import React, { useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import styles from "./PersonalInformation.module.css";

import {
  personalInfoFields,
  personalInfoFieldsLayoutForSchool,
} from "./personalInformationFields";

import UploadPicture from "../../../../widgets/UploadPicture/UploadPicture";
import { renderField } from "../../../../utils/renderField";

// API hooks
import {
  useGetQuota,
  useGetEmployeesForSale,
  useGetAdmissionType,
} from "../../../../queries/saleApis/clgSaleApis";

const PersonalInformationForSchool = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext();

  /* =======================
     Fetch Dropdown Data
  =========================*/
  const { data: quotaData } = useGetQuota();
  const { data: employeesData } = useGetEmployeesForSale();
  const { data: admissionData } = useGetAdmissionType();

  // Log API data to debug structure
  useEffect(() => {
    if (quotaData) {
      console.log("📋 Quota API Data:", quotaData);
      console.log("📋 First Quota Item:", quotaData[0]);
    }
    if (admissionData) {
      console.log("📋 Admission Type API Data:", admissionData);
      console.log("📋 First Admission Type Item:", admissionData[0]);
    }
  }, [quotaData, admissionData]);

  /* =======================
      Build Field Map & ID Maps
  =========================*/
  // Create ID maps for dropdowns
  const quotaNameToId = useMemo(() => {
    const map = new Map();
    quotaData?.forEach((q) => {
      // Handle different possible field names from API
      const name = q.name || q.quotaName || q.quota_name;
      const id = q.id || q.quotaId || q.quota_id;
      if (name && id) {
        map.set(name, id);
      }
    });
    console.log("📋 Quota Name to ID Map:", Array.from(map.entries()));
    return map;
  }, [quotaData]);

  const admissionTypeNameToId = useMemo(() => {
    const map = new Map();
    admissionData?.forEach((a) => {
      // Handle different possible field names from API
      const name = a.name || a.admissionTypeName || a.admission_type_name || a.typeName;
      const id = a.id || a.admissionTypeId || a.admission_type_id || a.typeId;
      if (name && id) {
        map.set(name, id);
      }
    });
    console.log("📋 Admission Type Name to ID Map:", Array.from(map.entries()));
    return map;
  }, [admissionData]);

  const fieldMap = personalInfoFields.reduce((acc, field) => {
    let f = { ...field };

    if (field.name === "quotaAdmissionReferredBy") {
      f.options = quotaData?.map((q) => q.name) || [];
    }

    if (field.name === "employeeId") {
      f.options = employeesData?.map((e) => e.name) || [];
    }

    if (field.name === "admissionType") {
      f.options = admissionData?.map((a) => a.name) || [];
    }

    acc[field.name] = f;
    return acc;
  }, {});

  /* =======================
      Staff Logic
  =========================*/
  const isStaff =
    values.quotaAdmissionReferredBy === "Staff" ||
    values.quotaAdmissionReferredBy === "Staff children";

  // cleanup employeeId if not staff
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
        // Always set genderId if gender is selected - ensure it's always set
        // This ensures genderId is always set when gender is selected
        console.log(`✅ Ensuring genderId is set: ${genderId} for gender: ${values.gender} (current genderId: ${values.genderId})`);
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

  // Sync quotaId when quotaAdmissionReferredBy is present but quotaId is missing
  useEffect(() => {
    if (values.quotaAdmissionReferredBy && (!values.quotaId || values.quotaId === 0)) {
      // Try exact match first
      if (quotaNameToId.has(values.quotaAdmissionReferredBy)) {
        const id = quotaNameToId.get(values.quotaAdmissionReferredBy);
        console.log(`🔄 Syncing quotaId: ${id} for quotaAdmissionReferredBy: ${values.quotaAdmissionReferredBy}`);
        setFieldValue("quotaId", id);
      } else {
        // Try case-insensitive match
        const quotaUpper = String(values.quotaAdmissionReferredBy).toUpperCase().trim();
        for (const [key, id] of quotaNameToId.entries()) {
          if (String(key).toUpperCase().trim() === quotaUpper) {
            console.log(`🔄 Syncing quotaId (case-insensitive): ${id} for quotaAdmissionReferredBy: ${values.quotaAdmissionReferredBy}`);
            setFieldValue("quotaId", id);
            break;
          }
        }
      }
    }
  }, [values.quotaAdmissionReferredBy, values.quotaId, quotaNameToId, setFieldValue]);

  // Sync appTypeId when admissionType is present but appTypeId is missing
  useEffect(() => {
    if (values.admissionType && (!values.appTypeId || values.appTypeId === 0)) {
      // Try exact match first
      if (admissionTypeNameToId.has(values.admissionType)) {
        const id = admissionTypeNameToId.get(values.admissionType);
        console.log(`🔄 Syncing appTypeId: ${id} for admissionType: ${values.admissionType}`);
        setFieldValue("appTypeId", id);
      } else {
        // Try case-insensitive match and variations
        const admissionTypeUpper = String(values.admissionType).toUpperCase().trim();
        for (const [key, id] of admissionTypeNameToId.entries()) {
          const keyUpper = String(key).toUpperCase().trim();
          if (keyUpper === admissionTypeUpper || 
              keyUpper.includes(admissionTypeUpper) || 
              admissionTypeUpper.includes(keyUpper)) {
            console.log(`🔄 Syncing appTypeId (case-insensitive): ${id} for admissionType: ${values.admissionType}`);
            setFieldValue("appTypeId", id);
            break;
          }
        }
      }
    }
  }, [values.admissionType, values.appTypeId, admissionTypeNameToId, setFieldValue]);

  /* =======================
      Admission Type Logic
  =========================*/
  // decide isWithPro first
  const isWithPro = values.admissionType === "With pro";

  // build row4 step-by-step
  let row4;
  // CASE 1: Staff selected + With Pro selected
  // employeeId | admissionType | proReceiptNo
  if (isStaff && isWithPro) {
    row4 = {
      id: "row4",
      fields: ["employeeId", "admissionType", "proReceiptNo"],
    };
  }

  // CASE 2: Staff selected + With Pro NOT selected
  // employeeId | admissionType | ""
  else if (isStaff && !isWithPro) {
    row4 = {
      id: "row4",
      fields: ["employeeId", "admissionType"],
    };
  }

  // CASE 3: Staff NOT selected + With Pro selected
  // admissionType | proReceiptNo
  // (These two fields will now occupy two cells, likely 50% width each)
  else if (!isStaff && isWithPro) {
    row4 = {
      id: "row4",
      // ONLY TWO FIELDS - No empty middle field, as requested.
      fields: ["admissionType", "proReceiptNo"],
    };
  }

  // CASE 4: Staff NOT selected + With Pro NOT selected
  // admissionType | "" | ""
  else {
    row4 = {
      id: "row4",
      fields: ["admissionType", "", ""],
    };
  }

  const staticRows = personalInfoFieldsLayoutForSchool.slice(0, 3);

  const dynamicLayout = [...staticRows, row4];
  return (
    <div className={styles.clgAppSalePersonalInforWrapper}>
      <div className={styles.clgAppSalePersonalInfoTop}>
        <p className={styles.clgAppSalePersonalInfoHeading}>
          Personal Information
        </p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      <div className={styles.clgAppSalePersonalInfoBottom}>
        {dynamicLayout.map((row) => (
          <div key={row.id} className={styles.schoolRow}>
            {row.fields.map((fname, idx) => (
              <div key={idx} className={styles.schoolCell}>
                {fname !== "" &&
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
                          console.warn(`⚠️ Available keys:`, Array.from(quotaNameToId.keys()));
                        }
                      } else if (fname === "admissionType") {
                        if (admissionTypeNameToId.has(selectedValue)) {
                          const id = admissionTypeNameToId.get(selectedValue);
                          console.log(`✅ Storing appTypeId: ${id} for admissionType: ${selectedValue}`);
                          setFieldValue("appTypeId", id);
                        } else {
                          console.warn(`⚠️ admissionTypeNameToId map does not have key: "${selectedValue}"`);
                          console.warn(`⚠️ Available keys:`, Array.from(admissionTypeNameToId.keys()));
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

      <div className={styles.clgAppSaleUploadPictureWrapper}>
        <UploadPicture />
      </div>
    </div>
  );
};

export default PersonalInformationForSchool;
