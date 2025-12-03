import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import SchoolSaleOverviewCont from "../school-sale-overview-container/SchoolSaleOverviewCont";
import SchoolSaleConfFormsCont from "../school-sale&conf-forms-container/SchoolSaleConfFormsCont";
import PaymentPopupContainer from "../scool-payment-popup-container/PaymentPopupContainer";
import SuccessPage from "../../../../widgets/sale-done/SuccessPage";
import { useAdmissionSaleData } from "../../../../hooks/college-apis/CollegeOverviewApis";
import { useSchoolOverviewData } from "../../../../hooks/school-apis/SchoolOverviewApis";
import styles from "./SchoolSaleConfirmationContainer.module.css";

const SchoolSaleConfirmationContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationData = location.state?.applicationData;
  
  // Get applicationNo and studentId from navigation state - no hardcoded fallback
  const applicationNo = applicationData?.applicationNo;
  // For school, we need studentId - use studentId from applicationData, or applicationNo as fallback
  const studentId = applicationData?.studentId || applicationData?.applicationNo;
  
  const [currentStep, setCurrentStep] = useState(1); // 1 = Overview, 2 = Forms
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  
  // State to store form data and siblings for submission
  const [formData, setFormData] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [submissionResponse, setSubmissionResponse] = useState(null);

  // Fetch data once at parent level - using dynamic values
  const { data: detailsObject } = useAdmissionSaleData(applicationNo);
  
  // Fetch overview data to get branchId and joiningClassId - using studentId
  const { overviewData } = useSchoolOverviewData(studentId);

  // Show error if applicationNo or studentId is not available
  if (!applicationNo || !studentId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: 'red', fontSize: '18px', marginBottom: '10px' }}>
          Error: Application number or Student ID is required
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
    console.log("✏️ Edit clicked - Navigating to school sale form with data");
    console.log("📦 Application Data:", applicationData);
    console.log("📦 Overview Data:", overviewData);
    
    // Navigate to school sale form via SaleFormRouter with proper path
    navigate(`/scopes/application/status/${applicationNo}/school-sale`, {
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

  const handleBackToStatus = () => {
    // Navigate back to application status table
    navigate("/scopes/application/status");
  };

  const handleProceedToPayment = (formDataFromChild, siblingsFromChild) => {
    // Store form data and siblings when proceeding to payment
    setFormData(formDataFromChild);
    setSiblings(siblingsFromChild || []);
    setShowPaymentPopup(true);
  };

  const handleClosePayment = () => {
    setShowPaymentPopup(false);
  };

  const handleSubmissionSuccess = (response, details) => {
    console.log("✅ Payment submission successful, showing success page");
    console.log("Response:", response);
    console.log("Details:", details);
    
    // Store response and close payment popup
    setSubmissionResponse(response);
    setShowPaymentPopup(false);
    
    // Show success page
    setShowSuccessPage(true);
  };

  const handleBackFromSuccess = () => {
    // Navigate back to application status
    navigate("/scopes/application/status");
  };

  return (
    <div className={styles.schoolSaleConfirmationWrapper}>
      {!showSuccessPage ? (
        <>
          <div>
            {currentStep === 1 && (
              <SchoolSaleOverviewCont 
                onNext={handleNext}
                onEdit={handleEdit}
                onBack={handleBackToStatus}
                detailsObject={detailsObject}
                studentId={studentId}
              />
            )}
            
            {currentStep === 2 && (
              <SchoolSaleConfFormsCont 
                onBack={handleBack}
                onProceedToPayment={handleProceedToPayment}
                detailsObject={detailsObject}
                overviewData={overviewData}
              />
            )}
          </div>

          {showPaymentPopup && (
            <PaymentPopupContainer 
              onClose={handleClosePayment}
              formData={formData}
              siblings={siblings}
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
  )
}

export default SchoolSaleConfirmationContainer
