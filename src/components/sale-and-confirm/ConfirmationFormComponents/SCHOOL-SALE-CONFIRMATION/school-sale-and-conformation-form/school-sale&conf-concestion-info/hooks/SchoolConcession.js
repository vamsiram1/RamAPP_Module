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

// Fetch employees from API
export const getEmployees = async () => {
  try {
    const response = await apiClient.get('/student-admissions-sale/authorizedBy/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error.message);
    throw error;
  }
};

// Hook for employees dropdown
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]); // Array of labels for dropdown
  const [employeeMap, setEmployeeMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await getEmployees();
        console.log('Employees API Response:', response);
        
        // Handle different possible response structures
        const employeesData = response?.data || response || [];
        console.log('Employees Data:', employeesData);
        
        // Helper function to extract label from employee object
        const extractLabel = (employee) => {
          if (!employee) return null;
          
          // If it's already a string, return it
          if (typeof employee === 'string') {
            return employee;
          }
          
          // If it's a number, convert to string
          if (typeof employee === 'number') {
            return String(employee);
          }
          
          // If it's an object, try to find label property
          if (typeof employee === 'object' && employee !== null) {
            // Try common property names for employee names
            const label = employee.name || 
                         employee.employeeName || 
                         employee.fullName ||
                         employee.firstName + (employee.lastName ? ' ' + employee.lastName : '') ||
                         employee.label || 
                         employee.employee || 
                         employee.userName ||
                         employee.type ||
                         employee.description ||
                         employee.title;
            
            if (label) {
              return typeof label === 'string' ? label : String(label);
            }
            
            // If no label found, try to get first string value from object
            const stringValue = Object.values(employee).find(val => typeof val === 'string' && val);
            if (stringValue) {
              return stringValue;
            }
          }
          
          return null;
        };
        
        // Create array of employee labels with "Label - ID" format for dropdown display
        const options = [];
        const labelToIdMap = new Map();
        
        employeesData.forEach(employee => {
          const label = extractLabel(employee);
          const id = employee?.id || employee?.employeeId || employee?.userId || employee?.value;
          
          if (label && id !== undefined) {
            // Create display format: "Label - ID"
            const displayOption = `${label} - ${id}`;
            options.push(displayOption);
            
            // Map both the full "Label - ID" format and just the label to the ID
            labelToIdMap.set(displayOption, id);
            labelToIdMap.set(label, id);
          }
        });
        
        console.log('Employee Options (Label - ID format):', options);
        console.log('Employee Map:', labelToIdMap);
        
        setEmployees(employeesData);
        setEmployeeOptions(options);
        setEmployeeMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useEmployees:', err);
        setError(err);
        setEmployees([]);
        setEmployeeOptions([]);
        setEmployeeMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Helper function to get employee ID by label
  const getEmployeeIdByLabel = (label) => {
    return employeeMap.get(label);
  };

  // Helper function to get employee label by ID (returns "Label - ID" format)
  const getEmployeeLabelById = (id) => {
    for (const [label, employeeId] of employeeMap.entries()) {
      if (employeeId === id || String(employeeId) === String(id)) {
        // If the label already contains " - ", it's already in the correct format
        if (label.includes(' - ')) {
          return label;
        }
        // Otherwise, format it as "Label - ID"
        return `${label} - ${employeeId}`;
      }
    }
    return null;
  };

  return { 
    employees, 
    employeeOptions, 
    employeeMap, 
    loading, 
    error,
    getEmployeeIdByLabel,
    getEmployeeLabelById
  };
};

// Fetch concession reasons from API
export const getConcessionReasons = async () => {
  try {
    const response = await apiClient.get('/student-admissions-sale/concessionReson/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching concession reasons:', error.message);
    throw error;
  }
};

// Hook for concession reasons dropdown
export const useConcessionReasons = () => {
  const [concessionReasons, setConcessionReasons] = useState([]);
  const [concessionReasonOptions, setConcessionReasonOptions] = useState([]); // Array of labels for dropdown
  const [concessionReasonMap, setConcessionReasonMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConcessionReasons = async () => {
      try {
        setLoading(true);
        const response = await getConcessionReasons();
        console.log('Concession Reasons API Response:', response);
        
        // Handle different possible response structures
        const concessionReasonsData = response?.data || response || [];
        console.log('Concession Reasons Data:', concessionReasonsData);
        
        // Helper function to extract label from concession reason object
        const extractLabel = (reason) => {
          if (!reason) return null;
          
          // If it's already a string, return it
          if (typeof reason === 'string') {
            return reason;
          }
          
          // If it's a number, convert to string
          if (typeof reason === 'number') {
            return String(reason);
          }
          
          // If it's an object, try to find label property
          if (typeof reason === 'object' && reason !== null) {
            // Try common property names
            const label = reason.name || 
                         reason.reasonName || 
                         reason.concessionReason ||
                         reason.reason ||
                         reason.label || 
                         reason.description ||
                         reason.title;
            
            if (label) {
              return typeof label === 'string' ? label : String(label);
            }
            
            // If no label found, try to get first string value from object
            const stringValue = Object.values(reason).find(val => typeof val === 'string' && val);
            if (stringValue) {
              return stringValue;
            }
          }
          
          return null;
        };
        
        // Create array of concession reason labels for dropdown display
        const options = concessionReasonsData
          .map(extractLabel)
          .filter(label => label !== null && label !== undefined);
        
        console.log('Concession Reason Options:', options);
        
        // Create map of label -> id for easy lookup
        const labelToIdMap = new Map();
        concessionReasonsData.forEach(reason => {
          const label = extractLabel(reason);
          const id = reason?.id || reason?.reasonId || reason?.concessionReasonId || reason?.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        console.log('Concession Reason Map:', labelToIdMap);
        
        setConcessionReasons(concessionReasonsData);
        setConcessionReasonOptions(options);
        setConcessionReasonMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useConcessionReasons:', err);
        setError(err);
        setConcessionReasons([]);
        setConcessionReasonOptions([]);
        setConcessionReasonMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchConcessionReasons();
  }, []);

  // Helper function to get concession reason ID by label
  const getConcessionReasonIdByLabel = (label) => {
    return concessionReasonMap.get(label);
  };

  // Helper function to get concession reason label by ID
  const getConcessionReasonLabelById = (id) => {
    for (const [label, reasonId] of concessionReasonMap.entries()) {
      if (reasonId === id || String(reasonId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  return { 
    concessionReasons, 
    concessionReasonOptions, 
    concessionReasonMap, 
    loading, 
    error,
    getConcessionReasonIdByLabel,
    getConcessionReasonLabelById
  };
};

// Fetch concession types from API (POST request with body)
export const getConcessionTypes = async () => {
  try {
    console.log('🌐 Fetching concession types from:', 'http://localhost:8080/api/student-admissions-sale/concessiontype_ids');
    
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
    
    console.log('✅ Concession Types API Response:', response);
    console.log('📊 Raw Response Data:', JSON.stringify(response.data, null, 2));
    
    // Handle different response formats
    let concessionTypesData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data?.data && Array.isArray(response.data.data)) {
        concessionTypesData = response.data.data;
        console.log('📦 Found data in response.data.data:', concessionTypesData);
      } else if (response.data?.concessionTypes && Array.isArray(response.data.concessionTypes)) {
        concessionTypesData = response.data.concessionTypes;
        console.log('📦 Found data in response.data.concessionTypes:', concessionTypesData);
      } else if (response.data?.types && Array.isArray(response.data.types)) {
        concessionTypesData = response.data.types;
        console.log('📦 Found data in response.data.types:', concessionTypesData);
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        concessionTypesData = response.data.results;
        console.log('📦 Found data in response.data.results:', concessionTypesData);
      } else if (response.data?.items && Array.isArray(response.data.items)) {
        concessionTypesData = response.data.items;
        console.log('📦 Found data in response.data.items:', concessionTypesData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    console.log('🔄 BEFORE Transformation - Raw Data:', JSON.stringify(concessionTypesData, null, 2));
    console.log('🔄 Sample Item Before Transformation:', concessionTypesData[0]);
    
    const concessionTypes = concessionTypesData.map((type, index) => {
      const transformed = {
        id: type.concTypeId || type.id || type.concessionTypeId || type.concession_type_id || type.typeId || type.type_id || type.value,
        label: type.concType || type.label || type.name || type.concessionTypeName || type.concession_type_name || type.typeName || type.type_name || type.text,
        value: type.concTypeId || type.id || type.concessionTypeId || type.concession_type_id || type.typeId || type.type_id || type.value
      };
      
      console.log(`🔄 Transforming Item ${index}:`, {
        original: type,
        transformed: transformed
      });
      
      return transformed;
    });
    
    console.log('🔄 AFTER Transformation:', JSON.stringify(concessionTypes, null, 2));
    console.log('📋 Transformed concession types sample:', concessionTypes[0]);
    
    return concessionTypes;
  } catch (error) {
    console.error('❌ Error fetching concession types:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
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
        console.log('🔄 useConcessionTypes: Fetching concession types data...');
        
        const concessionTypesData = await getConcessionTypes();
        console.log('✅ useConcessionTypes: Concession types data fetched successfully:', concessionTypesData);
        console.log('📊 useConcessionTypes: Concession types data length:', concessionTypesData?.length);
        console.log('📊 useConcessionTypes: Concession types data type:', typeof concessionTypesData);
        console.log('📊 useConcessionTypes: Concession types is array:', Array.isArray(concessionTypesData));
        
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
        
        console.log('📋 Concession Type Options:', options);
        console.log('📋 Concession Type Map:', labelToIdMap);
        
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

