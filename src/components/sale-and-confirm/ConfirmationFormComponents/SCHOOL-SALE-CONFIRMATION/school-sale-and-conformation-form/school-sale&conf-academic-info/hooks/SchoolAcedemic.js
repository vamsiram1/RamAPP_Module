import axios from 'axios';
import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased to 30 seconds for orientation APIs to handle slow database queries
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fetch orientations from API
export const getOrientations = async (joiningClassId, branchId) => {
  try {
    const response = await apiClient.get(`/student-admissions-sale/orientations/by-class/${joiningClassId}/cmps/${branchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orientations:', error.message);
    throw error;
  }
};

// Hook for orientations dropdown
export const useOrientations = (joiningClassId, branchId) => {
  const [orientations, setOrientations] = useState([]);
  const [orientationOptions, setOrientationOptions] = useState([]); // Array of labels for dropdown
  const [orientationMap, setOrientationMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrientations = async () => {
      // Don't fetch if IDs are not available
      if (!joiningClassId || !branchId) {
        setLoading(false);
        setOrientations([]);
        setOrientationOptions([]);
        setOrientationMap(new Map());
        return;
      }

      try {
        setLoading(true);
        const response = await getOrientations(joiningClassId, branchId);
        
        // Handle different possible response structures
        const orientationsData = response?.data || response || [];
        
        // Create array of orientation labels for dropdown display
        const options = orientationsData.map(orientation => {
          // Handle different possible field names (name, orientationName, label, etc.)
          const label = orientation?.name || orientation?.orientationName || orientation?.label || orientation?.orientation || String(orientation);
          return label;
        });
        
        // Create map of label -> id for easy lookup
        const labelToIdMap = new Map();
        orientationsData.forEach(orientation => {
          const label = orientation?.name || orientation?.orientationName || orientation?.label || orientation?.orientation || String(orientation);
          const id = orientation?.id || orientation?.orientationId || orientation?.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        setOrientations(orientationsData);
        setOrientationOptions(options);
        setOrientationMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useOrientations:', err);
        setError(err);
        setOrientations([]);
        setOrientationOptions([]);
        setOrientationMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchOrientations();
  }, [joiningClassId, branchId]);

  // Helper function to get orientation ID by label
  const getOrientationIdByLabel = (label) => {
    return orientationMap.get(label);
  };

  // Helper function to get orientation label by ID
  const getOrientationLabelById = (id) => {
    for (const [label, orientationId] of orientationMap.entries()) {
      if (orientationId === id || String(orientationId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  return { 
    orientations, 
    orientationOptions, 
    orientationMap, 
    loading, 
    error,
    getOrientationIdByLabel,
    getOrientationLabelById
  };
};

// Fetch orientation fee from API
export const getOrientationFee = async (orientationId) => {
  try {
    const response = await apiClient.get('/application-confirmation/orientation-fee', {
      params: { orientationId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orientation fee:', error.message);
    throw error;
  }
};

// Fetch food types from API
export const getFoodTypes = async () => {
  try {
    const response = await apiClient.get('/application-confirmation/dropdown/foodtypes');
    return response.data;
  } catch (error) {
    console.error('Error fetching food types:', error.message);
    throw error;
  }
};

// Hook for food types dropdown
export const useFoodTypes = () => {
  const [foodTypes, setFoodTypes] = useState([]);
  const [foodTypeOptions, setFoodTypeOptions] = useState([]); // Array of labels for dropdown
  const [foodTypeMap, setFoodTypeMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        setLoading(true);
        const response = await getFoodTypes();
        console.log('Food Types API Response:', response);
        
        // Handle different possible response structures
        const foodTypesData = response?.data || response || [];
        console.log('Food Types Data:', foodTypesData);
        
        // Helper function to extract label from food type object
        const extractLabel = (foodType) => {
          if (!foodType) return null;
          
          // If it's already a string, return it
          if (typeof foodType === 'string') {
            return foodType;
          }
          
          // If it's a number, convert to string
          if (typeof foodType === 'number') {
            return String(foodType);
          }
          
          // If it's an object, try to find label property
          if (typeof foodType === 'object' && foodType !== null) {
            // Try common property names
            const label = foodType.name || 
                         foodType.foodTypeName || 
                         foodType.label || 
                         foodType.foodType || 
                         foodType.type ||
                         foodType.description ||
                         foodType.title;
            
            if (label) {
              return typeof label === 'string' ? label : String(label);
            }
            
            // If no label found, try to get first string value from object
            const stringValue = Object.values(foodType).find(val => typeof val === 'string' && val);
            if (stringValue) {
              return stringValue;
            }
          }
          
          return null;
        };
        
        // Create array of food type labels for dropdown display
        const options = foodTypesData
          .map(extractLabel)
          .filter(label => label !== null && label !== undefined);
        
        console.log('Food Type Options:', options);
        
        // Create map of label -> id for easy lookup
        const labelToIdMap = new Map();
        foodTypesData.forEach(foodType => {
          const label = extractLabel(foodType);
          const id = foodType?.id || foodType?.foodTypeId || foodType?.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        console.log('Food Type Map:', labelToIdMap);
        
        setFoodTypes(foodTypesData);
        setFoodTypeOptions(options);
        setFoodTypeMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useFoodTypes:', err);
        setError(err);
        setFoodTypes([]);
        setFoodTypeOptions([]);
        setFoodTypeMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchFoodTypes();
  }, []);

  // Helper function to get food type ID by label
  const getFoodTypeIdByLabel = (label) => {
    return foodTypeMap.get(label);
  };

  // Helper function to get food type label by ID
  const getFoodTypeLabelById = (id) => {
    for (const [label, foodTypeId] of foodTypeMap.entries()) {
      if (foodTypeId === id || String(foodTypeId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  return { 
    foodTypes, 
    foodTypeOptions, 
    foodTypeMap, 
    loading, 
    error,
    getFoodTypeIdByLabel,
    getFoodTypeLabelById
  };
};

// Fetch blood groups from API
export const getBloodGroups = async () => {
  try {
    const response = await apiClient.get('/application-confirmation/dropdown/bloodGrouptypes');
    return response.data;
  } catch (error) {
    console.error('Error fetching blood groups:', error.message);
    throw error;
  }
};

// Hook for blood groups dropdown
export const useBloodGroups = () => {
  const [bloodGroups, setBloodGroups] = useState([]);
  const [bloodGroupOptions, setBloodGroupOptions] = useState([]); // Array of labels for dropdown
  const [bloodGroupMap, setBloodGroupMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBloodGroups = async () => {
      try {
        setLoading(true);
        const response = await getBloodGroups();
        console.log('Blood Groups API Response:', response);
        
        // Handle different possible response structures
        const bloodGroupsData = response?.data || response || [];
        console.log('Blood Groups Data:', bloodGroupsData);
        
        // Helper function to extract label from blood group object
        const extractLabel = (bloodGroup) => {
          if (!bloodGroup) return null;
          
          // If it's already a string, return it
          if (typeof bloodGroup === 'string') {
            return bloodGroup;
          }
          
          // If it's a number, convert to string
          if (typeof bloodGroup === 'number') {
            return String(bloodGroup);
          }
          
          // If it's an object, try to find label property
          if (typeof bloodGroup === 'object' && bloodGroup !== null) {
            // Try common property names
            const label = bloodGroup.name || 
                         bloodGroup.bloodGroupName || 
                         bloodGroup.label || 
                         bloodGroup.bloodGroup || 
                         bloodGroup.type ||
                         bloodGroup.description ||
                         bloodGroup.title;
            
            if (label) {
              return typeof label === 'string' ? label : String(label);
            }
            
            // If no label found, try to get first string value from object
            const stringValue = Object.values(bloodGroup).find(val => typeof val === 'string' && val);
            if (stringValue) {
              return stringValue;
            }
          }
          
          return null;
        };
        
        // Create array of blood group labels for dropdown display
        const options = bloodGroupsData
          .map(extractLabel)
          .filter(label => label !== null && label !== undefined);
        
        console.log('Blood Group Options:', options);
        
        // Create map of label -> id for easy lookup
        const labelToIdMap = new Map();
        bloodGroupsData.forEach(bloodGroup => {
          const label = extractLabel(bloodGroup);
          const id = bloodGroup?.id || bloodGroup?.bloodGroupId || bloodGroup?.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        console.log('Blood Group Map:', labelToIdMap);
        
        setBloodGroups(bloodGroupsData);
        setBloodGroupOptions(options);
        setBloodGroupMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useBloodGroups:', err);
        setError(err);
        setBloodGroups([]);
        setBloodGroupOptions([]);
        setBloodGroupMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchBloodGroups();
  }, []);

  // Helper function to get blood group ID by label
  const getBloodGroupIdByLabel = (label) => {
    return bloodGroupMap.get(label);
  };

  // Helper function to get blood group label by ID
  const getBloodGroupLabelById = (id) => {
    for (const [label, bloodGroupId] of bloodGroupMap.entries()) {
      if (bloodGroupId === id || String(bloodGroupId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  return { 
    bloodGroups, 
    bloodGroupOptions, 
    bloodGroupMap, 
    loading, 
    error,
    getBloodGroupIdByLabel,
    getBloodGroupLabelById
  };
};

// Fetch castes from API
export const getCastes = async () => {
  try {
    const response = await apiClient.get('/student-admissions-sale/castes');
    return response.data;
  } catch (error) {
    console.error('Error fetching castes:', error.message);
    throw error;
  }
};

// Hook for castes dropdown
export const useCastes = () => {
  const [castes, setCastes] = useState([]);
  const [casteOptions, setCasteOptions] = useState([]); // Array of labels for dropdown
  const [casteMap, setCasteMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCastes = async () => {
      try {
        setLoading(true);
        const response = await getCastes();
        console.log('Castes API Response:', response);
        
        // Handle different possible response structures
        const castesData = response?.data || response || [];
        console.log('Castes Data:', castesData);
        
        // Helper function to extract label from caste object
        const extractLabel = (caste) => {
          if (!caste) return null;
          
          // If it's already a string, return it
          if (typeof caste === 'string') {
            return caste;
          }
          
          // If it's a number, convert to string
          if (typeof caste === 'number') {
            return String(caste);
          }
          
          // If it's an object, try to find label property
          if (typeof caste === 'object' && caste !== null) {
            // Try common property names
            const label = caste.name || 
                         caste.casteName || 
                         caste.label || 
                         caste.caste || 
                         caste.type ||
                         caste.description ||
                         caste.title;
            
            if (label) {
              return typeof label === 'string' ? label : String(label);
            }
            
            // If no label found, try to get first string value from object
            const stringValue = Object.values(caste).find(val => typeof val === 'string' && val);
            if (stringValue) {
              return stringValue;
            }
          }
          
          return null;
        };
        
        // Create array of caste labels for dropdown display
        const options = castesData
          .map(extractLabel)
          .filter(label => label !== null && label !== undefined);
        
        console.log('Caste Options:', options);
        
        // Create map of label -> id for easy lookup
        const labelToIdMap = new Map();
        castesData.forEach(caste => {
          const label = extractLabel(caste);
          const id = caste?.id || caste?.casteId || caste?.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        console.log('Caste Map:', labelToIdMap);
        
        setCastes(castesData);
        setCasteOptions(options);
        setCasteMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useCastes:', err);
        setError(err);
        setCastes([]);
        setCasteOptions([]);
        setCasteMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchCastes();
  }, []);

  // Helper function to get caste ID by label
  const getCasteIdByLabel = (label) => {
    return casteMap.get(label);
  };

  // Helper function to get caste label by ID
  const getCasteLabelById = (id) => {
    for (const [label, casteId] of casteMap.entries()) {
      if (casteId === id || String(casteId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  return { 
    castes, 
    casteOptions, 
    casteMap, 
    loading, 
    error,
    getCasteIdByLabel,
    getCasteLabelById
  };
};

// Fetch religions from API
export const getReligions = async () => {
  try {
    const response = await apiClient.get('/student-admissions-sale/religions');
    return response.data;
  } catch (error) {
    console.error('Error fetching religions:', error.message);
    throw error;
  }
};

// Hook for religions dropdown
export const useReligions = () => {
  const [religions, setReligions] = useState([]);
  const [religionOptions, setReligionOptions] = useState([]); // Array of labels for dropdown
  const [religionMap, setReligionMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReligions = async () => {
      try {
        setLoading(true);
        const response = await getReligions();
        console.log('Religions API Response:', response);
        
        // Handle different possible response structures
        const religionsData = response?.data || response || [];
        console.log('Religions Data:', religionsData);
        
        // Helper function to extract label from religion object
        const extractLabel = (religion) => {
          if (!religion) return null;
          
          // If it's already a string, return it
          if (typeof religion === 'string') {
            return religion;
          }
          
          // If it's a number, convert to string
          if (typeof religion === 'number') {
            return String(religion);
          }
          
          // If it's an object, try to find label property
          if (typeof religion === 'object' && religion !== null) {
            // Try common property names
            const label = religion.name || 
                         religion.religionName || 
                         religion.label || 
                         religion.religion || 
                         religion.type ||
                         religion.description ||
                         religion.title;
            
            if (label) {
              return typeof label === 'string' ? label : String(label);
            }
            
            // If no label found, try to get first string value from object
            const stringValue = Object.values(religion).find(val => typeof val === 'string' && val);
            if (stringValue) {
              return stringValue;
            }
          }
          
          return null;
        };
        
        // Create array of religion labels for dropdown display
        const options = religionsData
          .map(extractLabel)
          .filter(label => label !== null && label !== undefined);
        
        console.log('Religion Options:', options);
        
        // Create map of label -> id for easy lookup
        const labelToIdMap = new Map();
        religionsData.forEach(religion => {
          const label = extractLabel(religion);
          const id = religion?.id || religion?.religionId || religion?.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        console.log('Religion Map:', labelToIdMap);
        
        setReligions(religionsData);
        setReligionOptions(options);
        setReligionMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useReligions:', err);
        setError(err);
        setReligions([]);
        setReligionOptions([]);
        setReligionMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchReligions();
  }, []);

  // Helper function to get religion ID by label
  const getReligionIdByLabel = (label) => {
    return religionMap.get(label);
  };

  // Helper function to get religion label by ID
  const getReligionLabelById = (id) => {
    for (const [label, religionId] of religionMap.entries()) {
      if (religionId === id || String(religionId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  return { 
    religions, 
    religionOptions, 
    religionMap, 
    loading, 
    error,
    getReligionIdByLabel,
    getReligionLabelById
  };
};

