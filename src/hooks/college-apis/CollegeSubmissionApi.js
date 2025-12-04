import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Submit college application confirmation data
 * @param {Object} payload - The complete payload matching the API structure
 * @returns {Promise} - Axios response
 */
export const submitCollegeApplicationConfirmation = async (payload) => {
  try {
    const endpoint = '/student_fast_sale/college-confirmation';
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Submitting to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    
    const response = await apiClient.post(endpoint, payload);
    console.log('✅ Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting college application confirmation:', error);
    console.error('📡 Request URL:', `${BASE_URL}/student_fast_sale/college-confirmation`);
    
    // Log detailed error information
    if (error.response) {
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 500) {
        console.error('⚠️ 500 Internal Server Error - Backend processing failed:');
        console.error('   Check backend server logs for detailed error message');
        console.error('   Backend error details:', error.response.data);
      }
    }
    
    throw error;
  }
};

/**
 * Map college form data to API payload structure
 * @param {Object} formData - Form data from CollegeAppConfContainer
 * @param {Object} academicFormData - Academic form data (from CollegeOrientInfoForms)
 * @param {Object} paymentData - Payment form data
 * @param {Object} detailsObject - Details object from overview
 * @param {String} activeTab - Active payment tab (cash, dd, cheque, card)
 * @returns {Object} - Mapped payload matching API structure
 */
export const mapCollegeFormDataToPayload = (formData, academicFormData, paymentData, detailsObject, activeTab) => {
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

  // Map concessions array
  const concessions = [];
  
  // Log all form data before processing
  console.log('🔍 ===== COLLEGE FORM DATA BEFORE MAPPING =====');
  console.log('Full formData object:', formData);
  console.log('  - firstYearConcession:', formData.firstYearConcession, 'Type:', typeof formData.firstYearConcession);
  console.log('  - firstYearConcessionTypeId:', formData.firstYearConcessionTypeId, 'Type:', typeof formData.firstYearConcessionTypeId);
  console.log('  - secondYearConcession:', formData.secondYearConcession, 'Type:', typeof formData.secondYearConcession);
  console.log('  - secondYearConcessionTypeId:', formData.secondYearConcessionTypeId, 'Type:', typeof formData.secondYearConcessionTypeId);
  console.log('  - concessionReason:', formData.concessionReason, 'Type:', typeof formData.concessionReason);
  console.log('  - authorizedBy:', formData.authorizedBy, 'Type:', typeof formData.authorizedBy);
  console.log('  - referredBy:', formData.referredBy, 'Type:', typeof formData.referredBy);
  console.log('  - description:', formData.description);
  console.log('===============================================');
  
  // First Year Concession - Only add if reasonId is provided (required by database)
  if (formData.firstYearConcession && formData.firstYearConcessionTypeId) {
    console.log('✅ First Year Concession found - checking reasonId...');
    console.log('  - Raw concessionReason value:', formData.concessionReason, 'Type:', typeof formData.concessionReason);
    
    // Extract reasonId - handle both ID format and "name - id" format
    let reasonId = 0;
    if (formData.concessionReason) {
      if (typeof formData.concessionReason === 'string' && formData.concessionReason.includes(' - ')) {
        // Extract ID from "name - id" format
        const parts = formData.concessionReason.split(' - ');
        if (parts.length >= 2) {
          const extractedId = parts[parts.length - 1].trim();
          reasonId = Number(extractedId);
          console.log('  - Extracted ID from "name - id" format:', extractedId, '->', reasonId);
        }
      } else {
        // Try to convert directly
        reasonId = toNumber(formData.concessionReason);
        console.log('  - Converted directly to number:', reasonId);
      }
    }
    
    console.log('  - Final reasonId:', reasonId, 'from:', formData.concessionReason);
    
    if (reasonId > 0) { // Only add if reasonId is valid (not 0 or null)
      // Extract authorizedBy and referredBy IDs (handle "name - id" format)
      const authorizedById = toNumber(formData.authorizedBy);
      const referredById = toNumber(formData.referredBy);
      
      const concession = {
        concessionTypeId: toNumber(formData.firstYearConcessionTypeId),
        concessionAmount: toNumber(formData.firstYearConcession),
        givenById: 0, // Add if available
        authorizedById: authorizedById,
        reasonId: reasonId, // Required field - must not be null
        comments: toString(formData.description),
        createdBy: 0, // Update with actual user ID
        concReferedBy: referredById
      };
      concessions.push(concession);
      console.log('✅ First Year Concession added:', concession);
    } else {
      console.warn('⚠️ First Year Concession SKIPPED: reasonId is required but not provided or is 0');
      console.warn('   - reasonId value:', reasonId);
      console.warn('   - concessionReason from formData:', formData.concessionReason);
    }
  } else {
    console.log('ℹ️ First Year Concession not added - missing amount or typeId');
    console.log('   - Has amount?', !!formData.firstYearConcession);
    console.log('   - Has typeId?', !!formData.firstYearConcessionTypeId);
  }

  // Second Year Concession - Only add if reasonId is provided (required by database)
  if (formData.secondYearConcession && formData.secondYearConcessionTypeId) {
    console.log('✅ Second Year Concession found - checking reasonId...');
    console.log('  - Raw concessionReason value:', formData.concessionReason, 'Type:', typeof formData.concessionReason);
    
    // Extract reasonId - handle both ID format and "name - id" format
    let reasonId = 0;
    if (formData.concessionReason) {
      if (typeof formData.concessionReason === 'string' && formData.concessionReason.includes(' - ')) {
        // Extract ID from "name - id" format
        const parts = formData.concessionReason.split(' - ');
        if (parts.length >= 2) {
          const extractedId = parts[parts.length - 1].trim();
          reasonId = Number(extractedId);
          console.log('  - Extracted ID from "name - id" format:', extractedId, '->', reasonId);
        }
      } else {
        // Try to convert directly
        reasonId = toNumber(formData.concessionReason);
        console.log('  - Converted directly to number:', reasonId);
      }
    }
    
    console.log('  - Final reasonId:', reasonId, 'from:', formData.concessionReason);
    
    if (reasonId > 0) { // Only add if reasonId is valid (not 0 or null)
      // Extract authorizedBy and referredBy IDs (handle "name - id" format)
      const authorizedById = toNumber(formData.authorizedBy);
      const referredById = toNumber(formData.referredBy);
      
      const concession = {
        concessionTypeId: toNumber(formData.secondYearConcessionTypeId),
        concessionAmount: toNumber(formData.secondYearConcession),
        givenById: 0, // Add if available
        authorizedById: authorizedById,
        reasonId: reasonId, // Required field - must not be null
        comments: toString(formData.description),
        createdBy: 0, // Update with actual user ID
        concReferedBy: referredById
      };
      concessions.push(concession);
      console.log('✅ Second Year Concession added:', concession);
    } else {
      console.warn('⚠️ Second Year Concession SKIPPED: reasonId is required but not provided or is 0');
      console.warn('   - reasonId value:', reasonId);
      console.warn('   - concessionReason from formData:', formData.concessionReason);
    }
  } else {
    console.log('ℹ️ Second Year Concession not added - missing amount or typeId');
    console.log('   - Has amount?', !!formData.secondYearConcession);
    console.log('   - Has typeId?', !!formData.secondYearConcessionTypeId);
  }
  
  // Log final concession mapping details
  console.log('🔍 ===== CONCESSION MAPPING SUMMARY =====');
  console.log('  - Total Concessions Created:', concessions.length);
  console.log('  - Concessions Array:', concessions);
  console.log('=========================================');

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
  console.log('🔍 College Form Data Values Before Mapping:');
  console.log('  academicYearId:', formData.academicYearId || detailsObject?.academicYearId);
  console.log('  joiningClassId:', academicFormData?.joiningClassId);
  console.log('  branchId:', academicFormData?.branchId);
  console.log('  studentTypeId:', academicFormData?.studentTypeId);
  console.log('  cityId:', academicFormData?.cityId);
  console.log('  courseNameId:', academicFormData?.courseNameId);
  console.log('  studAdmsNo:', detailsObject?.applicationNo);
  console.log('  Concessions - First Year:', formData.firstYearConcession, 'Second Year:', formData.secondYearConcession);

  const payload = {
    academicYearId: toNumber(formData.academicYearId || detailsObject?.academicYearId || 0),
    joiningClassId: toNumber(academicFormData?.joiningClassId || 0),
    branchId: toNumber(academicFormData?.branchId || 0),
    studentTypeId: toNumber(academicFormData?.studentTypeId || 0),
    cityId: toNumber(academicFormData?.cityId || 0),
    courseNameId: toNumber(academicFormData?.courseNameId || academicFormData?.orientationId || 0),
    studAdmsNo: toNumber(detailsObject?.applicationNo || detailsObject?.studAdmsNo || 0),
    createdBy: 0, // Update with actual user ID
    concessions: concessions, // Always include concessions array (even if empty)
    paymentDetails: paymentDetails
  };
  
  // Final payload validation
  console.log('🔍 ===== FINAL PAYLOAD VALIDATION =====');
  console.log('  - concessions array length:', payload.concessions.length);
  console.log('  - concessions array:', JSON.stringify(payload.concessions, null, 2));
  console.log('  - Is concessions array empty?', payload.concessions.length === 0);
  console.log('======================================');

  // Log the final payload structure
  console.log('✅ College Payload Created Successfully:');
  console.log('  - Total fields:', Object.keys(payload).length);
  console.log('  - Concessions array:', payload.concessions.length, 'items');
  console.log('  - Payment details:', Object.keys(payload.paymentDetails).length, 'fields');

  return payload;
};

/**
 * Submit college application sale data
 * @param {Object} payload - The complete payload matching the API structure
 * @returns {Promise} - Axios response
 */
export const submitCollegeApplicationSale = async (payload) => {
  try {
    const endpoint = '/student_fast_sale/college-application-sale';
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Submitting to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    
    const response = await apiClient.post(endpoint, payload);
    console.log('✅ Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting college application sale:', error);
    console.error('📡 Request URL:', `${BASE_URL}/student_fast_sale/college-application-sale`);
    
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
 * Map college application sale form data to API payload structure
 * @param {Object} formData - Complete form data from CollegeSaleForm
 * @param {Object} paymentData - Payment form data
 * @param {Object} detailsObject - Details object from application data
 * @param {String} activeTab - Active payment tab (cash, dd, cheque, card)
 * @returns {Object} - Mapped payload matching API structure
 */
export const mapCollegeApplicationSaleToPayload = (formData, paymentData, detailsObject, activeTab) => {
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

  // Map siblings array
  const siblings = (formData.siblings || []).map(sibling => ({
    fullName: toString(sibling.fullName),
    schoolName: toString(sibling.schoolName),
    classId: toNumber(sibling.classId),
    relationTypeId: toNumber(sibling.relationTypeId),
    genderId: toNumber(sibling.genderId) || 0,
    createdBy: 0
  }));

  // Map concessions array
  const concessions = [];
  
  // Log concession data for debugging
  console.log('🔍 ===== CONCESSION DATA MAPPING (Complete Sale) =====');
  console.log('  - firstYearConcession:', formData.firstYearConcession);
  console.log('  - firstYearConcessionTypeId:', formData.firstYearConcessionTypeId);
  console.log('  - secondYearConcession:', formData.secondYearConcession);
  console.log('  - secondYearConcessionTypeId:', formData.secondYearConcessionTypeId);
  console.log('  - concessionReason:', formData.concessionReason);
  console.log('  - authorizedBy:', formData.authorizedBy);
  console.log('  - referredBy:', formData.referredBy);
  console.log('  - description:', formData.description);
  console.log('====================================================');
  
  // First Year Concession - Add if amount and typeId exist
  if (formData.firstYearConcession && formData.firstYearConcessionTypeId) {
    console.log('✅ First Year Concession found - processing...');
    
    let reasonId = 0;
    if (formData.concessionReason) {
      if (typeof formData.concessionReason === 'string' && formData.concessionReason.includes(' - ')) {
        const parts = formData.concessionReason.split(' - ');
        if (parts.length >= 2) {
          reasonId = Number(parts[parts.length - 1].trim());
          console.log('  - Extracted reasonId from "name - id" format:', reasonId);
        }
      } else {
        reasonId = toNumber(formData.concessionReason);
        console.log('  - Converted concessionReason directly to number:', reasonId);
      }
    } else {
      console.warn('  - ⚠️ concessionReason is missing, using 0');
    }
    
    // Add concession even if reasonId is 0 (backend might handle it)
    const concession = {
      concessionTypeId: toNumber(formData.firstYearConcessionTypeId),
      concessionAmount: toNumber(formData.firstYearConcession),
      givenById: 0,
      authorizedById: toNumber(formData.authorizedBy || 0),
      reasonId: reasonId, // Allow 0 if not provided
      comments: toString(formData.description || ''),
      createdBy: 0,
      concReferedBy: toNumber(formData.referredBy || 0)
    };
    
    concessions.push(concession);
    console.log('✅ First Year Concession added:', concession);
  } else {
    console.log('ℹ️ First Year Concession not added - missing amount or typeId');
    console.log('   - Has amount?', !!formData.firstYearConcession);
    console.log('   - Has typeId?', !!formData.firstYearConcessionTypeId);
  }

  // Second Year Concession - Add if amount and typeId exist
  if (formData.secondYearConcession && formData.secondYearConcessionTypeId) {
    console.log('✅ Second Year Concession found - processing...');
    
    let reasonId = 0;
    if (formData.concessionReason) {
      if (typeof formData.concessionReason === 'string' && formData.concessionReason.includes(' - ')) {
        const parts = formData.concessionReason.split(' - ');
        if (parts.length >= 2) {
          reasonId = Number(parts[parts.length - 1].trim());
          console.log('  - Extracted reasonId from "name - id" format:', reasonId);
        }
      } else {
        reasonId = toNumber(formData.concessionReason);
        console.log('  - Converted concessionReason directly to number:', reasonId);
      }
    } else {
      console.warn('  - ⚠️ concessionReason is missing, using 0');
    }
    
    // Add concession even if reasonId is 0 (backend might handle it)
    const concession = {
      concessionTypeId: toNumber(formData.secondYearConcessionTypeId),
      concessionAmount: toNumber(formData.secondYearConcession),
      givenById: 0,
      authorizedById: toNumber(formData.authorizedBy || 0),
      reasonId: reasonId, // Allow 0 if not provided
      comments: toString(formData.description || ''),
      createdBy: 0,
      concReferedBy: toNumber(formData.referredBy || 0)
    };
    
    concessions.push(concession);
    console.log('✅ Second Year Concession added:', concession);
  } else {
    console.log('ℹ️ Second Year Concession not added - missing amount or typeId');
    console.log('   - Has amount?', !!formData.secondYearConcession);
    console.log('   - Has typeId?', !!formData.secondYearConcessionTypeId);
  }
  
  console.log('📊 Total Concessions:', concessions.length);
  console.log('====================================================');

  // Map address details
  const addressDetails = {
    doorNo: toString(formData.doorNo),
    street: toString(formData.streetName),
    landmark: toString(formData.landmark),
    area: toString(formData.area),
    cityId: toNumber(formData.cityAddress),
    mandalId: toNumber(formData.mandal),
    districtId: toNumber(formData.district),
    pincode: toNumber(formData.pincode),
    stateId: toNumber(formData.state),
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

  // Build the complete payload
  const payload = {
    studAdmsNo: toNumber(detailsObject?.applicationNo || detailsObject?.studAdmsNo || 0),
    createdBy: 0,
    hallTicketNumber: toString(formData.hallTicketNo),
    preHallTicketNo: toString(formData.tenthHallTicketNo),
    schoolStateId: toNumber(formData.schoolState),
    schoolDistrictId: toNumber(formData.schoolDistrict),
    schoolName: toString(formData.schoolName),
    scoreAppNo: toString(formData.scoreAppNo),
    scoreMarks: toNumber(formData.scoreMarks),
    schoolType: toNumber(formData.schoolType),
    proReceiptNo: toNumber(formData.proReceiptNo || 0),
    foodTypeId: toNumber(formData.foodType),
    bloodGroupId: toNumber(formData.bloodGroup),
    religionId: toNumber(formData.religion),
    casteId: toNumber(formData.caste),
    firstName: toString(formData.firstName),
    lastName: toString(formData.surName),
    genderId: toNumber(formData.gender),
    dob: toISODate(formData.dob),
    aadharCardNo: toNumber(formData.aadharCardNo),
    apaarNo: toString(formData.aaparNo),
    appTypeId: toNumber(formData.admissionType),
    quotaId: toNumber(formData.quotaAdmissionReferredBy),
    appSaleDate: new Date().toISOString(),
    admissionReferedBy: toString(formData.quotaAdmissionReferredBy),
    fatherName: toString(formData.fatherName),
    fatherMobileNo: toNumber(formData.mobileNumber || formData.fatherMobile),
    fatherEmail: toString(formData.email || formData.fatherEmail),
    fatherSectorId: (() => {
      // Prioritize fatherSectorId if it exists
      if (formData.fatherSectorId !== null && formData.fatherSectorId !== undefined && formData.fatherSectorId !== "" && formData.fatherSectorId !== 0) {
        return toNumber(formData.fatherSectorId);
      }
      console.warn('⚠️ WARNING: fatherSectorId is 0 or null!');
      return 0;
    })(),
    fatherOccupationId: (() => {
      // Prioritize fatherOccupationId if it exists
      if (formData.fatherOccupationId !== null && formData.fatherOccupationId !== undefined && formData.fatherOccupationId !== "" && formData.fatherOccupationId !== 0) {
        return toNumber(formData.fatherOccupationId);
      }
      console.warn('⚠️ WARNING: fatherOccupationId is 0 or null!');
      return 0;
    })(),
    motherName: toString(formData.motherName),
    motherMobileNo: toNumber(formData.motherMobile || 0),
    motherEmail: toString(formData.motherEmail || ''),
    motherSectorId: (() => {
      // Prioritize motherSectorId if it exists
      if (formData.motherSectorId !== null && formData.motherSectorId !== undefined && formData.motherSectorId !== "" && formData.motherSectorId !== 0) {
        return toNumber(formData.motherSectorId);
      }
      console.warn('⚠️ WARNING: motherSectorId is 0 or null!');
      return 0;
    })(),
    motherOccupationId: (() => {
      // Prioritize motherOccupationId if it exists
      if (formData.motherOccupationId !== null && formData.motherOccupationId !== undefined && formData.motherOccupationId !== "" && formData.motherOccupationId !== 0) {
        return toNumber(formData.motherOccupationId);
      }
      console.warn('⚠️ WARNING: motherOccupationId is 0 or null!');
      return 0;
    })(),
    academicYearId: toNumber(formData.academicYearId || detailsObject?.academicYearId || formData.academicYear || 0),
    branchId: toNumber(formData.branchId || formData.campusId || detailsObject?.campusId || detailsObject?.branchId || 0),
    classId: toNumber(formData.joiningClassId || formData.classId || 0),
    orientationId: toNumber(formData.orientationId || 0),
    studentTypeId: toNumber(formData.studentTypeId || 0),
    preCollegeName: toString(formData.collegeName),
    preCollegeTypeId: toNumber(formData.clgType),
    preCollegeStateId: toNumber(formData.clgState),
    preCollegeDistrictId: toNumber(formData.clgDistrict),
    addressDetails: addressDetails,
    paymentDetails: paymentDetails,
    siblings: siblings,
    concessions: concessions
  };

  return payload;
};

/**
 * Submit college fast sale data
 * @param {Object} payload - The complete payload matching the fast sale API structure
 * @returns {Promise} - Axios response
 */
export const submitCollegeFastSale = async (payload) => {
  try {
    const endpoint = '/student_fast_sale/fast-sale';
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Submitting College Fast Sale to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    console.log('📋 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await apiClient.post(endpoint, payload);
    console.log('✅ College Fast Sale Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting college fast sale:', error);
    console.error('📡 Request URL:', `${BASE_URL}/student_fast_sale/fast-sale`);
    
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
 * Map college fast sale form data to API payload structure
 * @param {Object} formData - Complete form data from CollegeFastSale
 * @param {Object} paymentData - Payment form data
 * @param {Object} detailsObject - Details object from application data
 * @param {String} activeTab - Active payment tab (cash, dd, cheque, card)
 * @returns {Object} - Mapped payload matching API structure
 */
export const mapCollegeFastSaleToPayload = (formData, paymentData, detailsObject, activeTab) => {
  // Log received formData for debugging
  console.log('🔍 ===== mapCollegeFastSaleToPayload - Received formData =====');
  console.log('  - admissionType:', formData.admissionType);
  console.log('  - appTypeId:', formData.appTypeId);
  console.log('  - gender:', formData.gender);
  console.log('  - genderId:', formData.genderId);
  console.log('  - quotaAdmissionReferredBy:', formData.quotaAdmissionReferredBy);
  console.log('  - quotaId:', formData.quotaId);
  console.log('  - fatherName:', formData.fatherName);
  console.log('  - fatherMobile:', formData.fatherMobile);
  console.log('  - mobileNumber:', formData.mobileNumber);
  console.log('==============================================================');
  
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
      case 'cash': return 1;
      case 'dd': return 2;
      case 'cheque': return 3;
      case 'card': return 4;
      default: return 0;
    }
  };

  // Map address details - prioritize ID fields
  const addressDetails = {
    doorNo: toString(formData.doorNo || ''),
    street: toString(formData.streetName || formData.street || ''),
    landmark: toString(formData.landmark || ''),
    area: toString(formData.area || ''),
    cityId: toNumber(formData.cityId || 0),
    mandalId: toNumber(formData.mandalId || 0),
    districtId: toNumber(formData.districtId || 0),
    pincode: toNumber(formData.pincode || 0),
    stateId: toNumber(formData.stateId || 0),
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

  // Build the payload matching the provided structure
  const payload = {
    createdBy: 0,
    aadharCardNo: toNumber(formData.aadharCardNo || 0),
    apaarNo: toString(formData.aaparNo || formData.apaarNo || ''),
    firstName: toString(formData.firstName || ''),
    lastName: toString(formData.surName || formData.lastName || ''),
    genderId: (() => {
      // Prioritize genderId if it exists
      if (formData.genderId !== null && formData.genderId !== undefined && formData.genderId !== "" && formData.genderId !== 0) {
        const id = toNumber(formData.genderId);
        console.log('✅ Using genderId from formData:', id);
        return id;
      }
      // Fallback: convert gender string to ID
      if (formData.gender === "MALE" || formData.gender === "Male") {
        console.log('✅ Converting gender "MALE" to genderId: 1');
        return 1;
      }
      if (formData.gender === "FEMALE" || formData.gender === "Female") {
        console.log('✅ Converting gender "FEMALE" to genderId: 2');
        return 2;
      }
      console.warn('⚠️ WARNING: genderId is 0 or null! gender:', formData.gender, 'genderId:', formData.genderId);
      return 0;
    })(),
    dob: toISODate(formData.dob),
    appTypeId: (() => {
      // Prioritize appTypeId if it exists and is valid
      if (formData.appTypeId !== null && formData.appTypeId !== undefined && formData.appTypeId !== "" && formData.appTypeId !== 0) {
        const id = toNumber(formData.appTypeId);
        console.log('✅ Using appTypeId from formData:', id, '(admissionType:', formData.admissionType, ')');
        return id;
      }
      // Log detailed warning with all available data
      console.error('❌ ERROR: appTypeId is 0 or null!');
      console.error('  - admissionType:', formData.admissionType);
      console.error('  - appTypeId:', formData.appTypeId);
      console.error('  - Full formData keys:', Object.keys(formData));
      console.error('  - formData values:', {
        admissionType: formData.admissionType,
        appTypeId: formData.appTypeId,
        genderId: formData.genderId,
        quotaId: formData.quotaId
      });
      // Return 0 but this will cause backend error - need to ensure appTypeId is set in component
      return 0;
    })(),
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
    app_sale_date: toISODate(formData.appSaleDate || new Date()),
    admissionReferredBy: toString(formData.admissionReferedBy || formData.admissionReferredBy || formData.quotaAdmissionReferredBy || ''),
    fatherName: toString(formData.fatherName || ''),
    fatherMobileNo: toNumber(formData.fatherMobile || formData.fatherMobileNo || formData.mobileNumber || 0),
    academicYearId: toNumber(formData.academicYearId || 0),
    branchId: toNumber(formData.branchId || formData.campusId || 0),
    classId: (() => {
      // Prioritize classId if it exists
      if (formData.classId !== null && formData.classId !== undefined && formData.classId !== "" && formData.classId !== 0) {
        const id = toNumber(formData.classId);
        console.log('✅ Using classId from formData:', id);
        return id;
      }
      // Try joiningClassId as fallback
      if (formData.joiningClassId !== null && formData.joiningClassId !== undefined && formData.joiningClassId !== "" && formData.joiningClassId !== 0) {
        const id = toNumber(formData.joiningClassId);
        console.log('✅ Using joiningClassId from formData:', id);
        return id;
      }
      console.error('❌ ERROR: classId is 0 or null! joiningClass:', formData.joiningClass, 'classId:', formData.classId, 'joiningClassId:', formData.joiningClassId);
      return 0;
    })(),
    orientationId: (() => {
      // Prioritize orientationId if it exists
      if (formData.orientationId !== null && formData.orientationId !== undefined && formData.orientationId !== "" && formData.orientationId !== 0) {
        return toNumber(formData.orientationId);
      }
      console.warn('⚠️ WARNING: orientationId is 0 or null! orientationName:', formData.orientationName);
      return 0;
    })(),
    studentTypeId: (() => {
      // Prioritize studentTypeId if it exists
      if (formData.studentTypeId !== null && formData.studentTypeId !== undefined && formData.studentTypeId !== "" && formData.studentTypeId !== 0) {
        return toNumber(formData.studentTypeId);
      }
      console.warn('⚠️ WARNING: studentTypeId is 0 or null! studentType:', formData.studentType);
      return 0;
    })(),
    addressDetails: addressDetails,
    paymentDetails: paymentDetails,
    studAdmsNo: toNumber(detailsObject?.applicationNo || detailsObject?.studAdmsNo || 0)
  };

  console.log('✅ College Fast Sale Payload Created:');
  console.log('  - firstName:', payload.firstName);
  console.log('  - lastName:', payload.lastName);
  console.log('  - genderId:', payload.genderId, '(from formData.genderId:', formData.genderId, 'or formData.gender:', formData.gender, ')');
  console.log('  - quotaId:', payload.quotaId, '(from formData.quotaId:', formData.quotaId, 'or formData.quotaAdmissionReferredBy:', formData.quotaAdmissionReferredBy, ')');
  console.log('  - appTypeId:', payload.appTypeId, '(from formData.appTypeId:', formData.appTypeId, 'or formData.admissionType:', formData.admissionType, ')');
  console.log('  - fatherName:', payload.fatherName, '(from formData.fatherName:', formData.fatherName, ')');
  console.log('  - fatherMobileNo:', payload.fatherMobileNo, '(from formData.fatherMobile:', formData.fatherMobile, 'or formData.mobileNumber:', formData.mobileNumber, ')');
  console.log('  - academicYearId:', payload.academicYearId);
  console.log('  - branchId:', payload.branchId);
  console.log('  - classId:', payload.classId);
  console.log('  - orientationId:', payload.orientationId);
  console.log('  - studentTypeId:', payload.studentTypeId);
  console.log('  - studAdmsNo:', payload.studAdmsNo);

  return payload;
};

/**
 * Map college application sale form data to complete API payload structure
 * This is for the complete college application sale with all fields
 * @param {Object} formData - Form data from CollegeSaleForm
 * @param {Object} paymentData - Payment form data
 * @param {Object} detailsObject - Details object from overview
 * @param {String} activeTab - Active payment tab (cash, dd, cheque, card)
 * @returns {Object} - Mapped payload matching complete API structure
 */
export const mapCollegeApplicationSaleCompleteToPayload = (formData, paymentData, detailsObject, activeTab) => {
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

  // Map siblings array
  const siblings = (formData.siblings || []).map(sibling => ({
    fullName: toString(sibling.fullName),
    schoolName: toString(sibling.schoolName),
    classId: toNumber(sibling.classId),
    relationTypeId: toNumber(sibling.relationTypeId),
    genderId: toNumber(sibling.genderId) || 0,
    createdBy: 0
  }));

  // Map concessions array
  const concessions = [];
  
  // Log concession data for debugging
  console.log('🔍 ===== CONCESSION DATA MAPPING (Complete Sale) =====');
  console.log('  - firstYearConcession:', formData.firstYearConcession);
  console.log('  - firstYearConcessionTypeId:', formData.firstYearConcessionTypeId);
  console.log('  - secondYearConcession:', formData.secondYearConcession);
  console.log('  - secondYearConcessionTypeId:', formData.secondYearConcessionTypeId);
  console.log('  - concessionReason:', formData.concessionReason);
  console.log('  - authorizedBy:', formData.authorizedBy);
  console.log('  - referredBy:', formData.referredBy);
  console.log('  - description:', formData.description);
  console.log('====================================================');
  
  // First Year Concession - Add if amount and typeId exist
  if (formData.firstYearConcession && formData.firstYearConcessionTypeId) {
    console.log('✅ First Year Concession found - processing...');
    
    // Prioritize concessionReasonId if it exists, otherwise try to extract from concessionReason
    let reasonId = 0;
    if (formData.concessionReasonId !== null && formData.concessionReasonId !== undefined && formData.concessionReasonId !== "" && formData.concessionReasonId !== 0) {
      reasonId = toNumber(formData.concessionReasonId);
      console.log('  - Using concessionReasonId from formData:', reasonId);
    } else if (formData.concessionReason) {
      if (typeof formData.concessionReason === 'string' && formData.concessionReason.includes(' - ')) {
        const parts = formData.concessionReason.split(' - ');
        if (parts.length >= 2) {
          reasonId = Number(parts[parts.length - 1].trim());
          console.log('  - Extracted reasonId from "name - id" format:', reasonId);
        }
      } else {
        reasonId = toNumber(formData.concessionReason);
        console.log('  - Converted concessionReason directly to number:', reasonId);
      }
    } else {
      console.error('  - ❌ ERROR: concessionReasonId is missing! This is required by the database.');
      console.error('     formData.concessionReasonId:', formData.concessionReasonId);
      console.error('     formData.concessionReason:', formData.concessionReason);
    }
    
    // Only add concession if reasonId is valid (required by database)
    if (reasonId > 0) {
      const concession = {
        concessionTypeId: toNumber(formData.firstYearConcessionTypeId),
        concessionAmount: toNumber(formData.firstYearConcession),
        givenById: 0,
        authorizedById: toNumber(formData.authorizedBy || 0),
        reasonId: reasonId, // Required field - must not be 0 or null
        comments: toString(formData.description || ''),
        createdBy: 0,
        concReferedBy: toNumber(formData.referredBy || 0)
      };
      
      concessions.push(concession);
      console.log('✅ First Year Concession added:', concession);
    } else {
      console.warn('⚠️ First Year Concession SKIPPED: reasonId is required but is 0 or null');
      console.warn('   - reasonId value:', reasonId);
      console.warn('   - concessionReasonId from formData:', formData.concessionReasonId);
      console.warn('   - concessionReason from formData:', formData.concessionReason);
    }
  } else {
    console.log('ℹ️ First Year Concession not added - missing amount or typeId');
    console.log('   - Has amount?', !!formData.firstYearConcession, 'Value:', formData.firstYearConcession);
    console.log('   - Has typeId?', !!formData.firstYearConcessionTypeId, 'Value:', formData.firstYearConcessionTypeId);
  }

  // Second Year Concession - Add if amount and typeId exist
  if (formData.secondYearConcession && formData.secondYearConcessionTypeId) {
    console.log('✅ Second Year Concession found - processing...');
    
    // Prioritize concessionReasonId if it exists, otherwise try to extract from concessionReason
    let reasonId = 0;
    if (formData.concessionReasonId !== null && formData.concessionReasonId !== undefined && formData.concessionReasonId !== "" && formData.concessionReasonId !== 0) {
      reasonId = toNumber(formData.concessionReasonId);
      console.log('  - Using concessionReasonId from formData:', reasonId);
    } else if (formData.concessionReason) {
      if (typeof formData.concessionReason === 'string' && formData.concessionReason.includes(' - ')) {
        const parts = formData.concessionReason.split(' - ');
        if (parts.length >= 2) {
          reasonId = Number(parts[parts.length - 1].trim());
          console.log('  - Extracted reasonId from "name - id" format:', reasonId);
        }
      } else {
        reasonId = toNumber(formData.concessionReason);
        console.log('  - Converted concessionReason directly to number:', reasonId);
      }
    } else {
      console.error('  - ❌ ERROR: concessionReasonId is missing! This is required by the database.');
      console.error('     formData.concessionReasonId:', formData.concessionReasonId);
      console.error('     formData.concessionReason:', formData.concessionReason);
    }
    
    // Only add concession if reasonId is valid (required by database)
    if (reasonId > 0) {
      const concession = {
        concessionTypeId: toNumber(formData.secondYearConcessionTypeId),
        concessionAmount: toNumber(formData.secondYearConcession),
        givenById: 0,
        authorizedById: toNumber(formData.authorizedBy || 0),
        reasonId: reasonId, // Required field - must not be 0 or null
        comments: toString(formData.description || ''),
        createdBy: 0,
        concReferedBy: toNumber(formData.referredBy || 0)
      };
      
      concessions.push(concession);
      console.log('✅ Second Year Concession added:', concession);
    } else {
      console.warn('⚠️ Second Year Concession SKIPPED: reasonId is required but is 0 or null');
      console.warn('   - reasonId value:', reasonId);
      console.warn('   - concessionReasonId from formData:', formData.concessionReasonId);
      console.warn('   - concessionReason from formData:', formData.concessionReason);
    }
  } else {
    console.log('ℹ️ Second Year Concession not added - missing amount or typeId');
    console.log('   - Has amount?', !!formData.secondYearConcession, 'Value:', formData.secondYearConcession);
    console.log('   - Has typeId?', !!formData.secondYearConcessionTypeId, 'Value:', formData.secondYearConcessionTypeId);
  }
  
  console.log('📊 Total Concessions:', concessions.length);
  console.log('====================================================');

  // Map address details
  const addressDetails = {
    doorNo: toString(formData.doorNo),
    street: toString(formData.streetName),
    landmark: toString(formData.landmark),
    area: toString(formData.area),
    cityId: (() => {
      // Prioritize cityId if it exists
      if (formData.cityId !== null && formData.cityId !== undefined && formData.cityId !== "" && formData.cityId !== 0) {
        return toNumber(formData.cityId);
      }
      // Try cityAddress as fallback
      return toNumber(formData.cityAddress || 0);
    })(),
    mandalId: (() => {
      // Prioritize mandalId if it exists
      if (formData.mandalId !== null && formData.mandalId !== undefined && formData.mandalId !== "" && formData.mandalId !== 0) {
        return toNumber(formData.mandalId);
      }
      // Try to convert mandal label to ID (fallback - will be 0 if not found)
      return toNumber(formData.mandal || 0);
    })(),
    districtId: (() => {
      // Prioritize districtId if it exists
      if (formData.districtId !== null && formData.districtId !== undefined && formData.districtId !== "" && formData.districtId !== 0) {
        return toNumber(formData.districtId);
      }
      // Try to convert district label to ID (fallback - will be 0 if not found)
      return toNumber(formData.district || 0);
    })(),
    pincode: toNumber(formData.pincode),
    stateId: (() => {
      // Prioritize stateId if it exists
      if (formData.stateId !== null && formData.stateId !== undefined && formData.stateId !== "" && formData.stateId !== 0) {
        return toNumber(formData.stateId);
      }
      // Try to convert state label to ID (fallback - will be 0 if not found)
      return toNumber(formData.state || 0);
    })(),
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

  // Build the complete payload matching the provided structure
  const payload = {
    studAdmsNo: toNumber(detailsObject?.applicationNo || detailsObject?.studAdmsNo || formData.studAdmsNo || 0),
    createdBy: 0,
    hallTicketNumber: toString(formData.hallTicketNo),
    preHallTicketNo: toString(formData.tenthHallTicketNo),
    schoolStateId: (() => {
      // Prioritize schoolStateId if it exists
      if (formData.schoolStateId !== null && formData.schoolStateId !== undefined && formData.schoolStateId !== "" && formData.schoolStateId !== 0) {
        return toNumber(formData.schoolStateId);
      }
      // Try to convert schoolState label to ID (fallback)
      return toNumber(formData.schoolState);
    })(),
    schoolDistrictId: (() => {
      // Prioritize schoolDistrictId if it exists
      if (formData.schoolDistrictId !== null && formData.schoolDistrictId !== undefined && formData.schoolDistrictId !== "" && formData.schoolDistrictId !== 0) {
        return toNumber(formData.schoolDistrictId);
      }
      // Try to convert schoolDistrict label to ID (fallback)
      return toNumber(formData.schoolDistrict);
    })(),
    schoolName: toString(formData.schoolName),
    scoreAppNo: toString(formData.scoreAppNo),
    scoreMarks: toNumber(formData.scoreMarks),
    schoolType: (() => {
      // Prioritize schoolTypeId if it exists
      if (formData.schoolTypeId !== null && formData.schoolTypeId !== undefined && formData.schoolTypeId !== "" && formData.schoolTypeId !== 0) {
        return toNumber(formData.schoolTypeId);
      }
      // Try to convert schoolType label to ID (fallback)
      return toNumber(formData.schoolType);
    })(),
    proReceiptNo: toNumber(formData.proReceiptNo || 0),
    foodTypeId: (() => {
      // Prioritize foodTypeId if it exists
      if (formData.foodTypeId !== null && formData.foodTypeId !== undefined && formData.foodTypeId !== "" && formData.foodTypeId !== 0) {
        return toNumber(formData.foodTypeId);
      }
      // Try to convert foodType label to ID (fallback)
      return toNumber(formData.foodType || 0);
    })(),
    bloodGroupId: (() => {
      // Prioritize bloodGroupId if it exists
      if (formData.bloodGroupId !== null && formData.bloodGroupId !== undefined && formData.bloodGroupId !== "" && formData.bloodGroupId !== 0) {
        return toNumber(formData.bloodGroupId);
      }
      // Try to convert bloodGroup label to ID (fallback)
      return toNumber(formData.bloodGroup || 0);
    })(),
    religionId: (() => {
      // Prioritize religionId if it exists
      if (formData.religionId !== null && formData.religionId !== undefined && formData.religionId !== "" && formData.religionId !== 0) {
        return toNumber(formData.religionId);
      }
      // Try to convert religion label to ID (fallback)
      return toNumber(formData.religion || 0);
    })(),
    casteId: (() => {
      // Prioritize casteId if it exists
      if (formData.casteId !== null && formData.casteId !== undefined && formData.casteId !== "" && formData.casteId !== 0) {
        return toNumber(formData.casteId);
      }
      // Try to convert caste label to ID (fallback)
      return toNumber(formData.caste || 0);
    })(),
    firstName: toString(formData.firstName),
    lastName: toString(formData.surName || formData.lastName),
    genderId: (() => {
      // Prioritize genderId if it exists
      if (formData.genderId !== null && formData.genderId !== undefined && formData.genderId !== "" && formData.genderId !== 0) {
        return toNumber(formData.genderId);
      }
      // Fallback: convert gender string to ID
      if (formData.gender === "MALE" || formData.gender === "Male") {
        return 1;
      }
      if (formData.gender === "FEMALE" || formData.gender === "Female") {
        return 2;
      }
      return toNumber(formData.gender);
    })(),
    dob: toISODate(formData.dob),
    aadharCardNo: toNumber(formData.aadharCardNo),
    apaarNo: toString(formData.aaparNo || formData.apaarNo),
    appTypeId: (() => {
      // Prioritize appTypeId if it exists
      if (formData.appTypeId !== null && formData.appTypeId !== undefined && formData.appTypeId !== "" && formData.appTypeId !== 0) {
        return toNumber(formData.appTypeId);
      }
      return toNumber(formData.admissionType);
    })(),
    quotaId: (() => {
      // Prioritize quotaId if it exists
      if (formData.quotaId !== null && formData.quotaId !== undefined && formData.quotaId !== "" && formData.quotaId !== 0) {
        return toNumber(formData.quotaId);
      }
      return toNumber(formData.quotaAdmissionReferredBy);
    })(),
    appSaleDate: toISODate(formData.appSaleDate || new Date()),
    admissionReferedBy: toString(formData.admissionReferedBy || formData.admissionReferredBy || formData.quotaAdmissionReferredBy || ''),
    fatherName: toString(formData.fatherName),
    fatherMobileNo: toNumber(formData.mobileNumber || formData.fatherMobile || formData.fatherMobileNo),
    fatherEmail: toString(formData.email || formData.fatherEmail),
    fatherSectorId: (() => {
      // Prioritize fatherSectorId if it exists
      if (formData.fatherSectorId !== null && formData.fatherSectorId !== undefined && formData.fatherSectorId !== "" && formData.fatherSectorId !== 0) {
        const id = toNumber(formData.fatherSectorId);
        console.log('✅ Using fatherSectorId from formData:', id);
        return id;
      }
      console.warn('⚠️ WARNING: fatherSectorId is 0 or null! sector:', formData.sector, 'fatherSector:', formData.fatherSector, 'fatherSectorId:', formData.fatherSectorId);
      return 0;
    })(),
    fatherOccupationId: (() => {
      // Prioritize fatherOccupationId if it exists
      if (formData.fatherOccupationId !== null && formData.fatherOccupationId !== undefined && formData.fatherOccupationId !== "" && formData.fatherOccupationId !== 0) {
        const id = toNumber(formData.fatherOccupationId);
        console.log('✅ Using fatherOccupationId from formData:', id);
        return id;
      }
      console.warn('⚠️ WARNING: fatherOccupationId is 0 or null! occupation:', formData.occupation, 'fatherOccupation:', formData.fatherOccupation, 'fatherOccupationId:', formData.fatherOccupationId);
      return 0;
    })(),
    motherName: toString(formData.motherName),
    motherMobileNo: toNumber(formData.motherMobile || formData.motherMobileNo),
    motherEmail: toString(formData.motherEmail),
    motherSectorId: (() => {
      // Prioritize motherSectorId if it exists
      if (formData.motherSectorId !== null && formData.motherSectorId !== undefined && formData.motherSectorId !== "" && formData.motherSectorId !== 0) {
        const id = toNumber(formData.motherSectorId);
        console.log('✅ Using motherSectorId from formData:', id);
        return id;
      }
      console.warn('⚠️ WARNING: motherSectorId is 0 or null! motherSector:', formData.motherSector, 'motherSectorId:', formData.motherSectorId);
      return 0;
    })(),
    motherOccupationId: (() => {
      // Prioritize motherOccupationId if it exists
      if (formData.motherOccupationId !== null && formData.motherOccupationId !== undefined && formData.motherOccupationId !== "" && formData.motherOccupationId !== 0) {
        const id = toNumber(formData.motherOccupationId);
        console.log('✅ Using motherOccupationId from formData:', id);
        return id;
      }
      console.warn('⚠️ WARNING: motherOccupationId is 0 or null! motherOccupation:', formData.motherOccupation, 'motherOccupationId:', formData.motherOccupationId);
      return 0;
    })(),
    academicYearId: (() => {
      // Prioritize academicYearId if it exists
      if (formData.academicYearId !== null && formData.academicYearId !== undefined && formData.academicYearId !== "" && formData.academicYearId !== 0) {
        const id = toNumber(formData.academicYearId);
        console.log('✅ Using academicYearId from formData:', id);
        return id;
      }
      // Try detailsObject as fallback
      if (detailsObject?.academicYearId !== null && detailsObject?.academicYearId !== undefined && detailsObject?.academicYearId !== "" && detailsObject?.academicYearId !== 0) {
        const id = toNumber(detailsObject.academicYearId);
        console.log('✅ Using academicYearId from detailsObject:', id);
        return id;
      }
      console.error('❌ ERROR: academicYearId is 0 or null! formData.academicYearId:', formData.academicYearId, 'detailsObject?.academicYearId:', detailsObject?.academicYearId, 'formData.academicYear:', formData.academicYear);
      return 0;
    })(),
    branchId: toNumber(formData.branchId || formData.campusId || detailsObject?.campusId || detailsObject?.branchId || 0),
    classId: toNumber(formData.joiningClassId || formData.classId || 0),
    orientationId: toNumber(formData.orientationId || 0),
    studentTypeId: toNumber(formData.studentTypeId || 0),
    preCollegeName: toString(formData.collegeName || formData.preCollegeName),
    preCollegeTypeId: (() => {
      // Prioritize preCollegeTypeId if it exists
      if (formData.preCollegeTypeId !== null && formData.preCollegeTypeId !== undefined && formData.preCollegeTypeId !== "" && formData.preCollegeTypeId !== 0) {
        return toNumber(formData.preCollegeTypeId);
      }
      // Try to convert clgType label to ID (fallback)
      return toNumber(formData.clgType);
    })(),
    preCollegeStateId: (() => {
      // Prioritize preCollegeStateId if it exists
      if (formData.preCollegeStateId !== null && formData.preCollegeStateId !== undefined && formData.preCollegeStateId !== "" && formData.preCollegeStateId !== 0) {
        return toNumber(formData.preCollegeStateId);
      }
      // Try to convert clgState label to ID (fallback)
      return toNumber(formData.clgState);
    })(),
    preCollegeDistrictId: (() => {
      // Prioritize preCollegeDistrictId if it exists
      if (formData.preCollegeDistrictId !== null && formData.preCollegeDistrictId !== undefined && formData.preCollegeDistrictId !== "" && formData.preCollegeDistrictId !== 0) {
        return toNumber(formData.preCollegeDistrictId);
      }
      // Try to convert clgDistrict label to ID (fallback)
      return toNumber(formData.clgDistrict);
    })(),
    addressDetails: addressDetails,
    paymentDetails: paymentDetails,
    siblings: siblings,
    concessions: concessions
  };

  console.log('✅ College Application Sale Complete Payload Created:');
  console.log('  - studAdmsNo:', payload.studAdmsNo);
  console.log('  - firstName:', payload.firstName);
  console.log('  - lastName:', payload.lastName);
  console.log('  - genderId:', payload.genderId);
  console.log('  - appTypeId:', payload.appTypeId);
  console.log('  - quotaId:', payload.quotaId);
  console.log('  - academicYearId:', payload.academicYearId);
  console.log('  - branchId:', payload.branchId);
  console.log('  - classId:', payload.classId);
  console.log('  - orientationId:', payload.orientationId);
  console.log('  - studentTypeId:', payload.studentTypeId);
  console.log('  - siblings count:', payload.siblings.length);
  console.log('  - concessions count:', payload.concessions.length);

  return payload;
};

/**
 * Submit college application sale complete data
 * @param {Object} payload - The complete payload matching the API structure
 * @returns {Promise} - Axios response
 */
export const submitCollegeApplicationSaleComplete = async (payload) => {
  try {
    const endpoint = '/student_fast_sale/college-application-sale';
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Submitting to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    
    const response = await apiClient.post(endpoint, payload);
    console.log('✅ Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting college application sale complete:', error);
    console.error('📡 Request URL:', `${BASE_URL}/student_fast_sale/college-application-sale`);
    
    // Log detailed error information
    if (error.response) {
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 500) {
        console.error('⚠️ 500 Internal Server Error - Backend processing failed:');
        console.error('   Check backend server logs for detailed error message');
        console.error('   Backend error details:', error.response.data);
      }
    }
    
    throw error;
  }
};

/**
 * Map college application sale form data to update API payload structure
 * @param {Object} formData - Complete form data from CollegeSaleForm
 * @param {Object} paymentData - Payment form data (not used for update, but kept for consistency)
 * @param {Object} detailsObject - Details object from application data
 * @param {String} activeTab - Active payment tab (not used for update, but kept for consistency)
 * @returns {Object} - Mapped payload matching update API structure
 */
export const mapCollegeApplicationSaleUpdateToPayload = (formData, paymentData, detailsObject, activeTab) => {
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

  // Map siblings array
  const siblings = (formData.siblings || []).map(sibling => ({
    fullName: toString(sibling.fullName),
    schoolName: toString(sibling.schoolName),
    classId: toNumber(sibling.classId),
    relationTypeId: toNumber(sibling.relationTypeId),
    genderId: toNumber(sibling.genderId) || 0,
    createdBy: 0
  }));

  // Map concessions array
  const concessions = [];
  
  // Helper function to extract employee ID from formData
  // Handles both ID format (number) and name format (string)
  const getEmployeeId = (employeeValue, employeeIdValue) => {
    // Priority 1: Use stored ID if available
    if (employeeIdValue !== null && employeeIdValue !== undefined && employeeIdValue !== "" && employeeIdValue !== 0) {
      return toNumber(employeeIdValue);
    }
    // Priority 2: Try to convert employeeValue directly to number (if it's already an ID)
    if (employeeValue && typeof employeeValue === 'number') {
      return toNumber(employeeValue);
    }
    // Priority 3: If employeeValue is a string, try to extract ID from "name - id" format
    if (employeeValue && typeof employeeValue === 'string' && employeeValue.includes(' - ')) {
      const parts = employeeValue.split(' - ');
      if (parts.length >= 2) {
        const extractedId = parts[parts.length - 1].trim();
        const num = Number(extractedId);
        if (!isNaN(num)) {
          return num;
        }
      }
    }
    // Priority 4: Try to convert employeeValue string to number (if it's a numeric string)
    if (employeeValue) {
      const num = Number(employeeValue);
      if (!isNaN(num) && num !== 0) {
        return num;
      }
    }
    return 0;
  };

  // First Year Concession
  if (formData.firstYearConcession && formData.firstYearConcessionTypeId) {
    let reasonId = 0;
    if (formData.concessionReasonId !== null && formData.concessionReasonId !== undefined && formData.concessionReasonId !== "" && formData.concessionReasonId !== 0) {
      reasonId = toNumber(formData.concessionReasonId);
    } else if (formData.concessionReason) {
      reasonId = toNumber(formData.concessionReason);
    }
    
    // Extract employee IDs
    const authorizedById = getEmployeeId(formData.authorizedBy, formData.authorizedById);
    const referredById = getEmployeeId(formData.referredBy, formData.referredById);
    
    console.log('📋 First Year Concession - Employee IDs:', {
      authorizedBy: formData.authorizedBy,
      authorizedById: formData.authorizedById,
      authorizedByIdFinal: authorizedById,
      referredBy: formData.referredBy,
      referredById: formData.referredById,
      referredByIdFinal: referredById
    });
    
    concessions.push({
      concessionTypeId: toNumber(formData.firstYearConcessionTypeId),
      concessionAmount: toNumber(formData.firstYearConcession),
      givenById: 0,
      authorizedById: authorizedById,
      reasonId: reasonId,
      comments: toString(formData.description || ''),
      createdBy: 0,
      concReferedBy: referredById
    });
  }

  // Second Year Concession
  if (formData.secondYearConcession && formData.secondYearConcessionTypeId) {
    let reasonId = 0;
    if (formData.concessionReasonId !== null && formData.concessionReasonId !== undefined && formData.concessionReasonId !== "" && formData.concessionReasonId !== 0) {
      reasonId = toNumber(formData.concessionReasonId);
    } else if (formData.concessionReason) {
      reasonId = toNumber(formData.concessionReason);
    }
    
    // Extract employee IDs
    const authorizedById = getEmployeeId(formData.authorizedBy, formData.authorizedById);
    const referredById = getEmployeeId(formData.referredBy, formData.referredById);
    
    console.log('📋 Second Year Concession - Employee IDs:', {
      authorizedBy: formData.authorizedBy,
      authorizedById: formData.authorizedById,
      authorizedByIdFinal: authorizedById,
      referredBy: formData.referredBy,
      referredById: formData.referredById,
      referredByIdFinal: referredById
    });
    
    concessions.push({
      concessionTypeId: toNumber(formData.secondYearConcessionTypeId),
      concessionAmount: toNumber(formData.secondYearConcession),
      givenById: 0,
      authorizedById: authorizedById,
      reasonId: reasonId,
      comments: toString(formData.description || ''),
      createdBy: 0,
      concReferedBy: referredById
    });
  }

  // Map address details
  const addressDetails = {
    doorNo: toString(formData.doorNo || ''),
    street: toString(formData.streetName || formData.street || ''),
    landmark: toString(formData.landmark || ''),
    area: toString(formData.area || ''),
    cityId: toNumber(formData.cityId || 0),
    mandalId: toNumber(formData.mandalId || 0),
    districtId: toNumber(formData.districtId || 0),
    pincode: toNumber(formData.pincode || 0),
    stateId: toNumber(formData.stateId || 0),
    createdBy: 0
  };

  // Build the payload matching the update API structure
  // Note: scoreAppNo contains the student admission number (studAdmsNo)
  const scoreAppNoValue = formData.scoreAppNo || detailsObject?.scoreAppNo || '';
  const studAdmsNoValue = toNumber(
    scoreAppNoValue || // Use scoreAppNo as studAdmsNo (scoreAppNo contains the student admission number)
    detailsObject?.studAdmsNo || 
    detailsObject?.stud_adms_no || 
    detailsObject?.applicationNo ||
    detailsObject?.application_no ||
    0
  );
  
  const payload = {
    studAdmsNo: studAdmsNoValue, // Use scoreAppNo as studAdmsNo
    createdBy: 0,
    hallTicketNumber: toString(formData.hallTicketNo || formData.tenthHallTicketNo || formData.interFirstYearHallTicketNo || formData.interHallTicketNo || '').substring(0, 15), // Limit to 15 chars to prevent "value too long" error
    schoolStateId: toNumber(formData.schoolStateId || 0),
    schoolDistrictId: toNumber(formData.schoolDistrictId || 0),
    schoolName: toString(formData.schoolName || ''),
    scoreAppNo: toString(scoreAppNoValue), // Keep scoreAppNo as string
    scoreMarks: toNumber(formData.scoreMarks || 0),
    proReceiptNo: toNumber(formData.proReceiptNo || 0),
    foodTypeId: toNumber(formData.foodTypeId || 0),
    bloodGroupId: toNumber(formData.bloodGroupId || 0),
    religionId: toNumber(formData.religionId || 0),
    casteId: toNumber(formData.casteId || 0),
    firstName: toString(formData.firstName || ''),
    lastName: toString(formData.surName || formData.lastName || ''),
    genderId: (() => {
      if (formData.genderId !== null && formData.genderId !== undefined && formData.genderId !== "" && formData.genderId !== 0) {
        return toNumber(formData.genderId);
      }
      if (formData.gender === "MALE" || formData.gender === "Male") return 1;
      if (formData.gender === "FEMALE" || formData.gender === "Female") return 2;
      return 0;
    })(),
    dob: toISODate(formData.dob),
    aadharCardNo: toNumber(formData.aadharCardNo || 0),
    apaarNo: toString(formData.aaparNo || formData.apaarNo || ''),
    admissionReferredBy: toString(formData.quotaAdmissionReferredBy || formData.admissionReferredBy || ''),
    appTypeId: toNumber(formData.appTypeId || 0),
    quotaId: toNumber(formData.quotaId || 0),
    appSaleDate: toISODate(formData.appSaleDate || new Date()),
    fatherName: toString(formData.fatherName || ''),
    fatherMobileNo: toNumber(formData.fatherMobile || formData.fatherMobileNo || 0),
    fatherEmail: toString(formData.fatherEmail || ''),
    fatherSectorId: toNumber(formData.fatherSectorId || 0),
    fatherOccupationId: toNumber(formData.fatherOccupationId || 0),
    motherName: toString(formData.motherName || ''),
    motherMobileNo: toNumber(formData.motherMobile || formData.motherMobileNo || 0),
    motherEmail: toString(formData.motherEmail || ''),
    motherSectorId: toNumber(formData.motherSectorId || 0),
    motherOccupationId: toNumber(formData.motherOccupationId || 0),
    academicYearId: toNumber(formData.academicYearId || 0),
    cityId: toNumber(formData.cityId || 0),
    branchId: toNumber(formData.branchId || formData.campusId || 0),
    classId: toNumber(formData.classId || formData.joiningClassId || 0),
    orientationId: toNumber(formData.orientationId || 0),
    studentTypeId: toNumber(formData.studentTypeId || 0),
    addressDetails: addressDetails,
    siblings: siblings,
    concessions: concessions,
    preCollegeName: toString(formData.collegeName || formData.preCollegeName || '').substring(0, 200), // Limit to 200 chars to prevent "value too long" error
    preCollegeTypeId: toNumber(formData.preCollegeTypeId || 0),
    preCollegeStateId: toNumber(formData.preCollegeStateId || 0),
    preCollegeDistrictId: toNumber(formData.preCollegeDistrictId || 0),
    preHallTicketNo: toString(formData.hallTicketNo || formData.preHallTicketNo || '').substring(0, 15) // Limit to 15 chars to prevent "value too long" error
  };

  // Log for debugging
  console.log('📋 Update Payload Mapping:');
  console.log('  - scoreAppNo (used as studAdmsNo):', scoreAppNoValue);
  console.log('  - studAdmsNo (final value):', studAdmsNoValue);
  console.log('  - scoreAppNo (string field):', payload.scoreAppNo);

  return payload;
};

/**
 * Update college application sale data
 * @param {String} applicationNo - Application number for the update endpoint
 * @param {Object} payload - The complete payload matching the update API structure
 * @returns {Promise} - Axios response
 */
export const updateCollegeApplicationSale = async (applicationNo, payload) => {
  try {
    const endpoint = `/student_fast_sale/update/${applicationNo}`;
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Updating College Application Sale to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    console.log('📋 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await apiClient.put(endpoint, payload);
    console.log('✅ Update Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating college application sale:', error);
    console.error('📡 Request URL:', `${BASE_URL}/student_fast_sale/update/${applicationNo}`);
    
    // Log detailed error information
    if (error.response) {
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 500) {
        console.error('⚠️ 500 Internal Server Error - Backend processing failed:');
        console.error('   Check backend server logs for detailed error message');
        console.error('   Backend error details:', error.response.data);
      }
    }
    
    throw error;
  }
};

