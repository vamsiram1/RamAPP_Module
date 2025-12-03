import React from 'react'
import PaymentPopup from '../../../../widgets/PaymentPopup/whole-payment-popup/PaymentPopup.jsx';

const CollegePaymentPopup = ({ onClose, formData, academicFormData, detailsObject, onSuccess }) => {
  return (
    <PaymentPopup 
      onClose={onClose} 
      title="Complete Application Confirmation"
      type="college"
      collegeFormData={formData}
      collegeAcademicFormData={academicFormData}
      detailsObject={detailsObject}
      isConfirmation={true}
      onSuccess={onSuccess}
    />
  );
}

export default CollegePaymentPopup
