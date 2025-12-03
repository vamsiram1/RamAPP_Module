import axios from 'axios';

// Use full URL - CORS needs to be configured on the backend
// For development: http://localhost:8080/api
// For production: Use environment variable REACT_APP_API_BASE_URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Submit school application sale and confirmation data
 * @param {Object} payload - The complete payload matching the API structure
 * @returns {Promise} - Axios response
 */
export const submitSchoolApplicationSale = async (payload) => {
  try {
    const endpoint = '/application-confirmation/confirm-school';
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Submitting to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    
    const response = await apiClient.post(endpoint, payload);
    console.log('✅ Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting school application sale:', error);
    console.error('📡 Request URL:', `${BASE_URL}/application-confirmation/confirm-school`);
    
    // Log detailed error information
    if (error.response) {
      // Server responded with error status
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // If 500 error, show backend error details
      if (error.response.status === 500) {
        console.error('⚠️ 500 Internal Server Error - Backend processing failed:');
        console.error('   Check backend server logs for detailed error message');
        console.error('   Common causes:');
        console.error('   1. Payload structure doesn\'t match backend expectations');
        console.error('   2. Missing required fields in the payload');
        console.error('   3. Database constraint violations');
        console.error('   4. Null pointer exceptions in backend code');
        console.error('   Backend error details:', error.response.data);
      }
      
      // If 404, suggest checking the endpoint path
      if (error.response.status === 404) {
        console.error('⚠️ 404 Not Found - Please verify:');
        console.error('   1. Backend server is running on http://localhost:8080');
        console.error('   2. Endpoint path is correct: /api/application-confirmation/confirm-school');
        console.error('   3. Backend controller has @PostMapping("/confirm-school") or equivalent');
        console.error('   4. Check if endpoint needs different path');
      }
      
      // If 400 Bad Request
      if (error.response.status === 400) {
        console.error('⚠️ 400 Bad Request - Payload validation failed:');
        console.error('   Check if all required fields are present and correctly formatted');
        console.error('   Backend validation errors:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('📊 Network Error - No response from server:', {
        message: error.message,
        code: error.code
      });
      
      // If CORS error
      if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
        console.error('⚠️ CORS Error - Backend needs CORS configuration:');
        console.error('   Your CORS config looks correct, but verify it\'s being applied');
        console.error('   Make sure the CORS config bean is being loaded');
      }
    } else {
      // Something else happened
      console.error('📊 Request Setup Error:', error.message);
    }
    
    throw error;
  }
};

/**
 * Map form data to API payload structure
 * @param {Object} formData - Form data from SchoolSaleConfFormsCont
 * @param {Array} siblings - Siblings array
 * @param {Object} paymentData - Payment form data
 * @param {Object} detailsObject - Details object from overview (contains studAdmsNo, applicationNo, etc.)
 * @param {String} activeTab - Active payment tab (cash, dd, cheque, card)
 * @returns {Object} - Mapped payload matching API structure
 */
export const mapFormDataToPayload = (formData, siblings, paymentData, detailsObject, activeTab) => {
  // Helper function to convert value to number or return 0
  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to convert value to string
  const toString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to convert date string to ISO format
  const toISODate = (dateString) => {
    if (!dateString) return new Date().toISOString();
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  // Get payment mode ID based on active tab
  const getPaymentModeId = () => {
    switch (activeTab) {
      case 'cash': return 1; // Assuming 1 = Cash
      case 'dd': return 2; // Assuming 2 = DD
      case 'cheque': return 3; // Assuming 3 = Cheque
      case 'card': return 4; // Assuming 4 = Card
      default: return 0;
    }
  };

  // Map parents array
  const parents = [];
  
  // Father - relationTypeId: 1
  if (formData.fatherName || formData.fatherPhone || formData.fatherEmail) {
    parents.push({
      name: toString(formData.fatherName),
      relationTypeId: 1, // Father
      occupation: toString(formData.fatherOccupation),
      otherOccupation: toString(formData.fatherOtherOccupation),
      mobileNo: toNumber(formData.fatherPhone),
      email: toString(formData.fatherEmail),
      createdBy: 0, // Update with actual user ID
      sectorId: toNumber(formData.fatherSector)
    });
  }

  // Mother - relationTypeId: 2
  if (formData.motherName || formData.motherPhone || formData.motherEmail) {
    parents.push({
      name: toString(formData.motherName),
      relationTypeId: 2, // Mother
      occupation: toString(formData.motherOccupation),
      otherOccupation: toString(formData.motherOtherOccupation),
      mobileNo: toNumber(formData.motherPhone),
      email: toString(formData.motherEmail),
      createdBy: 0, // Update with actual user ID
      sectorId: toNumber(formData.motherSector)
    });
  }

  // Map siblings array
  const mappedSiblings = siblings
    .filter(sibling => sibling.siblingName || sibling.siblingSchool || sibling.siblingClass)
    .map(sibling => ({
      fullName: toString(sibling.siblingName),
      schoolName: toString(sibling.siblingSchool),
      classId: toNumber(sibling.siblingClass),
      relationTypeId: toNumber(sibling.siblingRelation),
      genderId: 0, // Add gender field if available in form
      createdBy: 0 // Update with actual user ID
    }));

  // Map languages array
  const languages = [];
  if (formData.firstLanguage) {
    languages.push({
      langId: toNumber(formData.firstLanguage),
      languageName: toString(formData.firstLanguage) // You may need to get the name from ID
    });
  }
  if (formData.secondLanguage) {
    languages.push({
      langId: toNumber(formData.secondLanguage),
      languageName: toString(formData.secondLanguage)
    });
  }
  if (formData.thirdLanguage) {
    languages.push({
      langId: toNumber(formData.thirdLanguage),
      languageName: toString(formData.thirdLanguage)
    });
  }

  // Map concessions array
  const concessions = [];
  
  // Admission Fee Concession
  if (formData.admissionConcession && formData.admissionConcessionTypeId) {
    concessions.push({
      concessionTypeId: toNumber(formData.admissionConcessionTypeId),
      concessionAmount: toNumber(formData.admissionConcession),
      givenById: 0, // Add if available
      authorizedById: toNumber(formData.authorizedBy),
      reasonId: toNumber(formData.concessionReason),
      comments: toString(formData.concessionDescription),
      createdBy: 0, // Update with actual user ID
      concReferedBy: toNumber(formData.referredBy)
    });
  }

  // Tuition Fee Concession
  if (formData.tuitionConcession && formData.tuitionConcessionTypeId) {
    concessions.push({
      concessionTypeId: toNumber(formData.tuitionConcessionTypeId),
      concessionAmount: toNumber(formData.tuitionConcession),
      givenById: 0, // Add if available
      authorizedById: toNumber(formData.authorizedBy),
      reasonId: toNumber(formData.concessionReason),
      comments: toString(formData.concessionDescription),
      createdBy: 0, // Update with actual user ID
      concReferedBy: toNumber(formData.referredBy)
    });
  }

  // Map payment details based on active tab
  const paymentDetails = {
    paymentModeId: getPaymentModeId(),
    paymentDate: toISODate(paymentData.paymentDate || paymentData.card_paymentDate),
    amount: toNumber(paymentData.amount || paymentData.card_amount || paymentData.dd_amount || paymentData.cheque_amount),
    prePrintedReceiptNo: toString(paymentData.prePrinted || paymentData.card_receiptNo || paymentData.dd_receiptNo || paymentData.cheque_receiptNo),
    remarks: toString(paymentData.remarks || paymentData.card_remarks || paymentData.dd_remarks || paymentData.cheque_remarks),
    createdBy: 0, // Update with actual user ID
    transactionNumber: toString(paymentData.dd_transactionNo || paymentData.cheque_transactionNo || ''),
    transactionDate: toISODate(paymentData.dd_transactionDate || paymentData.cheque_transactionDate),
    organisationId: toNumber(paymentData.dd_org || paymentData.cheque_org || 0),
    bank: toString(paymentData.dd_bank || paymentData.cheque_bank || ''),
    branch: toString(paymentData.dd_branch || paymentData.cheque_branch || ''),
    ifscCode: toString(paymentData.dd_ifsc || paymentData.cheque_ifsc || ''),
    city: toString(paymentData.dd_city || paymentData.cheque_city || '')
  };

  // Build the complete payload
  // Debug: Log form data values before conversion
  console.log('🔍 Form Data Values Before Mapping:');
  console.log('  foodType:', formData.foodType, 'Type:', typeof formData.foodType);
  console.log('  bloodGroup:', formData.bloodGroup, 'Type:', typeof formData.bloodGroup);
  console.log('  caste:', formData.caste, 'Type:', typeof formData.caste);
  console.log('  religion:', formData.religion, 'Type:', typeof formData.religion);
  console.log('  orientationName:', formData.orientationName, 'Type:', typeof formData.orientationName);
  console.log('  scoreAppNo:', formData.scoreAppNo);
  console.log('  scoreMarks:', formData.scoreMarks);
  console.log('  Parents - Father:', formData.fatherName, 'Mother:', formData.motherName);
  console.log('  Siblings count:', siblings?.length || 0);
  console.log('  Languages:', formData.firstLanguage, formData.secondLanguage, formData.thirdLanguage);
  console.log('  Concessions - Admission:', formData.admissionConcession, 'Tuition:', formData.tuitionConcession);
  
  const payload = {
    studAdmsNo: toNumber(detailsObject?.applicationNo || detailsObject?.studAdmsNo || 0),
    createdBy: 0, // Update with actual user ID
    appConfDate: new Date().toISOString(),
    foodTypeId: toNumber(formData.foodType),
    bloodGroupId: toNumber(formData.bloodGroup),
    casteId: toNumber(formData.caste),
    religionId: toNumber(formData.religion),
    htNo: toString(formData.htNo || ''), // Add if available in form
    orientationId: toNumber(formData.orientationId || formData.orientationName || 0), // Use orientationId if available, fallback to orientationName conversion
    orientationBatchId: 0, // Add if available
    orientationDate: toISODate(formData.orientationDate || ''), // Add if available
    schoolStateId: 0, // Add if available
    schoolDistrictId: 0, // Add if available
    schoolTypeId: 0, // Add if available
    schoolName: toString(formData.schoolName || ''), // Add if available
    scoreAppNo: toString(formData.scoreAppNo || ''),
    marks: toNumber(formData.scoreMarks),
    parents: parents,
    siblings: mappedSiblings,
    languages: languages,
    concessions: concessions,
    paymentDetails: paymentDetails
  };

  // Log the final payload structure
  console.log('✅ Payload Created Successfully:');
  console.log('  - Total fields:', Object.keys(payload).length);
  console.log('  - Parents array:', payload.parents.length, 'items');
  console.log('  - Siblings array:', payload.siblings.length, 'items');
  console.log('  - Languages array:', payload.languages.length, 'items');
  console.log('  - Concessions array:', payload.concessions.length, 'items');
  console.log('  - Payment details:', Object.keys(payload.paymentDetails).length, 'fields');

  return payload;
};

/**
 * Submit school fast sale data
 * @param {Object} payload - The complete payload matching the fast sale API structure
 * @returns {Promise} - Axios response
 */
export const submitSchoolFastSale = async (payload) => {
  try {
    const endpoint = '/student_fast_sale/fast-sale';
    const fullUrl = `http://localhost:8080${endpoint}`;
    console.log('🌐 Submitting Fast Sale to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    
    const response = await axios.post(fullUrl, payload, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Fast Sale Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting school fast sale:', error);
    console.error('📡 Request URL:', `http://localhost:8080/student_fast_sale/fast-sale`);
    
    // Log detailed error information
    if (error.response) {
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    throw error;
  }
};

/**
 * Map form data to fast sale API payload structure
 * @param {Object} formData - Form data from SchoolSale form
 * @param {Object} paymentData - Payment form data
 * @param {Object} detailsObject - Details object (contains applicationNo, etc.)
 * @param {String} activeTab - Active payment tab (cash, dd, cheque, card)
 * @returns {Object} - Mapped payload matching fast sale API structure
 */
export const mapFormDataToFastSalePayload = (formData, paymentData, detailsObject, activeTab) => {
  // Helper function to convert value to number or return 0
  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    
    // If value is a string in "name - id" format, extract the ID
    if (typeof value === 'string' && value.includes(' - ')) {
      const parts = value.split(' - ');
      if (parts.length >= 2) {
        const extractedId = parts[parts.length - 1].trim();
        const num = Number(extractedId);
        if (!isNaN(num)) {
          return num;
        }
      }
    }
    
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to convert value to string
  const toString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to convert date string to ISO format
  const toISODate = (dateString) => {
    if (!dateString) return new Date().toISOString();
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  // Get payment mode ID based on active tab
  const getPaymentModeId = () => {
    switch (activeTab) {
      case 'cash': return 1;
      case 'dd': return 2;
      case 'cheque': return 3;
      case 'card': return 4;
      default: return 0;
    }
  };

  // Map address details
  const addressDetails = {
    doorNo: toString(formData.doorNo || ''),
    street: toString(formData.streetName || ''),
    landmark: toString(formData.landmark || ''),
    area: toString(formData.area || ''),
    cityId: toNumber(formData.city || formData.cityAddress),
    mandalId: toNumber(formData.mandal),
    districtId: toNumber(formData.district),
    pincode: toNumber(formData.pincode),
    stateId: toNumber(formData.state),
    createdBy: 0
  };

  // Map payment details based on active tab
  const paymentDetails = {
    paymentModeId: getPaymentModeId(),
    paymentDate: toISODate(paymentData.paymentDate || paymentData.card_paymentDate),
    amount: toNumber(paymentData.amount || paymentData.card_amount || paymentData.dd_amount || paymentData.cheque_amount),
    prePrintedReceiptNo: toString(paymentData.prePrinted || paymentData.card_receiptNo || paymentData.dd_receiptNo || paymentData.cheque_receiptNo),
    remarks: toString(paymentData.remarks || paymentData.card_remarks || paymentData.dd_remarks || paymentData.cheque_remarks),
    createdBy: 0,
    transactionNumber: toString(paymentData.dd_transactionNo || paymentData.cheque_transactionNo || ''),
    transactionDate: toISODate(paymentData.dd_transactionDate || paymentData.cheque_transactionDate),
    organisationId: toNumber(paymentData.dd_org || paymentData.cheque_org || 0),
    bank: toString(paymentData.dd_bank || paymentData.cheque_bank || ''),
    branch: toString(paymentData.dd_branch || paymentData.cheque_branch || ''),
    ifscCode: toString(paymentData.dd_ifsc || paymentData.cheque_ifsc || ''),
    city: toString(paymentData.dd_city || paymentData.cheque_city || '')
  };

  // Build the fast sale payload
  const payload = {
    createdBy: 0,
    aadharCardNo: toNumber(formData.aadharCardNo),
    apaarNo: toString(formData.aaparNo || ''),
    firstName: toString(formData.firstName || ''),
    lastName: toString(formData.surName || ''),
    genderId: toNumber(formData.gender),
    dob: toISODate(formData.dob),
    appTypeId: toNumber(formData.admissionType),
    quotaId: toNumber(formData.quotaAdmissionReferredBy),
    app_sale_date: new Date().toISOString(),
    admissionReferredBy: toString(formData.quotaAdmissionReferredBy || ''),
    fatherName: toString(formData.fatherName || ''),
    fatherMobileNo: toNumber(formData.fatherMobile),
    academicYearId: toNumber(formData.academicYearId || detailsObject?.academicYearId || formData.academicYear || 0),
    branchId: toNumber(formData.campusId || detailsObject?.campusId || detailsObject?.branchId || formData.campusName || formData.branchName || 0),
    classId: toNumber(formData.joiningClass),
    orientationId: toNumber(formData.orientationName),
    studentTypeId: toNumber(formData.studentType),
    addressDetails: addressDetails,
    paymentDetails: paymentDetails,
    studAdmsNo: toNumber(detailsObject?.applicationNo || detailsObject?.studAdmsNo || 0)
  };

  console.log('✅ Fast Sale Payload Created Successfully:');
  console.log('  - studAdmsNo:', payload.studAdmsNo);
  console.log('  - firstName:', payload.firstName);
  console.log('  - academicYearId:', payload.academicYearId, '(from formData.academicYearId:', formData.academicYearId, ')');
  console.log('  - branchId:', payload.branchId, '(from formData.campusId:', formData.campusId, ')');
  console.log('  - Payment Mode ID:', payload.paymentDetails?.paymentModeId);
  console.log('  - Payment Amount:', payload.paymentDetails?.amount);

  return payload;
};

/**
 * Submit school application sale data to create endpoint
 * @param {Object} payload - The complete payload matching the API structure
 * @returns {Promise} - Axios response
 */
export const submitSchoolApplicationSaleCreate = async (payload) => {
  try {
    const endpoint = '/student-admissions-sale/create';
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Submitting to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    
    const response = await apiClient.post(endpoint, payload);
    console.log('✅ Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting school application sale create:', error);
    console.error('📡 Request URL:', `${BASE_URL}/student-admissions-sale/create`);
    
    // Log detailed error information
    if (error.response) {
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    throw error;
  }
};

/**
 * Submit school application sale only (without confirmation)
 * @param {Object} payload - The complete payload matching the API structure
 * @returns {Promise} - Axios response
 */
export const submitSchoolApplicationSaleOnly = async (payload) => {
  try {
    const endpoint = '/student-admissions-sale/create/sale/only';
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Submitting to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    console.log('📋 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await apiClient.post(endpoint, payload);
    console.log('✅ Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting school application sale only:', error);
    console.error('📡 Request URL:', `${BASE_URL}/student-admissions-sale/create/sale/only`);
    
    // Log detailed error information
    if (error.response) {
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    throw error;
  }
};

/**
 * Map school application sale form data to create API payload structure
 * @param {Object} formData - Complete form data from SchoolSaleForm
 * @param {Object} paymentData - Payment form data
 * @param {Object} detailsObject - Details object from application data
 * @param {String} activeTab - Active payment tab (cash, dd, cheque, card)
 * @returns {Object} - Mapped payload matching API structure
 */
export const mapSchoolApplicationSaleToPayload = (formData, paymentData, detailsObject, activeTab) => {
  // Helper function to convert value to number or return 0
  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    
    // If value is a string in "name - id" format, extract the ID
    if (typeof value === 'string' && value.includes(' - ')) {
      const parts = value.split(' - ');
      if (parts.length >= 2) {
        const extractedId = parts[parts.length - 1].trim();
        const num = Number(extractedId);
        if (!isNaN(num)) {
          return num;
        }
      }
    }
    
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to convert value to string
  const toString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to convert date string to ISO format
  const toISODate = (dateString) => {
    if (!dateString) return new Date().toISOString();
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  // Get payment mode ID based on active tab
  const getPaymentModeId = () => {
    switch (activeTab) {
      case 'cash': return 1;
      case 'dd': return 2;
      case 'cheque': return 3;
      case 'card': return 4;
      default: return 0;
    }
  };

  // Map address details - prioritize ID fields over label fields
  const addressDetails = {
    doorNo: toString(formData.doorNo || ''),
    street: toString(formData.streetName || ''),
    landmark: toString(formData.landmark || ''),
    area: toString(formData.area || ''),
    cityId: toNumber(formData.cityId || formData.city || formData.cityAddress || 0),
    mandalId: toNumber(formData.mandalId || formData.mandal || 0),
    districtId: toNumber(formData.districtId || formData.district || 0),
    pincode: toNumber(formData.pincode || 0),
    stateId: toNumber(formData.stateId || formData.state || 0),
    createdBy: 0
  };

  // Map payment details
  const paymentDetails = {
    paymentModeId: getPaymentModeId(),
    paymentDate: toISODate(paymentData.paymentDate || paymentData.card_paymentDate),
    amount: toNumber(paymentData.amount || paymentData.card_amount || paymentData.dd_amount || paymentData.cheque_amount),
    prePrintedReceiptNo: toString(paymentData.prePrinted || paymentData.card_receiptNo || paymentData.dd_receiptNo || paymentData.cheque_receiptNo),
    remarks: toString(paymentData.remarks || paymentData.card_remarks || paymentData.dd_remarks || paymentData.cheque_remarks),
    createdBy: 0,
    transactionNumber: toString(paymentData.dd_transactionNo || paymentData.cheque_transactionNo || ''),
    transactionDate: toISODate(paymentData.dd_transactionDate || paymentData.cheque_transactionDate),
    organisationId: toNumber(paymentData.dd_org || paymentData.cheque_org || 0),
    bank: toString(paymentData.dd_bank || paymentData.cheque_bank || ''),
    branch: toString(paymentData.dd_branch || paymentData.cheque_branch || ''),
    ifscCode: toString(paymentData.dd_ifsc || paymentData.cheque_ifsc || ''),
    city: toString(paymentData.dd_city || paymentData.cheque_city || '')
  };

  // Log formData to debug what's being received
  console.log('🔍 ===== mapSchoolApplicationSaleToPayload - Received formData =====');
  console.log('Personal Info:', {
    firstName: formData.firstName,
    surName: formData.surName,
    gender: formData.gender,
    genderId: formData.genderId,
    aaparNo: formData.aaparNo,
    dob: formData.dob,
    aadharCardNo: formData.aadharCardNo,
  });
  console.log('Orientation Info:', {
    academicYearId: formData.academicYearId,
    branchId: formData.branchId,
    campusId: formData.campusId,
    studentTypeId: formData.studentTypeId,
    joiningClassId: formData.joiningClassId,
    classId: formData.classId,
    orientationId: formData.orientationId,
  });
  console.log('Other Info:', {
    quotaAdmissionReferredBy: formData.quotaAdmissionReferredBy,
    quotaId: formData.quotaId,
    admissionType: formData.admissionType,
    appTypeId: formData.appTypeId,
    proReceiptNo: formData.proReceiptNo,
    fatherName: formData.fatherName,
    fatherMobile: formData.fatherMobile,
  });
  console.log('Address Info:', {
    doorNo: formData.doorNo,
    streetName: formData.streetName,
    cityId: formData.cityId,
    stateId: formData.stateId,
    districtId: formData.districtId,
    pincode: formData.pincode,
  });
  console.log('==============================================================');

  // Build the payload
  const payload = {
    firstName: toString(formData.firstName || ''),
    lastName: toString(formData.surName || formData.lastName || ''),
    genderId: (() => {
      // First try to use genderId if it exists (stored by useEffect)
      // Check if genderId is a valid number (not null, undefined, empty string, or 0)
      if (formData.genderId !== null && formData.genderId !== undefined && formData.genderId !== "" && formData.genderId !== 0) {
        const id = toNumber(formData.genderId);
        console.log('✅ Using genderId from formData:', id, '(original value:', formData.genderId, ')');
        return id;
      }
      // Fallback: convert gender string to ID (hardcoded in frontend Gender widget)
      if (formData.gender === "MALE" || formData.gender === "Male") {
        console.log('✅ Converting gender "MALE" to genderId: 1');
        return 1;
      }
      if (formData.gender === "FEMALE" || formData.gender === "Female") {
        console.log('✅ Converting gender "FEMALE" to genderId: 2');
        return 2;
      }
      console.error('❌ ERROR: genderId is 0 or null! gender:', formData.gender, 'genderId:', formData.genderId);
      return 0;
    })(),
    apaarNo: toString(formData.aaparNo || formData.apaarNo || ''),
    dob: toISODate(formData.dob),
    aadharCardNo: toNumber(formData.aadharCardNo || 0),
    quotaId: (() => {
      // Prioritize quotaId if it exists
      if (formData.quotaId !== null && formData.quotaId !== undefined && formData.quotaId !== "" && formData.quotaId !== 0) {
        const id = toNumber(formData.quotaId);
        console.log('✅ Using quotaId from formData:', id);
        return id;
      }
      console.warn('⚠️ WARNING: quotaId is 0 or null! quotaAdmissionReferredBy:', formData.quotaAdmissionReferredBy, 'quotaId:', formData.quotaId);
      return 0;
    })(),
    proReceiptNo: toNumber(formData.proReceiptNo || 0),
    admissionReferedBy: toString(formData.quotaAdmissionReferredBy || formData.admissionReferedBy || ''),
    appSaleDate: new Date().toISOString(),
    fatherName: toString(formData.fatherName || ''),
    fatherMobileNo: toNumber(formData.fatherMobile || formData.fatherMobileNo || formData.mobileNumber || 0),
    academicYearId: toNumber(formData.academicYearId || detailsObject?.academicYearId || 0),
    branchId: toNumber(formData.branchId || formData.campusId || detailsObject?.campusId || detailsObject?.branchId || 0),
    studentTypeId: toNumber(formData.studentTypeId || 0),
    classId: toNumber(formData.joiningClassId || formData.classId || 0),
    orientationId: toNumber(formData.orientationId || 0),
    appTypeId: (() => {
      // Prioritize appTypeId if it exists
      if (formData.appTypeId !== null && formData.appTypeId !== undefined && formData.appTypeId !== "" && formData.appTypeId !== 0) {
        const id = toNumber(formData.appTypeId);
        console.log('✅ Using appTypeId from formData:', id);
        return id;
      }
      console.warn('⚠️ WARNING: appTypeId is 0 or null! admissionType:', formData.admissionType, 'appTypeId:', formData.appTypeId);
      return 0;
    })(),
    addressDetails: addressDetails,
    studAdmsNo: toNumber(detailsObject?.applicationNo || detailsObject?.studAdmsNo || 0),
    createdBy: 0,
    paymentDetails: paymentDetails
  };

  console.log('✅ School Application Sale Payload Created:');
  console.log('  - firstName:', payload.firstName);
  console.log('  - lastName:', payload.lastName);
  console.log('  - genderId:', payload.genderId, '(from formData.genderId:', formData.genderId, 'or formData.gender:', formData.gender, ')');
  console.log('  - academicYearId:', payload.academicYearId, '(from formData.academicYearId:', formData.academicYearId, ')');
  console.log('  - branchId:', payload.branchId, '(from formData.branchId:', formData.branchId, 'or formData.campusId:', formData.campusId, ')');
  console.log('  - studentTypeId:', payload.studentTypeId, '(from formData.studentTypeId:', formData.studentTypeId, ')');
  console.log('  - classId:', payload.classId, '(from formData.joiningClassId:', formData.joiningClassId, 'or formData.classId:', formData.classId, ')');
  console.log('  - orientationId:', payload.orientationId, '(from formData.orientationId:', formData.orientationId, ')');
  console.log('  - quotaId:', payload.quotaId, '(from formData.quotaId:', formData.quotaId, 'or formData.quotaAdmissionReferredBy:', formData.quotaAdmissionReferredBy, ')');
  console.log('  - appTypeId:', payload.appTypeId, '(from formData.appTypeId:', formData.appTypeId, 'or formData.admissionType:', formData.admissionType, ')');
  console.log('  - studAdmsNo:', payload.studAdmsNo);
  console.log('  - addressDetails.cityId:', payload.addressDetails?.cityId);
  console.log('  - addressDetails.stateId:', payload.addressDetails?.stateId);
  console.log('  - addressDetails.districtId:', payload.addressDetails?.districtId);

  return payload;
};

/**
 * Map school application sale form data to sale-only API payload structure
 * This is for the "Sale & Confirm" button that posts directly to /create/sale/only
 * @param {Object} formData - Complete form data from SchoolSaleForm
 * @param {Object} detailsObject - Details object from application data
 * @returns {Object} - Mapped payload matching API structure
 */
export const mapSchoolApplicationSaleOnlyToPayload = (formData, detailsObject) => {
  // Helper function to convert value to number or return 0
  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to convert value to string
  const toString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to convert date string to ISO format
  const toISODate = (dateString) => {
    if (!dateString) return new Date().toISOString();
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  // Map address details - prioritize ID fields
  const addressDetails = {
    doorNo: toString(formData.doorNo || ''),
    street: toString(formData.streetName || ''),
    landmark: toString(formData.landmark || ''),
    area: toString(formData.area || ''),
    cityId: toNumber(formData.cityId || 0),
    mandalId: toNumber(formData.mandalId || 0),
    districtId: toNumber(formData.districtId || 0),
    pincode: toNumber(formData.pincode || 0),
    stateId: toNumber(formData.stateId || 0),
    createdBy: 0
  };

  // Build the payload matching the provided structure
  const payload = {
    firstName: toString(formData.firstName || ''),
    lastName: toString(formData.surName || ''),
    genderId: toNumber(formData.genderId || 0),
    apaarNo: toString(formData.aaparNo || ''),
    dob: toISODate(formData.dob),
    aadharCardNo: toNumber(formData.aadharCardNo || 0),
    quotaId: toNumber(formData.quotaId || 0),
    proReceiptNo: toNumber(formData.proReceiptNo || 0),
    appSaleDate: toISODate(formData.appSaleDate || new Date()),
    admissionReferedBy: toString(formData.admissionReferedBy || formData.quotaAdmissionReferredBy || ''),
    fatherName: toString(formData.fatherName || ''),
    fatherMobileNo: toNumber(formData.fatherMobile || 0),
    academicYearId: toNumber(formData.academicYearId || 0),
    branchId: toNumber(formData.branchId || formData.campusId || 0),
    studentTypeId: toNumber(formData.studentTypeId || 0),
    classId: toNumber(formData.classId || formData.joiningClassId || 0),
    orientationId: toNumber(formData.orientationId || 0),
    appTypeId: toNumber(formData.appTypeId || 0),
    addressDetails: addressDetails,
    studAdmsNo: toNumber(detailsObject?.applicationNo || detailsObject?.studAdmsNo || 0),
    createdBy: 0
  };

  console.log('✅ Sale Only Payload Created:');
  console.log('  - firstName:', payload.firstName);
  console.log('  - lastName:', payload.lastName);
  console.log('  - genderId:', payload.genderId);
  console.log('  - academicYearId:', payload.academicYearId);
  console.log('  - branchId:', payload.branchId);
  console.log('  - classId:', payload.classId);
  console.log('  - orientationId:', payload.orientationId);
  console.log('  - studAdmsNo:', payload.studAdmsNo);

  return payload;
};

/**
 * Map school application sale form data to update API payload structure
 * @param {Object} formData - Complete form data from SchoolSaleForm
 * @param {Object} detailsObject - Details object from application data
 * @returns {Object} - Mapped payload matching update API structure
 */
export const mapSchoolApplicationSaleUpdateToPayload = (formData, detailsObject) => {
  // Helper function to convert value to number or return 0
  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to convert value to string
  const toString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to convert date string to ISO format
  const toISODate = (dateString) => {
    if (!dateString) return new Date().toISOString();
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  // Map address details - prioritize ID fields
  const addressDetails = {
    doorNo: toString(formData.doorNo || ''),
    street: toString(formData.streetName || ''),
    landmark: toString(formData.landmark || ''),
    area: toString(formData.area || ''),
    cityId: toNumber(formData.cityId || 0),
    mandalId: toNumber(formData.mandalId || 0),
    districtId: toNumber(formData.districtId || 0),
    pincode: toNumber(formData.pincode || 0),
    stateId: toNumber(formData.stateId || 0),
    createdBy: 0
  };

  // Get studAdmsNo from detailsObject or formData
  const studAdmsNoValue = toNumber(
    detailsObject?.studAdmsNo || 
    detailsObject?.stud_adms_no || 
    detailsObject?.applicationNo ||
    detailsObject?.application_no ||
    formData.studAdmsNo ||
    0
  );

  // Build the payload matching the update API structure
  const payload = {
    firstName: toString(formData.firstName || ''),
    lastName: toString(formData.surName || formData.lastName || ''),
    genderId: toNumber(formData.genderId || 0),
    apaarNo: toString(formData.aaparNo || ''),
    dob: toISODate(formData.dob),
    aadharCardNo: toNumber(formData.aadharCardNo || 0),
    quotaId: toNumber(formData.quotaId || 0),
    proReceiptNo: toNumber(formData.proReceiptNo || 0),
    appSaleDate: toISODate(formData.appSaleDate || new Date()),
    admissionReferedBy: toString(formData.admissionReferedBy || formData.quotaAdmissionReferredBy || ''),
    fatherName: toString(formData.fatherName || ''),
    fatherMobileNo: toNumber(formData.fatherMobile || formData.fatherMobileNo || 0),
    academicYearId: toNumber(formData.academicYearId || 0),
    branchId: toNumber(formData.branchId || formData.campusId || 0),
    studentTypeId: toNumber(formData.studentTypeId || 0),
    classId: toNumber(formData.classId || formData.joiningClassId || 0),
    orientationId: toNumber(formData.orientationId || 0),
    appTypeId: toNumber(formData.appTypeId || 0),
    addressDetails: addressDetails,
    studAdmsNo: studAdmsNoValue,
    createdBy: 0
  };

  console.log('📋 School Update Payload Mapping:');
  console.log('  - studAdmsNo (final value):', studAdmsNoValue);
  console.log('  - firstName:', payload.firstName);
  console.log('  - lastName:', payload.lastName);
  console.log('  - genderId:', payload.genderId);
  console.log('  - academicYearId:', payload.academicYearId);
  console.log('  - branchId:', payload.branchId);
  console.log('  - classId:', payload.classId);
  console.log('  - orientationId:', payload.orientationId);
  console.log('  - appTypeId:', payload.appTypeId);
  console.log('  - quotaId:', payload.quotaId);

  return payload;
};

/**
 * Update school application sale data
 * @param {String|Number} studAdmsNo - Student admission number (application number)
 * @param {Object} payload - The complete payload matching the update API structure
 * @returns {Promise} - Axios response
 */
export const updateSchoolApplicationSale = async (studAdmsNo, payload) => {
  try {
    const endpoint = `/student-admissions-sale/update_details/${studAdmsNo}`;
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Updating School Application Sale to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    console.log('📋 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await apiClient.put(endpoint, payload); // Use PUT for update
    console.log('✅ Update Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating school application sale:', error);
    console.error('📡 Request URL:', `${BASE_URL}/student-admissions-sale/update_details/${studAdmsNo}`);
    
    // Log detailed error information
    if (error.response) {
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    throw error;
  }
};

