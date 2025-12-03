export const formatToDDMMYYYY = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date)) return "";

  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();

  return `${day}/${month}/${year}`;
};