import axios from 'axios';
import { useState, useEffect } from 'react';
 
const BASE_URL = 'http://localhost:8080/api';
 
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});
 
// Fetch application status data by employee ID
export const getApplicationStatusData = async (empId) => {
  try {
    const response = await apiClient.get(`/application-status/getview/employee-campus/${empId}`);
    return response.data;
  } catch (error) {
    // Only log errors for debugging - timeout or server errors
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout - The API took longer than 60 seconds to respond');
      console.error('   This indicates a backend performance issue. Please check:');
      console.error('   1. Database query optimization for empId:', empId);
      console.error('   2. Backend server logs for slow queries');
      console.error('   3. Consider adding pagination or filtering to reduce dataset size');
    } else if (error.response) {
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: `${BASE_URL}/application-status/getview/employee-campus/${empId}`,
      });
    } else if (error.request) {
      console.error('📡 No response received from server');
      console.error('   URL:', `${BASE_URL}/application-status/getview/employee-campus/${empId}`);
    }
   
    throw error;
  }
};
 
// Hook for application status data
export const useApplicationStatusData = (empId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      if (!empId) {
        setData([]); // Set empty array when no empId
        setLoading(false);
        setError(null);
        return;
      }
 
      try {
        setLoading(true);
        setError(null);
        const response = await getApplicationStatusData(empId);
       
        // Transform API response to match table data structure
        const transformedData = transformApiResponseToTableData(response);
       
        setData(transformedData);
      } catch (err) {
        console.error('Error in useApplicationStatusData:', err);
        setError(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, [empId]);
 
  return { data, loading, error };
};
 
// Transform API response to match table data structure
const transformApiResponseToTableData = (apiResponse) => {
  // Extract data from API response
  // Try different response structures
  let responseData = null;
 
  if (Array.isArray(apiResponse)) {
    responseData = apiResponse;
  } else if (apiResponse?.data) {
    if (Array.isArray(apiResponse.data)) {
      responseData = apiResponse.data;
    } else if (apiResponse.data?.data && Array.isArray(apiResponse.data.data)) {
      responseData = apiResponse.data.data;
    } else if (apiResponse.data?.list && Array.isArray(apiResponse.data.list)) {
      responseData = apiResponse.data.list;
    } else if (apiResponse.data?.results && Array.isArray(apiResponse.data.results)) {
      responseData = apiResponse.data.results;
    }
  } else if (apiResponse?.list && Array.isArray(apiResponse.list)) {
    responseData = apiResponse.list;
  } else if (apiResponse?.results && Array.isArray(apiResponse.results)) {
    responseData = apiResponse.results;
  }
 
  if (!responseData || !Array.isArray(responseData)) {
    return [];
  }
 
  // Map API response fields to table structure
  // Only use actual API data - no hardcoded fallback values
  const transformed = responseData.map((item) => {
    // Try multiple possible field name variations from API
    // Use empty string if field doesn't exist (no hardcoded values)
    // NOTE: API uses 'num' for application number
    // Convert to string since num is a number (e.g., 2811002)
    const applicationNoRaw = item.num || item.applicationNo || item.application_no || item.appNo || item.applicationNumber || item.applicantNo || item.applicant_no || '';
    const applicationNo = applicationNoRaw ? String(applicationNoRaw) : '';
    const pro = item.pro_name || item.pro || item.proName || '';
    const campus = item.cmps_name || item.campus || item.campusName || item.campus_name || '';
    const dgm = item.dgm_name || item.dgm || item.dgmName || '';
    const zone = item.zone_name || item.zone || item.zoneName || '';
   
    // Handle date - try multiple date field variations
    let dateValue = null;
    const dateFields = ['date', 'createdDate', 'created_date', 'applicationDate', 'application_date', 'createdAt', 'created_at', 'appliedDate', 'applied_date'];
    for (const field of dateFields) {
      if (item[field]) {
        dateValue = new Date(item[field]);
        if (!isNaN(dateValue.getTime())) {
          break;
        }
      }
    }
   
    // Only use date if it's valid, otherwise use current date
    const date = dateValue && !isNaN(dateValue.getTime()) ? dateValue : new Date();
   
    // Handle status - try multiple status field variations
    const status = item.status || item.applicationStatus || item.application_status || item.appStatus || item.app_status || '';
 
    return {
      applicationNo,
      pro,
      campus,
      dgm,
      zone,
      date,
      status,
      isSelected: false,
    };
  });
 
  // Filter out items without application number
  const filtered = transformed.filter(item => {
    // Ensure applicationNo is a string before calling trim
    const appNoStr = item.applicationNo ? String(item.applicationNo) : '';
    return appNoStr.trim() !== '';
  });
 
  return filtered;
};
 