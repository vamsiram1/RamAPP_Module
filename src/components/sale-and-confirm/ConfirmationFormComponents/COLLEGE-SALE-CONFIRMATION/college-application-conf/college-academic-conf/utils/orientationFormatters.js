// Utility helpers for Orientation/Academic form

/**
 * Format a date-like value into YYYY-MM-DD suitable for input[type="date"].
 * Accepts strings or Date-compatible values and returns empty string if invalid.
 */
export const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";

  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  try {
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  } catch (_) {
    // ignore
  }

  return "";
};

// Normalizers to derive display values from various API shapes
export const getCityDisplay = (city) => city?.cityName || city?.name || city;
export const getCampusDisplay = (campus) => campus?.campusName || campus?.branchName || campus?.name || campus;
export const getClassDisplay = (cls) => cls?.className || cls?.name || cls;
export const getOrientationDisplay = (o) => o?.orientationName || o?.courseName || o?.name || o;
export const getStudentTypeDisplay = (t) => (typeof t === "string" ? t : (t?.studentTypeName || t?.typeName || t?.name || t));
