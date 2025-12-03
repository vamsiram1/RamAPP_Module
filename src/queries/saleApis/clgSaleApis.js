import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const CLGSALEBASEURL = "http://localhost:8080";

const APPLICATION_SALE = "/api/student-admissions-sale";
const APPLICATION_CONFIRMATION = "/api/application-confirmation";
const DISTRIBUTION_GETS = "/distribution/gets";

/* ========================
   API CALL FUNCTIONS
======================== */

const getApplicationHeaderValues = async (applicationNo) =>
  (await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_SALE}/by-application-no/{applicationNo}?appNo=${applicationNo}`
  )).data;

const getQuota = async () =>
  (await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/quotas`)).data;

const getEmployeesForSale = async () =>
  (await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_SALE}/authorizedBy/all`
  )).data;

const getAllCities = async () => {
  const response = await axios.get(`${CLGSALEBASEURL}${DISTRIBUTION_GETS}/cities`);
  // Handle nested data structure: response.data.data or response.data
  return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
};

const getAdmissionType = async () =>
  (await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/admission-types`))
    .data;

const getSector = async () =>
  (await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_CONFIRMATION}/dropdown/sectors`
  )).data;

const getOccupation = async () =>
  (await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_CONFIRMATION}/dropdown/occupations`
  )).data;

const getClassesByCampusId = async (campusId) => {
  const response = await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_SALE}/classes/by-campus/${campusId}`
  );
  // Handle nested data structure: response.data.data or response.data
  return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
};

const getOrientationByClass = async ({ classId, campusId }) => {
  const response = await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_SALE}/orientations/by-class/${classId}/cmps/${campusId}`
  );
  // Handle nested data structure: response.data.data or response.data
  return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
};

const getStudentTypeByClass = async ({ campusId, classId }) => {
  const response = await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_SALE}/study-typebycmpsId_and_classId?cmpsId=${campusId}&classId=${classId}`
  );
  // Handle nested data structure: response.data.data or response.data
  return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
};

const getOrientationDatesAndFee = async (orientationId) =>
  (await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_SALE}/OrientationFeeDetails/${orientationId}`
  )).data;

const getBranchFeeByCampusId = async (campusId) => {
  const response = await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_SALE}/branch-fee/${campusId}`
  );
  // Handle nested data structure: response.data.data or response.data
  // Return the fee value (could be a number or object with fee property)
  if (response.data?.data) {
    return typeof response.data.data === 'object' ? response.data.data : { fee: response.data.data };
  }
  if (typeof response.data === 'object' && response.data !== null) {
    return response.data;
  }
  return { fee: response.data || null };
};

const getCampusesByCityId = async(cityId) => {
  const response = await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/by-city/Campuses/${cityId}`);
  // Handle nested data structure: response.data.data or response.data
  return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
};

const getState = async () =>
  (await axios.get(`${CLGSALEBASEURL}${DISTRIBUTION_GETS}/states`)).data;

const getDistrictByState = async (stateId) =>
  (await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_SALE}/districts/${stateId}`
  )).data;

const getSchoolType = async () =>
  (await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_SALE}/Type_of_school`
  )).data;

const getFoodType = async () => {
  const response = await axios.get(
    `${CLGSALEBASEURL}${APPLICATION_CONFIRMATION}/dropdown/foodtypes`
  );
  // Handle nested data structure: response.data.data or response.data
  return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
};

const getBloodGroup = async () =>
  (await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/BloodGroup/all`))
    .data;

const getCaste = async () =>
  (await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/castes`)).data;

const getReligion = async () =>
  (await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/religions`)).data;

const getConcessionReasons = async () => {
  const response = await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/concessionReson/all`);
  // Handle nested data structure: response.data.data or response.data
  return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
};

const getPincode = async (pinCode) =>
  (await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/${pinCode}`)).data;

const getMandalsByDistrictId = async (districtId) =>
  (await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/mandals/${districtId}`))
    .data;

const getCityByDistrictId = async (districtId) =>
  (await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/cities/${districtId}`))
    .data;

const getAllClasses = async() => {
  const response = await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/all/Studentclass`);
  // Handle nested data structure: response.data.data or response.data
  return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
};

const getRelationType= async()=>
(await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/relation-types`)).data;

const getAllClgTypes = async() =>
(await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/Clge-Types`)).data;

const getSchoolNames = async(newDistrictId,schoolType) =>
(await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/${newDistrictId}/${schoolType}/schools`)).data;

const getClgNames = async(newDistrictId,collegeTypeId)=>
(await axios.get(`${CLGSALEBASEURL}${APPLICATION_SALE}/${newDistrictId}/${collegeTypeId}/list`)).data;

/* ========================
   HOOKS (useQuery)
======================== */

export const useGetApplicationHeaderValues = (applicationNo) =>
  useQuery({
    queryKey: ["application-header", applicationNo],
    queryFn: () => getApplicationHeaderValues(applicationNo),
    enabled: !!applicationNo,
  });

export const useGetQuota = () =>
  useQuery({ queryKey: ["quota"], queryFn: getQuota });

export const useGetEmployeesForSale = () =>
  useQuery({ queryKey: ["employees-for-sale"], queryFn: getEmployeesForSale });

export const useGetAllCities = () =>
  useQuery({ queryKey: ["all-cities"], queryFn: getAllCities });

export const useGetAdmissionType = () =>
  useQuery({ queryKey: ["admission-types"], queryFn: getAdmissionType });

export const useGetSector = () =>
  useQuery({ queryKey: ["sectors"], queryFn: getSector });

export const useGetOccupation = () =>
  useQuery({ queryKey: ["occupations"], queryFn: getOccupation });

export const useGetClassesByCampus = (campusId) =>
  useQuery({
    queryKey: ["classes-by-campus", campusId],
    queryFn: () => getClassesByCampusId(campusId),
    enabled: !!campusId,
  });

export const useGetOrientationByClass = (classId, campusId) =>
  useQuery({
    queryKey: ["orientation-by-class", classId, campusId],
    queryFn: () => getOrientationByClass({ classId, campusId }),
    enabled: !!classId && !!campusId,
  });

export const useGetStudentTypeByClass = (campusId, classId) =>
  useQuery({
    queryKey: ["student-type-by-class", campusId, classId],
    queryFn: () => getStudentTypeByClass({ campusId, classId }),
    enabled: !!classId && !!campusId,
  });

export const useGetOrientationDatesAndFee = (orientationId) =>
  useQuery({
    queryKey: ["orientation-dates-fee", orientationId],
    queryFn: () => getOrientationDatesAndFee(orientationId),
    enabled: !!orientationId,
  });

export const useGetBranchFeeByCampus = (campusId) =>
  useQuery({
    queryKey: ["branch-fee-by-campus", campusId],
    queryFn: () => getBranchFeeByCampusId(campusId),
    enabled: !!campusId,
  });

export const useGetState = () =>
  useQuery({ queryKey: ["states"], queryFn: getState });

export const useGetDistrictByState = (stateId) =>
  useQuery({
    queryKey: ["districts-by-state", stateId],
    queryFn: () => getDistrictByState(stateId),
    enabled: !!stateId,
  });

export const useGetSchoolType = (isSchoolFlow) =>
  useQuery({
    queryKey: ["school-types", isSchoolFlow],
    queryFn: getSchoolType,
    enabled: !!isSchoolFlow,
  });

export const useGetFoodType = () =>
  useQuery({ queryKey: ["food-types"], queryFn: getFoodType });

export const useGetBloodGroup = () =>
  useQuery({ queryKey: ["blood-groups"], queryFn: getBloodGroup });

export const useGetCaste = () =>
  useQuery({ queryKey: ["castes"], queryFn: getCaste });

export const useGetReligion = () =>
  useQuery({ queryKey: ["religions"], queryFn: getReligion });

export const useGetConcessionReasons = () =>
  useQuery({
    queryKey: ["concessionReasons"],
    queryFn: getConcessionReasons,
  });

export const useGetPincode = (pinCode) =>
  useQuery({
    queryKey: ["pincode", pinCode],
    queryFn: () => getPincode(pinCode),
    enabled: !!pinCode,
  });

export const useGetMandalsByDistrict = (districtId) =>
  useQuery({
    queryKey: ["mandals-by-district", districtId],
    queryFn: () => getMandalsByDistrictId(districtId),
    enabled: !!districtId,
  });

export const useGetCityByDistrict = (districtId) =>
  useQuery({
    queryKey: ["cities-by-district", districtId],
    queryFn: () => getCityByDistrictId(districtId),
    enabled: !!districtId,
  });

export const useGetAllClasses = () =>
  useQuery({ queryKey: ["Get All Classes"], queryFn: getAllClasses });

export const useGetRelationTypes = () =>
  useQuery({ queryKey: ["Relations: "], queryFn: getRelationType });

export const useGetCampuesByCity = (cityId) =>
  useQuery({
    queryKey: ["canpues-by-city", cityId],
    queryFn: () => getCampusesByCityId(cityId),
    enabled: !!cityId,
  });

export const useGetAllClgTypes = (isCollegeFlow) =>
  useQuery({
    queryKey: ["college-types", isCollegeFlow],
    queryFn: getAllClgTypes,
    enabled: !!isCollegeFlow,
  });

export const useGetSchoolNames = (newDistrictId,schoolType,isSchoolFlow) =>
  useQuery({
    queryKey: ["School Names:", newDistrictId,schoolType],
    queryFn: () => getSchoolNames(newDistrictId,schoolType),
    enabled: !!isSchoolFlow && !!newDistrictId && !!schoolType,
  });

export const useGetClgNames = (newDistrictId,collegeTypeId,isCollegeFlow) =>
  useQuery({
    queryKey: ["College Names:", newDistrictId,collegeTypeId],
    queryFn: () => getClgNames(newDistrictId,collegeTypeId),
    enabled: !!isCollegeFlow && !!newDistrictId && !!collegeTypeId,
  });

