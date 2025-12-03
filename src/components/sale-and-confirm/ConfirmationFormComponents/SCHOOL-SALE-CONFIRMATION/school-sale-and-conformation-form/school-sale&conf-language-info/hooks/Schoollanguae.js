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

// Fetch languages from API
export const getLanguages = async () => {
  try {
    const response = await apiClient.get('/student-admissions-sale/languages');
    return response.data;
  } catch (error) {
    console.error('Error fetching languages:', error.message);
    throw error;
  }
};

// Hook for languages dropdown
export const useLanguages = () => {
  const [languages, setLanguages] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]); // Array of labels for dropdown
  const [languageMap, setLanguageMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const response = await getLanguages();
        console.log('Languages API Response:', response);
        
        // Handle different possible response structures
        const languagesData = response?.data || response || [];
        console.log('Languages Data:', languagesData);
        
        // Helper function to extract label from language object
        const extractLabel = (language) => {
          if (!language) return null;
          
          // If it's already a string, return it
          if (typeof language === 'string') {
            return language;
          }
          
          // If it's a number, convert to string
          if (typeof language === 'number') {
            return String(language);
          }
          
          // If it's an object, try to find label property
          if (typeof language === 'object' && language !== null) {
            // Try common property names
            const label = language.name || 
                         language.languageName || 
                         language.label || 
                         language.language || 
                         language.type ||
                         language.description ||
                         language.title;
            
            if (label) {
              return typeof label === 'string' ? label : String(label);
            }
            
            // If no label found, try to get first string value from object
            const stringValue = Object.values(language).find(val => typeof val === 'string' && val);
            if (stringValue) {
              return stringValue;
            }
          }
          
          return null;
        };
        
        // Create array of language labels for dropdown display
        const options = languagesData
          .map(extractLabel)
          .filter(label => label !== null && label !== undefined);
        
        console.log('Language Options:', options);
        
        // Create map of label -> id for easy lookup
        const labelToIdMap = new Map();
        languagesData.forEach(language => {
          const label = extractLabel(language);
          const id = language?.id || language?.languageId || language?.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        console.log('Language Map:', labelToIdMap);
        
        setLanguages(languagesData);
        setLanguageOptions(options);
        setLanguageMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useLanguages:', err);
        setError(err);
        setLanguages([]);
        setLanguageOptions([]);
        setLanguageMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // Helper function to get language ID by label
  const getLanguageIdByLabel = (label) => {
    return languageMap.get(label);
  };

  // Helper function to get language label by ID
  const getLanguageLabelById = (id) => {
    for (const [label, languageId] of languageMap.entries()) {
      if (languageId === id || String(languageId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  return { 
    languages, 
    languageOptions, 
    languageMap, 
    loading, 
    error,
    getLanguageIdByLabel,
    getLanguageLabelById
  };
};

