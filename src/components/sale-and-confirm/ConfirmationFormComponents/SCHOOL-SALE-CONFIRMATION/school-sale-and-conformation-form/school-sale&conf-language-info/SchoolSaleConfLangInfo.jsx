import React from "react";
import Dropdown from "../../../../../../widgets/Dropdown/Dropdown";
import styles from "./SchoolSaleConfLangInfo.module.css";
import { useLanguages } from "./hooks/Schoollanguae";

const SchoolSaleConfLangInfo = ({ formData, onChange }) => {
  // Fetch languages from API
  const { languageOptions, getLanguageIdByLabel, getLanguageLabelById, loading: languagesLoading } = useLanguages();

  // Get display value for language (convert ID to label if needed)
  const getLanguageDisplayValue = (languageValue) => {
    if (!languageValue) return "";
    // If it's already a label (string that exists in options), return it
    if (languageOptions.includes(languageValue)) {
      return languageValue;
    }
    // Otherwise, try to convert ID to label
    const label = getLanguageLabelById(languageValue);
    return label || languageValue;
  };

  // Handle language change - convert label to ID before storing
  const handleLanguageChange = (fieldName) => (e) => {
    const selectedLabel = e.target.value;
    const languageId = getLanguageIdByLabel(selectedLabel);
    
    // Create a synthetic event with the ID value
    const syntheticEvent = {
      target: {
        name: fieldName,
        value: languageId !== undefined ? languageId : selectedLabel // Fallback to label if ID not found
      }
    };
    
    onChange(syntheticEvent);

    // If Language 1 changes and it matches Language 2, clear Language 2
    if (fieldName === "firstLanguage" && formData.secondLanguage) {
      const secondLanguageLabel = getLanguageDisplayValue(formData.secondLanguage);
      if (selectedLabel === secondLanguageLabel) {
        const clearSecondEvent = {
          target: {
            name: "secondLanguage",
            value: ""
          }
        };
        onChange(clearSecondEvent);
      }
    }

    // If Language 1 changes and it matches Language 3, clear Language 3
    if (fieldName === "firstLanguage" && formData.thirdLanguage) {
      const thirdLanguageLabel = getLanguageDisplayValue(formData.thirdLanguage);
      if (selectedLabel === thirdLanguageLabel) {
        const clearThirdEvent = {
          target: {
            name: "thirdLanguage",
            value: ""
          }
        };
        onChange(clearThirdEvent);
      }
    }

    // If Language 2 changes and it matches Language 3, clear Language 3
    if (fieldName === "secondLanguage" && formData.thirdLanguage) {
      const thirdLanguageLabel = getLanguageDisplayValue(formData.thirdLanguage);
      if (selectedLabel === thirdLanguageLabel) {
        const clearThirdEvent = {
          target: {
            name: "thirdLanguage",
            value: ""
          }
        };
        onChange(clearThirdEvent);
      }
    }

    // If Language 2 changes and it matches Language 1, clear Language 1
    if (fieldName === "secondLanguage" && formData.firstLanguage) {
      const firstLanguageLabel = getLanguageDisplayValue(formData.firstLanguage);
      if (selectedLabel === firstLanguageLabel) {
        const clearFirstEvent = {
          target: {
            name: "firstLanguage",
            value: ""
          }
        };
        onChange(clearFirstEvent);
      }
    }

    // If Language 3 changes and it matches Language 1, clear Language 1
    if (fieldName === "thirdLanguage" && formData.firstLanguage) {
      const firstLanguageLabel = getLanguageDisplayValue(formData.firstLanguage);
      if (selectedLabel === firstLanguageLabel) {
        const clearFirstEvent = {
          target: {
            name: "firstLanguage",
            value: ""
          }
        };
        onChange(clearFirstEvent);
      }
    }

    // If Language 3 changes and it matches Language 2, clear Language 2
    if (fieldName === "thirdLanguage" && formData.secondLanguage) {
      const secondLanguageLabel = getLanguageDisplayValue(formData.secondLanguage);
      if (selectedLabel === secondLanguageLabel) {
        const clearSecondEvent = {
          target: {
            name: "secondLanguage",
            value: ""
          }
        };
        onChange(clearSecondEvent);
      }
    }
  };

  // Get selected language labels for filtering
  const firstLanguageLabel = getLanguageDisplayValue(formData.firstLanguage);
  const secondLanguageLabel = getLanguageDisplayValue(formData.secondLanguage);
  const thirdLanguageLabel = getLanguageDisplayValue(formData.thirdLanguage);

  // Filter options for Language 1: exclude Language 2 and Language 3 selections
  const getFirstLanguageOptions = () => {
    if (languagesLoading) return [];
    const selectedLabels = [secondLanguageLabel, thirdLanguageLabel].filter(Boolean);
    if (selectedLabels.length === 0) return languageOptions;
    return languageOptions.filter(lang => !selectedLabels.includes(lang));
  };

  // Filter options for Language 2: exclude Language 1 and Language 3 selections
  const getSecondLanguageOptions = () => {
    if (languagesLoading) return [];
    const selectedLabels = [firstLanguageLabel, thirdLanguageLabel].filter(Boolean);
    if (selectedLabels.length === 0) return languageOptions;
    return languageOptions.filter(lang => !selectedLabels.includes(lang));
  };

  // Filter options for Language 3: exclude Language 1 and Language 2 selections
  const getThirdLanguageOptions = () => {
    if (languagesLoading) return [];
    const selectedLabels = [firstLanguageLabel, secondLanguageLabel].filter(Boolean);
    if (selectedLabels.length === 0) return languageOptions;
    return languageOptions.filter(lang => !selectedLabels.includes(lang));
  };

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <span className={styles.sectionTitle}>Language Information</span>
        <div className={styles.line}></div>
      </div>

      <div className={styles.formGrid3}>
        <Dropdown
          dropdownname="1st Language"
          name="firstLanguage"
          results={getFirstLanguageOptions()}
          value={getLanguageDisplayValue(formData.firstLanguage)}
          onChange={handleLanguageChange("firstLanguage")}
          disabled={languagesLoading}
        />

        <Dropdown
          dropdownname="2nd Language"
          name="secondLanguage"
          results={getSecondLanguageOptions()}
          value={getLanguageDisplayValue(formData.secondLanguage)}
          onChange={handleLanguageChange("secondLanguage")}
          disabled={languagesLoading}
        />

        <Dropdown
          dropdownname="3rd Language"
          name="thirdLanguage"
          results={getThirdLanguageOptions()}
          value={getLanguageDisplayValue(formData.thirdLanguage)}
          onChange={handleLanguageChange("thirdLanguage")}
          disabled={languagesLoading}
        />
      </div>
    </div>
  );
};

export default SchoolSaleConfLangInfo;
