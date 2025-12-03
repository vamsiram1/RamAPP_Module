import axios from 'axios';
import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:8080';

// Create axios client with increased timeout for concession-related APIs
const concessionApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased to 30 seconds to handle slow database queries
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fetch authorized by list for dropdowns (Referred By, Authorized By, Concession Referred By)
export const getAuthorizedByList = async () => {
  try {
    const response = await concessionApiClient.get('/api/student-admissions-sale/authorizedBy/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching authorized by list:', error.message);
    throw error;
  }
};

// Hook for fetching authorized by list
export const useAuthorizedByList = () => {
  const [authorizedByList, setAuthorizedByList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorizedByList = async () => {
      try {
        setLoading(true);
        console.log('=== Fetching Authorized By List ===');
        const response = await getAuthorizedByList();
        console.log('Authorized By API Full Response:', response);
        console.log('Response type:', typeof response);
        console.log('Is Array?:', Array.isArray(response));
        
        // Assuming response.data contains the list array
        const listData = response?.data || response;
        console.log('Authorized By List Data:', listData);
        console.log('List Data type:', typeof listData);
        console.log('List Data is Array?:', Array.isArray(listData));
        
        if (listData && Array.isArray(listData) && listData.length > 0) {
          console.log('First item in list:', listData[0]);
          console.log('First item keys:', Object.keys(listData[0]));
        }
        
        // Format the data as "name - id" for dropdown display
        let formattedList = [];
        if (Array.isArray(listData)) {
          formattedList = listData.map(item => {
            console.log('Processing item:', item);
            // Extract name and id from the item (adjust field names as needed)
            const name = item.name || item.userName || item.authorizedByName || item.personName || item.authorisedByName || '';
            const id = item.id || item.authorizedById || item.userId || item.authorisedById || '';
            
            console.log('Extracted name:', name, 'id:', id);
            
            // Return formatted string "name - id"
            return {
              displayText: `${name} - ${id}`,
              id: id,
              name: name,
              originalData: item
            };
          });
        }
        
        console.log('Formatted Authorized By List:', formattedList);
        console.log('Formatted list length:', formattedList.length);
        setAuthorizedByList(formattedList);
        setError(null);
      } catch (err) {
        console.error('Error in useAuthorizedByList:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(err);
        setAuthorizedByList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorizedByList();
  }, []);

  return { authorizedByList, loading, error };
};

// Fetch concession reason list for dropdown
export const getConcessionReasonList = async () => {
  try {
    const response = await concessionApiClient.get('/api/student-admissions-sale/concessionReson/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching concession reason list:', error.message);
    throw error;
  }
};

// Hook for fetching concession reason list
export const useConcessionReasonList = () => {
  const [concessionReasonList, setConcessionReasonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConcessionReasonList = async () => {
      try {
        setLoading(true);
        console.log('=== Fetching Concession Reason List ===');
        const response = await getConcessionReasonList();
        console.log('Concession Reason API Full Response:', response);
        console.log('Response type:', typeof response);
        console.log('Is Array?:', Array.isArray(response));
        
        // Assuming response.data contains the list array
        const listData = response?.data || response;
        console.log('Concession Reason List Data:', listData);
        console.log('List Data type:', typeof listData);
        console.log('List Data is Array?:', Array.isArray(listData));
        
        if (listData && Array.isArray(listData) && listData.length > 0) {
          console.log('First item in list:', listData[0]);
          console.log('First item keys:', Object.keys(listData[0]));
        }
        
        // Format the data as "name - id" for dropdown display
        let formattedList = [];
        if (Array.isArray(listData)) {
          formattedList = listData.map(item => {
            console.log('Processing concession reason item:', item);
            // Extract name and id from the item (adjust field names as needed)
            const name = item.name || item.reasonName || item.concessionReasonName || item.reason || item.concessionReason || '';
            const id = item.id || item.reasonId || item.concessionReasonId || '';
            
            console.log('Extracted reason name:', name, 'id:', id);
            
            // Return formatted string "name - id"
            return {
              displayText: `${name} - ${id}`,
              id: id,
              name: name,
              originalData: item
            };
          });
        }
        
        console.log('Formatted Concession Reason List:', formattedList);
        console.log('Formatted list length:', formattedList.length);
        setConcessionReasonList(formattedList);
        setError(null);
      } catch (err) {
        console.error('Error in useConcessionReasonList:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(err);
        setConcessionReasonList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConcessionReasonList();
  }, []);

  return { concessionReasonList, loading, error };
};
