import React, { useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import styles from "./PersonalInformation.module.css";

import {
  personalInfoFields,
  personalInfoFieldsLayout,
} from "./personalInformationFields";

import UploadPicture from "../../../../widgets/UploadPicture/UploadPicture";
import { renderField } from "../../../../utils/renderField";
import {toTitleCase} from "../../../../utils/toTitleCase";

// API Hooks
import {
  useGetQuota,
  useGetEmployeesForSale,
  useGetAdmissionType,
  useGetFoodType,
  useGetCaste,
  useGetReligion,
  useGetBloodGroup,
} from "../../../../queries/saleApis/clgSaleApis";

const PersonalInformation = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext();

  // Fetch dropdown data
  const { data: quotaData } = useGetQuota();
  const { data: employeesData } = useGetEmployeesForSale();
  const { data: admissionData } = useGetAdmissionType();
  const { data: foodData } = useGetFoodType();
  const { data: casteData } = useGetCaste();
  const { data: religionData } = useGetReligion();
  const { data: bloodGroupData } = useGetBloodGroup();

  // Create name-to-ID maps for storing IDs
  const quotaNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(quotaData)) {
      quotaData.forEach((q) => {
        if (q.name && q.id) {
          map.set(q.name, q.id);
        }
      });
    }
    return map;
  }, [quotaData]);

  const admissionTypeNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(admissionData)) {
      admissionData.forEach((a) => {
        const name = a.name || a.admissionTypeName || a.admission_type_name;
        const id = a.id || a.admissionTypeId || a.admission_type_id;
        if (name && id) {
          map.set(name, id);
          map.set(toTitleCase(name), id); // Also store title-cased version
        }
      });
    }
    return map;
  }, [admissionData]);

  const foodTypeNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(foodData)) {
      foodData.forEach((food) => {
        const name = food.name || food.foodTypeName;
        const id = food.id || food.foodTypeId;
        if (name && id) {
          map.set(name, id);
          map.set(toTitleCase(name), id);
        }
      });
    }
    return map;
  }, [foodData]);

  const casteNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(casteData)) {
      casteData.forEach((c) => {
        if (c.name && c.id) {
          map.set(c.name, c.id);
        }
      });
    }
    return map;
  }, [casteData]);

  const religionNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(religionData)) {
      religionData.forEach((r) => {
        const name = r.name || r.religionName;
        const id = r.id || r.religionId;
        if (name && id) {
          map.set(name, id);
          map.set(toTitleCase(name), id);
        }
      });
    }
    return map;
  }, [religionData]);

  const bloodGroupNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(bloodGroupData)) {
      bloodGroupData.forEach((b) => {
        if (b.name && b.id) {
          map.set(b.name, b.id);
        }
      });
    }
    return map;
  }, [bloodGroupData]);

  // Build field map with API results - memoized to prevent unnecessary recalculations
  const fieldMap = useMemo(() => {
    return personalInfoFields.reduce((acc, f) => {
      let field = { ...f };

      if (f.name === "quotaAdmissionReferredBy")
        field.options = Array.isArray(quotaData) ? quotaData.map((q) => q.name) : [];

      if (f.name === "employeeId")
        field.options = Array.isArray(employeesData) ? employeesData.map((emp) => toTitleCase(emp.name)) : [];

      if (f.name === "admissionType")
        field.options = Array.isArray(admissionData) ? admissionData.map((a) => toTitleCase(a.name)) : [];

      if (f.name === "foodType")
        field.options = Array.isArray(foodData) ? foodData.map((food) => toTitleCase(food.name)) : [];

      if (f.name === "caste")
        field.options = Array.isArray(casteData) ? casteData.map((c) => c.name) : [];

      if (f.name === "religion")
        field.options = Array.isArray(religionData) ? religionData.map((r) => toTitleCase(r.name)) : [];

      if (f.name === "bloodGroup")
        field.options = Array.isArray(bloodGroupData) ? bloodGroupData.map((b) => b.name) : [];

      acc[f.name] = field;
      return acc;
    }, {});
  }, [quotaData, employeesData, admissionData, foodData, casteData, religionData, bloodGroupData]);

  const isStaff =
    values.quotaAdmissionReferredBy === "Staff children" ||
    values.quotaAdmissionReferredBy === "Staff";

  // CLEANUP employeeId if not Staff - use useEffect to prevent infinite loops
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
        setFieldValue("genderId", genderId);
      }
    } else if (values.genderId) {
      setFieldValue("genderId", null);
    }
  }, [values.gender, setFieldValue]);

  // Store quotaId when quotaAdmissionReferredBy changes
  useEffect(() => {
    if (values.quotaAdmissionReferredBy && quotaNameToId.has(values.quotaAdmissionReferredBy)) {
      const id = quotaNameToId.get(values.quotaAdmissionReferredBy);
      setFieldValue("quotaId", id);
    } else if (!values.quotaAdmissionReferredBy && values.quotaId) {
      setFieldValue("quotaId", null);
    }
  }, [values.quotaAdmissionReferredBy, quotaNameToId, setFieldValue]);

  // Store appTypeId when admissionType changes
  useEffect(() => {
    if (values.admissionType) {
      let id = admissionTypeNameToId.get(values.admissionType);
      if (id === undefined && typeof values.admissionType === 'string') {
        const titleCasedValue = toTitleCase(values.admissionType);
        id = admissionTypeNameToId.get(titleCasedValue);
      }
      if (id !== undefined && id !== null) {
        setFieldValue("appTypeId", id);
      }
    } else if (!values.admissionType && values.appTypeId) {
      setFieldValue("appTypeId", null);
    }
  }, [values.admissionType, admissionTypeNameToId, setFieldValue]);

  // Store foodTypeId when foodType changes
  useEffect(() => {
    if (values.foodType) {
      let id = foodTypeNameToId.get(values.foodType);
      if (id === undefined && typeof values.foodType === 'string') {
        const titleCasedValue = toTitleCase(values.foodType);
        id = foodTypeNameToId.get(titleCasedValue);
      }
      if (id !== undefined && id !== null) {
        setFieldValue("foodTypeId", id);
      }
    } else if (!values.foodType && values.foodTypeId) {
      setFieldValue("foodTypeId", null);
    }
  }, [values.foodType, foodTypeNameToId, setFieldValue]);

  // Store casteId when caste changes
  useEffect(() => {
    if (values.caste && casteNameToId.has(values.caste)) {
      const id = casteNameToId.get(values.caste);
      setFieldValue("casteId", id);
    } else if (!values.caste && values.casteId) {
      setFieldValue("casteId", null);
    }
  }, [values.caste, casteNameToId, setFieldValue]);

  // Store religionId when religion changes
  useEffect(() => {
    if (values.religion) {
      let id = religionNameToId.get(values.religion);
      if (id === undefined && typeof values.religion === 'string') {
        const titleCasedValue = toTitleCase(values.religion);
        id = religionNameToId.get(titleCasedValue);
      }
      if (id !== undefined && id !== null) {
        setFieldValue("religionId", id);
      }
    } else if (!values.religion && values.religionId) {
      setFieldValue("religionId", null);
    }
  }, [values.religion, religionNameToId, setFieldValue]);

  // Store bloodGroupId when bloodGroup changes
  useEffect(() => {
    if (values.bloodGroup && bloodGroupNameToId.has(values.bloodGroup)) {
      const id = bloodGroupNameToId.get(values.bloodGroup);
      setFieldValue("bloodGroupId", id);
    } else if (!values.bloodGroup && values.bloodGroupId) {
      setFieldValue("bloodGroupId", null);
    }
  }, [values.bloodGroup, bloodGroupNameToId, setFieldValue]);

  // 🔥 Dynamic layout
  const dynamicLayout = [
    personalInfoFieldsLayout[0], // row1
    personalInfoFieldsLayout[1], // row2
    personalInfoFieldsLayout[2], // row3

    isStaff
      ? { id: "row4", fields: ["employeeId", "admissionType", "foodType"] }
      : { id: "row4", fields: ["admissionType", "foodType", "bloodGroup"] },

    isStaff
      ? { id: "row5", fields: ["bloodGroup", "caste", "religion"] }
      : { id: "row5", fields: ["caste", "religion", ""] }
  ];

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
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => (
              <div key={fname} className={styles.clgAppSaleFieldCell}>
                {renderField(fname, fieldMap, {
                  value: values[fname] ?? "",
                  onChange: (e) => setFieldValue(fname, e.target.value),
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

export default PersonalInformation;
