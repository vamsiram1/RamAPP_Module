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

// Fetch sectors from API
export const getSectors = async () => {
  try {
    const response = await apiClient.get('/application-confirmation/dropdown/sectors');
    return response.data;
  } catch (error) {
    console.error('Error fetching sectors:', error.message);
    throw error;
  }
};

// Fetch occupations from API
export const getOccupations = async () => {
  try {
    const response = await apiClient.get('/application-confirmation/dropdown/occupations');
    return response.data;
  } catch (error) {
    console.error('Error fetching occupations:', error.message);
    throw error;
  }
};

// Hook for sectors dropdown
export const useSectors = () => {
  const [sectors, setSectors] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]); // Array of names for dropdown
  const [sectorMap, setSectorMap] = useState(new Map()); // Map name -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setLoading(true);
        const response = await getSectors();
        
        // Handle different possible response structures
        const sectorsData = response?.data || response || [];
        
        // Create array of sector names for dropdown display
        const options = sectorsData.map(sector => {
          // Handle different possible field names (name, sectorName, label, etc.)
          const name = sector?.name || sector?.sectorName || sector?.label || sector?.sector || String(sector);
          return name;
        });
        
        // Create map of name -> id for easy lookup
        const nameToIdMap = new Map();
        sectorsData.forEach(sector => {
          const name = sector?.name || sector?.sectorName || sector?.label || sector?.sector || String(sector);
          const id = sector?.id || sector?.sectorId || sector?.value;
          if (name && id !== undefined) {
            nameToIdMap.set(name, id);
          }
        });
        
        setSectors(sectorsData);
        setSectorOptions(options);
        setSectorMap(nameToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useSectors:', err);
        setError(err);
        setSectors([]);
        setSectorOptions([]);
        setSectorMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchSectors();
  }, []);

  // Helper function to get sector ID by name
  const getSectorIdByName = (name) => {
    return sectorMap.get(name);
  };

  // Helper function to get sector name by ID
  const getSectorNameById = (id) => {
    for (const [name, sectorId] of sectorMap.entries()) {
      if (sectorId === id || String(sectorId) === String(id)) {
        return name;
      }
    }
    return null;
  };

  return { 
    sectors, 
    sectorOptions, 
    sectorMap, 
    loading, 
    error,
    getSectorIdByName,
    getSectorNameById
  };
};

// Hook for occupations dropdown
export const useOccupations = () => {
  const [occupations, setOccupations] = useState([]);
  const [occupationOptions, setOccupationOptions] = useState([]); // Array of names for dropdown
  const [occupationMap, setOccupationMap] = useState(new Map()); // Map name -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        setLoading(true);
        const response = await getOccupations();
        
        // Handle different possible response structures
        const occupationsData = response?.data || response || [];
        
        // Create array of occupation names for dropdown display
        const options = occupationsData.map(occupation => {
          // Handle different possible field names (name, occupationName, label, etc.)
          const name = occupation?.name || occupation?.occupationName || occupation?.label || occupation?.occupation || String(occupation);
          return name;
        });
        
        // Create map of name -> id for easy lookup
        const nameToIdMap = new Map();
        occupationsData.forEach(occupation => {
          const name = occupation?.name || occupation?.occupationName || occupation?.label || occupation?.occupation || String(occupation);
          const id = occupation?.id || occupation?.occupationId || occupation?.value;
          if (name && id !== undefined) {
            nameToIdMap.set(name, id);
          }
        });
        
        setOccupations(occupationsData);
        setOccupationOptions(options);
        setOccupationMap(nameToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useOccupations:', err);
        setError(err);
        setOccupations([]);
        setOccupationOptions([]);
        setOccupationMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchOccupations();
  }, []);

  // Helper function to get occupation ID by name
  const getOccupationIdByName = (name) => {
    return occupationMap.get(name);
  };

  // Helper function to get occupation name by ID
  const getOccupationNameById = (id) => {
    for (const [name, occupationId] of occupationMap.entries()) {
      if (occupationId === id || String(occupationId) === String(id)) {
        return name;
      }
    }
    return null;
  };

  return { 
    occupations, 
    occupationOptions, 
    occupationMap, 
    loading, 
    error,
    getOccupationIdByName,
    getOccupationNameById
  };
};

