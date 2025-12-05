import React, { useState, useCallback, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import clgActualSaleValidationSchema from "../../components/sale-and-confirm/CollegSaleFormComponents/CollegeActualSaleValidationSchema";

import styles from "./CollegeSaleForm.module.css";

import ApplicationSaleDetails from "../../components/sale-and-confirm/CollegSaleFormComponents/ApplicationDetails/ApplicationSaleDetails";
import PersonalInformation from "../../components/sale-and-confirm/CollegSaleFormComponents/PersonalInformation/PersonalInformation";
import ParentInformation from "../../components/sale-and-confirm/CollegSaleFormComponents/ParentInformation/ParentInformation";
import OrientationInformation from "../../components/sale-and-confirm/CollegSaleFormComponents/OrientationInformation/OrientaionInformation";
import AddressInformation from "../../components/sale-and-confirm/CollegSaleFormComponents/AddressInformation/AddressInformation";
import ConcessionInformation from "../../components/sale-and-confirm/CollegSaleFormComponents/ConcessionInformation/ConcessionInformation";
import ExtraConcession from "../../components/sale-and-confirm/CollegSaleFormComponents/ExtraConcession/ExtraConcession";
import AcademicInformation from "../../components/sale-and-confirm/CollegSaleFormComponents/AcademicInformation/AcademicInformation";
import PaymentPopup from "../../widgets/PaymentPopup/whole-payment-popup/PaymentPopup.jsx";
import SuccessPage from "../../widgets/sale-done/SuccessPage.jsx";

import leftArrowBlueColor from "../../assets/application-status/leftArrowBlueColor";
import applicationSaleicon from "../../assets/application-status/applicationSaleicon";
import Button from "../../widgets/Button/Button";
import Popup from "../../widgets/Popup/Popup";
import { updateCollegeApplicationSale, mapCollegeApplicationSaleUpdateToPayload } from "../../hooks/college-apis/CollegeSubmissionApi";
import { useCollegeOverviewData } from "../../hooks/college-apis/CollegeOverviewApis";

const CollegeSalePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationData = location.state?.applicationData;
  const overviewData = location.state?.overviewData; // Get overviewData from navigation state
  const isEditMode = location.state?.isEditMode; // Check if this is edit mode
 
  // Check if this is a fast sold application (status is "fast sold" or "fastsold")
  const isFastSold = applicationData?.status &&
    (applicationData.status.toLowerCase().trim() === "fast sold" ||
     applicationData.status.toLowerCase().trim() === "fastsold" ||
     applicationData.status.toLowerCase().trim() === "fast sale" ||
     applicationData.status.toLowerCase().trim() === "fastsale");
 
  // Get application number for fast sale data fetching
  const applicationNo = applicationData?.applicationNo || applicationData?.studAdmsNo;
 
  // Fetch fast sale data if this is a fast sold application
  const { overviewData: fastSaleData, loading: fastSaleLoading } = useCollegeOverviewData(
    isFastSold && applicationNo ? applicationNo : null
  );
 
  // Use fast sale data if available, otherwise use overviewData from navigation state
  const dataToPopulate = isFastSold && fastSaleData ? fastSaleData : overviewData;
  const shouldAutoPopulate = (isEditMode && overviewData) || (isFastSold && fastSaleData);
 
  const [joiningClass, setJoiningClass] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [academicFormValues, setAcademicFormValues] = useState(null);
  const [submissionResponse, setSubmissionResponse] = useState(null);
 
  // State to store data from ApplicationSaleDetails
  const [applicationDetailsData, setApplicationDetailsData] = useState(null);
 
  // Ref to store formik instance for stable callback
  const formikRef = useRef(null);

  // All form fields initial values
  const initialValues = {
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

    // Parent Information
    fatherName: "",
    fatherMobile: "",
    fatherEmail: "",
    fatherSector: "", // Display label for father sector
    fatherSectorId: null, // Backend ID for father sector
    fatherOccupation: "", // Display label for father occupation
    fatherOccupationId: null, // Backend ID for father occupation
    fatherOther: "",
    motherName: "",
    motherMobile: "",
    motherEmail: "",
    motherSector: "",
    motherSectorId: null, // Backend ID for mother sector
    motherOccupation: "",
    motherOccupationId: null, // Backend ID for mother occupation
    motherOther: "",

    // Orientation
    academicYear: "",
    academicYearId: null, // Backend ID for academic year
    branchName: "",
    branchId: null, // Backend ID for branch (same as campusId)
    branchType: "",
    orientationName: "",
    orientationId: null, // Backend ID for orientation
    city: "",
    cityId: null, // Backend ID for city
    campusName: "",
    campusId: null, // Backend ID for campus/branch
    joiningClass: "",
    classId: null, // Backend ID for class
    joiningClassId: null, // Backend ID for joining class (same as classId)
    studentType: "",
    studentTypeId: null, // Backend ID for student type

    // Academic
    hallTicketNo: "",
    schoolState: "",
    schoolStateId: null, // Backend ID for school state
    schoolDistrict: "",
    schoolDistrictId: null, // Backend ID for school district
    schoolType: "",
    schoolTypeId: null, // Backend ID for school type
    schoolName: "",
    tenthHallTicketNo: "",
    interFirstYearHallTicketNo: "",
    interHallTicketNo: "",
    clgState: "",
    preCollegeStateId: null, // Backend ID for college state
    clgDistrict: "",
    preCollegeDistrictId: null, // Backend ID for college district
    clgType: "",
    preCollegeTypeId: null, // Backend ID for college type
    collegeName: "",
    scoreAppNo: "",
    scoreMarks: "",
    foodType: "",
    foodTypeId: null, // Backend ID for food type
    bloodGroup: "",
    bloodGroupId: null, // Backend ID for blood group
    caste: "",
    casteId: null, // Backend ID for caste
    religion: "",
    religionId: null, // Backend ID for religion

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

    // Concession
    firstYearConcession: "",
    firstYearConcessionTypeId: null, // Backend ID for "1st year" concession type
    secondYearConcession: "",
    secondYearConcessionTypeId: null, // Backend ID for "2nd year" concession type
    referredBy: "",
    referredById: null, // Backend ID for referred by employee
    description: "",
    authorizedBy: "",
    authorizedById: null, // Backend ID for authorized by employee
    concessionReason: "",
    concessionReasonId: null, // Backend ID for concession reason

    siblings: []
  };

  // API Call Function (Will replace placeholder)
  const handleSubmitAPI = async (values) => {
    console.log("📤 Final Submit API Payload:", values);

    // TODO: Replace this with your actual POST API call
    alert("API submitted successfully!");
  };

  // Handle back button click - navigate to overview if in edit mode, otherwise go back
  const handleBackClick = () => {
    if (isEditMode && applicationData?.applicationNo) {
      console.log("🔙 Edit Mode: Navigating back to college confirmation overview");
      // Navigate to college confirmation overview with applicationData via proper route
      navigate(`/scopes/application/status/${applicationData.applicationNo}/college-confirmation`, {
        state: {
          applicationData: applicationData
        }
      });
    } else {
      console.log("🔙 Normal Mode: Going back to previous page");
      navigate(-1);
    }
  };

  const handleSubmissionSuccess = (response, details) => {
    console.log("🎉 College Sale submission successful!");
    console.log("Response:", response);
    console.log("Details:", details);
   
    // Store response
    setSubmissionResponse(response);
   
    // Close payment popup
    setShowPaymentPopup(false);
   
    // Show success page
    setShowSuccessPage(true);
  };

  const handleBackFromSuccess = () => {
    // Navigate back to application status table from success page
    navigate('/scopes/application/status');
  };

  // Auto-populate form fields when in edit mode or fast sold status
  useEffect(() => {
    // Don't auto-populate if fast sale data is still loading
    if (isFastSold && fastSaleLoading) {
      console.log("⏳ Fast sale data is loading, waiting...");
      return;
    }
   
    // Use a small delay to ensure Formik is initialized
    const timer = setTimeout(() => {
      if (!formikRef.current) {
        console.log("⏳ Formik not yet initialized, skipping auto-population");
        return;
      }

      if (shouldAutoPopulate && dataToPopulate) {
        const sourceData = dataToPopulate;
        const sourceType = isFastSold ? "Fast Sale" : "Edit Mode";
        console.log(`✏️ ${sourceType}: Auto-populating college form from ${isFastSold ? 'fast sale' : 'overview'} data`);
        const formik = formikRef.current;
        console.log(`📦 ${sourceType} Data:`, sourceData);
        console.log(`📦 ${sourceType} Data Keys:`, Object.keys(sourceData));
      console.log("📦 Parent Information:", {
        fatherName: sourceData.fatherName,
        fatherMobile: sourceData.fatherMobile,
        fatherEmail: sourceData.fatherEmail,
        fatherSectorName: sourceData.fatherSectorName,
        fatherSectorId: sourceData.fatherSectorId,
        fatherOccupationName: sourceData.fatherOccupationName,
        fatherOccupationId: sourceData.fatherOccupationId,
        motherName: sourceData.motherName,
        motherMobile: sourceData.motherMobile,
        motherEmail: sourceData.motherEmail,
        motherSectorName: sourceData.motherSectorName,
        motherSectorId: sourceData.motherSectorId,
        motherOccupationName: sourceData.motherOccupationName,
        motherOccupationId: sourceData.motherOccupationId,
      });
     
      // Personal Information
      if (sourceData.firstName) {
        formik.setFieldValue("firstName", sourceData.firstName);
      }
      if (sourceData.lastName) {
        formik.setFieldValue("surName", sourceData.lastName);
      }
     
      // Gender - normalize to "MALE" or "FEMALE"
      const genderValue = sourceData.genderName || sourceData.gender || sourceData.gender_name;
      if (genderValue) {
        const genderUpper = String(genderValue).toUpperCase().trim();
        let normalizedGender = "";
        if (genderUpper === "MALE" || genderUpper === "M" || genderUpper.includes("MALE")) {
          normalizedGender = "MALE";
          formik.setFieldValue("genderId", 1);
        } else if (genderUpper === "FEMALE" || genderUpper === "F" || genderUpper.includes("FEMALE")) {
          normalizedGender = "FEMALE";
          formik.setFieldValue("genderId", 2);
        }
        if (normalizedGender) {
          formik.setFieldValue("gender", normalizedGender);
        }
      }
     
      // APAAR No
      const apaarValue = sourceData.apaarNo || sourceData.aaparNo || sourceData.apaar_no || sourceData.aapar_no;
      if (apaarValue) {
        formik.setFieldValue("aaparNo", String(apaarValue));
      }
     
      // Date of Birth - convert to YYYY-MM-DD format
      const dobValue = sourceData.dob || sourceData.dateOfBirth || sourceData.date_of_birth;
      if (dobValue) {
        let dobFormatted = "";
        if (dobValue instanceof Date) {
          dobFormatted = dobValue.toISOString().split('T')[0];
        } else if (typeof dobValue === 'string') {
          const dateObj = new Date(dobValue);
          if (!isNaN(dateObj.getTime())) {
            dobFormatted = dateObj.toISOString().split('T')[0];
          }
        }
        if (dobFormatted) {
          formik.setFieldValue("dob", dobFormatted);
        }
      }
     
      // Aadhar Card No
      const aadharValue = sourceData.aadharNo || sourceData.aadharCardNo || sourceData.aadharCard || sourceData.aadhar_card_no || sourceData.aadhar;
      if (aadharValue) {
        formik.setFieldValue("aadharCardNo", String(aadharValue));
      }
     
      // Quota/Admission Referred By
      const quotaValue = sourceData.quotaName || sourceData.quotaAdmissionReferredBy || sourceData.admissionReferredByName || sourceData.quota_name;
      if (quotaValue) {
        formik.setFieldValue("quotaAdmissionReferredBy", quotaValue);
      }
      if (sourceData.quotaId || sourceData.quota_id) {
        formik.setFieldValue("quotaId", sourceData.quotaId || sourceData.quota_id);
      }
     
      // Admission Type
      const admissionTypeValue = sourceData.admissionType || sourceData.admissionTypeName || sourceData.admission_type_name;
      if (admissionTypeValue) {
        formik.setFieldValue("admissionType", admissionTypeValue);
      }
      if (sourceData.appTypeId || sourceData.admissionTypeId || sourceData.admission_type_id || sourceData.app_type_id) {
        formik.setFieldValue("appTypeId", sourceData.appTypeId || sourceData.admissionTypeId || sourceData.admission_type_id || sourceData.app_type_id);
      }
     
      // Parent Information - Father
      const fatherNameValue = sourceData.fatherName || sourceData.father_name;
      if (fatherNameValue) {
        formik.setFieldValue("fatherName", fatherNameValue);
        console.log("✅ Auto-populated fatherName:", fatherNameValue);
      }
     
      const fatherMobileValue = sourceData.fatherMobile || sourceData.fatherMobileNo || sourceData.father_mobile || sourceData.father_mobile_no;
      if (fatherMobileValue) {
        formik.setFieldValue("fatherMobile", String(fatherMobileValue));
        console.log("✅ Auto-populated fatherMobile:", fatherMobileValue);
      }
     
      const fatherEmailValue = sourceData.fatherEmail || sourceData.father_email;
      if (fatherEmailValue) {
        formik.setFieldValue("fatherEmail", fatherEmailValue);
        console.log("✅ Auto-populated fatherEmail:", fatherEmailValue);
      }
     
      const fatherSectorNameValue = sourceData.fatherSectorName || sourceData.fatherSector || sourceData.father_sector_name || sourceData.father_sector;
      if (fatherSectorNameValue) {
        formik.setFieldValue("fatherSector", fatherSectorNameValue);
        console.log("✅ Auto-populated fatherSector:", fatherSectorNameValue);
      }
     
      const fatherSectorIdValue = sourceData.fatherSectorId || sourceData.father_sector_id;
      if (fatherSectorIdValue) {
        formik.setFieldValue("fatherSectorId", fatherSectorIdValue);
        console.log("✅ Auto-populated fatherSectorId:", fatherSectorIdValue);
      }
     
      const fatherOccupationNameValue = sourceData.fatherOccupationName || sourceData.fatherOccupation || sourceData.father_occupation_name || sourceData.father_occupation;
      if (fatherOccupationNameValue) {
        formik.setFieldValue("fatherOccupation", fatherOccupationNameValue);
        console.log("✅ Auto-populated fatherOccupation:", fatherOccupationNameValue);
      }
     
      const fatherOccupationIdValue = sourceData.fatherOccupationId || sourceData.father_occupation_id;
      if (fatherOccupationIdValue) {
        formik.setFieldValue("fatherOccupationId", fatherOccupationIdValue);
        console.log("✅ Auto-populated fatherOccupationId:", fatherOccupationIdValue);
      }
     
      const fatherOtherValue = sourceData.fatherOther || sourceData.father_other;
      if (fatherOtherValue) {
        formik.setFieldValue("fatherOther", fatherOtherValue);
        console.log("✅ Auto-populated fatherOther:", fatherOtherValue);
      }
     
      // Parent Information - Mother
      const motherNameValue = sourceData.motherName || sourceData.mother_name;
      if (motherNameValue) {
        formik.setFieldValue("motherName", motherNameValue);
        console.log("✅ Auto-populated motherName:", motherNameValue);
      }
     
      const motherMobileValue = sourceData.motherMobile || sourceData.motherMobileNo || sourceData.mother_mobile || sourceData.mother_mobile_no;
      if (motherMobileValue) {
        formik.setFieldValue("motherMobile", String(motherMobileValue));
        console.log("✅ Auto-populated motherMobile:", motherMobileValue);
      }
     
      const motherEmailValue = sourceData.motherEmail || sourceData.mother_email;
      if (motherEmailValue) {
        formik.setFieldValue("motherEmail", motherEmailValue);
        console.log("✅ Auto-populated motherEmail:", motherEmailValue);
      }
     
      const motherSectorNameValue = sourceData.motherSectorName || sourceData.motherSector || sourceData.mother_sector_name || sourceData.mother_sector;
      if (motherSectorNameValue) {
        formik.setFieldValue("motherSector", motherSectorNameValue);
        console.log("✅ Auto-populated motherSector:", motherSectorNameValue);
      }
     
      const motherSectorIdValue = sourceData.motherSectorId || sourceData.mother_sector_id;
      if (motherSectorIdValue) {
        formik.setFieldValue("motherSectorId", motherSectorIdValue);
        console.log("✅ Auto-populated motherSectorId:", motherSectorIdValue);
      }
     
      const motherOccupationNameValue = sourceData.motherOccupationName || sourceData.motherOccupation || sourceData.mother_occupation_name || sourceData.mother_occupation;
      if (motherOccupationNameValue) {
        formik.setFieldValue("motherOccupation", motherOccupationNameValue);
        console.log("✅ Auto-populated motherOccupation:", motherOccupationNameValue);
      }
     
      const motherOccupationIdValue = sourceData.motherOccupationId || sourceData.mother_occupation_id;
      if (motherOccupationIdValue) {
        formik.setFieldValue("motherOccupationId", motherOccupationIdValue);
        console.log("✅ Auto-populated motherOccupationId:", motherOccupationIdValue);
      }
     
      const motherOtherValue = sourceData.motherOther || sourceData.mother_other;
      if (motherOtherValue) {
        formik.setFieldValue("motherOther", motherOtherValue);
        console.log("✅ Auto-populated motherOther:", motherOtherValue);
      }
     
      // IMPORTANT: Ensure all Parent IDs are set even if they come from sourceData directly
      // This ensures IDs are available for backend submission
      // Note: The ParentInformation component will also sync IDs from labels if needed
      console.log("🔑 Final Parent IDs in Formik after auto-population:", {
        fatherSectorId: formik.values.fatherSectorId,
        fatherOccupationId: formik.values.fatherOccupationId,
        motherSectorId: formik.values.motherSectorId,
        motherOccupationId: formik.values.motherOccupationId,
      });
     
      console.log("⚠️ NOTE: ParentInformation component will sync IDs from labels if IDs are missing after API data loads");
     
      // Orientation Information
      console.log("📦 Orientation Information:", {
        academicYearName: sourceData.academicYearName,
        academicYearValue: sourceData.academicYearValue,
        academicYearId: sourceData.academicYearId,
        cityName: sourceData.cityName,
        cityId: sourceData.cityId,
        branchName: sourceData.branchName,
        campusName: sourceData.campusName,
        branchId: sourceData.branchId,
        campusId: sourceData.campusId,
        className: sourceData.className,
        joiningClassName: sourceData.joiningClassName,
        classId: sourceData.classId,
        joiningClassId: sourceData.joiningClassId,
        orientationName: sourceData.orientationName,
        orientationId: sourceData.orientationId,
        courseId: sourceData.courseId,
        studentTypeName: sourceData.studentTypeName,
        studentTypeId: sourceData.studentTypeId,
        orientationStartDate: sourceData.orientationStartDate,
        orientationEndDate: sourceData.orientationEndDate,
        orientationFee: sourceData.orientationFee,
        courseStartDate: sourceData.courseStartDate,
        courseEndDate: sourceData.courseEndDate,
        courseFee: sourceData.courseFee,
      });
     
      // Academic Year
      const academicYearValue = sourceData.academicYearName || sourceData.academicYearValue || sourceData.academicYear || sourceData.academic_year_name || sourceData.academic_year_value;
      if (academicYearValue) {
        formik.setFieldValue("academicYear", academicYearValue);
        console.log("✅ Auto-populated academicYear:", academicYearValue);
      }
      const academicYearIdValue = sourceData.academicYearId || sourceData.academic_year_id;
      if (academicYearIdValue) {
        formik.setFieldValue("academicYearId", academicYearIdValue);
        console.log("✅ Auto-populated academicYearId:", academicYearIdValue);
      }
     
      // City
      const cityNameValue = sourceData.cityName || sourceData.city_name;
      if (cityNameValue) {
        formik.setFieldValue("city", cityNameValue);
        console.log("✅ Auto-populated city:", cityNameValue);
      }
      const cityIdValue = sourceData.cityId || sourceData.city_id;
      if (cityIdValue) {
        formik.setFieldValue("cityId", cityIdValue);
        console.log("✅ Auto-populated cityId:", cityIdValue);
      }
     
      // Branch/Campus Name
      const branchNameValue = sourceData.branchName || sourceData.campusName || sourceData.branch_name || sourceData.campus_name;
      if (branchNameValue) {
        formik.setFieldValue("branchName", branchNameValue);
        formik.setFieldValue("campusName", branchNameValue);
        console.log("✅ Auto-populated branchName/campusName:", branchNameValue);
      }
      const branchIdValue = sourceData.branchId || sourceData.campusId || sourceData.branch_id || sourceData.campus_id;
      if (branchIdValue) {
        formik.setFieldValue("branchId", branchIdValue);
        formik.setFieldValue("campusId", branchIdValue);
        console.log("✅ Auto-populated branchId/campusId:", branchIdValue);
      }
     
      // Joining Class
      const joiningClassNameValue = sourceData.className || sourceData.joiningClassName || sourceData.class_name || sourceData.joining_class_name;
      if (joiningClassNameValue) {
        formik.setFieldValue("joiningClass", joiningClassNameValue);
        console.log("✅ Auto-populated joiningClass:", joiningClassNameValue);
      }
      const classIdValue = sourceData.classId || sourceData.joiningClassId || sourceData.class_id || sourceData.joining_class_id;
      if (classIdValue) {
        formik.setFieldValue("classId", classIdValue);
        formik.setFieldValue("joiningClassId", classIdValue);
        console.log("✅ Auto-populated classId/joiningClassId:", classIdValue);
      }
     
      // Orientation/Course Name
      const orientationNameValue = sourceData.orientationName || sourceData.courseName || sourceData.orientation_name || sourceData.course_name;
      if (orientationNameValue) {
        formik.setFieldValue("orientationName", orientationNameValue);
        console.log("✅ Auto-populated orientationName:", orientationNameValue);
      }
      const orientationIdValue = sourceData.orientationId || sourceData.courseId || sourceData.orientation_id || sourceData.course_id;
      if (orientationIdValue) {
        formik.setFieldValue("orientationId", orientationIdValue);
        console.log("✅ Auto-populated orientationId:", orientationIdValue);
      }
     
      // Student Type
      const studentTypeNameValue = sourceData.studentTypeName || sourceData.studentType || sourceData.student_type_name || sourceData.student_type;
      if (studentTypeNameValue) {
        formik.setFieldValue("studentType", studentTypeNameValue);
        console.log("✅ Auto-populated studentType:", studentTypeNameValue);
      }
      const studentTypeIdValue = sourceData.studentTypeId || sourceData.student_type_id;
      if (studentTypeIdValue) {
        formik.setFieldValue("studentTypeId", studentTypeIdValue);
        console.log("✅ Auto-populated studentTypeId:", studentTypeIdValue);
      }
     
      // Course Start Date
      const courseStartDateValue = sourceData.orientationStartDate || sourceData.courseStartDate || sourceData.orientation_start_date || sourceData.course_start_date;
      if (courseStartDateValue) {
        // Convert to YYYY-MM-DD format if it's a date string
        let formattedStartDate = courseStartDateValue;
        if (courseStartDateValue instanceof Date) {
          formattedStartDate = courseStartDateValue.toISOString().split('T')[0];
        } else if (typeof courseStartDateValue === 'string') {
          // Try to parse and format the date
          const dateObj = new Date(courseStartDateValue);
          if (!isNaN(dateObj.getTime())) {
            formattedStartDate = dateObj.toISOString().split('T')[0];
          }
        }
        formik.setFieldValue("orientationStartDate", formattedStartDate);
        console.log("✅ Auto-populated orientationStartDate:", formattedStartDate);
      }
     
      // Course End Date
      const courseEndDateValue = sourceData.orientationEndDate || sourceData.courseEndDate || sourceData.orientation_end_date || sourceData.course_end_date;
      if (courseEndDateValue) {
        // Convert to YYYY-MM-DD format if it's a date string
        let formattedEndDate = courseEndDateValue;
        if (courseEndDateValue instanceof Date) {
          formattedEndDate = courseEndDateValue.toISOString().split('T')[0];
        } else if (typeof courseEndDateValue === 'string') {
          // Try to parse and format the date
          const dateObj = new Date(courseEndDateValue);
          if (!isNaN(dateObj.getTime())) {
            formattedEndDate = dateObj.toISOString().split('T')[0];
          }
        }
        formik.setFieldValue("orientationEndDate", formattedEndDate);
        console.log("✅ Auto-populated orientationEndDate:", formattedEndDate);
      }
     
      // Course Fee
      const courseFeeValue = sourceData.orientationFee || sourceData.courseFee || sourceData.orientation_fee || sourceData.course_fee;
      if (courseFeeValue !== undefined && courseFeeValue !== null && courseFeeValue !== '') {
        formik.setFieldValue("orientationFee", String(courseFeeValue));
        console.log("✅ Auto-populated orientationFee:", courseFeeValue);
      }
     
      // Academic Information
      console.log("📦 Academic Information:", {
        hallTicketNo: sourceData.hallTicketNo,
        tenthHallTicketNo: sourceData.tenthHallTicketNo,
        interFirstYearHallTicketNo: sourceData.interFirstYearHallTicketNo,
        interHallTicketNo: sourceData.interHallTicketNo,
        preHallTicketNo: sourceData.preHallTicketNo,
        schoolStateName: sourceData.schoolStateName,
        preSchoolStateName: sourceData.preSchoolStateName,
        schoolStateId: sourceData.schoolStateId,
        schoolDistrictName: sourceData.schoolDistrictName,
        preSchoolDistrictName: sourceData.preSchoolDistrictName,
        schoolDistrictId: sourceData.schoolDistrictId,
        schoolTypeName: sourceData.schoolTypeName,
        schoolTypeId: sourceData.schoolTypeId,
        schoolName: sourceData.schoolName,
        preSchoolName: sourceData.preSchoolName,
        scoreAppNo: sourceData.scoreAppNo,
        studAdmsNo: sourceData.studAdmsNo,
        scoreMarks: sourceData.scoreMarks,
        preCollegeStateName: sourceData.preCollegeStateName,
        preCollegeStateId: sourceData.preCollegeStateId,
        preCollegeDistrictName: sourceData.preCollegeDistrictName,
        preCollegeDistrictId: sourceData.preCollegeDistrictId,
        preCollegeTypeName: sourceData.preCollegeTypeName,
        preCollegeTypeId: sourceData.preCollegeTypeId,
        collegeName: sourceData.collegeName,
        foodTypeName: sourceData.foodTypeName,
        foodTypeId: sourceData.foodTypeId,
        bloodGroupName: sourceData.bloodGroupName,
        bloodGroupId: sourceData.bloodGroupId,
        casteName: sourceData.casteName,
        casteId: sourceData.casteId,
        religionName: sourceData.religionName,
        religionId: sourceData.religionId,
      });
     
      // Hall Ticket Number (for INTER1)
      const hallTicketNoValue = sourceData.hallTicketNo || sourceData.hall_ticket_no || sourceData.htNo || sourceData.ht_no || sourceData.preHallTicketNo || sourceData.pre_hall_ticket_no;
      if (hallTicketNoValue) {
        formik.setFieldValue("hallTicketNo", String(hallTicketNoValue));
        console.log("✅ Auto-populated hallTicketNo:", hallTicketNoValue);
      }
     
      // 10th Hall Ticket No (for INTER2)
      const tenthHallTicketNoValue = sourceData.tenthHallTicketNo || sourceData.tenth_hall_ticket_no || sourceData.tenthHallTicket || sourceData.tenth_hall_ticket;
      if (tenthHallTicketNoValue) {
        formik.setFieldValue("tenthHallTicketNo", String(tenthHallTicketNoValue));
        console.log("✅ Auto-populated tenthHallTicketNo:", tenthHallTicketNoValue);
      }
     
      // Inter 1st Year Hall Ticket No (for INTER2)
      const interFirstYearHallTicketNoValue = sourceData.interFirstYearHallTicketNo || sourceData.inter_first_year_hall_ticket_no || sourceData.inter1stYearHallTicketNo || sourceData.inter_1st_year_hall_ticket_no;
      if (interFirstYearHallTicketNoValue) {
        formik.setFieldValue("interFirstYearHallTicketNo", String(interFirstYearHallTicketNoValue));
        console.log("✅ Auto-populated interFirstYearHallTicketNo:", interFirstYearHallTicketNoValue);
      }
     
      // Inter Hall Ticket No (for LONG_TERM/SHORT_TERM)
      const interHallTicketNoValue = sourceData.interHallTicketNo || sourceData.inter_hall_ticket_no || sourceData.interHallTicket || sourceData.inter_hall_ticket;
      if (interHallTicketNoValue) {
        formik.setFieldValue("interHallTicketNo", String(interHallTicketNoValue));
        console.log("✅ Auto-populated interHallTicketNo:", interHallTicketNoValue);
      }
     
      // Score App No
      const scoreAppNoValue = sourceData.scoreAppNo || sourceData.studAdmsNo || sourceData.score_app_no || sourceData.stud_adms_no;
      if (scoreAppNoValue) {
        formik.setFieldValue("scoreAppNo", String(scoreAppNoValue));
        console.log("✅ Auto-populated scoreAppNo:", scoreAppNoValue);
      }
     
      // Score Marks
      const scoreMarksValue = sourceData.scoreMarks || sourceData.score_marks || sourceData.marks;
      if (scoreMarksValue !== undefined && scoreMarksValue !== null) {
        formik.setFieldValue("scoreMarks", Number(scoreMarksValue));
        console.log("✅ Auto-populated scoreMarks:", scoreMarksValue);
      }
     
      // School State
      const schoolStateNameValue = sourceData.schoolStateName || sourceData.preSchoolStateName || sourceData.schoolState || sourceData.preSchoolState || sourceData.school_state_name || sourceData.pre_school_state_name || sourceData.school_state || sourceData.pre_school_state;
      if (schoolStateNameValue) {
        formik.setFieldValue("schoolState", schoolStateNameValue);
        console.log("✅ Auto-populated schoolState:", schoolStateNameValue);
      }
      const schoolStateIdValue = sourceData.schoolStateId || sourceData.preSchoolStateId || sourceData.school_state_id || sourceData.pre_school_state_id;
      if (schoolStateIdValue) {
        formik.setFieldValue("schoolStateId", schoolStateIdValue);
        console.log("✅ Auto-populated schoolStateId:", schoolStateIdValue);
      }
     
      // School District
      const schoolDistrictNameValue = sourceData.schoolDistrictName || sourceData.preSchoolDistrictName || sourceData.schoolDistrict || sourceData.preSchoolDistrict || sourceData.school_district_name || sourceData.pre_school_district_name || sourceData.school_district || sourceData.pre_school_district;
      if (schoolDistrictNameValue) {
        formik.setFieldValue("schoolDistrict", schoolDistrictNameValue);
        console.log("✅ Auto-populated schoolDistrict:", schoolDistrictNameValue);
      }
      const schoolDistrictIdValue = sourceData.schoolDistrictId || sourceData.preSchoolDistrictId || sourceData.school_district_id || sourceData.pre_school_district_id;
      if (schoolDistrictIdValue) {
        formik.setFieldValue("schoolDistrictId", schoolDistrictIdValue);
        console.log("✅ Auto-populated schoolDistrictId:", schoolDistrictIdValue);
      }
     
      // School Type
      const schoolTypeNameValue = sourceData.schoolTypeName || sourceData.preSchoolTypeName || sourceData.schoolType || sourceData.preSchoolType || sourceData.school_type_name || sourceData.pre_school_type_name || sourceData.school_type || sourceData.pre_school_type;
      if (schoolTypeNameValue) {
        formik.setFieldValue("schoolType", schoolTypeNameValue);
        console.log("✅ Auto-populated schoolType:", schoolTypeNameValue);
      }
      const schoolTypeIdValue = sourceData.schoolTypeId || sourceData.preSchoolTypeId || sourceData.school_type_id || sourceData.pre_school_type_id;
      if (schoolTypeIdValue) {
        formik.setFieldValue("schoolTypeId", schoolTypeIdValue);
        console.log("✅ Auto-populated schoolTypeId:", schoolTypeIdValue);
      }
     
      // School Name
      const schoolNameValue = sourceData.schoolName || sourceData.preSchoolName || sourceData.school_name || sourceData.pre_school_name;
      if (schoolNameValue) {
        formik.setFieldValue("schoolName", schoolNameValue);
        console.log("✅ Auto-populated schoolName:", schoolNameValue);
      }
     
      // Pre-College State
      const preCollegeStateNameValue = sourceData.preCollegeStateName || sourceData.preCollegeState || sourceData.pre_college_state_name || sourceData.pre_college_state;
      if (preCollegeStateNameValue) {
        formik.setFieldValue("clgState", preCollegeStateNameValue);
        console.log("✅ Auto-populated clgState:", preCollegeStateNameValue);
      }
      const preCollegeStateIdValue = sourceData.preCollegeStateId || sourceData.pre_college_state_id;
      if (preCollegeStateIdValue) {
        formik.setFieldValue("preCollegeStateId", preCollegeStateIdValue);
        console.log("✅ Auto-populated preCollegeStateId:", preCollegeStateIdValue);
      }
     
      // Pre-College District
      const preCollegeDistrictNameValue = sourceData.preCollegeDistrictName || sourceData.preCollegeDistrict || sourceData.pre_college_district_name || sourceData.pre_college_district;
      if (preCollegeDistrictNameValue) {
        formik.setFieldValue("clgDistrict", preCollegeDistrictNameValue);
        console.log("✅ Auto-populated clgDistrict:", preCollegeDistrictNameValue);
      }
      const preCollegeDistrictIdValue = sourceData.preCollegeDistrictId || sourceData.pre_college_district_id;
      if (preCollegeDistrictIdValue) {
        formik.setFieldValue("preCollegeDistrictId", preCollegeDistrictIdValue);
        console.log("✅ Auto-populated preCollegeDistrictId:", preCollegeDistrictIdValue);
      }
     
      // Pre-College Type
      const preCollegeTypeNameValue = sourceData.preCollegeTypeName || sourceData.preCollegeType || sourceData.pre_college_type_name || sourceData.pre_college_type;
      if (preCollegeTypeNameValue) {
        formik.setFieldValue("clgType", preCollegeTypeNameValue);
        console.log("✅ Auto-populated clgType:", preCollegeTypeNameValue);
      }
      const preCollegeTypeIdValue = sourceData.preCollegeTypeId || sourceData.pre_college_type_id;
      if (preCollegeTypeIdValue) {
        formik.setFieldValue("preCollegeTypeId", preCollegeTypeIdValue);
        console.log("✅ Auto-populated preCollegeTypeId:", preCollegeTypeIdValue);
      }
     
      // College Name
      const collegeNameValue = sourceData.collegeName || sourceData.college_name || sourceData.preCollegeName || sourceData.pre_college_name;
      if (collegeNameValue) {
        formik.setFieldValue("collegeName", collegeNameValue);
        console.log("✅ Auto-populated collegeName:", collegeNameValue);
      }
     
      // Food Type
      const foodTypeNameValue = sourceData.foodTypeName || sourceData.foodType || sourceData.food_type_name || sourceData.food_type;
      if (foodTypeNameValue) {
        formik.setFieldValue("foodType", foodTypeNameValue);
        console.log("✅ Auto-populated foodType:", foodTypeNameValue);
      }
      const foodTypeIdValue = sourceData.foodTypeId || sourceData.food_type_id;
      if (foodTypeIdValue) {
        formik.setFieldValue("foodTypeId", foodTypeIdValue);
        console.log("✅ Auto-populated foodTypeId:", foodTypeIdValue);
      }
     
      // Blood Group
      const bloodGroupNameValue = sourceData.bloodGroupName || sourceData.bloodGroup || sourceData.blood_group_name || sourceData.blood_group;
      if (bloodGroupNameValue) {
        formik.setFieldValue("bloodGroup", bloodGroupNameValue);
        console.log("✅ Auto-populated bloodGroup:", bloodGroupNameValue);
      }
      const bloodGroupIdValue = sourceData.bloodGroupId || sourceData.blood_group_id;
      if (bloodGroupIdValue) {
        formik.setFieldValue("bloodGroupId", bloodGroupIdValue);
        console.log("✅ Auto-populated bloodGroupId:", bloodGroupIdValue);
      }
     
      // Caste
      const casteNameValue = sourceData.casteName || sourceData.caste || sourceData.caste_name;
      if (casteNameValue) {
        formik.setFieldValue("caste", casteNameValue);
        console.log("✅ Auto-populated caste:", casteNameValue);
      }
      const casteIdValue = sourceData.casteId || sourceData.caste_id;
      if (casteIdValue) {
        formik.setFieldValue("casteId", casteIdValue);
        console.log("✅ Auto-populated casteId:", casteIdValue);
      }
     
      // Religion
      const religionNameValue = sourceData.religionName || sourceData.religion || sourceData.religion_name;
      if (religionNameValue) {
        formik.setFieldValue("religion", religionNameValue);
        console.log("✅ Auto-populated religion:", religionNameValue);
      }
      const religionIdValue = sourceData.religionId || sourceData.religion_id;
      if (religionIdValue) {
        formik.setFieldValue("religionId", religionIdValue);
        console.log("✅ Auto-populated religionId:", religionIdValue);
      }
     
      // Address Information
      console.log("📦 Address Information:", sourceData.addressDetails);
     
      if (sourceData.addressDetails) {
        const addr = sourceData.addressDetails;
       
        // Door No
        const doorNoValue = addr.doorNo || addr.door_no;
        if (doorNoValue) {
          formik.setFieldValue("doorNo", String(doorNoValue));
          console.log("✅ Auto-populated doorNo:", doorNoValue);
        }
       
        // Street
        const streetValue = addr.street || addr.streetName || addr.street_name;
        if (streetValue) {
          formik.setFieldValue("streetName", streetValue);
          console.log("✅ Auto-populated streetName:", streetValue);
        }
       
        // Landmark
        const landmarkValue = addr.landmark || addr.land_mark;
        if (landmarkValue) {
          formik.setFieldValue("landmark", landmarkValue);
          console.log("✅ Auto-populated landmark:", landmarkValue);
        }
       
        // Area
        const areaValue = addr.area;
        if (areaValue) {
          formik.setFieldValue("area", String(areaValue));
          console.log("✅ Auto-populated area:", areaValue);
        }
       
        // Pincode
        const pincodeValue = addr.pincode || addr.pin_code;
        if (pincodeValue) {
          const pincodeStr = String(pincodeValue).trim();
          formik.setFieldValue("pincode", pincodeStr);
          console.log("✅ Auto-populated pincode:", pincodeStr);
        }
       
        // State
        const stateNameValue = addr.stateName || addr.state || addr.state_name;
        if (stateNameValue) {
          formik.setFieldValue("state", stateNameValue);
          console.log("✅ Auto-populated state:", stateNameValue);
        }
        const stateIdValue = addr.stateId || addr.state_id;
        if (stateIdValue) {
          formik.setFieldValue("stateId", stateIdValue);
          console.log("✅ Auto-populated stateId:", stateIdValue);
        }
       
        // District
        const districtNameValue = addr.districtName || addr.district || addr.district_name;
        if (districtNameValue) {
          formik.setFieldValue("district", districtNameValue);
          console.log("✅ Auto-populated district:", districtNameValue);
        }
        const districtIdValue = addr.districtId || addr.district_id;
        if (districtIdValue) {
          formik.setFieldValue("districtId", districtIdValue);
          console.log("✅ Auto-populated districtId:", districtIdValue);
        }
       
        // Mandal
        const mandalNameValue = addr.mandalName || addr.mandal || addr.mandal_name;
        if (mandalNameValue) {
          formik.setFieldValue("mandal", mandalNameValue);
          console.log("✅ Auto-populated mandal:", mandalNameValue);
        }
        const mandalIdValue = addr.mandalId || addr.mandal_id;
        if (mandalIdValue) {
          formik.setFieldValue("mandalId", mandalIdValue);
          console.log("✅ Auto-populated mandalId:", mandalIdValue);
        }
       
        // City
        const cityNameValue = addr.cityName || addr.city || addr.city_name;
        if (cityNameValue) {
          formik.setFieldValue("cityAddress", cityNameValue);
          formik.setFieldValue("city", cityNameValue);
          console.log("✅ Auto-populated city/cityAddress:", cityNameValue);
        }
        const cityIdValue = addr.cityId || addr.city_id;
        if (cityIdValue) {
          formik.setFieldValue("cityId", cityIdValue);
          console.log("✅ Auto-populated cityId:", cityIdValue);
        }
       
        // G-pin (Latitude & Longitude)
        const gpinValue = addr.gpin || addr.gPin || addr.g_pin || addr.latitude || addr.longitude || addr.lat || addr.lng;
        if (gpinValue) {
          formik.setFieldValue("gpin", String(gpinValue));
          console.log("✅ Auto-populated gpin:", gpinValue);
        }
      }
     
      // Also check if address fields are at root level (not nested in addressDetails)
      if (sourceData.doorNo || sourceData.door_no) {
        formik.setFieldValue("doorNo", String(sourceData.doorNo || sourceData.door_no));
        console.log("✅ Auto-populated doorNo (root level):", sourceData.doorNo || sourceData.door_no);
      }
      if (sourceData.streetName || sourceData.street || sourceData.street_name) {
        formik.setFieldValue("streetName", sourceData.streetName || sourceData.street || sourceData.street_name);
        console.log("✅ Auto-populated streetName (root level):", sourceData.streetName || sourceData.street || sourceData.street_name);
      }
      if (sourceData.landmark || sourceData.land_mark) {
        formik.setFieldValue("landmark", sourceData.landmark || sourceData.land_mark);
        console.log("✅ Auto-populated landmark (root level):", sourceData.landmark || sourceData.land_mark);
      }
      if (sourceData.area) {
        formik.setFieldValue("area", String(sourceData.area));
        console.log("✅ Auto-populated area (root level):", sourceData.area);
      }
      if (sourceData.pincode || sourceData.pin_code) {
        const pincodeStr = String(sourceData.pincode || sourceData.pin_code).trim();
        formik.setFieldValue("pincode", pincodeStr);
        console.log("✅ Auto-populated pincode (root level):", pincodeStr);
      }
      if (sourceData.stateName || sourceData.state || sourceData.state_name) {
        formik.setFieldValue("state", sourceData.stateName || sourceData.state || sourceData.state_name);
        console.log("✅ Auto-populated state (root level):", sourceData.stateName || sourceData.state || sourceData.state_name);
      }
      if (sourceData.stateId || sourceData.state_id) {
        formik.setFieldValue("stateId", sourceData.stateId || sourceData.state_id);
        console.log("✅ Auto-populated stateId (root level):", sourceData.stateId || sourceData.state_id);
      }
      if (sourceData.districtName || sourceData.district || sourceData.district_name) {
        formik.setFieldValue("district", sourceData.districtName || sourceData.district || sourceData.district_name);
        console.log("✅ Auto-populated district (root level):", sourceData.districtName || sourceData.district || sourceData.district_name);
      }
      if (sourceData.districtId || sourceData.district_id) {
        formik.setFieldValue("districtId", sourceData.districtId || sourceData.district_id);
        console.log("✅ Auto-populated districtId (root level):", sourceData.districtId || sourceData.district_id);
      }
      if (sourceData.mandalName || sourceData.mandal || sourceData.mandal_name) {
        formik.setFieldValue("mandal", sourceData.mandalName || sourceData.mandal || sourceData.mandal_name);
        console.log("✅ Auto-populated mandal (root level):", sourceData.mandalName || sourceData.mandal || sourceData.mandal_name);
      }
      if (sourceData.mandalId || sourceData.mandal_id) {
        formik.setFieldValue("mandalId", sourceData.mandalId || sourceData.mandal_id);
        console.log("✅ Auto-populated mandalId (root level):", sourceData.mandalId || sourceData.mandal_id);
      }
      if (sourceData.cityName || sourceData.city || sourceData.city_name) {
        formik.setFieldValue("cityAddress", sourceData.cityName || sourceData.city || sourceData.city_name);
        formik.setFieldValue("city", sourceData.cityName || sourceData.city || sourceData.city_name);
        console.log("✅ Auto-populated city (root level):", sourceData.cityName || sourceData.city || sourceData.city_name);
      }
      if (sourceData.cityId || sourceData.city_id) {
        formik.setFieldValue("cityId", sourceData.cityId || sourceData.city_id);
        console.log("✅ Auto-populated cityId (root level):", sourceData.cityId || sourceData.city_id);
      }
     
      // Address fields from root level (for fast sale data structure)
      if (sourceData.doorNo) {
        formik.setFieldValue("doorNo", String(sourceData.doorNo));
      }
      if (sourceData.street) {
        formik.setFieldValue("streetName", sourceData.street);
      }
      if (sourceData.landmark) {
        formik.setFieldValue("landmark", sourceData.landmark);
      }
      if (sourceData.area) {
        formik.setFieldValue("area", String(sourceData.area));
      }
      if (sourceData.pincode) {
        formik.setFieldValue("pincode", String(sourceData.pincode));
      }
      if (sourceData.addressStateName) {
        formik.setFieldValue("state", sourceData.addressStateName);
      }
      if (sourceData.addressStateId) {
        formik.setFieldValue("stateId", sourceData.addressStateId);
      }
      if (sourceData.addressDistrictName) {
        formik.setFieldValue("district", sourceData.addressDistrictName);
      }
      if (sourceData.addressDistrictId) {
        formik.setFieldValue("districtId", sourceData.addressDistrictId);
      }
      if (sourceData.addressMandalName) {
        formik.setFieldValue("mandal", sourceData.addressMandalName);
      }
      if (sourceData.addressMandalId) {
        formik.setFieldValue("mandalId", sourceData.addressMandalId);
      }
      if (sourceData.addressCityName) {
        formik.setFieldValue("cityAddress", sourceData.addressCityName);
        formik.setFieldValue("city", sourceData.addressCityName);
      }
      if (sourceData.addressCityId) {
        formik.setFieldValue("cityId", sourceData.addressCityId);
      }
     
      // Concession Information
      console.log("📦 Concession Information:", {
        concessions: sourceData.concessions,
        firstYearConcession: sourceData.firstYearConcession,
        secondYearConcession: sourceData.secondYearConcession,
        concessionReason: sourceData.concessionReason,
        referredBy: sourceData.referredBy,
        authorizedBy: sourceData.authorizedBy,
        description: sourceData.description,
      });
     
      // Helper function to find concession by type name
      const findConcessionByType = (concessions, typeNames) => {
        if (!Array.isArray(concessions)) return null;
        return concessions.find(c => {
          const typeName = (c.concessionTypeName || c.concessionType || c.typeName || "").toLowerCase();
          return typeNames.some(name => typeName.includes(name.toLowerCase()));
        });
      };
     
      // Handle concessions array format
      if (sourceData.concessions && Array.isArray(sourceData.concessions) && sourceData.concessions.length > 0) {
        // Find first year concession (by type name or year number)
        const firstYearConcession = findConcessionByType(sourceData.concessions, ["1st", "first", "1st year", "first year"]) ||
          sourceData.concessions.find(c => c.concessionYear === 1 || c.year === 1);
       
        // Find second year concession (by type name or year number)
        const secondYearConcession = findConcessionByType(sourceData.concessions, ["2nd", "second", "2nd year", "second year"]) ||
          sourceData.concessions.find(c => c.concessionYear === 2 || c.year === 2);
       
        // Use first concession as primary for common fields
        const primaryConcession = firstYearConcession || secondYearConcession || sourceData.concessions[0];
       
        // First Year Concession
        if (firstYearConcession) {
          const amount = firstYearConcession.concessionAmount || firstYearConcession.amount || firstYearConcession.firstYearConcession;
          if (amount !== undefined && amount !== null && amount !== '') {
            formik.setFieldValue("firstYearConcession", String(amount));
            console.log("✅ Auto-populated firstYearConcession:", amount);
          }
          const typeId = firstYearConcession.concessionTypeId || firstYearConcession.concessionType_id || firstYearConcession.typeId;
          if (typeId) {
            formik.setFieldValue("firstYearConcessionTypeId", typeId);
            console.log("✅ Auto-populated firstYearConcessionTypeId:", typeId);
          }
        }
       
        // Second Year Concession
        if (secondYearConcession) {
          const amount = secondYearConcession.concessionAmount || secondYearConcession.amount || secondYearConcession.secondYearConcession;
          if (amount !== undefined && amount !== null && amount !== '') {
            formik.setFieldValue("secondYearConcession", String(amount));
            console.log("✅ Auto-populated secondYearConcession:", amount);
          }
          const typeId = secondYearConcession.concessionTypeId || secondYearConcession.concessionType_id || secondYearConcession.typeId;
          if (typeId) {
            formik.setFieldValue("secondYearConcessionTypeId", typeId);
            console.log("✅ Auto-populated secondYearConcessionTypeId:", typeId);
          }
        }
       
        // Common fields from primary concession
        if (primaryConcession) {
          // Concession Reason
          const reasonName = primaryConcession.reasonName || primaryConcession.concessionReason || primaryConcession.reason || primaryConcession.concessionReasonName;
          if (reasonName) {
            formik.setFieldValue("concessionReason", reasonName);
            console.log("✅ Auto-populated concessionReason:", reasonName);
          }
          const reasonId = primaryConcession.reasonId || primaryConcession.concessionReasonId || primaryConcession.reason_id || primaryConcession.concession_reason_id;
          if (reasonId) {
            formik.setFieldValue("concessionReasonId", reasonId);
            console.log("✅ Auto-populated concessionReasonId:", reasonId);
          }
         
          // Referred By
          const referredBy = primaryConcession.referredBy || primaryConcession.concReferedBy || primaryConcession.concessionReferredBy || primaryConcession.referred_by;
          if (referredBy) {
            formik.setFieldValue("referredBy", String(referredBy));
            console.log("✅ Auto-populated referredBy:", referredBy);
          }
         
          // Authorized By
          const authorizedBy = primaryConcession.authorizedBy || primaryConcession.authorized_by || primaryConcession.authorizedById || primaryConcession.authorized_by_id;
          if (authorizedBy) {
            formik.setFieldValue("authorizedBy", String(authorizedBy));
            console.log("✅ Auto-populated authorizedBy:", authorizedBy);
          }
         
          // Description
          const description = primaryConcession.comments || primaryConcession.description || primaryConcession.comment || primaryConcession.concessionDescription;
          if (description) {
            formik.setFieldValue("description", String(description));
            console.log("✅ Auto-populated description:", description);
          }
        }
      } else {
        // Handle flat format (fields at root level)
        // First Year Concession
        const firstYearConcessionValue = sourceData.firstYearConcession || sourceData.first_year_concession || sourceData["1stYearConcession"];
        if (firstYearConcessionValue !== undefined && firstYearConcessionValue !== null && firstYearConcessionValue !== '') {
          formik.setFieldValue("firstYearConcession", String(firstYearConcessionValue));
          console.log("✅ Auto-populated firstYearConcession (flat):", firstYearConcessionValue);
        }
        const firstYearConcessionTypeIdValue = sourceData.firstYearConcessionTypeId || sourceData.first_year_concession_type_id;
        if (firstYearConcessionTypeIdValue) {
          formik.setFieldValue("firstYearConcessionTypeId", firstYearConcessionTypeIdValue);
          console.log("✅ Auto-populated firstYearConcessionTypeId (flat):", firstYearConcessionTypeIdValue);
        }
       
        // Second Year Concession
        const secondYearConcessionValue = sourceData.secondYearConcession || sourceData.second_year_concession || sourceData["2ndYearConcession"];
        if (secondYearConcessionValue !== undefined && secondYearConcessionValue !== null && secondYearConcessionValue !== '') {
          formik.setFieldValue("secondYearConcession", String(secondYearConcessionValue));
          console.log("✅ Auto-populated secondYearConcession (flat):", secondYearConcessionValue);
        }
        const secondYearConcessionTypeIdValue = sourceData.secondYearConcessionTypeId || sourceData.second_year_concession_type_id;
        if (secondYearConcessionTypeIdValue) {
          formik.setFieldValue("secondYearConcessionTypeId", secondYearConcessionTypeIdValue);
          console.log("✅ Auto-populated secondYearConcessionTypeId (flat):", secondYearConcessionTypeIdValue);
        }
       
        // Concession Reason
        const concessionReasonValue = sourceData.concessionReason || sourceData.concession_reason || sourceData.reasonName || sourceData.reason;
        if (concessionReasonValue) {
          formik.setFieldValue("concessionReason", String(concessionReasonValue));
          console.log("✅ Auto-populated concessionReason (flat):", concessionReasonValue);
        }
        const concessionReasonIdValue = sourceData.concessionReasonId || sourceData.concession_reason_id || sourceData.reasonId || sourceData.reason_id;
        if (concessionReasonIdValue) {
          formik.setFieldValue("concessionReasonId", concessionReasonIdValue);
          console.log("✅ Auto-populated concessionReasonId (flat):", concessionReasonIdValue);
        }
       
        // Referred By
        const referredByValue = sourceData.referredBy || sourceData.referred_by || sourceData.concReferedBy || sourceData.concessionReferredBy;
        if (referredByValue) {
          formik.setFieldValue("referredBy", String(referredByValue));
          console.log("✅ Auto-populated referredBy (flat):", referredByValue);
        }
       
        // Authorized By
        const authorizedByValue = sourceData.authorizedBy || sourceData.authorized_by || sourceData.authorizedById || sourceData.authorized_by_id;
        if (authorizedByValue) {
          formik.setFieldValue("authorizedBy", String(authorizedByValue));
          console.log("✅ Auto-populated authorizedBy (flat):", authorizedByValue);
        }
       
        // Description
        const descriptionValue = sourceData.description || sourceData.comments || sourceData.comment || sourceData.concessionDescription;
        if (descriptionValue) {
          formik.setFieldValue("description", String(descriptionValue));
          console.log("✅ Auto-populated description (flat):", descriptionValue);
        }
      }
     
      console.log(`✅ College form auto-populated from ${isFastSold ? 'fast sale' : 'overview'} data`);
     
      // Log what was actually set in Formik for parent and orientation information
      setTimeout(() => {
        if (formikRef.current) {
          const formikValues = formikRef.current.values;
         
          console.log("📋 Formik values after auto-population (Parent Info):", {
            fatherName: formikValues.fatherName,
            fatherMobile: formikValues.fatherMobile,
            fatherEmail: formikValues.fatherEmail,
            fatherSector: formikValues.fatherSector,
            fatherSectorId: formikValues.fatherSectorId,
            fatherOccupation: formikValues.fatherOccupation,
            fatherOccupationId: formikValues.fatherOccupationId,
            motherName: formikValues.motherName,
            motherMobile: formikValues.motherMobile,
            motherEmail: formikValues.motherEmail,
            motherSector: formikValues.motherSector,
            motherSectorId: formikValues.motherSectorId,
            motherOccupation: formikValues.motherOccupation,
            motherOccupationId: formikValues.motherOccupationId,
          });
         
          console.log("📋 Formik values after auto-population (Orientation Info):", {
            academicYear: formikValues.academicYear,
            academicYearId: formikValues.academicYearId,
            city: formikValues.city,
            cityId: formikValues.cityId,
            branchName: formikValues.branchName,
            campusName: formikValues.campusName,
            branchId: formikValues.branchId,
            campusId: formikValues.campusId,
            joiningClass: formikValues.joiningClass,
            classId: formikValues.classId,
            joiningClassId: formikValues.joiningClassId,
            orientationName: formikValues.orientationName,
            orientationId: formikValues.orientationId,
            studentType: formikValues.studentType,
            studentTypeId: formikValues.studentTypeId,
            orientationStartDate: formikValues.orientationStartDate,
            orientationEndDate: formikValues.orientationEndDate,
            orientationFee: formikValues.orientationFee,
          });
         
          // SUMMARY: All IDs that will be sent to backend
          console.log("🚀 SUMMARY: All IDs that will be sent to backend:", {
            // Parent Information IDs
            fatherSectorId: formikValues.fatherSectorId || "⚠️ MISSING",
            fatherOccupationId: formikValues.fatherOccupationId || "⚠️ MISSING",
            motherSectorId: formikValues.motherSectorId || "⚠️ MISSING",
            motherOccupationId: formikValues.motherOccupationId || "⚠️ MISSING",
           
            // Orientation Information IDs
            academicYearId: formikValues.academicYearId || "⚠️ MISSING",
            cityId: formikValues.cityId || "⚠️ MISSING",
            branchId: formikValues.branchId || formikValues.campusId || "⚠️ MISSING",
            campusId: formikValues.campusId || formikValues.branchId || "⚠️ MISSING",
            classId: formikValues.classId || formikValues.joiningClassId || "⚠️ MISSING",
            joiningClassId: formikValues.joiningClassId || formikValues.classId || "⚠️ MISSING",
            orientationId: formikValues.orientationId || "⚠️ MISSING",
            studentTypeId: formikValues.studentTypeId || "⚠️ MISSING",
           
            // Academic Information IDs
            schoolStateId: formikValues.schoolStateId || "⚠️ MISSING",
            schoolDistrictId: formikValues.schoolDistrictId || "⚠️ MISSING",
            schoolTypeId: formikValues.schoolTypeId || "⚠️ MISSING",
            preCollegeStateId: formikValues.preCollegeStateId || "⚠️ MISSING",
            preCollegeDistrictId: formikValues.preCollegeDistrictId || "⚠️ MISSING",
            preCollegeTypeId: formikValues.preCollegeTypeId || "⚠️ MISSING",
            foodTypeId: formikValues.foodTypeId || "⚠️ MISSING",
            bloodGroupId: formikValues.bloodGroupId || "⚠️ MISSING",
            casteId: formikValues.casteId || "⚠️ MISSING",
            religionId: formikValues.religionId || "⚠️ MISSING",
           
            // Address Information IDs
            stateId: formikValues.stateId || "⚠️ MISSING",
            districtId: formikValues.districtId || "⚠️ MISSING",
            mandalId: formikValues.mandalId || "⚠️ MISSING",
            cityIdAddress: formikValues.cityId || "⚠️ MISSING",
          });
         
          // Check if any IDs are missing
          const missingIds = [];
          if (!formikValues.fatherSectorId || formikValues.fatherSectorId === 0) missingIds.push("fatherSectorId");
          if (!formikValues.fatherOccupationId || formikValues.fatherOccupationId === 0) missingIds.push("fatherOccupationId");
          if (!formikValues.motherSectorId || formikValues.motherSectorId === 0) missingIds.push("motherSectorId");
          if (!formikValues.motherOccupationId || formikValues.motherOccupationId === 0) missingIds.push("motherOccupationId");
          if (!formikValues.academicYearId || formikValues.academicYearId === 0) missingIds.push("academicYearId");
          if (!formikValues.cityId || formikValues.cityId === 0) missingIds.push("cityId");
          if (!formikValues.branchId && !formikValues.campusId || (formikValues.branchId === 0 && formikValues.campusId === 0)) missingIds.push("branchId/campusId");
          if (!formikValues.classId && !formikValues.joiningClassId || (formikValues.classId === 0 && formikValues.joiningClassId === 0)) missingIds.push("classId/joiningClassId");
          if (!formikValues.orientationId || formikValues.orientationId === 0) missingIds.push("orientationId");
          if (!formikValues.studentTypeId || formikValues.studentTypeId === 0) missingIds.push("studentTypeId");
          if (!formikValues.schoolStateId || formikValues.schoolStateId === 0) missingIds.push("schoolStateId");
          if (!formikValues.schoolDistrictId || formikValues.schoolDistrictId === 0) missingIds.push("schoolDistrictId");
          if (!formikValues.schoolTypeId || formikValues.schoolTypeId === 0) missingIds.push("schoolTypeId");
          if (!formikValues.preCollegeStateId || formikValues.preCollegeStateId === 0) missingIds.push("preCollegeStateId");
          if (!formikValues.preCollegeDistrictId || formikValues.preCollegeDistrictId === 0) missingIds.push("preCollegeDistrictId");
          if (!formikValues.preCollegeTypeId || formikValues.preCollegeTypeId === 0) missingIds.push("preCollegeTypeId");
          if (!formikValues.foodTypeId || formikValues.foodTypeId === 0) missingIds.push("foodTypeId");
          if (!formikValues.bloodGroupId || formikValues.bloodGroupId === 0) missingIds.push("bloodGroupId");
          if (!formikValues.casteId || formikValues.casteId === 0) missingIds.push("casteId");
          if (!formikValues.religionId || formikValues.religionId === 0) missingIds.push("religionId");
          if (!formikValues.stateId || formikValues.stateId === 0) missingIds.push("stateId");
          if (!formikValues.districtId || formikValues.districtId === 0) missingIds.push("districtId");
          if (!formikValues.mandalId || formikValues.mandalId === 0) missingIds.push("mandalId");
          if (!formikValues.cityId || formikValues.cityId === 0) missingIds.push("cityId (address)");
         
          if (missingIds.length > 0) {
            console.warn("⚠️ WARNING: The following IDs are missing or 0. Components will try to sync them from labels:", missingIds);
            console.warn("⚠️ If IDs are still missing after component sync, check that the labels match the API dropdown options exactly.");
          } else {
            console.log("✅ SUCCESS: All required IDs are present and will be sent to backend!");
          }
        }
      }, 500); // Increased delay to allow component sync logic to run
      }
    }, 100); // Small delay to ensure Formik is ready
   
    return () => clearTimeout(timer);
  }, [shouldAutoPopulate, dataToPopulate, isFastSold, fastSaleLoading]);

  // Stable callback that uses ref to access formik
  const handleDataLoaded = useCallback((data) => {
    setApplicationDetailsData((prevData) => {
      // Only update if data actually changed
      if (prevData && JSON.stringify(prevData) === JSON.stringify(data)) {
        return prevData;
      }
      return data;
    });
    // Pre-populate Formik values if not already set
    if (formikRef.current) {
      // Set academic year and ID
      if (data.academicYear && !formikRef.current.values.academicYear) {
        formikRef.current.setFieldValue("academicYear", data.academicYear);
      }
      if (data.academicYearId !== null && data.academicYearId !== undefined && !formikRef.current.values.academicYearId) {
        console.log("✅ Setting academicYearId in Formik (for backend):", data.academicYearId);
        formikRef.current.setFieldValue("academicYearId", data.academicYearId);
      } else if (data.academicYearId === null || data.academicYearId === undefined) {
        console.warn("⚠️ academicYearId is null/undefined - check API response");
      }
     
      // Set campus name and ID
      if (data.campusName && !formikRef.current.values.campusName) {
        formikRef.current.setFieldValue("campusName", data.campusName);
      }
      if (data.campusId !== null && data.campusId !== undefined && !formikRef.current.values.campusId) {
        console.log("✅ Setting campusId in Formik (for backend):", data.campusId);
        formikRef.current.setFieldValue("campusId", data.campusId);
        formikRef.current.setFieldValue("branchId", data.campusId); // Also set branchId
      } else if (data.campusId === null || data.campusId === undefined) {
        console.warn("⚠️ campusId is null/undefined - check API response");
      }
     
      // Set city name and ID
      if (data.cityName && !formikRef.current.values.city) {
        formikRef.current.setFieldValue("city", data.cityName);
      }
      if (data.cityId !== null && data.cityId !== undefined && !formikRef.current.values.cityId) {
        console.log("✅ Setting cityId in Formik (for backend):", data.cityId);
        formikRef.current.setFieldValue("cityId", data.cityId);
      }
     
      // Log final Formik values to verify IDs are stored
      console.log("📋 Formik values after setting IDs:", {
        academicYear: formikRef.current.values.academicYear,
        academicYearId: formikRef.current.values.academicYearId,
        campusName: formikRef.current.values.campusName,
        campusId: formikRef.current.values.campusId,
        branchId: formikRef.current.values.branchId,
        city: formikRef.current.values.city,
        cityId: formikRef.current.values.cityId
      });
    }
  }, []);

  return (
    <>
    {!showSuccessPage ? (
      <>
    <Formik
      initialValues={initialValues}
      validationSchema={clgActualSaleValidationSchema()}
      onSubmit={(values) => {
        // Popup YES triggers actual POST
        handleSubmitAPI(values);
      }}
    >
      {(formik) => {
        // Store formik instance in ref
        formikRef.current = formik;

        return (
          <Form className={styles.clgSalePageWrapper}>
            <ApplicationSaleDetails
              saleName={"Sale"}
              onDataLoaded={handleDataLoaded}
              applicationNo={applicationData?.applicationNo}
              onBack={handleBackClick}
            />

          <div className={styles.clgAppSaleFormMiddleSection}>
            <PersonalInformation />
            <ParentInformation />
            <OrientationInformation
              initialAcademicYear={applicationDetailsData?.academicYear}
              initialAcademicYearId={applicationDetailsData?.academicYearId}
              initialCampusName={applicationDetailsData?.campusName}
              initialCampusId={applicationDetailsData?.campusId}
            />
            <AcademicInformation joiningClass={formik.values.joiningClass} />
            <AddressInformation />
            <ConcessionInformation />
            <ExtraConcession />
          </div>

          <div className={styles.clgAppSaleButtons}>
            {/* Show Back and Application Sale buttons only if NOT in edit mode */}
            {!isEditMode && (
              <>
                <Button
                  buttonname={"Back"}
                  variant={"secondaryWithExtraPadding"}
                  lefticon={leftArrowBlueColor}
                  type="button"
                />

                {/* Application Sale Trigger */}
                <Button
                  buttonname={"Application Sale"}
                  variant={"primary"}
                  lefticon={applicationSaleicon}
                  type="button"
                  onClick={() => {
                    // Store all form values (make a deep copy to ensure latest state)
                    const values = JSON.parse(JSON.stringify(formik.values));
                   
                    // Log concession data before passing to PaymentPopup
                    console.log('📋 ===== COLLEGE SALE FORM VALUES (Before PaymentPopup) =====');
                    console.log('Concession Data:', {
                      firstYearConcession: values.firstYearConcession,
                      firstYearConcessionTypeId: values.firstYearConcessionTypeId,
                      secondYearConcession: values.secondYearConcession,
                      secondYearConcessionTypeId: values.secondYearConcessionTypeId,
                      concessionReason: values.concessionReason,
                      authorizedBy: values.authorizedBy,
                      referredBy: values.referredBy,
                      description: values.description,
                    });
                    console.log('============================================================');
                   
                    // Separate academic/orientation data (collegeAcademicFormData)
                    // Include both labels (for display) and IDs (for backend)
                    const academicData = {
                      // Labels (for display/logging)
                      academicYear: values.academicYear || "",
                      branchName: values.branchName || "",
                      branchType: values.branchType || "",
                      orientationName: values.orientationName || "",
                      city: values.city || "",
                      joiningClass: values.joiningClass || "",
                      // IDs (for backend submission)
                      academicYearId: values.academicYearId || 0,
                      joiningClassId: values.joiningClassId || values.classId || 0,
                      branchId: values.branchId || values.campusId || 0,
                      studentTypeId: values.studentTypeId || 0,
                      cityId: values.cityId || 0,
                      orientationId: values.orientationId || 0,
                      courseNameId: values.orientationId || 0,
                    };
                   
                    // Store all form data for college application sale (includes all concession fields)
                    setFormValues(values);
                    setAcademicFormValues(academicData);
                   
                    // Open payment popup (validation will be handled in the popup if needed)
                    setShowPaymentPopup(true);
                  }}
                />
              </>
            )}

            {/* Show Update button only if in edit mode */}
            {isEditMode && (
              <Button
                buttonname={"Update"}
                variant={"primary"}
                lefticon={applicationSaleicon}
                type="button"
                onClick={async () => {
                  try {
                    // Validate form - but for update, we'll be more lenient
                    // Only check critical fields that are absolutely required
                    const errors = await formik.validateForm();
                   
                    // Filter out non-critical errors for update operation
                    // Critical fields that must be present for update
                    const criticalFields = ['firstName', 'gender', 'dob', 'admissionType'];
                    const criticalErrors = {};
                   
                    // Check if any critical fields have errors
                    for (const field of criticalFields) {
                      if (errors[field]) {
                        criticalErrors[field] = errors[field];
                      }
                    }
                   
                    // Also check if critical fields are empty
                    const formValues = formik.values;
                    if (!formValues.firstName || formValues.firstName.trim() === '') {
                        criticalErrors.firstName = 'First name is required';
                    }
                    if (!formValues.gender || formValues.gender === '') {
                        criticalErrors.gender = 'Gender is required';
                    }
                    if (!formValues.dob || formValues.dob === '') {
                        criticalErrors.dob = 'Date of birth is required';
                    }
                    if (!formValues.admissionType || formValues.admissionType === '') {
                        criticalErrors.admissionType = 'Admission type is required';
                    }
                   
                    if (Object.keys(criticalErrors).length > 0) {
                      console.error("❌ Critical form validation errors:", criticalErrors);
                      console.error("📋 All validation errors:", errors);
                     
                      // Show detailed error message
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

                    // Get application number (student admission number) for update API
                    // Priority: 1. From ApplicationSaleDetails (studAdmsNo), 2. From applicationData, 3. From applicationDetailsData
                    const applicationNo =
                      applicationDetailsData?.studAdmsNo || // Student admission number from ApplicationSaleDetails API
                      applicationDetailsData?.appNo || // Application number from ApplicationSaleDetails API
                      applicationData?.studAdmsNo || // Student admission number from applicationData
                      applicationData?.stud_adms_no ||
                      applicationData?.applicationNo || // Application number from applicationData
                      applicationData?.application_no ||
                      null;
                   
                    if (!applicationNo) {
                      console.error("❌ Application number (student admission number) is missing");
                      console.error("   - applicationDetailsData:", applicationDetailsData);
                      console.error("   - applicationData:", applicationData);
                      alert("Application number (student admission number) is required for update. Please ensure the application details are loaded.");
                      return;
                    }
                   
                    // Store all form values (make a deep copy to ensure latest state)
                    const values = JSON.parse(JSON.stringify(formik.values));
                   
                    // Map form data to update payload structure
                    // Note: For update, we don't need payment data, so we pass empty object
                    const payload = mapCollegeApplicationSaleUpdateToPayload(
                      values,
                      {}, // No payment data for update
                      applicationData,
                      'cash' // Default payment mode
                    );
                   
                    console.log('📦 Update Payload:', JSON.stringify(payload, null, 2));
                   
                    // Call update API
                    const response = await updateCollegeApplicationSale(applicationNo, payload);
                   
                    console.log('✅ Update successful:', response);
                    alert("Application updated successfully!");
                   
                    // Navigate back to college confirmation overview
                    navigate('/college-application-confirmation', {
                      state: {
                        applicationData: applicationData
                      }
                    });
                  } catch (error) {
                    console.error('❌ Error updating application:', error);
                    alert(error.response?.data?.message || error.message || "Failed to update application. Please try again.");
                  }
                }}
              />
            )}
          </div>

          {/* POPUP */}
          <Popup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onConfirm={() => {
              setIsPopupOpen(false);
              formik.handleSubmit(); // triggers POST API
            }}
          />
          </Form>
        );
      }}
    </Formik>

    {/* Payment Popup */}
    {showPaymentPopup && (
      <PaymentPopup
        onClose={() => setShowPaymentPopup(false)}
        title="Complete Application Sale & Confirmation"
        formData={formValues || {}}
        siblings={formValues?.siblings || []}
        detailsObject={applicationData}
        type="college"
        collegeFormData={formValues}
        collegeAcademicFormData={academicFormValues}
        saleType="regular"
        onSuccess={handleSubmissionSuccess}
      />
    )}
    </>
    ) : (
      <SuccessPage
        applicationNo={applicationData?.applicationNo}
        studentName={formValues?.firstName + " " + formValues?.surName}
        campus={formValues?.campusName}
        zone={applicationData?.zone}
        onBack={handleBackFromSuccess}
        statusType="sale"
      />
    )}
    </>
  );
};

export default CollegeSalePage;