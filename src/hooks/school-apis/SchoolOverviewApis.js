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
// API 2: OVERVIEW SECTIONS - All Student Details
// ====================================================================

// Fetch complete student overview data for all sections below yellow box
export const getSchoolOverviewData = async (studentId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/student-admissions-sale/details/${studentId}`, {
      timeout: 30000 // Increased timeout to handle slow database queries
    });
    console.log('Raw axios response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching school overview data:', error.message);
    throw error;
  }
};

// Hook for overview sections data (Personal, Parent, Academic, Orientation, Address, etc.)
export const useSchoolOverviewData = (studentId) => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const response = await getSchoolOverviewData(studentId);
        console.log('Full API Response:', response);
        // The API returns data in response.data.data structure
        // response = { success: true, message: "...", data: {...actual data...} }
        const backendData = response?.data || response;
        console.log('Extracted backend data:', backendData);
        setOverviewData(backendData);
        setError(null);
      } catch (err) {
        console.error('Error in useSchoolOverviewData:', err);
        setError(err);
        setOverviewData(null);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchOverviewData();
    }
  }, [studentId]);

  return { overviewData, loading, error };
};
