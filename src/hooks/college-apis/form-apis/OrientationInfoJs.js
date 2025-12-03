import axios from 'axios';
import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:8080';

// Create axios client with increased timeout for orientation-related APIs
const orientationApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased to 30 seconds for orientation APIs to handle slow database queries
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fetch cities for dropdown
export const getCities = async () => {
  try {
    const response = await orientationApiClient.get('/distribution/gets/cities', {
      timeout: 60000 // Increased to 60 seconds for cities API to handle slow database queries
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    throw error;
  }
};

// Hook for fetching cities
export const useCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await getCities();
        console.log('Cities API Response:', response);
        // Assuming response.data contains the cities array
        const citiesData = response?.data || response;
        console.log('Cities Data:', citiesData);
        setCities(Array.isArray(citiesData) ? citiesData : []);
        setError(null);
      } catch (err) {
        console.error('Error in useCities:', err);
        setError(err);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
};

// Fetch campuses/branches based on city ID
export const getCampusesByCity = async (cityId) => {
  try {
    const response = await orientationApiClient.get(`/api/student-admissions-sale/by-city/Campuses/${cityId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching campuses:', error.message);
    throw error;
  }
};

// Hook for fetching campuses/branches based on city ID
export const useCampusesByCity = (cityId) => {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampuses = async () => {
      if (!cityId) {
        setCampuses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getCampusesByCity(cityId);
        console.log('Campuses API Response:', response);
        // Assuming response.data contains the campuses array
        const campusesData = response?.data || response;
        console.log('Campuses Data:', campusesData);
        setCampuses(Array.isArray(campusesData) ? campusesData : []);
        setError(null);
      } catch (err) {
        console.error('Error in useCampusesByCity:', err);
        setError(err);
        setCampuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampuses();
  }, [cityId]);

  return { campuses, loading, error };
};

// Fetch classes based on campus ID
export const getClassesByCampus = async (campusId) => {
  try {
    const response = await orientationApiClient.get(`/api/student-admissions-sale/classes/by-campus/${campusId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error.message);
    throw error;
  }
};

// Hook for fetching classes based on campus ID
export const useClassesByCampus = (campusId) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!campusId) {
        setClasses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getClassesByCampus(campusId);
        console.log('Classes API Response:', response);
        // Assuming response.data contains the classes array
        const classesData = response?.data || response;
        console.log('Classes Data:', classesData);
        setClasses(Array.isArray(classesData) ? classesData : []);
        setError(null);
      } catch (err) {
        console.error('Error in useClassesByCampus:', err);
        setError(err);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [campusId]);

  return { classes, loading, error };
};

// Fetch orientations based on class ID and campus ID
export const getOrientationsByClassAndCampus = async (classId, campusId) => {
  try {
    const response = await orientationApiClient.get(`/api/student-admissions-sale/orientations/by-class/${classId}/cmps/${campusId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orientations:', error.message);
    throw error;
  }
};

// Hook for fetching orientations based on class ID and campus ID
export const useOrientationsByClassAndCampus = (classId, campusId) => {
  const [orientations, setOrientations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrientations = async () => {
      if (!classId || !campusId) {
        setOrientations([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getOrientationsByClassAndCampus(classId, campusId);
        console.log('Orientations API Response:', response);
        // Assuming response.data contains the orientations array
        const orientationsData = response?.data || response;
        console.log('Orientations Data:', orientationsData);
        setOrientations(Array.isArray(orientationsData) ? orientationsData : []);
        setError(null);
      } catch (err) {
        console.error('Error in useOrientationsByClassAndCampus:', err);
        setError(err);
        setOrientations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrientations();
  }, [classId, campusId]);

  return { orientations, loading, error };
};

// Fetch student types based on orientation ID and campus ID
export const getStudentTypesByOrientationAndCampus = async (orientationId, campusId) => {
  try {
    const response = await orientationApiClient.get(`/api/student-admissions-sale/studet-type/${orientationId}/${campusId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student types:', error.message);
    throw error;
  }
};

// Hook for fetching student types based on orientation ID and campus ID
export const useStudentTypesByOrientationAndCampus = (orientationId, campusId) => {
  const [studentTypes, setStudentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentTypes = async () => {
      console.log('=== fetchStudentTypes called ===');
      console.log('Orientation ID:', orientationId);
      console.log('Campus ID:', campusId);
      
      if (!orientationId || !campusId) {
        console.log('Missing IDs - skipping student types fetch');
        setStudentTypes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching student types for orientation: ${orientationId}, campus: ${campusId}`);
        const response = await getStudentTypesByOrientationAndCampus(orientationId, campusId);
        console.log('Student Types API Response:', response);
        // Assuming response.data contains the student types array
        const studentTypesData = response?.data || response;
        console.log('Student Types Data:', studentTypesData);
        console.log('Is Array?', Array.isArray(studentTypesData));
        
        // Handle different response types
        let finalData = [];
        if (Array.isArray(studentTypesData)) {
          finalData = studentTypesData;
        } else if (typeof studentTypesData === 'string') {
          // If it's a string, wrap it in an array
          finalData = [studentTypesData];
        } else if (studentTypesData && typeof studentTypesData === 'object') {
          // If it's an object, try to extract an array or convert to array
          finalData = [studentTypesData];
        }
        
        console.log('Final Student Types Data to set:', finalData);
        setStudentTypes(finalData);
        setError(null);
      } catch (err) {
        console.error('Error in useStudentTypesByOrientationAndCampus:', err);
        setError(err);
        setStudentTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentTypes();
  }, [orientationId, campusId]);

  return { studentTypes, loading, error };
};

// Fetch orientation fee details based on orientation ID
export const getOrientationFeeDetails = async (orientationId) => {
  try {
    const response = await orientationApiClient.get(`/api/student-admissions-sale/OrientationFeeDetails/${orientationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orientation fee details:', error.message);
    throw error;
  }
};

// Hook for fetching orientation fee details based on orientation ID
export const useOrientationFeeDetails = (orientationId) => {
  const [feeDetails, setFeeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeeDetails = async () => {
      console.log('=== fetchOrientationFeeDetails called ===');
      console.log('Orientation ID:', orientationId);
      
      if (!orientationId) {
        console.log('No orientation ID - skipping fee details fetch');
        setFeeDetails(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching fee details for orientation: ${orientationId}`);
        const response = await getOrientationFeeDetails(orientationId);
        console.log('Orientation Fee Details API Response:', response);
        // Assuming response.data contains the fee details object
        const feeDetailsData = response?.data || response;
        console.log('Fee Details Data:', feeDetailsData);
        setFeeDetails(feeDetailsData);
        setError(null);
      } catch (err) {
        console.error('Error in useOrientationFeeDetails:', err);
        setError(err);
        setFeeDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeDetails();
  }, [orientationId]);

  return { feeDetails, loading, error };
};
