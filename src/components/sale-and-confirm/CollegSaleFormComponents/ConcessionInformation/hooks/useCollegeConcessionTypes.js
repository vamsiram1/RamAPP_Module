import axios from 'axios';
import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fetch concession types from API (POST request with body)
export const getConcessionTypes = async () => {
  try {
    // Request body with concession type names
    const requestBody = ["1st year", "2nd year", "3rd year", "Admission Fee", "Tuition Fee"];
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Use POST request with concession type names in body
    const response = await apiClient.post('/student-admissions-sale/concessiontype_ids', requestBody, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    // Handle different response formats
    let concessionTypesData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      // Check common wrapper properties
      if (response.data?.data && Array.isArray(response.data.data)) {
        concessionTypesData = response.data.data;
      } else if (response.data?.concessionTypes && Array.isArray(response.data.concessionTypes)) {
        concessionTypesData = response.data.concessionTypes;
      } else if (response.data?.types && Array.isArray(response.data.types)) {
        concessionTypesData = response.data.types;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        concessionTypesData = response.data.results;
      } else if (response.data?.items && Array.isArray(response.data.items)) {
        concessionTypesData = response.data.items;
      } else {
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const concessionTypes = concessionTypesData.map((type) => {
      return {
        id: type.concTypeId || type.id || type.concessionTypeId || type.concession_type_id || type.typeId || type.type_id || type.value,
        label: type.concType || type.label || type.name || type.concessionTypeName || type.concession_type_name || type.typeName || type.type_name || type.text,
        value: type.concTypeId || type.id || type.concessionTypeId || type.concession_type_id || type.typeId || type.type_id || type.value
      };
    });
    
    return concessionTypes;
  } catch (error) {
    console.error('❌ Error fetching concession types:', error);
    throw new Error(`Failed to fetch concession types: ${error.message}`);
  }
};

// Hook for concession types dropdown
export const useConcessionTypes = () => {
  const [concessionTypes, setConcessionTypes] = useState([]);
  const [concessionTypeOptions, setConcessionTypeOptions] = useState([]); // Array of labels for dropdown
  const [concessionTypeMap, setConcessionTypeMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConcessionTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const concessionTypesData = await getConcessionTypes();
        
        // Extract labels and create mapping
        const options = concessionTypesData.map(type => type.label || type.name || String(type));
        const labelToIdMap = new Map();
        
        concessionTypesData.forEach(type => {
          const label = type.label || type.name || String(type);
          const id = type.id || type.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        setConcessionTypes(concessionTypesData || []);
        setConcessionTypeOptions(options);
        setConcessionTypeMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('❌ useConcessionTypes: Error fetching concession types data:', err);
        setError(err.message);
        setConcessionTypes([]);
        setConcessionTypeOptions([]);
        setConcessionTypeMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchConcessionTypes();
  }, []);

  // Helper function to get concession type ID by label
  const getConcessionTypeIdByLabel = (label) => {
    return concessionTypeMap.get(label);
  };

  // Helper function to get concession type label by ID
  const getConcessionTypeLabelById = (id) => {
    for (const [label, typeId] of concessionTypeMap.entries()) {
      if (typeId === id || String(typeId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  // Refetch function for manual refresh
  const refetch = () => {
    const fetchConcessionTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const concessionTypesData = await getConcessionTypes();
        
        const options = concessionTypesData.map(type => type.label || type.name || String(type));
        const labelToIdMap = new Map();
        
        concessionTypesData.forEach(type => {
          const label = type.label || type.name || String(type);
          const id = type.id || type.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        setConcessionTypes(concessionTypesData || []);
        setConcessionTypeOptions(options);
        setConcessionTypeMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error refetching concession types:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConcessionTypes();
  };

  return {
    concessionTypes,
    concessionTypeOptions,
    concessionTypeMap,
    loading,
    error,
    getConcessionTypeIdByLabel,
    getConcessionTypeLabelById,
    refetch
  };
};

