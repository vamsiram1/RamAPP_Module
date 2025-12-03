import { useEffect, useState } from "react";
import { useAuthorizedByList, useConcessionReasonList } from "../../../../../../../hooks/college-apis/form-apis/ConcessionInfoApis";
import { useConcessionTypes } from "../../../../../../../components/sale-and-confirm/ConfirmationFormComponents/SCHOOL-SALE-CONFIRMATION/school-sale-and-conformation-form/school-sale&conf-concestion-info/hooks/SchoolConcession";
import {
  isValidValue,
  normalizeConcessionsFromOverview,
  findConcessionByType,
  getDisplayValueById,
  findOptionByFuzzyText,
} from "../utils/concessionHelpers";

export default function useCollegeConcessionFormState({ formData, onChange, academicYear, academicYearId, overviewData }) {
  const [isChecked, setIsChecked] = useState(formData?.concessionWrittenOnApplication || false);

  // Always sync isChecked with parent form value
  useEffect(() => {
    if (isChecked !== !!formData?.concessionWrittenOnApplication) {
      setIsChecked(!!formData?.concessionWrittenOnApplication);
    }
  }, [formData?.concessionWrittenOnApplication]);
  const [selectedReferredBy, setSelectedReferredBy] = useState("");
  const [selectedAuthorizedBy, setSelectedAuthorizedBy] = useState("");
  const [selectedConcessionReferredBy, setSelectedConcessionReferredBy] = useState("");
  const [selectedConcessionReason, setSelectedConcessionReason] = useState("");

  // Dropdown data
  const { authorizedByList, loading, error } = useAuthorizedByList();
  const { concessionReasonList, loading: reasonLoading, error: reasonError } = useConcessionReasonList();

  // Only need the id lookup; avoid unused values
  const { getConcessionTypeIdByLabel } = useConcessionTypes();

  // Initialize academic year and id into the parent form if missing
  useEffect(() => {
    if (academicYear && onChange && !formData?.academicYear) {
      onChange({ target: { name: "academicYear", value: academicYear } });
    }
    if (academicYearId && onChange && !formData?.academicYearId) {
      onChange({ target: { name: "academicYearId", value: academicYearId } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academicYear, academicYearId]);

  // Options for dropdowns
  const dropdownOptions = loading
    ? ["Loading..."]
    : (authorizedByList?.length ? authorizedByList.map((i) => i.displayText) : ["No data available"]);

  const concessionReasonOptions = reasonLoading
    ? ["Loading..."]
    : (concessionReasonList?.length ? concessionReasonList.map((i) => i.displayText) : ["No data available"]);

  // Display helpers
  const getConcessionReasonDisplayValue = (reasonId) => getDisplayValueById(concessionReasonList || [], reasonId);
  const getAuthorizedByDisplayValue = (authorizedById) => getDisplayValueById(authorizedByList || [], authorizedById);
  const getReferredByDisplayValue = (referredById) => getDisplayValueById(authorizedByList || [], referredById);

  // Handlers
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onChange?.({ target: { name: "concessionWrittenOnApplication", type: "checkbox", checked } });
  };

  const handleFirstYearConcessionChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters (allow only numbers)
    const digitsOnly = value.replace(/\D/g, "");
    
    // Create a filtered event with only numeric value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: digitsOnly,
      },
    };
    
    onChange?.(filteredEvent);
    const typeId = getConcessionTypeIdByLabel("1st year");
    if (typeId !== undefined) {
      onChange?.({ target: { name: "firstYearConcessionTypeId", value: typeId } });
    }
  };

  const handleSecondYearConcessionChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-digit characters (allow only numbers)
    const digitsOnly = value.replace(/\D/g, "");
    
    // Create a filtered event with only numeric value
    const filteredEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: digitsOnly,
      },
    };
    
    onChange?.(filteredEvent);
    const typeId = getConcessionTypeIdByLabel("2nd year");
    if (typeId !== undefined) {
      onChange?.({ target: { name: "secondYearConcessionTypeId", value: typeId } });
    }
  };

  const handleReferredByChange = (event) => {
    const selectedDisplayText = event?.target?.value || event;
    setSelectedReferredBy(selectedDisplayText);
    let referredById = null;
    const selectedItem = (authorizedByList || []).find((i) => i.displayText === selectedDisplayText);
    if (selectedItem) referredById = selectedItem.id;
    else if (typeof selectedDisplayText === 'string' && selectedDisplayText.includes(' - ')) {
      const parts = selectedDisplayText.split(' - ');
      if (parts.length >= 2) referredById = parts[parts.length - 1].trim();
    }
    onChange?.({ target: { name: "referredBy", value: referredById || selectedDisplayText } });
  };

  const handleAuthorizedByChange = (event) => {
    const selectedDisplayText = event?.target?.value || event;
    setSelectedAuthorizedBy(selectedDisplayText);
    let authorizedById = null;
    const selectedItem = (authorizedByList || []).find((i) => i.displayText === selectedDisplayText);
    if (selectedItem) authorizedById = selectedItem.id;
    else if (typeof selectedDisplayText === 'string' && selectedDisplayText.includes(' - ')) {
      const parts = selectedDisplayText.split(' - ');
      if (parts.length >= 2) authorizedById = parts[parts.length - 1].trim();
    }
    onChange?.({ target: { name: "authorizedBy", value: authorizedById || selectedDisplayText } });
  };

  const handleConcessionReferredByChange = (event) => {
    const value = event?.target?.value || event;
    setSelectedConcessionReferredBy(value);
    onChange?.({ target: { name: "concessionReferredBy", value } });
  };

  const handleConcessionReasonChange = (event) => {
    const selectedDisplayText = event?.target?.value || event;
    setSelectedConcessionReason(selectedDisplayText);
    let reasonId = null;
    const selectedItem = (concessionReasonList || []).find((i) => i.displayText === selectedDisplayText);
    if (selectedItem) reasonId = selectedItem.id;
    else if (typeof selectedDisplayText === 'string' && selectedDisplayText.includes(' - ')) {
      const parts = selectedDisplayText.split(' - ');
      if (parts.length >= 2) reasonId = parts[parts.length - 1].trim();
    }
    onChange?.({ target: { name: "concessionReason", value: reasonId || selectedDisplayText } });
  };

  // Seed selected display values if parent formData carries ids
  useEffect(() => {
    if (formData?.concessionReason && (concessionReasonList?.length || 0) > 0) {
      const display = getConcessionReasonDisplayValue(formData.concessionReason);
      if (display && display !== selectedConcessionReason) setSelectedConcessionReason(display);
    }
    if (formData?.authorizedBy && (authorizedByList?.length || 0) > 0) {
      const display = getAuthorizedByDisplayValue(formData.authorizedBy);
      if (display && display !== selectedAuthorizedBy) setSelectedAuthorizedBy(display);
    }
    if (formData?.referredBy && (authorizedByList?.length || 0) > 0) {
      const display = getReferredByDisplayValue(formData.referredBy);
      if (display && display !== selectedReferredBy) setSelectedReferredBy(display);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.concessionReason, formData?.authorizedBy, formData?.referredBy, concessionReasonList, authorizedByList]);

  // Auto-populate from overviewData
  useEffect(() => {
    console.log("[Concession AutoPopulate] effect running");
    console.log("overviewData:", overviewData);
    console.log("loading:", loading, "reasonLoading:", reasonLoading);
    console.log("authorizedByList:", authorizedByList);
    console.log("concessionReasonList:", concessionReasonList);
    console.log("formData before:", formData);

    if (!overviewData || !onChange) return;
    if (loading || reasonLoading) return;

    const concessions = normalizeConcessionsFromOverview(overviewData);
    console.log("normalized concessions:", concessions);

    // Always prefer overview fields for auto-population
    const hasOverviewConcession = isValidValue(overviewData.concessionAmount) || isValidValue(overviewData.concessionReferredBy) || isValidValue(overviewData.reason);
    if (hasOverviewConcession) {
      if (!formData?.concessionWrittenOnApplication) {
        setIsChecked(true);
        onChange({ target: { name: "concessionWrittenOnApplication", type: "checkbox", checked: true } });
      }
      if (!formData?.concessionAmount && isValidValue(overviewData.concessionAmount)) {
        onChange({ target: { name: 'concessionAmount', value: overviewData.concessionAmount } });
      }
      if (!formData?.concessionReferredBy && isValidValue(overviewData.concessionReferredBy)) {
        onChange({ target: { name: 'concessionReferredBy', value: overviewData.concessionReferredBy } });
      }
      if (!formData?.reason && isValidValue(overviewData.reason)) {
        onChange({ target: { name: 'reason', value: overviewData.reason } });
      }
    } else if (concessions.length > 0) {
      // Fallback to concessions array if overview fields are not present
      const firstYear = findConcessionByType(concessions, ["1st", "first", "1st year", "first year"]);
      const secondYear = findConcessionByType(concessions, ["2nd", "second", "2nd year", "second year"]);
      const thirdYear = findConcessionByType(concessions, ["3rd", "third", "3rd year", "third year"]);
      const primary = firstYear || secondYear || thirdYear || concessions[0];

      if (firstYear && isValidValue(firstYear.amount) && !formData?.firstYearConcession) {
        onChange({ target: { name: "firstYearConcession", value: firstYear.amount } });
      }
      if (secondYear && isValidValue(secondYear.amount) && !formData?.secondYearConcession) {
        onChange({ target: { name: "secondYearConcession", value: secondYear.amount } });
      }
      if (primary && isValidValue(primary.comments) && !formData?.description) {
        onChange({ target: { name: "description", value: primary.comments } });
      }
      if (primary && isValidValue(primary.amount) && !formData?.concessionAmount) {
        onChange({ target: { name: "concessionAmount", value: primary.amount } });
        if (!formData?.concessionWrittenOnApplication) {
          setIsChecked(true);
          onChange({ target: { name: "concessionWrittenOnApplication", type: "checkbox", checked: true } });
        }
      }
      if (primary && isValidValue(primary.reasonName) && !formData?.reason) {
        onChange({ target: { name: "reason", value: primary.reasonName } });
      }

      // Dropdowns: fuzzy match against displayText list
      if (primary?.referredBy && !formData?.referredBy && (authorizedByList?.length || 0) > 0) {
        const match = findOptionByFuzzyText(authorizedByList, primary.referredBy);
        if (match) {
          setSelectedReferredBy(match.displayText);
          onChange({ target: { name: "referredBy", value: match.id } });
        } else {
          onChange({ target: { name: "referredBy", value: primary.referredBy } });
        }
      }
      if (primary?.authorizedBy && !formData?.authorizedBy && (authorizedByList?.length || 0) > 0) {
        const match = findOptionByFuzzyText(authorizedByList, primary.authorizedBy);
        if (match) {
          setSelectedAuthorizedBy(match.displayText);
          onChange({ target: { name: "authorizedBy", value: match.id } });
        } else {
          onChange({ target: { name: "authorizedBy", value: primary.authorizedBy } });
        }
      }
      if (primary?.referredBy && !formData?.concessionReferredBy) {
        setSelectedConcessionReferredBy(primary.referredBy);
        onChange({ target: { name: "concessionReferredBy", value: primary.referredBy } });
      }
      if (primary?.reasonName && !formData?.concessionReason && (concessionReasonList?.length || 0) > 0) {
        const match = findOptionByFuzzyText(concessionReasonList, primary.reasonName);
        if (match) {
          setSelectedConcessionReason(match.displayText);
          onChange({ target: { name: "concessionReason", value: match.id } });
        } else {
          onChange({ target: { name: "concessionReason", value: primary.reasonName } });
        }
      }
    }
    console.log("formData after:", formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overviewData, authorizedByList, concessionReasonList, loading, reasonLoading]);

  const hasValidConcessionData = () => true; // keep previous behavior

  return {
    // options
    dropdownOptions,
    concessionReasonOptions,

    // selected display values
    selectedReferredBy,
    selectedAuthorizedBy,
    selectedConcessionReferredBy,
    selectedConcessionReason,

    // handlers
    handleCheckboxChange,
    handleFirstYearConcessionChange,
    handleSecondYearConcessionChange,
    handleReferredByChange,
    handleAuthorizedByChange,
    handleConcessionReferredByChange,
    handleConcessionReasonChange,

    // display getters (for controlled value fallbacks)
    getReferredByDisplayValue,
    getAuthorizedByDisplayValue,
    getConcessionReasonDisplayValue,

    // checkbox state
    isChecked,
    setIsChecked,

    // misc
    hasValidConcessionData,
  };
}
