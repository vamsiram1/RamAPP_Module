import axios from 'axios';
import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased to 30 seconds to handle slow database queries
  headers: {
    'Content-Type': 'application/json',
  }
});

// ====================================================================
// API 1: YELLOW BOX (Top Section) - Application Sale Data
// ====================================================================

// Fetch application sale data for yellow box
export const getStudentAdmissionSaleByApplicationNo = async (applicationNo) => {
  try {
    const response = await apiClient.get(`/student-admissions-sale/by-application-no/${applicationNo}`, {
      params: { appNo: applicationNo }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admission sale data:', error.message);
    throw error;
  }
};

// Map API response to yellow box format
export const mapAdmissionDataToTopSection = (apiResponse) => {
  const apiData = apiResponse?.data;
  
  return {
    academicYear: apiData?.academicYear || 'N/A',
    academicYearId: apiData?.academicYearId || apiData?.academicYear_id || apiData?.acadYearId || apiData?.yearId || 'N/A',
    applicationNo: apiData?.applicationNo?.toString() || 'N/A',
    branch: apiData?.campusName || 'N/A',
    zone: apiData?.zoneName || 'N/A',
    applicationFee: apiData?.applicationFee?.toString() || '0'
  };
};

// Hook for yellow box data
export const useAdmissionSaleData = (applicationNo) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmissionData = async () => {
      try {
        setLoading(true);
        const response = await getStudentAdmissionSaleByApplicationNo(applicationNo);
        const mappedData = mapAdmissionDataToTopSection(response);
        setData(mappedData);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (applicationNo) {
      fetchAdmissionData();
    }
  }, [applicationNo]);

  return { data, loading, error };
};

// ====================================================================
// API 2: OVERVIEW SECTIONS - All Student Details
// ====================================================================

// Fetch complete student overview data for all sections below yellow box
export const getCollegeOverviewData = async (applicationNo) => {
  try {
    const response = await axios.get(`http://localhost:8080/student_fast_sale/saleget-college/${applicationNo}`, {
      timeout: 30000 // Increased timeout to handle slow database queries
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching college overview data:', error.message);
    throw error;
  }
};

// Hook for overview sections data (Personal, Parent, Academic, Orientation, Address, etc.)
export const useCollegeOverviewData = (applicationNo) => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const response = await getCollegeOverviewData(applicationNo);
        const backendData = response?.data || response;
        setOverviewData(backendData);
        setError(null);
      } catch (err) {
        setError(err);
        setOverviewData(null);
      } finally {
        setLoading(false);
      }
    };

    if (applicationNo) {
      fetchOverviewData();
    }
  }, [applicationNo]);

  return { overviewData, loading, error };
};





