import React from 'react';
import { useParams } from 'react-router-dom';
import SchoolSale from '../SchoolSaleForm/SchoolSale';
import CollegeSaleForm from '../CollegeSaleForm/CollegeSaleForm';
import CollegeFastSale from '../CollegeFastSaleForm/CollegeFastSale';
import SchoolSaleConfirmationContainer from '../ConfirmationForms/SCHOOL-SALE_CONFIRMATION-CONTAINERS/school-sale&confirmation-container/SchoolSaleConfirmationContainer';
import CollegeSaleConfirmationContainer from '../ConfirmationForms/COLLEGE-SALE_CONFIRMATION-CONTAINER/college-saleAndConf-Container/CollegeSaleConfirmationContainer';
// Reverted: do not include DamagedForm route here

const SaleFormRouter = () => {
  const { status, applicationNo } = useParams();

  // Route based on status parameter
  switch(status?.toLowerCase()) {
    case 'school-sale':
    case 'school':
      return <SchoolSale />;
    
    case 'college-sale':
    case 'college':
      return <CollegeSaleForm />;
    
    case 'college-fast-sale':
    case 'fast-sale':
      return <CollegeFastSale />;
    
    case 'school-confirmation':
    case 'school-confirm':
      return <SchoolSaleConfirmationContainer />;
    
    case 'college-confirmation':
    case 'college-confirm':
      return <CollegeSaleConfirmationContainer />;
    
    // case 'damaged':
    //   return <DamagedForm />;
    
    default:
      // Default to school sale if status is unclear
      return <SchoolSale />;
  }
};

export default SaleFormRouter;
