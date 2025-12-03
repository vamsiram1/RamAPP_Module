import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useLocation } from "react-router-dom";
import styles from "../CollegeSaleForm/CollegeSaleForm.module.css";

import ApplicationSaleDetails from "../../components/sale-and-confirm/CollegSaleFormComponents/ApplicationDetails/ApplicationSaleDetails";
import PersonalInformationClgFastSale from "../../components/sale-and-confirm/CollegSaleFormComponents/PersonalInformation/PersonalInformationClgFastSale";
import ParentInformationForSchool from "../../components/sale-and-confirm/CollegSaleFormComponents/ParentInformation/ParentInformationForSchool";
import OrientationInformation from "../../components/sale-and-confirm/CollegSaleFormComponents/OrientationInformation/OrientaionInformation";
import AddressInformation from "../../components/sale-and-confirm/CollegSaleFormComponents/AddressInformation/AddressInformation";
import PaymentPopup from "../../widgets/PaymentPopup/whole-payment-popup/PaymentPopup.jsx";

import leftArrowBlue from "../../assets/application-status/leftArrowBlueColor";
import saleIcon from "../../assets/application-status/applicationSaleicon";
import Button from "../../widgets/Button/Button";

// INITIAL VALUES
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
  mobileNumber: "",
  email: "",
  // Parent Info
  fatherName: "",
  fatherMobile: "", // Also stored as mobileNumber for backward compatibility
  // Orientation fields
  academicYear: "",
  academicYearId: null, // Backend ID for academic year
  campusName: "", // Display name for campus/branch
  campusId: null, // Backend ID for campus/branch
  branchId: null, // Backend ID for branch (same as campusId)
  city: "",
  cityId: null, // Backend ID for city
  joiningClass: "",
  classId: null, // Backend ID for class
  joiningClassId: null, // Backend ID for joining class (same as classId)
  orientationName: "",
  orientationId: null, // Backend ID for orientation
  studentType: "",
  studentTypeId: null, // Backend ID for student type
  // Address fields
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
  // add more fields later
};

const CollegeFastSale = () => {
  const location = useLocation();
  const applicationData = location.state?.applicationData;
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [applicationDetailsData, setApplicationDetailsData] = useState(null);
  
  // For college fast sale, use "fast" sale type to show "Finish Fast Sale" button
  const saleType = "fast";

  const handleApplicationFastSale = (formik) => {
    // Log all form values including IDs before submission
    console.log("📋 ===== COLLEGE FAST SALE FORM VALUES (Before Submission) =====");
    console.log("Personal IDs:", {
      genderId: formik.values.genderId,
      quotaId: formik.values.quotaId,
      appTypeId: formik.values.appTypeId,
    });
    console.log("Personal Labels:", {
      gender: formik.values.gender,
      quotaAdmissionReferredBy: formik.values.quotaAdmissionReferredBy,
      admissionType: formik.values.admissionType,
    });
    console.log("Parent Info:", {
      fatherName: formik.values.fatherName,
      fatherMobile: formik.values.fatherMobile,
      mobileNumber: formik.values.mobileNumber,
    });
    console.log("========================================================");
    console.log("📦 Full Formik Values Object:", formik.values);
    
    // Store current form values (make sure we're getting the latest values)
    const currentValues = JSON.parse(JSON.stringify(formik.values));
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

  const handleClosePayment = () => {
    setShowPaymentPopup(false);
  };

  return (
    <>
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log("FAST SALE SUBMIT:", values);
      }}
    >
      {(formik) => (
        <Form className={styles.clgSalePageWrapper}>
          <ApplicationSaleDetails 
            saleName={"Fast Sale"}
            applicationNo={applicationData?.applicationNo}
            onDataLoaded={(data) => {
              console.log("🏫 CollegeFastSale - ApplicationSaleDetails data loaded:", data);
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
                console.log("✅ Setting campusName in Formik:", data.campusName);
                formik.setFieldValue("campusName", data.campusName);
              }
              if (data.campusId !== null && data.campusId !== undefined) {
                console.log("✅ Setting campusId in Formik (for backend):", data.campusId);
                formik.setFieldValue("campusId", data.campusId);
              } else {
                console.warn("⚠️ campusId is null/undefined - check API response");
              }
              
              if (data.cityName) {
                console.log("✅ Setting city in Formik:", data.cityName);
                formik.setFieldValue("city", data.cityName);
              }
              if (data.cityId !== null && data.cityId !== undefined) {
                console.log("✅ Setting cityId in Formik (for backend):", data.cityId);
                formik.setFieldValue("cityId", data.cityId);
              }
              
              // Log final Formik values to verify IDs are stored
              console.log("📋 Formik values after setting IDs:", {
                academicYear: formik.values.academicYear,
                academicYearId: formik.values.academicYearId,
                campusName: formik.values.campusName,
                campusId: formik.values.campusId,
                city: formik.values.city,
                cityId: formik.values.cityId
              });
            }}
          />

          <div className={styles.clgAppFastSaleFormMiddleSection}>
            <PersonalInformationClgFastSale />
            <ParentInformationForSchool />
            <OrientationInformation
              initialAcademicYear={applicationDetailsData?.academicYear}
              initialAcademicYearId={applicationDetailsData?.academicYearId}
              initialCampusName={applicationDetailsData?.campusName}
              initialCampusId={applicationDetailsData?.campusId}
            />
            <AddressInformation />
          </div>

          <div className={styles.clgAppSaleButtonsWrapper}>
            <div className={styles.clgAppSaleButtons}>
              <Button
                buttonname={"Back"}
                variant={"secondaryWithExtraPadding"}
                lefticon={leftArrowBlue}
                type="button"
              />

              <Button
                buttonname={"Application Fast Sale"}
                variant={"primary"}
                  type="button"
                lefticon={saleIcon}
                  onClick={() => handleApplicationFastSale(formik)}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>

      {/* Payment Popup */}
      {showPaymentPopup && (
        <PaymentPopup
          onClose={handleClosePayment}
          title="Complete Application Fast Sale & Confirmation"
          formData={formValues}
          collegeFormData={formValues}
          siblings={[]}
          detailsObject={applicationData}
          type="college"
          saleType={saleType}
        />
      )}
    </>
  );
};

export default CollegeFastSale;
