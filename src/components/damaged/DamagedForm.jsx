import React, { useMemo, useState, useEffect } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { useLocation } from "react-router-dom";
 
import styles from "./DamagedForm.module.css";
import leftArrow from "../../assets/application-status/Frame 1410092236.svg";
import rightArrow from "../../assets/application-status/rightArrowWhiteColor";
 
import { damagedFields, damagedFieldsLayout } from "./DamagedFields";
import { renderField } from "../../utils/renderField";
import { useGetApplicationValues, useGetApplicationStatuses, useSubmitDamagedApplication } from "../../queries/damagedApis/damageApis";
import Button from "../../widgets/Button/Button";
 
// ------------------------------------------------------------------
// 🔥 INNER FORM COMPONENT
// ------------------------------------------------------------------
const DamagedFormInner = ({ appNo, setAppNo, applicationIds, setApplicationIds }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const [debouncedAppNo, setDebouncedAppNo] = useState("");
  
  // Remove local state since it's now passed as prop
  // const [applicationIds, setApplicationIds] = useState({...});
  
  // Sync appNo with form value on mount (for navigation from Application Status)
  useEffect(() => {
    if (appNo && !values.applicationNo) {
      setFieldValue("applicationNo", appNo);
    }
  }, [appNo, values.applicationNo, setFieldValue]);
 
  // Debounce the application number to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAppNo(appNo);
    }, 500); // Wait 500ms after user stops typing
    
    return () => clearTimeout(timer);
  }, [appNo]);
 
  // API Call -> Runs when debouncedAppNo changes (enabled only when appNo has valid length)
  const { data: applicationValues, isLoading, isError } = useGetApplicationValues(debouncedAppNo);
  
  // API Call -> Fetch application statuses for dropdown
  const { data: applicationStatuses } = useGetApplicationStatuses();
  
  // Debug: Log the API response
  useEffect(() => {
    console.log("Application Statuses API Response:", applicationStatuses);
  }, [applicationStatuses]);
 
  // When API returns → autofill fields
  useEffect(() => {
    // Clear fields when application number is empty or too short
    if (!debouncedAppNo || debouncedAppNo.length < 4) {
      setFieldValue("zoneName", "");
      setFieldValue("proName", "");
      setFieldValue("dgmName", "");
      setFieldValue("campusName", "");
      return;
    }
    
    if (!applicationValues) {
      // Clear fields if no data
      if (debouncedAppNo && isError) {
        setFieldValue("zoneName", "");
        setFieldValue("proName", "");
        setFieldValue("dgmName", "");
        setFieldValue("campusName", "");
      }
      return;
    }
 
    // Handle both direct response and nested data property
    const app = applicationValues.data || applicationValues;
    
    console.log("Application Values API Response:", app);
 
    setFieldValue("zoneName", app.zoneName ?? "");
    setFieldValue("proName", app.proName ?? "");
    setFieldValue("dgmName", app.dgmName ?? "");
    setFieldValue("campusName", app.campusName ?? ""); // This is Branch Name
    
    // Store IDs for submission
    setApplicationIds({
      campusId: app.campusId ?? null,
      proId: app.proEmpId ?? null,
      zoneId: app.zoneId ?? null,
      dgmEmpId: app.dgmEmpId ?? null,
      statusId: null // Will be set when status is selected
    });
  }, [applicationValues, setFieldValue, debouncedAppNo, isError]);
 
  // Build fieldMap for renderField
  const fieldMap = useMemo(() => {
    const map = {};
    damagedFields.forEach((f) => {
      // Update applicationStatus field with API data
      if (f.name === "applicationStatus" && applicationStatuses) {
        // Handle different possible response structures
        let statusOptions = [];
        let statusMap = {}; // Map to store status_id by status name
        
        if (Array.isArray(applicationStatuses)) {
          // If response is directly an array of objects, extract the 'status' field
          statusOptions = applicationStatuses
            .filter(item => item && item.status) // Filter valid items
            .map(item => {
              statusMap[item.status] = item.status_id;
              return item.status;
            }); // Extract status string
        } else if (applicationStatuses?.data && Array.isArray(applicationStatuses.data)) {
          // If response has data property with array of objects
          statusOptions = applicationStatuses.data
            .filter(item => item && item.status)
            .map(item => {
              statusMap[item.status] = item.status_id;
              return item.status;
            });
        } else if (typeof applicationStatuses === 'object') {
          // If it's an object, try to extract values
          statusOptions = Object.values(applicationStatuses);
        }
        
        console.log("Raw API Response:", applicationStatuses);
        console.log("Processed status options:", statusOptions);
        console.log("Status ID Map:", statusMap);
        
        // Store statusMap for later use
        window.statusIdMap = statusMap;
        
        map[f.name] = {
          ...f,
          options: statusOptions.length > 0 ? statusOptions : f.options
        };
      } else {
        map[f.name] = f;
      }
    });
    return map;
  }, [applicationStatuses]);
 
  return (
    <div className={styles.damagedFormWrapper}>
      {/* ---------------- TOP HEADER ---------------- */}
      <div className={styles.clgAppSaleDetailsLeft}>
        {/* <figure>
          <img src={leftArrow} alt="back arrow" />
        </figure> */}
 
        <div className={styles.clgAppSaleDetailsHeadingStepper}>
          <p className={styles.clgAppSaleDetails}>Application Damage</p>
          
        </div>
      </div>
 
      {/* ---------------- FORM BODY ---------------- */}
      <div className={styles.damagedForm}>
        {damagedFieldsLayout.map((row) => {
          const colsClass =
            row.fields.length >= 3
              ? styles.row3cols
              : row.fields.length === 2
              ? styles.row2cols
              : styles.row1col;

          return (
          <div key={row.id} className={`${styles.damagedRow} ${colsClass}`}>
            {row.fields.map((fname) => {
              const field = fieldMap[fname];
              if (!field) return <div key={fname}></div>;
 
              return (
                <div key={fname} className={styles.damagedFieldCell}>
                  {renderField(fname, fieldMap, {
                    value: values[fname],
                    onChange: (e) => {
                      setFieldValue(fname, e.target.value);
 
                      // 🔥 set applicationNo while typing
                      if (fname === "applicationNo") {
                        setAppNo(e.target.value);
                      }
                      
                      // 🔥 set statusId when status is selected
                      if (fname === "applicationStatus" && window.statusIdMap) {
                        const selectedStatusId = window.statusIdMap[e.target.value];
                        setApplicationIds(prev => ({
                          ...prev,
                          statusId: selectedStatusId
                        }));
                      }
                    },
                    error: touched[fname] && errors[fname],
                  })}
                </div>
              );
            })}
            {row.id === "row3" && (
              <div className={styles.damagedSubmitWrapper}>
                <Button buttonname="Submit" type="submit" variant="primary" righticon={rightArrow}/>
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
};
 
// ------------------------------------------------------------------
// 🔥 MASTER WRAPPER COMPONENT WITH useState
// ------------------------------------------------------------------
const DamagedForm = () => {
  const location = useLocation();
  const [appNo, setAppNo] = useState(""); // 🔥 main state
  
  // Store the IDs from API response
  const [applicationIds, setApplicationIds] = useState({
    campusId: null,
    proId: null,
    zoneId: null,
    dgmEmpId: null,
    statusId: null
  });
  
  // Mutation for submitting damaged application
  const { mutate: submitDamage, isLoading: isSubmitting, isSuccess, isError: submitError } = useSubmitDamagedApplication();
  
  // Show success alert when submission is successful
  useEffect(() => {
    if (isSuccess) {
      alert("Done");
    }
  }, [isSuccess]);
  
  // Check if there's application data from navigation (from Application Status table)
  const applicationDataFromNav = location?.state?.applicationData;
 
  const initialValues = {
    applicationNo: applicationDataFromNav?.applicationNo || "",
    zoneName: "",
    proName: "",
    dgmName: "",
    campusName: "",
    applicationStatus: "",
    reason: "",
  };
  
  // Set appNo from navigation state when component mounts
  useEffect(() => {
    if (applicationDataFromNav?.applicationNo) {
      setAppNo(String(applicationDataFromNav.applicationNo));
    }
  }, [applicationDataFromNav]);
  
  // Handle form submission
  const handleSubmit = (values) => {
    console.log("Form Values:", values);
    console.log("Application IDs:", applicationIds);
    
    // Validate required fields
    if (!values.applicationNo) {
      alert("Please enter Application Number");
      return;
    }
    
    if (!values.applicationStatus) {
      alert("Please select Application Status");
      return;
    }
    
    if (!values.reason) {
      alert("Please enter Reason");
      return;
    }
    
    if (!applicationIds.statusId) {
      alert("Please select a valid status");
      return;
    }
    
    // Prepare data for POST request
    const damageData = {
      applicationNo: parseInt(values.applicationNo) || 0,
      statusId: applicationIds.statusId || 0,
      reason: values.reason || "",
      campusId: applicationIds.campusId || 0,
      proId: applicationIds.proId || 0,
      zoneId: applicationIds.zoneId || 0,
      dgmEmpId: applicationIds.dgmEmpId || 0
    };
    
    console.log("Submitting Damage Data:", damageData);
    
    // Submit the data
    submitDamage(damageData, {
      onSuccess: (data) => {
        console.log("Damage application submitted successfully:", data);
        // Alert is now handled by useEffect watching isSuccess
      },
      onError: (error) => {
        console.error("Error submitting damage application:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Full error object:", error);
        
        // Try to extract meaningful error message
        let errorMessage = "Unknown error";
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data) {
          errorMessage = JSON.stringify(error.response.data);
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(`Failed to submit: ${errorMessage}\n\nCheck console for details.`);
      }
    });
  };
 
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <DamagedFormInner 
          appNo={appNo} 
          setAppNo={setAppNo} 
          applicationIds={applicationIds}
          setApplicationIds={setApplicationIds}
        />
      </Form>
    </Formik>
  );
};
 
export default DamagedForm;