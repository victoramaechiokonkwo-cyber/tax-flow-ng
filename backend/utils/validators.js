/**
 * Validate Nigerian TIN (Tax Identification Number)
 * @param {string} tin - TIN to validate
 * @returns {boolean} Is valid
 */
exports.validateTIN = (tin) => {
  return /^\d{10,12}$/.test(tin);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
exports.validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

/**
 * Validate tax period dates
 * @param {Date} start - Period start
 * @param {Date} end - Period end
 * @returns {boolean} Is valid
 */
exports.validateTaxPeriod = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  return startDate < endDate && 
         endDate <= new Date() &&
         (endDate - startDate) / (1000 * 60 * 60 * 24) <= 366; // Max 1 year
};

/**
 * Sanitize string input
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
exports.sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};