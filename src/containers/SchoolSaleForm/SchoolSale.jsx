import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./SchoolSale.module.css";

import ApplicationSaleDetails from "../../components/sale-and-confirm/CollegSaleFormComponents/ApplicationDetails/ApplicationSaleDetails";
import Button from "../../widgets/Button/Button";
import leftArrowBlueColor from "../../assets/application-status/leftArrowBlueColor";
import applicationSaleicon from "../../assets/application-status/applicationSaleicon";
import rightArrowBlueColor from "../../assets/application-status/rightArrowBlueColor";
import PaymentPopup from "../../widgets/PaymentPopup/whole-payment-popup/PaymentPopup.jsx";
import SuccessPage from "../../widgets/sale-done/SuccessPage";
import { submitSchoolApplicationSaleOnly, mapSchoolApplicationSaleOnlyToPayload, updateSchoolApplicationSale, mapSchoolApplicationSaleUpdateToPayload } from "../../hooks/school-apis/SchoolSubmissionApi";

import PersonalInformationForSchool from "../../components/sale-and-confirm/CollegSaleFormComponents/PersonalInformation/PersnoalInformationForSchool";
import ParentInformationForSchool from "../../components/sale-and-confirm/CollegSaleFormComponents/ParentInformation/ParentInformationForSchool";
import OrientationInformationForSchool from "../../components/sale-and-confirm/CollegSaleFormComponents/OrientationInformation/OrientationInformationForSchool";
import AddressInformation from "../../components/sale-and-confirm/CollegSaleFormComponents/AddressInformation/AddressInformation";

// ---------------------------------------
// 🟦 Initial Values for School Flow
// ---------------------------------------
const initialValues = {
  // Personal Information
  firstName: "",
  surName: "",
  gender: "",
  genderId: null, // Backend ID for gender
  aaparNo: "",
  dob: "",
  aadharCardNo: "",
  quotaAdmissionReferredBy: "",
  quotaId: null, // Backend ID for quota
  employeeId: "",
  admissionType: "",
  appTypeId: null, // Backend ID for admission type
  proReceiptNo:"",

  // Parent Info
  fatherName: "",
  fatherMobile: "",

  // Orientation
  academicYear: "",
  academicYearId: null, // Backend ID for academic year
  branchName: "", // Display name for branch/campus
  campusId: null, // Backend ID for campus/branch
  branchId: null, // Backend ID for branch (same as campusId)
  branchType: "",
  city: "",
  cityId: null, // Backend ID for city
  joiningClass: "",
  classId: null, // Backend ID for class
  joiningClassId: null, // Backend ID for joining class (same as classId)
  orientationName: "",
  orientationId: null, // Backend ID for orientation
  studentType: "",
  studentTypeId: null, // Backend ID for student type
  orientationFee: "",

  // Address
  doorNo: "",
  streetName: "",
  landmark: "",
  area: "",
  pincode: "",
  state: "",
  stateId: null, // Backend ID for state
  district: "",
  districtId: null, // Backend ID for district
  mandal: "",
  mandalId: null, // Backend ID for mandal
  cityAddress: "",
  gpin: "",
};

const SchoolSale = () => {
  const location = useLocation();
  const [applicationDetailsData, setApplicationDetailsData] = useState(null);
  const navigate = useNavigate();
  const applicationData = location.state?.applicationData;
  const overviewData = location.state?.overviewData; // Get overviewData from navigation state
  const isEditMode = location.state?.isEditMode; // Check if this is edit mode
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [submissionResponse, setSubmissionResponse] = useState(null);
  
  // For school sale "Proceed to Sale" button, use "regular" sale type to show "Finish Sale" button
  const saleType = "regular";
  
  // Ref to store formik instance for auto-population
  const formikRef = React.useRef(null);
  
  // Auto-populate form fields from overviewData when in edit mode
  useEffect(() => {
    if (isEditMode && overviewData && formikRef.current) {
      const formik = formikRef.current;
      console.log("✏️ Edit Mode: Auto-populating form from overviewData");
      console.log("📦 Overview Data:", overviewData);
      console.log("📦 Overview Data Keys:", Object.keys(overviewData));
      console.log("📦 Personal Info Fields:", {
        firstName: overviewData.firstName,
        lastName: overviewData.lastName,
        genderName: overviewData.genderName,
        gender: overviewData.gender,
        apaarNo: overviewData.apaarNo,
        aaparNo: overviewData.aaparNo,
        dob: overviewData.dob,
        aadharCardNo: overviewData.aadharCardNo,
        aadharCard: overviewData.aadharCard,
        quotaName: overviewData.quotaName,
        quotaId: overviewData.quotaId,
        admissionReferredByName: overviewData.admissionReferredByName,
        admissionType: overviewData.admissionType,
        admissionTypeName: overviewData.admissionTypeName,
        appTypeId: overviewData.appTypeId,
        admissionTypeId: overviewData.admissionTypeId
      });
      
      // Personal Information
      if (overviewData.firstName) {
        formik.setFieldValue("firstName", overviewData.firstName);
      }
      if (overviewData.lastName) {
        formik.setFieldValue("surName", overviewData.lastName);
      }
      
      // Gender - check multiple possible field names and normalize to "MALE" or "FEMALE"
      const genderValue = overviewData.genderName || overviewData.gender || overviewData.gender_name;
      console.log("🔍 Gender auto-population - Raw genderValue from overviewData:", genderValue);
      if (genderValue) {
        const genderUpper = String(genderValue).toUpperCase().trim();
        console.log("🔍 Gender auto-population - Normalized to uppercase:", genderUpper);
        // Normalize to exact values expected by Gender component: "MALE" or "FEMALE"
        let normalizedGender = "";
        if (genderUpper === "MALE" || genderUpper === "M" || genderUpper.includes("MALE")) {
          normalizedGender = "MALE";
          formik.setFieldValue("genderId", 1);
          console.log("✅ Gender auto-population - Setting to MALE, genderId: 1");
        } else if (genderUpper === "FEMALE" || genderUpper === "F" || genderUpper.includes("FEMALE")) {
          normalizedGender = "FEMALE";
          formik.setFieldValue("genderId", 2);
          console.log("✅ Gender auto-population - Setting to FEMALE, genderId: 2");
        } else {
          console.warn("⚠️ Gender auto-population - Unknown gender value:", genderUpper);
        }
        
        if (normalizedGender) {
          // Set gender value in Formik
          formik.setFieldValue("gender", normalizedGender);
          console.log("✅ Auto-populated gender in Formik:", normalizedGender);
          console.log("✅ Current Formik gender value:", formik.values.gender);
          console.log("✅ Current Formik genderId value:", formik.values.genderId);
          
          // Force a small delay to ensure Formik state is updated
          setTimeout(() => {
            console.log("🔄 After delay - Formik gender value:", formik.values.gender);
          }, 100);
        } else {
          console.warn("⚠️ Gender auto-population - Could not normalize gender value:", genderValue);
        }
      } else {
        console.warn("⚠️ Gender auto-population - No gender value found in overviewData");
      }
      
      // APAAR No - check both spellings (aaparNo and apaarNo)
      const apaarValue = overviewData.apaarNo || overviewData.aaparNo || overviewData.apaar_no || overviewData.aapar_no;
      if (apaarValue) {
        formik.setFieldValue("aaparNo", String(apaarValue));
        console.log("✅ Auto-populated aaparNo:", apaarValue);
      }
      
      // Date of Birth - handle different date formats and convert to YYYY-MM-DD format
      const dobValue = overviewData.dob || overviewData.dateOfBirth || overviewData.date_of_birth;
      if (dobValue) {
        let dobFormatted = "";
        
        if (dobValue instanceof Date) {
          // If it's a Date object, convert to ISO string (YYYY-MM-DD)
          dobFormatted = dobValue.toISOString().split('T')[0];
        } else if (typeof dobValue === 'string') {
          // Try to parse and reformat if needed
          // Handle different date formats: "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD", etc.
          const dateObj = new Date(dobValue);
          if (!isNaN(dateObj.getTime())) {
            // Convert to YYYY-MM-DD format for HTML date input
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            dobFormatted = `${year}-${month}-${day}`;
          } else {
            // If parsing fails, try to extract date parts manually
            // Handle formats like "DD/MM/YYYY" or "MM/DD/YYYY"
            const dateMatch = dobValue.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (dateMatch) {
              const [, day, month, year] = dateMatch;
              dobFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            } else if (dobValue.match(/^\d{4}-\d{2}-\d{2}/)) {
              // Already in YYYY-MM-DD format
              dobFormatted = dobValue.split('T')[0].split(' ')[0];
            }
          }
        } else if (typeof dobValue === 'number') {
          // If it's a timestamp
          const dateObj = new Date(dobValue);
          if (!isNaN(dateObj.getTime())) {
            dobFormatted = dateObj.toISOString().split('T')[0];
          }
        }
        
        if (dobFormatted) {
          formik.setFieldValue("dob", dobFormatted);
          console.log("✅ Auto-populated dob:", dobFormatted, "from original:", dobValue);
        } else {
          console.warn("⚠️ Could not parse dob value:", dobValue);
        }
      }
      
      // Aadhar Card No - check multiple possible field names
      const aadharValue = overviewData.aadharCardNo || overviewData.aadharCard || overviewData.aadhar_card_no || overviewData.aadhar;
      if (aadharValue) {
        formik.setFieldValue("aadharCardNo", String(aadharValue));
        console.log("✅ Auto-populated aadharCardNo:", aadharValue);
      }
      // Quota/Admission Referred By - check multiple possible field names
      const quotaValue = overviewData.quotaName || overviewData.quotaAdmissionReferredBy || overviewData.admissionReferredByName || overviewData.quota_name;
      if (quotaValue) {
        formik.setFieldValue("quotaAdmissionReferredBy", quotaValue);
        console.log("✅ Auto-populated quotaAdmissionReferredBy:", quotaValue);
        // Note: quotaId will be set automatically by PersonalInformationForSchool component's useEffect
        // when it detects quotaAdmissionReferredBy and matches it with the quotaNameToId map
      }
      
      // Quota ID - if available directly, set it
      if (overviewData.quotaId || overviewData.quota_id) {
        const quotaId = overviewData.quotaId || overviewData.quota_id;
        formik.setFieldValue("quotaId", quotaId);
        console.log("✅ Auto-populated quotaId:", quotaId);
      }
      
      // Admission Type - check multiple possible field names
      const admissionTypeValue = overviewData.admissionType || overviewData.admissionTypeName || overviewData.admission_type_name;
      if (admissionTypeValue) {
        formik.setFieldValue("admissionType", admissionTypeValue);
        console.log("✅ Auto-populated admissionType:", admissionTypeValue);
        // Note: appTypeId will be set automatically by PersonalInformationForSchool component's useEffect
        // when it detects admissionType and matches it with the admissionTypeNameToId map
      }
      
      // Admission Type ID (appTypeId) - if available directly, set it
      if (overviewData.appTypeId || overviewData.admissionTypeId || overviewData.admission_type_id || overviewData.app_type_id) {
        const appTypeId = overviewData.appTypeId || overviewData.admissionTypeId || overviewData.admission_type_id || overviewData.app_type_id;
        formik.setFieldValue("appTypeId", appTypeId);
        console.log("✅ Auto-populated appTypeId:", appTypeId);
      }
      
      if (overviewData.proReceiptNo) {
        formik.setFieldValue("proReceiptNo", overviewData.proReceiptNo);
      }
      
      // Parent Information
      if (overviewData.parentInfo?.fatherName) {
        formik.setFieldValue("fatherName", overviewData.parentInfo.fatherName);
      }
      if (overviewData.parentInfo?.phoneNumber) {
        formik.setFieldValue("fatherMobile", overviewData.parentInfo.phoneNumber);
      }
      
      // Orientation Information
      console.log("🔍 Orientation auto-population - Overview data:", {
        academicYearValue: overviewData.academicYearValue,
        academicYearId: overviewData.academicYearId,
        branchName: overviewData.branchName,
        branchId: overviewData.branchId,
        campusId: overviewData.campusId,
        cityName: overviewData.cityName,
        cityId: overviewData.cityId,
        joiningClassName: overviewData.joiningClassName,
        classId: overviewData.classId,
        joiningClassId: overviewData.joiningClassId,
        orientationName: overviewData.orientationName,
        orientationId: overviewData.orientationId,
        courseId: overviewData.courseId,
        studentTypeName: overviewData.studentTypeName,
        studentTypeId: overviewData.studentTypeId
      });

      if (overviewData.academicYearValue) {
        formik.setFieldValue("academicYear", overviewData.academicYearValue);
        console.log("✅ Auto-populated academicYear:", overviewData.academicYearValue);
      }
      if (overviewData.academicYearId) {
        formik.setFieldValue("academicYearId", overviewData.academicYearId);
        console.log("✅ Auto-populated academicYearId:", overviewData.academicYearId);
      }
      if (overviewData.branchName) {
        formik.setFieldValue("branchName", overviewData.branchName);
        console.log("✅ Auto-populated branchName:", overviewData.branchName);
      }
      if (overviewData.branchId || overviewData.campusId) {
        const branchId = overviewData.branchId || overviewData.campusId;
        formik.setFieldValue("branchId", branchId);
        formik.setFieldValue("campusId", branchId);
        console.log("✅ Auto-populated branchId and campusId:", branchId);
      }
      if (overviewData.cityName) {
        formik.setFieldValue("city", overviewData.cityName);
        console.log("✅ Auto-populated city:", overviewData.cityName);
      }
      if (overviewData.cityId) {
        formik.setFieldValue("cityId", overviewData.cityId);
        console.log("✅ Auto-populated cityId:", overviewData.cityId);
      }
      if (overviewData.joiningClassName) {
        formik.setFieldValue("joiningClass", overviewData.joiningClassName);
        console.log("✅ Auto-populated joiningClass:", overviewData.joiningClassName);
      }
      if (overviewData.classId || overviewData.joiningClassId) {
        const classId = overviewData.classId || overviewData.joiningClassId;
        formik.setFieldValue("classId", classId);
        formik.setFieldValue("joiningClassId", classId);
        console.log("✅ Auto-populated classId and joiningClassId:", classId);
      }
      if (overviewData.orientationName) {
        formik.setFieldValue("orientationName", overviewData.orientationName);
        console.log("✅ Auto-populated orientationName:", overviewData.orientationName);
      }
      if (overviewData.orientationId || overviewData.courseId) {
        const orientationId = overviewData.orientationId || overviewData.courseId;
        formik.setFieldValue("orientationId", orientationId);
        console.log("✅ Auto-populated orientationId:", orientationId);
      }
      if (overviewData.studentTypeName) {
        formik.setFieldValue("studentType", overviewData.studentTypeName);
        console.log("✅ Auto-populated studentType:", overviewData.studentTypeName);
      }
      if (overviewData.studentTypeId) {
        formik.setFieldValue("studentTypeId", overviewData.studentTypeId);
        console.log("✅ Auto-populated studentTypeId:", overviewData.studentTypeId);
      }
      
      // Address Information
      if (overviewData.addressDetails) {
        const addr = overviewData.addressDetails;
        if (addr.doorNo) formik.setFieldValue("doorNo", addr.doorNo);
        if (addr.street) formik.setFieldValue("streetName", addr.street);
        if (addr.landmark) formik.setFieldValue("landmark", addr.landmark);
        if (addr.area) formik.setFieldValue("area", addr.area);
        // Set pincode first (as string) to trigger API call
        if (addr.pincode) {
          const pincodeValue = String(addr.pincode).trim();
          formik.setFieldValue("pincode", pincodeValue);
          console.log("✅ Auto-populated pincode:", pincodeValue, "(this should trigger pincode API)");
        }
        if (addr.stateName) formik.setFieldValue("state", addr.stateName);
        if (addr.stateId) formik.setFieldValue("stateId", addr.stateId);
        if (addr.districtName) formik.setFieldValue("district", addr.districtName);
        if (addr.districtId) {
          formik.setFieldValue("districtId", addr.districtId);
          console.log("✅ Auto-populated districtId:", addr.districtId);
        }
        // Set mandal label and ID
        if (addr.mandalName) {
          formik.setFieldValue("mandal", addr.mandalName);
          console.log("✅ Auto-populated mandal:", addr.mandalName);
        }
        if (addr.mandalId) {
          formik.setFieldValue("mandalId", addr.mandalId);
          console.log("✅ Auto-populated mandalId:", addr.mandalId);
        }
        
        // Set city label and ID
        if (addr.cityName) {
          // Note: The field might be "city" or "cityAddress" depending on the form
          formik.setFieldValue("city", addr.cityName);
          formik.setFieldValue("cityAddress", addr.cityName);
          console.log("✅ Auto-populated city:", addr.cityName);
        }
        if (addr.cityId) {
          formik.setFieldValue("cityId", addr.cityId);
          console.log("✅ Auto-populated cityId:", addr.cityId);
        }
      }
      
      console.log("✅ Form auto-populated from overviewData");
    }
  }, [isEditMode, overviewData]);

  const handleProceedToSale = (formik) => {
    // Log all form values including IDs before submission
    console.log("📋 ===== SCHOOL SALE FORM VALUES (Before Submission) =====");
    console.log("Orientation IDs:", {
      academicYearId: formik.values.academicYearId,
      branchId: formik.values.branchId,
      campusId: formik.values.campusId,
      classId: formik.values.classId,
      joiningClassId: formik.values.joiningClassId,
      orientationId: formik.values.orientationId,
      studentTypeId: formik.values.studentTypeId,
      cityId: formik.values.cityId,
    });
    console.log("Orientation Labels:", {
      academicYear: formik.values.academicYear,
      branchName: formik.values.branchName,
      joiningClass: formik.values.joiningClass,
      orientationName: formik.values.orientationName,
      studentType: formik.values.studentType,
      city: formik.values.city,
    });
    console.log("Address IDs:", {
      stateId: formik.values.stateId,
      districtId: formik.values.districtId,
      mandalId: formik.values.mandalId,
    });
    console.log("========================================================");
    console.log("📦 Full Formik Values Object:", formik.values);
    console.log("📦 Formik Values Keys:", Object.keys(formik.values));
    
    // Store current form values (make sure we're getting the latest values)
    const currentValues = { ...formik.values };
    console.log("📦 Storing formValues:", currentValues);
    setFormValues(currentValues);
    
    // Validate form before opening popup
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setShowPaymentPopup(true);
      } else {
        // Mark all fields as touched to show errors
        formik.setTouched(
          Object.keys(formik.values).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
          )
        );
      }
    });
  };

  const handleSaleAndConform = async (formik) => {
    // Store current form values (make sure we're getting the latest values)
    const currentValues = JSON.parse(JSON.stringify(formik.values));
    setFormValues(currentValues);
    
    // Validate form before submitting
    formik.validateForm().then(async (errors) => {
      if (Object.keys(errors).length === 0) {
        try {
          console.log("📋 ===== SCHOOL SALE & CONFIRM - SUBMITTING DATA =====");
          console.log("Form Values:", currentValues);
          console.log("Application Data:", applicationData);
          
          // Map form data to payload structure
          const payload = mapSchoolApplicationSaleOnlyToPayload(
            currentValues,
            applicationData
          );
          
          console.log("📤 Submitting to: /student-admissions-sale/create/sale/only");
          console.log("📦 Payload:", JSON.stringify(payload, null, 2));
          
          // Submit to API
          const response = await submitSchoolApplicationSaleOnly(payload);
          
          console.log("✅ Success! Response:", response);
          
          // Navigate to confirmation page after successful submission
          navigate('/school-application-confirmation', {
            state: {
              applicationData: applicationData,
              formData: currentValues
            }
          });
          
        } catch (error) {
          console.error("❌ Error submitting sale & confirm:", error);
          alert("Error submitting sale & confirm. Please check console for details.");
        }
      } else {
        // Mark all fields as touched to show errors
        formik.setTouched(
          Object.keys(formik.values).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
          )
        );
      }
    });
  };

  const handleClosePayment = () => {
    setShowPaymentPopup(false);
  };

  const handleSubmissionSuccess = (response, details) => {
    console.log("🎉🎉🎉 ===== SCHOOL SALE SUBMISSION SUCCESS ===== 🎉🎉🎉");
    console.log("✅ Payment submission successful, showing success page");
    console.log("Response:", response);
    console.log("Details:", details);
    
    // Store response and close payment popup
    setSubmissionResponse(response);
    setShowPaymentPopup(false);
    
    // Show success page
    console.log("🔄 Setting showSuccessPage to TRUE");
    setShowSuccessPage(true);
  };

  const handleBackFromSuccess = () => {
    // If in edit mode, navigate back to school confirmation overview
    if (isEditMode && applicationData?.applicationNo) {
      console.log("🔙 Edit Mode Success: Navigating back to school confirmation overview");
      navigate(`/scopes/application/status/${applicationData.applicationNo}/school-confirmation`, {
        state: {
          applicationData: applicationData
        }
      });
    } else {
      // Otherwise navigate back to application status
      navigate("/scopes/application/status");
    }
  };

  // Handle back button click - navigate to overview if in edit mode, otherwise go back
  const handleBackClick = () => {
    if (isEditMode && applicationData?.applicationNo) {
      console.log("🔙 Edit Mode: Navigating back to school confirmation overview");
      // Navigate to school confirmation overview with applicationData via proper route
      navigate(`/scopes/application/status/${applicationData.applicationNo}/school-confirmation`, {
        state: {
          applicationData: applicationData
        }
      });
    } else {
      console.log("🔙 Normal Mode: Going back to previous page");
      // Normal back navigation
      navigate(-1);
    }
  };

  return (
    <>
      {!showSuccessPage ? (
        <>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              console.log("📤 School Sale Submit:", values);
              alert("School Sale Submitted!");
            }}
          >
            {(formik) => {
              // Store formik reference for auto-population
              formikRef.current = formik;
              
              return (
              <Form className={styles.clgSalePageWrapper}>
          {/* -- APPLICATION DETAILS -- */}
          <ApplicationSaleDetails 
            saleName={"Sale"}
            applicationNo={applicationData?.applicationNo}
            onBack={handleBackClick}
            onDataLoaded={(data) => {
              console.log("🏫 SchoolSale - ApplicationSaleDetails data loaded:", data);
              setApplicationDetailsData(data);
              
              // Always set IDs if they exist in the API response (for backend submission)
              if (data.academicYear) {
                console.log("✅ Setting academicYear in Formik:", data.academicYear);
                formik.setFieldValue("academicYear", data.academicYear);
              }
              if (data.academicYearId !== null && data.academicYearId !== undefined) {
                console.log("✅ Setting academicYearId in Formik (for backend):", data.academicYearId);
                formik.setFieldValue("academicYearId", data.academicYearId);
              } else {
                console.warn("⚠️ academicYearId is null/undefined - check API response");
              }
              
              if (data.campusName) {
                console.log("✅ Setting branchName in Formik:", data.campusName);
                formik.setFieldValue("branchName", data.campusName);
              }
              if (data.campusId !== null && data.campusId !== undefined) {
                console.log("✅ Setting campusId in Formik (for backend):", data.campusId);
                formik.setFieldValue("campusId", data.campusId);
              } else {
                console.warn("⚠️ campusId is null/undefined - check API response");
              }
              
              // Log studAdmsNo for update functionality
              if (data.studAdmsNo) {
                console.log("✅ studAdmsNo available for update:", data.studAdmsNo);
              }
              
              // Log final Formik values to verify IDs are stored
              console.log("📋 Formik values after setting IDs:", {
                academicYear: formik.values.academicYear,
                academicYearId: formik.values.academicYearId,
                branchName: formik.values.branchName,
                campusId: formik.values.campusId,
                studAdmsNo: data.studAdmsNo
              });
            }}
          />

          {/* -- ALL MIDDLE COMPONENTS -- */}
          <div className={styles.clgAppSaleFormMiddleSection}>
            <PersonalInformationForSchool />
            <ParentInformationForSchool />
            <OrientationInformationForSchool
              initialAcademicYear={applicationDetailsData?.academicYear}
              initialAcademicYearId={applicationDetailsData?.academicYearId}
              initialCampusName={applicationDetailsData?.campusName}
              initialCampusId={applicationDetailsData?.campusId}
              initialCityName={applicationDetailsData?.cityName}
              initialCityId={applicationDetailsData?.cityId}
            />
            <AddressInformation />
          </div>

          {/* -- BUTTONS -- */}
          <div className={styles.clgAppSaleButtons}>
            {isEditMode ? (
              <Button
                buttonname={"Update"}
                variant={"primary"}
                type="button"
                onClick={async () => {
                  try {
                    // Validate form
                    const errors = await formik.validateForm();
                    const criticalErrors = {};
                    const criticalFields = ['firstName', 'gender', 'dob', 'admissionType'];

                    // Manually check critical fields
                    const values = formik.values;
                    if (!values.firstName || values.firstName.trim() === '') {
                        criticalErrors.firstName = 'First name is required';
                    }
                    if (!values.gender || values.gender === '') {
                        criticalErrors.gender = 'Gender is required';
                    }
                    if (!values.dob || values.dob === '') {
                        criticalErrors.dob = 'Date of birth is required';
                    }
                    if (!values.admissionType || values.admissionType === '') {
                        criticalErrors.admissionType = 'Admission type is required';
                    }
                    
                    if (Object.keys(criticalErrors).length > 0) {
                      console.error("❌ Critical form validation errors:", criticalErrors);
                      console.error("📋 All validation errors:", errors);
                      const errorMessages = Object.values(criticalErrors).join('\n');
                      alert(`Please fill in the following required fields:\n\n${errorMessages}`);
                      return;
                    }
                    
                    // Log non-critical errors but don't block update
                    const nonCriticalErrors = Object.keys(errors).filter(key => !criticalFields.includes(key));
                    if (nonCriticalErrors.length > 0) {
                      console.warn("⚠️ Non-critical validation errors (will proceed with update):", 
                        nonCriticalErrors.reduce((acc, key) => {
                          acc[key] = errors[key];
                          return acc;
                        }, {})
                      );
                    }

                    // Get application number (studAdmsNo) from applicationDetailsData or applicationData
                    const studAdmsNo = applicationDetailsData?.studAdmsNo || applicationDetailsData?.appNo || applicationData?.studAdmsNo || applicationData?.applicationNo || applicationData?.application_no || applicationData?.stud_adms_no;
                    if (!studAdmsNo) {
                      console.error("❌ Application number (student admission number) is missing");
                      console.error("Cannot update without application number");
                      return;
                    }

                    const formValues = JSON.parse(JSON.stringify(formik.values));
                    const payload = mapSchoolApplicationSaleUpdateToPayload(formValues, applicationData);
                    const response = await updateSchoolApplicationSale(studAdmsNo, payload);
                    
                    console.log('✅ Update successful:', response);
                    // Navigate back to confirmation overview after successful update
                    navigate(`/scopes/application/status/${applicationData.applicationNo}/school-confirmation`, {
                      state: {
                        applicationData: applicationData
                      }
                    });
                  } catch (error) {
                    console.error('❌ Error updating application:', error);
                    // Show error in console, user can see validation errors in the form
                  }
                }}
              />
            ) : (
              <>
                <Button
                  buttonname={"Proceed to Sale"}
                  variant={"secondaryWithExtraPadding"}
                  righticon={rightArrowBlueColor}
                  type="button"
                  onClick={() => handleProceedToSale(formik)}
                />

                <Button
                  buttonname={"Sale & Conform"}
                  variant={"primary"}
                  type="button"
                  lefticon={applicationSaleicon}
                  onClick={() => handleSaleAndConform(formik)}
                />
              </>
            )}
          </div>
        </Form>
        );
      }}
    </Formik>

      {/* Payment Popup */}
      {showPaymentPopup && (
        <PaymentPopup
          onClose={handleClosePayment}
          title="Complete Application Sale & Confirmation"
          formData={formValues}
          schoolFormData={formValues}
          siblings={[]}
          detailsObject={applicationData}
          type="school"
          saleType={saleType}
          onSuccess={handleSubmissionSuccess}
        />
      )}
      {/* Debug: Log formValues when popup opens */}
      {showPaymentPopup && console.log("🔍 PaymentPopup opened with formValues:", formValues)}
        </>
      ) : (
        <SuccessPage 
          applicationNo={applicationData?.applicationNo || formValues?.applicationNo}
          studentName={formValues?.firstName + " " + formValues?.surName}
          campus={formValues?.branchName}
          zone={formValues?.zoneName}
          onBack={handleBackFromSuccess}
          statusType="sale"
        />
      )}
    </>
  );
};

export default SchoolSale;
