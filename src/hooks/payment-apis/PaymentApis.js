import axios from 'axios';
import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:8080/api';

const paymentApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fetch organizations from API
export const getOrganizations = async () => {
  try {
    const response = await paymentApiClient.get('/student-admissions-sale/organizations');
    return response.data;
  } catch (error) {
    console.error('Error fetching organizations:', error.message);
    throw error;
  }
};

// Hook for organizations dropdown
export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [organizationOptions, setOrganizationOptions] = useState([]); // Array of labels for dropdown
  const [organizationMap, setOrganizationMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const response = await getOrganizations();
        console.log('Organizations API Response:', response);
        
        // Handle different possible response structures
        const organizationsData = response?.data || response || [];
        console.log('Organizations Data:', organizationsData);
        
        // Helper function to extract label from organization object
        const extractLabel = (org) => {
          if (!org) return null;
          
          // If it's already a string, return it
          if (typeof org === 'string') {
            return org;
          }
          
          // If it's a number, convert to string
          if (typeof org === 'number') {
            return String(org);
          }
          
          // If it's an object, try to find label property
          if (typeof org === 'object' && org !== null) {
            // Try common property names
            const label = org.name || 
                         org.organizationName || 
                         org.orgName ||
                         org.label || 
                         org.organization || 
                         org.type ||
                         org.description ||
                         org.title;
            
            if (label) {
              return typeof label === 'string' ? label : String(label);
            }
            
            // If no label found, try to get first string value from object
            const stringValue = Object.values(org).find(val => typeof val === 'string' && val);
            if (stringValue) {
              return stringValue;
            }
          }
          
          return null;
        };
        
        // Create array of organization labels for dropdown display
        const options = organizationsData
          .map(extractLabel)
          .filter(label => label !== null && label !== undefined);
        
        console.log('Organization Options:', options);
        
        // Create map of label -> id for easy lookup
        const labelToIdMap = new Map();
        organizationsData.forEach(org => {
          const label = extractLabel(org);
          const id = org?.id || org?.organizationId || org?.orgId || org?.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        console.log('Organization Map:', labelToIdMap);
        
        setOrganizations(organizationsData);
        setOrganizationOptions(options);
        setOrganizationMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useOrganizations:', err);
        setError(err);
        setOrganizations([]);
        setOrganizationOptions([]);
        setOrganizationMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  // Helper function to get organization ID by label
  const getOrganizationIdByLabel = (label) => {
    return organizationMap.get(label);
  };

  // Helper function to get organization label by ID
  const getOrganizationLabelById = (id) => {
    for (const [label, orgId] of organizationMap.entries()) {
      if (orgId === id || String(orgId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  return { 
    organizations, 
    organizationOptions, 
    organizationMap, 
    loading, 
    error,
    getOrganizationIdByLabel,
    getOrganizationLabelById
  };
};

// Fetch banks by organization ID from API
export const getBanksByOrganization = async (organizationId) => {
  try {
    if (!organizationId) {
      return [];
    }
    const response = await paymentApiClient.get(`/student-admissions-sale/banks/${organizationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching banks by organization:', error.message);
    throw error;
  }
};

// Hook for banks dropdown (fetches when organization ID is selected)
export const useBanksByOrganization = (organizationId) => {
  const [banks, setBanks] = useState([]);
  const [bankOptions, setBankOptions] = useState([]); // Array of labels for dropdown
  const [bankMap, setBankMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanks = async () => {
      // Don't fetch if organization ID is not available
      if (!organizationId) {
        setBanks([]);
        setBankOptions([]);
        setBankMap(new Map());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getBanksByOrganization(organizationId);
        console.log('Banks API Response:', response);
        
        // Handle different possible response structures
        const banksData = response?.data || response || [];
        console.log('Banks Data:', banksData);
        
        // Helper function to extract label from bank object
        const extractLabel = (bank) => {
          if (!bank) return null;
          
          // If it's already a string, return it
          if (typeof bank === 'string') {
            return bank;
          }
          
          // If it's a number, convert to string
          if (typeof bank === 'number') {
            return String(bank);
          }
          
          // If it's an object, try to find label property
          if (typeof bank === 'object' && bank !== null) {
            // Try common property names
            const label = bank.name || 
                         bank.bankName || 
                         bank.bank_name ||
                         bank.label || 
                         bank.bank || 
                         bank.type ||
                         bank.description ||
                         bank.title;
            
            if (label) {
              return typeof label === 'string' ? label : String(label);
            }
            
            // If no label found, try to get first string value from object
            const stringValue = Object.values(bank).find(val => typeof val === 'string' && val);
            if (stringValue) {
              return stringValue;
            }
          }
          
          return null;
        };
        
        // Create array of bank labels for dropdown display
        const options = banksData
          .map(extractLabel)
          .filter(label => label !== null && label !== undefined);
        
        console.log('Bank Options:', options);
        
        // Create map of label -> id for easy lookup
        const labelToIdMap = new Map();
        banksData.forEach(bank => {
          const label = extractLabel(bank);
          const id = bank?.id || bank?.bankId || bank?.bank_id || bank?.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        console.log('Bank Map:', labelToIdMap);
        
        setBanks(banksData);
        setBankOptions(options);
        setBankMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useBanksByOrganization:', err);
        setError(err);
        setBanks([]);
        setBankOptions([]);
        setBankMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, [organizationId]);

  // Helper function to get bank ID by label
  const getBankIdByLabel = (label) => {
    return bankMap.get(label);
  };

  // Helper function to get bank label by ID
  const getBankLabelById = (id) => {
    for (const [label, bankId] of bankMap.entries()) {
      if (bankId === id || String(bankId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  return { 
    banks, 
    bankOptions, 
    bankMap, 
    loading, 
    error,
    getBankIdByLabel,
    getBankLabelById
  };
};

// Fetch branches by organization ID and bank ID from API
export const getBranchesByOrganizationAndBank = async (organizationId, bankId) => {
  try {
    if (!organizationId || !bankId) {
      return [];
    }
    const response = await paymentApiClient.get(`/student-admissions-sale/branches/${organizationId}/${bankId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching branches by organization and bank:', error.message);
    throw error;
  }
};

// Hook for branches dropdown (fetches when organization ID and bank ID are selected)
export const useBranchesByOrganizationAndBank = (organizationId, bankId) => {
  const [branches, setBranches] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]); // Array of labels for dropdown
  const [branchMap, setBranchMap] = useState(new Map()); // Map label -> id
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      // Don't fetch if organization ID or bank ID is not available
      if (!organizationId || !bankId) {
        setBranches([]);
        setBranchOptions([]);
        setBranchMap(new Map());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getBranchesByOrganizationAndBank(organizationId, bankId);
        console.log('Branches API Response:', response);
        
        // Handle different possible response structures
        const branchesData = response?.data || response || [];
        console.log('Branches Data:', branchesData);
        
        // Helper function to extract label from branch object
        const extractLabel = (branch) => {
          if (!branch) return null;
          
          // If it's already a string, return it
          if (typeof branch === 'string') {
            return branch;
          }
          
          // If it's a number, convert to string
          if (typeof branch === 'number') {
            return String(branch);
          }
          
          // If it's an object, try to find label property
          if (typeof branch === 'object' && branch !== null) {
            // Try common property names
            const label = branch.name || 
                         branch.branchName || 
                         branch.branch_name ||
                         branch.label || 
                         branch.branch || 
                         branch.type ||
                         branch.description ||
                         branch.title;
            
            if (label) {
              return typeof label === 'string' ? label : String(label);
            }
            
            // If no label found, try to get first string value from object
            const stringValue = Object.values(branch).find(val => typeof val === 'string' && val);
            if (stringValue) {
              return stringValue;
            }
          }
          
          return null;
        };
        
        // Create array of branch labels for dropdown display
        const options = branchesData
          .map(extractLabel)
          .filter(label => label !== null && label !== undefined);
        
        console.log('Branch Options:', options);
        
        // Create map of label -> id for easy lookup
        const labelToIdMap = new Map();
        branchesData.forEach(branch => {
          const label = extractLabel(branch);
          const id = branch?.id || branch?.branchId || branch?.branch_id || branch?.value;
          if (label && id !== undefined) {
            labelToIdMap.set(label, id);
          }
        });
        
        console.log('Branch Map:', labelToIdMap);
        
        setBranches(branchesData);
        setBranchOptions(options);
        setBranchMap(labelToIdMap);
        setError(null);
      } catch (err) {
        console.error('Error in useBranchesByOrganizationAndBank:', err);
        setError(err);
        setBranches([]);
        setBranchOptions([]);
        setBranchMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [organizationId, bankId]);

  // Helper function to get branch ID by label
  const getBranchIdByLabel = (label) => {
    return branchMap.get(label);
  };

  // Helper function to get branch label by ID
  const getBranchLabelById = (id) => {
    for (const [label, branchId] of branchMap.entries()) {
      if (branchId === id || String(branchId) === String(id)) {
        return label;
      }
    }
    return null;
  };

  return { 
    branches, 
    branchOptions, 
    branchMap, 
    loading, 
    error,
    getBranchIdByLabel,
    getBranchLabelById
  };
};

