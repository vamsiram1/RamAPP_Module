import axios from "axios";
import axiosInstance from "../../axiosInstance";
import { useQuery, useMutation } from "@tanstack/react-query";
const BASE_URL = "http://localhost:8080";
const DAMAGE_URL ="/api/applications";
 
const getApplicationValues = async (applicationNo) =>
(await axios.get(`${BASE_URL}${DAMAGE_URL}/${applicationNo}`)).data;
 
 
export const useGetApplicationValues = (applicationNo) =>
    useQuery({
        queryKey: ["Application Values:", applicationNo],
        queryFn: () => getApplicationValues(applicationNo),
        enabled: !!applicationNo && applicationNo.toString().length >= 4, // Only fetch when valid number
        retry: false, // Don't retry on error
      });

const getApplicationStatuses = async () =>
(await axios.get(`${BASE_URL}/api/applications/statuses`)).data;
 
 
export const useGetApplicationStatuses = () =>
    useQuery({
        queryKey: ["Application Statuses"],
        queryFn: () => getApplicationStatuses(),
      });

// POST request to submit damaged application
const submitDamagedApplication = async (damageData) =>
  (await axiosInstance.post(`${DAMAGE_URL}/status`, damageData)).data;

export const useSubmitDamagedApplication = () =>
  useMutation({
    mutationFn: submitDamagedApplication,
  });
 
 