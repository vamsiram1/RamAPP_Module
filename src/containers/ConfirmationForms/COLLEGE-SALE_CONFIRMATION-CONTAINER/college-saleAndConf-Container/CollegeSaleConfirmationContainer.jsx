import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CollegeOverviewContainer from "../college-overview-container/CollegeOverviewContainer";
import CollegeAppConfContainer from "../college-app_conf-container/CollegeAppConfContainer";
import CollegePaymentPopup from "../college-payment-popup-container/CollegePaymentPopup";
import SuccessPage from "../../../../widgets/sale-done/SuccessPage";
import { useAdmissionSaleData, useCollegeOverviewData } from "../../../../hooks/college-apis/CollegeOverviewApis";
import styles from "./CollegeSaleConfirmationContainer.module.css";

const CollegeSaleConfirmationContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationData = location.state?.applicationData;
  
  // Get applicationNo from navigation state - no hardcoded fallback
  const applicationNo = applicationData?.applicationNo;
  
  const [currentStep, setCurrentStep] = useState(1); // 1 = Overview, 2 = Application Confirmation
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  
  // State to store form data and academic form data for submission
  const [formData, setFormData] = useState(null);
  const [academicFormData, setAcademicFormData] = useState(null);
  const [submissionResponse, setSubmissionResponse] = useState(null);

  // Fetch data once at parent level - using dynamic applicationNo
  const { data: detailsObject } = useAdmissionSaleData(applicationNo);
  const { overviewData } = useCollegeOverviewData(applicationNo);

  // Show error if applicationNo is not available
  if (!applicationNo) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: 'red', fontSize: '18px', marginBottom: '10px' }}>
          Error: Application number is required
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Please navigate from the Application Status table to access this page.
        </div>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleEdit = () => {
    console.log("✏️ Edit clicked - Navigating to college application sale form with data");
    console.log("📦 Application Data:", applicationData);
    console.log("📦 Overview Data:", overviewData);
    
    // Navigate to college sale form via SaleFormRouter with proper path
    navigate(`/scopes/application/status/${applicationNo}/college-sale`, {
      state: {
        applicationData: applicationData,
        overviewData: overviewData,
        isEditMode: true // Flag to indicate this is edit mode
      }
    });
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleProceedToPayment = (formDataFromChild, academicFormDataFromChild) => {
    // Store form data and academic form data when proceeding to payment
    setFormData(formDataFromChild);
    setAcademicFormData(academicFormDataFromChild);
    setShowPaymentPopup(true);
  };

  const handleClosePayment = () => {
    setShowPaymentPopup(false);
  };

  const handleSubmissionSuccess = (response, details) => {
    console.log("🎉🎉🎉 ===== SUBMISSION SUCCESS HANDLER CALLED ===== 🎉🎉🎉");
    console.log("✅ Payment submission successful, showing success page");
    console.log("Response:", response);
    console.log("Details:", details);
    console.log("Current showSuccessPage state:", showSuccessPage);
    console.log("Current showPaymentPopup state:", showPaymentPopup);
    
    // Store response and close payment popup
    setSubmissionResponse(response);
    setShowPaymentPopup(false);
    
    // Show success page
    console.log("🔄 Setting showSuccessPage to TRUE");
    setShowSuccessPage(true);
    
    // Log after state update
    setTimeout(() => {
      console.log("📊 State after update - showSuccessPage should be true");
    }, 100);
  };

  const handleBackFromSuccess = () => {
    // Navigate back to application status
    navigate("/scopes/application/status");
  };

  const handleBackToStatus = () => {
    // Navigate back to application status table from overview
    navigate("/scopes/application/status");
  };

  console.log("🔍 RENDER - showSuccessPage:", showSuccessPage);
  console.log("🔍 RENDER - showPaymentPopup:", showPaymentPopup);
  console.log("🔍 RENDER - currentStep:", currentStep);

  return (
    <div className={styles.collegeSaleConfirmationWrapper}>
      {!showSuccessPage ? (
        <>
          <div>
            {currentStep === 1 && (
              <CollegeOverviewContainer 
                onNext={handleNext} 
                onEdit={handleEdit}
                onBack={handleBackToStatus}
                detailsObject={detailsObject}
                overviewData={overviewData}
              />
            )}

            {currentStep === 2 && (
              <CollegeAppConfContainer
                onBack={handleBack}
                onProceedToPayment={handleProceedToPayment}
                detailsObject={detailsObject}
                overviewData={overviewData}
              />
            )}
          </div>

          {showPaymentPopup && (
            <CollegePaymentPopup 
              onClose={handleClosePayment}
              formData={formData}
              academicFormData={academicFormData}
              detailsObject={detailsObject}
              onSuccess={handleSubmissionSuccess}
            />
          )}
        </>
      ) : (
        <SuccessPage 
          applicationNo={applicationNo}
          studentName={overviewData?.firstName + " " + overviewData?.lastName}
          campus={overviewData?.campus}
          zone={overviewData?.zone}
          onBack={handleBackFromSuccess}
          statusType="confirmation"
        />
      )}
    </div>
  );
};

export default CollegeSaleConfirmationContainer;
