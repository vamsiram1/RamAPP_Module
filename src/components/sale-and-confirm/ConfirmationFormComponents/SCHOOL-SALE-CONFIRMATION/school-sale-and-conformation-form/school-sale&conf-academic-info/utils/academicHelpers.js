// Extract fee value from any API response shape
export function extractFeeValue(response) {
  if (typeof response === 'number' || typeof response === 'string') return String(response);
  if (response === null || response === undefined) return "";
  if (response.data !== undefined) {
    const data = response.data;
    if (typeof data === 'number' || typeof data === 'string') return String(data);
    if (typeof data === 'object' && data !== null) {
      return data.fee || data.orientationFee || data.amount || data.value || "";
    }
  }
  if (typeof response === 'object' && response !== null) {
    const fee = response.fee || response.orientationFee || response.amount || response.value;
    if (fee !== undefined && fee !== null) {
      if (typeof fee === 'object') {
        const numericValue = Object.values(fee).find(val => typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val))));
        return numericValue !== undefined ? String(numericValue) : "";
      }
      return String(fee);
    }
  }
  return "";
}

// Display value normalization for dropdowns
export function getDisplayValue(value, options, getLabelById) {
  if (!value) return "";
  if (options && options.includes(value)) return value;
  const label = getLabelById ? getLabelById(value) : null;
  return label || value;
}
