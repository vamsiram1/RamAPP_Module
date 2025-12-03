export const formatFee = (amount) => {
  if (amount === null || amount === undefined) return "";

  // Convert to number safely
  const num = Number(amount);
  if (isNaN(num)) return amount; // return original if invalid

  // Convert using Indian locale
  return num.toLocaleString("en-IN");
};