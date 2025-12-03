import React from "react";
import PaymentPopup from "../../../../widgets/PaymentPopup/whole-payment-popup/PaymentPopup.jsx";

const SchoolPaymentPopup = ({ onClose, formData, siblings, detailsObject, onSuccess }) => {
  return (
    <PaymentPopup 
      onClose={onClose} 
      title="Complete Application Sale & Confirmation"
      formData={formData}
      siblings={siblings}
      detailsObject={detailsObject}
      type="school"
      isConfirmation={true}
      onSuccess={onSuccess}
    />
  );
};

export default SchoolPaymentPopup;
