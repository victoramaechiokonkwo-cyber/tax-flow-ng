const xlsx = require('xlsx');

/**
 * Generate Excel report from transaction data
 * @param {Array} data - Transaction data
 * @param {string} reportType - Type of report
 * @returns {Buffer} Excel file buffer
 */
exports.generateExcel = (data, reportType) => {
  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, reportType);
  
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

/**
 * Generate CSV report
 * @param {Array} data - Transaction data
 * @returns {string} CSV string
 */
exports.generateCSV = (data) => {
  const ws = xlsx.utils.json_to_sheet(data);
  return xlsx.utils.sheet_to_csv(ws);
};

/**
 * Format report metadata
 * @param {string} type - Report type
 * @param {string} period - Report period
 * @param {Object} user - User generating report
 * @returns {Object} Formatted metadata
 */
exports.formatReportMetadata = (type, period, user) => {
  return {
    reportType: type,
    period,
    generatedAt: new Date().toISOString(),
    generatedBy: user.name,
    generatedByEmail: user.email,
    institution: user.institution,
    firsCompliant: true,
    version: '1.0.0'
  };
};