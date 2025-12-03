import React, { useState, useEffect } from "react";
import styles from "./Gender.module.css";

const Gender = ({ name, label = "Gender", value, onChange }) => {

  // Normalize value function
  const normalizeGenderValue = (val) => {
    if (!val || val === "") return "";
    const normalizedValue = String(val).toUpperCase().trim();
    // Map various gender formats to MALE or FEMALE
    if (normalizedValue === "MALE" || normalizedValue === "M" || normalizedValue.includes("MALE")) {
      return "MALE";
    } else if (normalizedValue === "FEMALE" || normalizedValue === "F" || normalizedValue.includes("FEMALE")) {
      return "FEMALE";
    }
    return normalizedValue;
  };

  // Initialize with normalized value
  const initialValue = normalizeGenderValue(value);
  const [selected, setSelected] = useState(initialValue);

  // Sync selected state when value prop changes (controlled component)
  useEffect(() => {
    const normalized = normalizeGenderValue(value);
    console.log("🔄 Gender component: Value prop changed. Original:", value, "Normalized:", normalized, "Current selected:", selected);
    if (normalized !== selected) {
      console.log("✅ Gender component: Updating selected from", selected, "to", normalized);
      setSelected(normalized);
    }
  }, [value]); // Only depend on value, not selected

  const genderOptions = [
    { id: 1, label: "Male", value: "MALE" },
    { id: 2, label: "Female", value: "FEMALE" }
  ];

  const handleSelect = (val) => {
    setSelected(val);
    // Call onChange with event-like object for Formik compatibility
    // Formik expects: onChange(e) where e.target.value contains the value
    if (onChange) {
      onChange({ target: { name, value: val } });
    }
  };

  return (
    <div className={styles.gender_wrapper}>
      <p className={styles.gender_label}>{label}</p>
      <div className={styles.gender_content}>
        {genderOptions.map((option) => (
          <label
            key={option.id}
            className={`${styles.gender_option} ${
              selected === option.value ? styles.active : ""
            }`}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Gender;
