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

// Fetch relation types from API
export const getRelationTypes = async () => {
  try {
    const response = await apiClient.get('/student-admissions-sale/relation-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching relation types:', error.message);
    throw error;
  }
};

// Hook for relation types dropdown
export const useRelationTypes = () => {
  const [relationTypes, setRelationTypes] = useState([]);
  const [relationOptions, setRelationOptions] = useState([]); // Array of names for dropdown
  const [relationMap, setRelationMap] = useState(new Map()); // Map name -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelationTypes = async () => {
      try {
        setLoading(true);
        const response = await getRelationTypes();
        
        // Handle different possible response structures
        const relationTypesData = response?.data || response || [];
        
        // Allowed relation types (case-insensitive)
        const allowedRelations = ["brother", "sister"];
        
        // Filter and create array of relation type names for dropdown display
        // Only include "Brother" and "Sister"
        const filteredRelationTypes = relationTypesData.filter(relationType => {
          const name = relationType?.name || relationType?.relationName || relationType?.label || relationType?.relationType || String(relationType);
          const nameLower = String(name || "").toLowerCase().trim();
          return allowedRelations.includes(nameLower);
        });
        
        // Create array of relation type names for dropdown display
        const options = filteredRelationTypes.map(relationType => {
          // Handle different possible field names (name, relationName, label, etc.)
          const name = relationType?.name || relationType?.relationName || relationType?.label || relationType?.relationType || String(relationType);
          return name;
        });
        
        // Create map of name -> id for easy lookup (only for filtered types)
        const nameToIdMap = new Map();
        filteredRelationTypes.forEach(relationType => {
          const name = relationType?.name || relationType?.relationName || relationType?.label || relationType?.relationType || String(relationType);
          const id = relationType?.id || relationType?.relationId || relationType?.value;
          if (name && id !== undefined) {
            nameToIdMap.set(name, id);
          }
        });
        
        setRelationTypes(filteredRelationTypes);
        setRelationOptions(options);
        setRelationMap(nameToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useRelationTypes:', err);
        setError(err);
        setRelationTypes([]);
        setRelationOptions([]);
        setRelationMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchRelationTypes();
  }, []);

  // Helper function to get relation type ID by name
  const getRelationTypeIdByName = (name) => {
    return relationMap.get(name);
  };

  // Helper function to get relation type name by ID
  const getRelationTypeNameById = (id) => {
    for (const [name, relationId] of relationMap.entries()) {
      if (relationId === id || String(relationId) === String(id)) {
        return name;
      }
    }
    return null;
  };

  return { 
    relationTypes, 
    relationOptions, 
    relationMap, 
    loading, 
    error,
    getRelationTypeIdByName,
    getRelationTypeNameById
  };
};

// Fetch classes from API
export const getClasses = async () => {
  try {
    const response = await apiClient.get('/application-confirmation/dropdown/classes');
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error.message);
    throw error;
  }
};

// Hook for classes dropdown
export const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [classOptions, setClassOptions] = useState([]); // Array of names/labels for dropdown
  const [classMap, setClassMap] = useState(new Map()); // Map name/label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await getClasses();
        
        // Handle different possible response structures
        const classesData = response?.data || response || [];
        
        // Create array of class names/labels for dropdown display
        const options = classesData.map(classItem => {
          // Handle different possible field names (name, className, label, etc.)
          const name = classItem?.name || classItem?.className || classItem?.label || classItem?.class || String(classItem);
          return name;
        });
        
        // Create map of name/label -> id for easy lookup
        const nameToIdMap = new Map();
        classesData.forEach(classItem => {
          const name = classItem?.name || classItem?.className || classItem?.label || classItem?.class || String(classItem);
          const id = classItem?.id || classItem?.classId || classItem?.value;
          if (name && id !== undefined) {
            nameToIdMap.set(name, id);
          }
        });
        
        setClasses(classesData);
        setClassOptions(options);
        setClassMap(nameToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useClasses:', err);
        setError(err);
        setClasses([]);
        setClassOptions([]);
        setClassMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Helper function to get class ID by name/label
  const getClassIdByName = (name) => {
    return classMap.get(name);
  };

  // Helper function to get class name/label by ID
  const getClassNameById = (id) => {
    for (const [name, classId] of classMap.entries()) {
      if (classId === id || String(classId) === String(id)) {
        return name;
      }
    }
    return null;
  };

  return { 
    classes, 
    classOptions, 
    classMap, 
    loading, 
    error,
    getClassIdByName,
    getClassNameById
  };
};

