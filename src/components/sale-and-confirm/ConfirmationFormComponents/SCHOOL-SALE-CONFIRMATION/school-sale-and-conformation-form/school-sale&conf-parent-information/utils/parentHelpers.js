// Display value normalization for sector
export function getSectorDisplayValue(value, options, getNameById) {
  if (!value) return "";
  if (options && options.includes(value)) return value;
  const name = getNameById ? getNameById(value) : null;
  return name || value;
}

// Display value normalization for occupation
export function getOccupationDisplayValue(value, options, getNameById) {
  if (!value) return "";
  if (options && options.includes(value)) return value;
  const name = getNameById ? getNameById(value) : null;
  return name || value;
}

// Check if sector is "Other" or "Others"
export function isSectorOther(value) {
  if (!value) return false;
  const v = String(value).toLowerCase().trim();
  return v === "other" || v === "others";
}

// Check if occupation is "Other" or "Others"
export function isOccupationOther(value) {
  if (!value) return false;
  const v = String(value).toLowerCase().trim();
  return v === "other" || v === "others";
}

// Filter occupation options based on sector selection
export function getFilteredOccupationOptions(sectorValue, occupationOptions, getSectorDisplay) {
  if (!sectorValue) return occupationOptions;
  const sectorDisplay = getSectorDisplay(sectorValue);
  const sectorLower = String(sectorDisplay || "").toLowerCase().trim();
  const valueLower = String(sectorValue || "").toLowerCase().trim();
  const isOther = sectorLower === "other" || sectorLower === "others" || valueLower === "other" || valueLower === "others";
  if (isOther) {
    const otherOption = occupationOptions.find(opt => {
      const optLower = String(opt || "").toLowerCase().trim();
      return optLower === "other" || optLower === "others";
    });
    return otherOption ? [otherOption] : [];
  }
  return occupationOptions;
}
