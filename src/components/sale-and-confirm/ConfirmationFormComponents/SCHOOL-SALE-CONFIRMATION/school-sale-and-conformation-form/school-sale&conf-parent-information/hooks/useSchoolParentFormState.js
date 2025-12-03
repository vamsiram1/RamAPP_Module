import { useSectors, useOccupations } from "../hooks/SchoolParentInfo";
import {
  getSectorDisplayValue,
  getOccupationDisplayValue,
  isSectorOther,
  isOccupationOther,
  getFilteredOccupationOptions,
} from "../utils/parentHelpers";

export default function useSchoolParentFormState({ formData, onChange }) {
  const {
    sectorOptions,
    getSectorIdByName,
    getSectorNameById,
    loading: sectorsLoading,
  } = useSectors();
  const {
    occupationOptions,
    getOccupationIdByName,
    getOccupationNameById,
    loading: occupationsLoading,
  } = useOccupations();

  // Handlers
  const handleSectorChangeWithReset = (fieldName) => (e) => {
    const selectedName = e.target.value;
    const sectorId = getSectorIdByName(selectedName);
    onChange({
      target: {
        name: fieldName,
        value: sectorId !== undefined ? sectorId : selectedName,
      },
    });
    // Reset occupation and other occupation if sector changes to/from "Other"
    const occupationFieldName = fieldName === "fatherSector" ? "fatherOccupation" : "motherOccupation";
    const otherOccupationFieldName = fieldName === "fatherSector" ? "fatherOtherOccupation" : "motherOtherOccupation";
    const currentOccupation = getOccupationDisplayValue(formData[occupationFieldName], occupationOptions, getOccupationNameById);
    const currentIsOther = isOccupationOther(currentOccupation);
    const selectedIsOther = isSectorOther(selectedName);
    if ((selectedIsOther && !currentIsOther) || (!selectedIsOther && currentIsOther)) {
      onChange({ target: { name: occupationFieldName, value: "" } });
      onChange({ target: { name: otherOccupationFieldName, value: "" } });
    }
  };

  const handleOccupationChange = (fieldName) => (e) => {
    const selectedName = e.target.value;
    const occupationId = getOccupationIdByName(selectedName);
    onChange({
      target: {
        name: fieldName,
        value: occupationId !== undefined ? occupationId : selectedName,
      },
    });
    // Clear other occupation if not "Other"
    const otherOccupationFieldName = fieldName === "fatherOccupation" ? "fatherOtherOccupation" : "motherOtherOccupation";
    if (!isOccupationOther(selectedName) && formData[otherOccupationFieldName]) {
      onChange({ target: { name: otherOccupationFieldName, value: "" } });
    }
  };

  // Display helpers
  const getSectorDisplay = (value) => getSectorDisplayValue(value, sectorOptions, getSectorNameById);
  const getOccupationDisplay = (value) => getOccupationDisplayValue(value, occupationOptions, getOccupationNameById);

  // Filtered occupation options
  const fatherOccupationOptions = getFilteredOccupationOptions(formData.fatherSector, occupationOptions, getSectorDisplay);
  const motherOccupationOptions = getFilteredOccupationOptions(formData.motherSector, occupationOptions, getSectorDisplay);

  // Show "Other Occupation Name" input
  const showFatherOtherOccupation = isOccupationOther(getOccupationDisplay(formData.fatherOccupation));
  const showMotherOtherOccupation = isOccupationOther(getOccupationDisplay(formData.motherOccupation));

  return {
    sectorOptions,
    sectorsLoading,
    occupationOptions,
    occupationsLoading,
    getSectorDisplay,
    getOccupationDisplay,
    handleSectorChangeWithReset,
    handleOccupationChange,
    fatherOccupationOptions,
    motherOccupationOptions,
    showFatherOtherOccupation,
    showMotherOtherOccupation,
  };
}
