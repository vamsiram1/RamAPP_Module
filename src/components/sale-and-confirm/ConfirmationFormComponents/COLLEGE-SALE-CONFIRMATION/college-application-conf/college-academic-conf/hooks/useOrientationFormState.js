import { useEffect, useState } from "react";
import {
  useCities,
  useCampusesByCity,
  useClassesByCampus,
  useOrientationsByClassAndCampus,
  useStudentTypesByOrientationAndCampus,
  useOrientationFeeDetails,
} from "../../../../../../../hooks/college-apis/form-apis/OrientationInfoJs";
import {
  formatDateForInput,
  getCampusDisplay,
  getCityDisplay,
  getClassDisplay,
  getOrientationDisplay,
  getStudentTypeDisplay,
} from "../utils/orientationFormatters";

/**
 * Consolidates all state, effects, and handlers for the College Academic/Orientation form.
 * Keeps the UI component simple and declarative.
 */
export default function useOrientationFormState({ academicYear, onDataChange, overviewData }) {
  // Selected IDs
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedOrientationId, setSelectedOrientationId] = useState(null);

  // Selected display values
  const [selectedCityName, setSelectedCityName] = useState("");
  const [selectedBranchName, setSelectedBranchName] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedStudentType, setSelectedStudentType] = useState("");

  // Course details
  const [courseStartDate, setCourseStartDate] = useState("");
  const [courseEndDate, setCourseEndDate] = useState("");
  const [courseFee, setCourseFee] = useState("");

  // Academic year value
  const [academicYearValue, setAcademicYearValue] = useState(academicYear || "");
  useEffect(() => {
    if (academicYear) setAcademicYearValue(academicYear);
  }, [academicYear]);

  // Data sources
  const { cities, loading: citiesLoading } = useCities();
  const { campuses, loading: campusesLoading } = useCampusesByCity(selectedCityId);
  const { classes, loading: classesLoading } = useClassesByCampus(selectedCampusId);
  const { orientations, loading: orientationsLoading } = useOrientationsByClassAndCampus(selectedClassId, selectedCampusId);
  const { studentTypes, loading: studentTypesLoading } = useStudentTypesByOrientationAndCampus(selectedOrientationId, selectedCampusId);
  const { feeDetails } = useOrientationFeeDetails(selectedOrientationId);

  // Derived dropdown options
  const cityOptions = cities?.map(getCityDisplay) || [];
  const branchOptions = campuses?.map(getCampusDisplay) || [];
  const classOptions = classes?.map(getClassDisplay) || [];
  const orientationOptions = orientations?.map(getOrientationDisplay) || [];
  const studentTypeOptions = Array.isArray(studentTypes) ? studentTypes.map(getStudentTypeDisplay) : [];

  // Fee details -> course dates and fee
  useEffect(() => {
    if (!feeDetails) {
      setCourseStartDate("");
      setCourseEndDate("");
      setCourseFee("");
      return;
    }

    const rawStartDate =
      feeDetails.courseStartDate || feeDetails.startDate || feeDetails.orientationStartDate || feeDetails.courseStartedDate || feeDetails.start_date || feeDetails.fromDate || "";
    const rawEndDate =
      feeDetails.courseEndDate || feeDetails.endDate || feeDetails.orientationEndDate || feeDetails.courseEndedDate || feeDetails.end_date || feeDetails.toDate || "";
    const fee = feeDetails.courseFee || feeDetails.fee || feeDetails.orientationFee || feeDetails.totalFee || feeDetails.amount || feeDetails.feeAmount || "";

    setCourseStartDate(formatDateForInput(rawStartDate));
    setCourseEndDate(formatDateForInput(rawEndDate));
    setCourseFee(fee);
  }, [feeDetails]);

  // Handlers
  const handleCityChange = (event) => {
    const selectedCity = event?.target?.value || event;
    const selectedCityObj = cities?.find((c) => getCityDisplay(c) === selectedCity);
    const cityId = selectedCityObj?.cityId || selectedCityObj?.id;
    setSelectedCityId(cityId);
    setSelectedCityName(selectedCity);
    // Reset downstream selections
    setSelectedCampusId(null);
    setSelectedBranchName("");
    setSelectedClassId(null);
    setSelectedClassName("");
    setSelectedOrientationId(null);
    setSelectedCourseName("");
    setSelectedStudentType("");
    // Clear course dates and fee when city changes
    setCourseStartDate("");
    setCourseEndDate("");
    setCourseFee("");
    
    // Notify parent immediately with cleared values
    onDataChange?.({
      cityId: cityId,
      branchId: null,
      joiningClassId: null,
      orientationId: null,
      courseNameId: null,
      studentTypeId: null,
      courseFee: null, // Clear course fee
    });
  };

  const handleBranchChange = (event) => {
    const selectedBranch = event?.target?.value || event;
    const selectedCampus = campuses?.find((cp) => getCampusDisplay(cp) === selectedBranch);
    const campusId = selectedCampus?.campusId || selectedCampus?.id || selectedCampus?.branchId;
    setSelectedCampusId(campusId);
    setSelectedBranchName(selectedBranch);
    // Reset downstream selections
    setSelectedClassId(null);
    setSelectedClassName("");
    setSelectedOrientationId(null);
    setSelectedCourseName("");
    setSelectedStudentType("");
    // Clear course dates and fee when branch changes
    setCourseStartDate("");
    setCourseEndDate("");
    setCourseFee("");
  };

  const handleClassChange = (event) => {
    const selectedClass = event?.target?.value || event;
    const selectedClassObj = classes?.find((cls) => getClassDisplay(cls) === selectedClass);
    const classId = selectedClassObj?.classId || selectedClassObj?.id;
    setSelectedClassId(classId);
    setSelectedClassName(selectedClass);
    // Reset downstream
    setSelectedOrientationId(null);
    setSelectedCourseName("");
    setSelectedStudentType("");
    setCourseStartDate("");
    setCourseEndDate("");
    setCourseFee("");
  };

  const handleOrientationChange = (event) => {
    const selectedOrientation = event?.target?.value || event;
    const selectedOrientationObj = orientations?.find((o) => getOrientationDisplay(o) === selectedOrientation);
    const orientationId = selectedOrientationObj?.orientationId || selectedOrientationObj?.id || selectedOrientationObj?.courseId;
    setSelectedOrientationId(orientationId);
    setSelectedCourseName(selectedOrientation);
    setSelectedStudentType("");

    onDataChange?.({
      cityId: selectedCityId,
      branchId: selectedCampusId,
      joiningClassId: selectedClassId,
      orientationId,
      courseNameId: orientationId,
      studentTypeId: null,
      courseFee, // Include course fee (orientation fee)
    });
  };

  const handleStudentTypeChange = (event) => {
    const selectedType = event?.target?.value || event;
    setSelectedStudentType(selectedType);
    const selectedStudentTypeObj = studentTypes?.find((t) => getStudentTypeDisplay(t) === selectedType);
    const studentTypeId = selectedStudentTypeObj?.studentTypeId || selectedStudentTypeObj?.id;

    onDataChange?.({
      cityId: selectedCityId,
      branchId: selectedCampusId,
      joiningClassId: selectedClassId,
      orientationId: selectedOrientationId,
      courseNameId: selectedOrientationId,
      studentTypeId,
      courseFee, // Include course fee (orientation fee)
    });
  };

  // Bubble changes up when any selection mutates
  useEffect(() => {
    const selectedStudentTypeObj = studentTypes?.find((t) => getStudentTypeDisplay(t) === selectedStudentType);
    const studentTypeId = selectedStudentTypeObj?.studentTypeId || selectedStudentTypeObj?.id;
    onDataChange?.({
      cityId: selectedCityId,
      branchId: selectedCampusId,
      joiningClassId: selectedClassId,
      orientationId: selectedOrientationId,
      courseNameId: selectedOrientationId,
      studentTypeId,
      courseFee, // Include course fee (orientation fee)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCityId, selectedCampusId, selectedClassId, selectedOrientationId, selectedStudentType, courseFee]);

  // Deep auto-population from overviewData
  useEffect(() => {
    if (!overviewData) return;

    const autoPopulate = async () => {
      try {
        if (overviewData.cityName && !selectedCityName && cities?.length > 0) {
          const cityObj = cities.find((c) => getCityDisplay(c) === overviewData.cityName);
          if (cityObj) {
            const cityId = cityObj.cityId || cityObj.id;
            setSelectedCityName(overviewData.cityName);
            setSelectedCityId(cityId);
          }
        }

        const branchName = overviewData.branchName || overviewData.campusName;
        if (branchName && !selectedBranchName && campuses?.length > 0 && selectedCityId) {
          const campusObj = campuses.find((cp) => getCampusDisplay(cp) === branchName);
          if (campusObj) {
            const campusId = campusObj.campusId || campusObj.id || campusObj.branchId;
            setSelectedBranchName(branchName);
            setSelectedCampusId(campusId);
          }
        }

        const className = overviewData.className || overviewData.joiningClassName;
        if (className && !selectedClassName && classes?.length > 0 && selectedCampusId) {
          const classObj = classes.find((cls) => getClassDisplay(cls) === className);
          if (classObj) {
            const classId = classObj.classId || classObj.id;
            setSelectedClassName(className);
            setSelectedClassId(classId);
          }
        }

        const courseName = overviewData.orientationName || overviewData.courseName;
        if (courseName && !selectedCourseName && orientations?.length > 0 && selectedClassId && selectedCampusId) {
          const orientationObj = orientations.find((o) => getOrientationDisplay(o) === courseName);
          if (orientationObj) {
            const orientationId = orientationObj.orientationId || orientationObj.id || orientationObj.courseId;
            setSelectedCourseName(courseName);
            setSelectedOrientationId(orientationId);
          }
        }

        if (overviewData.studentTypeName && !selectedStudentType && studentTypes?.length > 0 && selectedOrientationId && selectedCampusId) {
          const exact = studentTypes.find((t) => getStudentTypeDisplay(t) === overviewData.studentTypeName);
          if (exact) {
            setSelectedStudentType(overviewData.studentTypeName);
          } else {
            const ci = studentTypes.find((t) => getStudentTypeDisplay(t)?.toLowerCase?.() === overviewData.studentTypeName.toLowerCase());
            if (ci) setSelectedStudentType(overviewData.studentTypeName);
          }
        }
      } catch (e) {
        console.error("Error in auto-population:", e);
      }
    };

    autoPopulate();
  }, [
    overviewData,
    cities,
    campuses,
    classes,
    orientations,
    studentTypes,
    selectedCityName,
    selectedBranchName,
    selectedClassName,
    selectedCourseName,
    selectedStudentType,
    selectedCityId,
    selectedCampusId,
    selectedClassId,
    selectedOrientationId,
  ]);

  // Populate course dates and fee directly from overviewData if present
  // Only populate if orientation is selected (not when city/branch/class is changed)
  useEffect(() => {
    if (!overviewData) return;
    // Only auto-populate if orientation is selected (to prevent repopulation when city changes)
    if (!selectedOrientationId) return;
    
    if ((overviewData.orientationStartDate || overviewData.courseStartDate) && !courseStartDate) {
      setCourseStartDate(overviewData.orientationStartDate || overviewData.courseStartDate);
    }
    if ((overviewData.orientationEndDate || overviewData.courseEndDate) && !courseEndDate) {
      setCourseEndDate(overviewData.orientationEndDate || overviewData.courseEndDate);
    }
    if ((overviewData.orientationFee || overviewData.courseFee) && !courseFee) {
      setCourseFee(overviewData.orientationFee || overviewData.courseFee);
    }
  }, [overviewData, courseStartDate, courseEndDate, courseFee, selectedOrientationId]);

  return {
    // Academic year
    academicYearValue,

    // Options and loading flags
    citiesLoading,
    cityOptions,
    campusesLoading,
    branchOptions,
    classesLoading,
    classOptions,
    orientationsLoading,
    orientationOptions,
    studentTypesLoading,
    studentTypeOptions,

    // Selected values
    selectedCityName,
    selectedBranchName,
    selectedClassName,
    selectedCourseName,
    selectedStudentType,

    // Course details
    courseStartDate,
    courseEndDate,
    courseFee,

    // Handlers
    handleCityChange,
    handleBranchChange,
    handleClassChange,
    handleOrientationChange,
    handleStudentTypeChange,
  };
}
