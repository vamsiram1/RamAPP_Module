/**
 * Aadhaar Validation Utility
 *
 * Implements the Verhoeff checksum algorithm used by the
 * Unique Identification Authority of India (UIDAI) for Aadhaar
 * number validation.
 *
 * An Aadhaar number is a 12-digit unique identification number.
 * The 12th digit is a checksum calculated using the Verhoeff
 * algorithm to detect transcription and transposition errors.
 */

// 1. Verhoeff Dihedral Multiplication Table (D8)
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

// 2. Permutation Table (P10)
const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

// 3. Inverse Table (used for checksum calculation)
const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Calculates the Verhoeff checksum digit for a given number string.
 * @param {string} numString - The number string (e.g., first 11 digits of Aadhaar).
 * @returns {number} The checksum digit.
 */
function calculateVerhoeffChecksum(numString) {
  let c = 0;
  const numArr = String(numString).split('').map(Number);

  for (let i = 0; i < numArr.length; i++) {
    const j = numArr.length - 1 - i;
    // Multiplies the current checksum (c) with the permutation (p) of the index (i % 8)
    // and the digit (numArr[j]).
    c = d[c][p[i % 8][numArr[j]]];
  }
  return inv[c];
}

/**
 * Validates a complete 12-digit Aadhaar number using the Verhoeff algorithm.
 *
 * @param {string} aadhaarNumber - The 12-digit Aadhaar number string.
 * @returns {boolean} True if the Aadhaar number is valid, false otherwise.
 */
export function validateAadhaar(aadhaarNumber) {
  if (typeof aadhaarNumber !== 'string') {
    return false;
  }

  // 1. Basic format and length check
  const cleanedNumber = aadhaarNumber.replace(/[\s\-\.]/g, ''); // Remove spaces, hyphens, dots
  
  if (!/^\d{12}$/.test(cleanedNumber)) {
    // Must be exactly 12 digits
    return false;
  }
  
  // 2. Aadhaar numbers generally do not start with 0 or 1.
  // The first digit of a valid Aadhaar number is typically 2-9.
  if (cleanedNumber.startsWith('0') || cleanedNumber.startsWith('1')) {
     return false;
  }

  // 3. Extract the number part (first 11 digits) and the checksum digit (12th digit)
  const numberPart = cleanedNumber.slice(0, 11);
  const expectedChecksum = Number(cleanedNumber.slice(11));

  // 4. Calculate the checksum for the 11 digits
  const calculatedChecksum = calculateVerhoeffChecksum(numberPart);

  // 5. Compare the calculated checksum with the actual checksum digit
  // The calculated checksum is the inverse of the required check digit.
  // If we calculate the checksum for the *entire* 12 digits, the result should be 0.
  // Let's re-calculate for the entire 12 digits for simplicity.
  
  let c = 0;
  const numArr = cleanedNumber.split('').map(Number);

  for (let i = 0; i < numArr.length; i++) {
    const j = numArr.length - 1 - i;
    c = d[c][p[i % 8][numArr[j]]];
  }

  // A valid Verhoeff number should result in 0 after the final operation.
  return c === 0;
}

// Helper function to calculate the needed check digit (optional, for debugging)
export function getRequiredCheckDigit(numberPart) {
    return calculateVerhoeffChecksum(numberPart);
}