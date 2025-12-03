import React, { useMemo, useEffect } from "react";
import { useFormikContext } from "formik";
import styles from "./ConcessionInformation.module.css";

import { useGetEmployeesForSale, useGetConcessionReasons } from "../../../../queries/saleApis/clgSaleApis";
import { useConcessionTypes } from "./hooks/useCollegeConcessionTypes";

import {
  concessionInformationFields,
  concessionInformationFieldsLayout,
} from "./concessionInformtionFields";

import { renderField } from "../../../../utils/renderField";
import {toTitleCase} from "../../../../utils/toTitleCase";

const ConcessionInformation = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext();

  /* -------------------------
      API: Get Employees
  ------------------------- */
  const { data: employeesRaw = [] } = useGetEmployeesForSale();
  
  /* -------------------------
      API: Get Concession Types
  ------------------------- */
  const { getConcessionTypeIdByLabel } = useConcessionTypes();
  
  /* -------------------------
      API: Get Concession Reasons
  ------------------------- */
  const { data: concessionReasonsRaw = [] } = useGetConcessionReasons();
  
  // Create name-to-ID map for concession reasons
  const concessionReasonNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(concessionReasonsRaw)) {
      concessionReasonsRaw.forEach((reason) => {
        const name = reason?.name || reason?.reasonName || reason?.label || reason?.concessionReasonName || "";
        const id = reason?.id || reason?.reasonId || reason?.concessionReasonId || reason?.value;
        if (name && id !== undefined && id !== null) {
          map.set(name, id);
        }
      });
    }
    return map;
  }, [concessionReasonsRaw]);
  
  // Concession reason options for dropdown
  const concessionReasonOptions = useMemo(() => {
    if (Array.isArray(concessionReasonsRaw)) {
      return concessionReasonsRaw.map((reason) => 
        reason?.name || reason?.reasonName || reason?.label || reason?.concessionReasonName || ""
      ).filter(Boolean);
    }
    return [];
  }, [concessionReasonsRaw]);

  /* -------------------------
      Dropdown options
  ------------------------- */
  const employeeOptions = useMemo(
    () => employeesRaw.map((e) => toTitleCase(e?.name ?? "")), // adjust key if needed
    [employeesRaw]
  );

  // Create name-to-ID map for employees (for authorizedBy and referredBy)
  const employeeNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(employeesRaw)) {
      employeesRaw.forEach((emp) => {
        const name = toTitleCase(emp?.name ?? "");
        const id = emp?.id || emp?.employeeId || emp?.value;
        if (name && id !== undefined && id !== null) {
          map.set(name, id);
        }
      });
    }
    return map;
  }, [employeesRaw]);

  /* -------------------------
      Handle 1st Year Concession Change - Store amount and type ID
  ------------------------- */
  const handleFirstYearConcessionChange = (e) => {
    const { name, value } = e.target;
    
    // Remove any non-digit characters (allow only numbers)
    const digitsOnly = value.replace(/\D/g, "");
    
    // Get the "1st year" concession type ID
    const firstYearTypeId = getConcessionTypeIdByLabel("1st year");
    
    // Update the form data with the concession amount
    setFieldValue(name, digitsOnly);
    
    // Also store the concession type ID separately
    if (firstYearTypeId !== undefined) {
      setFieldValue("firstYearConcessionTypeId", firstYearTypeId);
      console.log('✅ Stored firstYearConcessionTypeId:', firstYearTypeId, 'for amount:', digitsOnly);
    } else {
      console.warn('⚠️ Could not find "1st year" concession type ID');
    }
  };

  /* -------------------------
      Handle 2nd Year Concession Change - Store amount and type ID
  ------------------------- */
  const handleSecondYearConcessionChange = (e) => {
    const { name, value } = e.target;
    
    // Remove any non-digit characters (allow only numbers)
    const digitsOnly = value.replace(/\D/g, "");
    
    // Get the "2nd year" concession type ID
    const secondYearTypeId = getConcessionTypeIdByLabel("2nd year");
    
    // Update the form data with the concession amount
    setFieldValue(name, digitsOnly);
    
    // Also store the concession type ID separately
    if (secondYearTypeId !== undefined) {
      setFieldValue("secondYearConcessionTypeId", secondYearTypeId);
      console.log('✅ Stored secondYearConcessionTypeId:', secondYearTypeId, 'for amount:', digitsOnly);
    } else {
      console.warn('⚠️ Could not find "2nd year" concession type ID');
    }
  };

  /* -------------------------
      Handle Concession Reason Change - Store reason ID
  ------------------------- */
  const handleConcessionReasonChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    
    // Store concessionReasonId when reason is selected
    if (value && concessionReasonNameToId.has(value)) {
      const reasonId = concessionReasonNameToId.get(value);
      setFieldValue("concessionReasonId", reasonId);
      console.log('✅ Stored concessionReasonId:', reasonId, 'for reason:', value);
    } else if (!value) {
      setFieldValue("concessionReasonId", null);
    }
  };

  /* -------------------------
      Handle Authorized By Change - Store employee ID
  ------------------------- */
  const handleAuthorizedByChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    
    // Store employee ID when employee is selected
    if (value && employeeNameToId.has(value)) {
      const employeeId = employeeNameToId.get(value);
      setFieldValue("authorizedById", employeeId);
      console.log('✅ Stored authorizedById:', employeeId, 'for employee:', value);
    } else if (!value) {
      setFieldValue("authorizedById", null);
    }
  };

  /* -------------------------
      Handle Referred By Change - Store employee ID
  ------------------------- */
  const handleReferredByChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    
    // Store employee ID when employee is selected
    if (value && employeeNameToId.has(value)) {
      const employeeId = employeeNameToId.get(value);
      setFieldValue("referredById", employeeId);
      console.log('✅ Stored referredById:', employeeId, 'for employee:', value);
    } else if (!value) {
      setFieldValue("referredById", null);
    }
  };

  /* -------------------------
      Sync concession type IDs when values are present but IDs are missing
  ------------------------- */
  useEffect(() => {
    // Sync firstYearConcessionTypeId
    if (values.firstYearConcession && (!values.firstYearConcessionTypeId || values.firstYearConcessionTypeId === 0)) {
      const firstYearTypeId = getConcessionTypeIdByLabel("1st year");
      if (firstYearTypeId !== undefined) {
        setFieldValue("firstYearConcessionTypeId", firstYearTypeId);
        console.log('🔄 Synced firstYearConcessionTypeId:', firstYearTypeId);
      }
    }
    
    // Sync secondYearConcessionTypeId
    if (values.secondYearConcession && (!values.secondYearConcessionTypeId || values.secondYearConcessionTypeId === 0)) {
      const secondYearTypeId = getConcessionTypeIdByLabel("2nd year");
      if (secondYearTypeId !== undefined) {
        setFieldValue("secondYearConcessionTypeId", secondYearTypeId);
        console.log('🔄 Synced secondYearConcessionTypeId:', secondYearTypeId);
      }
    }
    
    // Sync concessionReasonId when reason label is present but ID is missing
    if (values.concessionReason && (!values.concessionReasonId || values.concessionReasonId === 0)) {
      // Try exact match first
      if (concessionReasonNameToId.has(values.concessionReason)) {
        const reasonId = concessionReasonNameToId.get(values.concessionReason);
        setFieldValue("concessionReasonId", reasonId);
        console.log('🔄 Synced concessionReasonId (exact match):', reasonId, 'for reason:', values.concessionReason);
      } else {
        // Try case-insensitive match
        const reasonLabel = String(values.concessionReason).trim();
        for (const [key, id] of concessionReasonNameToId.entries()) {
          if (key.toLowerCase() === reasonLabel.toLowerCase()) {
            setFieldValue("concessionReasonId", id);
            // Also update the reason value to match the dropdown format
            setFieldValue("concessionReason", key);
            console.log('🔄 Synced concessionReasonId (case-insensitive):', id, 'for reason:', reasonLabel, 'matched with:', key);
            break;
          }
        }
      }
    }
    
    // Sync authorizedById when authorizedBy label is present but ID is missing
    if (values.authorizedBy && (!values.authorizedById || values.authorizedById === 0)) {
      const authorizedByLabel = toTitleCase(String(values.authorizedBy).trim());
      if (employeeNameToId.has(authorizedByLabel)) {
        const employeeId = employeeNameToId.get(authorizedByLabel);
        setFieldValue("authorizedById", employeeId);
        console.log('🔄 Synced authorizedById:', employeeId, 'for employee:', values.authorizedBy);
      } else {
        // Try case-insensitive match
        for (const [key, id] of employeeNameToId.entries()) {
          if (key.toLowerCase() === authorizedByLabel.toLowerCase()) {
            setFieldValue("authorizedById", id);
            setFieldValue("authorizedBy", key);
            console.log('🔄 Synced authorizedById (case-insensitive):', id, 'for employee:', values.authorizedBy, 'matched with:', key);
            break;
          }
        }
      }
    }
    
    // Sync referredById when referredBy label is present but ID is missing
    if (values.referredBy && (!values.referredById || values.referredById === 0)) {
      const referredByLabel = toTitleCase(String(values.referredBy).trim());
      if (employeeNameToId.has(referredByLabel)) {
        const employeeId = employeeNameToId.get(referredByLabel);
        setFieldValue("referredById", employeeId);
        console.log('🔄 Synced referredById:', employeeId, 'for employee:', values.referredBy);
      } else {
        // Try case-insensitive match
        for (const [key, id] of employeeNameToId.entries()) {
          if (key.toLowerCase() === referredByLabel.toLowerCase()) {
            setFieldValue("referredById", id);
            setFieldValue("referredBy", key);
            console.log('🔄 Synced referredById (case-insensitive):', id, 'for employee:', values.referredBy, 'matched with:', key);
            break;
          }
        }
      }
    }
  }, [values.firstYearConcession, values.secondYearConcession, values.firstYearConcessionTypeId, values.secondYearConcessionTypeId, values.concessionReason, values.concessionReasonId, values.authorizedBy, values.authorizedById, values.referredBy, values.referredById, getConcessionTypeIdByLabel, concessionReasonNameToId, employeeNameToId, setFieldValue, concessionReasonsRaw, employeesRaw]);

  /* -------------------------
      Build final field map
  ------------------------- */
  const fieldMap = useMemo(() => {
    const map = {};

    concessionInformationFields.forEach((f) => {
      map[f.name] = { ...f };

      // Replace dropdowns
      if (f.name === "referredBy") map[f.name].options = employeeOptions;
      if (f.name === "authorizedBy") map[f.name].options = employeeOptions;
      if (f.name === "concessionReason") {
        map[f.name].options = concessionReasonOptions;
        map[f.name].type = "select"; // Change from text to select
      }
    });

    return map;
  }, [employeeOptions, concessionReasonOptions]);

  return (
    <div className={styles.clgAppSaleConcessionInfoWrapper}>
      <div className={styles.clgAppSaleConcessionInfoTop}>
        <p className={styles.clgAppSaleConcessionHeading}>
          Concession Information
        </p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      <div className={styles.clgAppSaleConcessionInfoBottom}>
        {concessionInformationFieldsLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => {
              // Custom onChange handlers for concession amount fields, reason, and employee fields
              let onChangeHandler = (e) => setFieldValue(fname, e.target.value);
              
              if (fname === "firstYearConcession") {
                onChangeHandler = handleFirstYearConcessionChange;
              } else if (fname === "secondYearConcession") {
                onChangeHandler = handleSecondYearConcessionChange;
              } else if (fname === "concessionReason") {
                onChangeHandler = handleConcessionReasonChange;
              } else if (fname === "authorizedBy") {
                onChangeHandler = handleAuthorizedByChange;
              } else if (fname === "referredBy") {
                onChangeHandler = handleReferredByChange;
              }
              
              return (
                <div key={fname} className={styles.clgAppSaleFieldCell}>
                  {renderField(fname, fieldMap, {
                    value: values[fname] ?? "",
                    onChange: onChangeHandler,
                    error: touched[fname] && errors[fname],
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConcessionInformation;
