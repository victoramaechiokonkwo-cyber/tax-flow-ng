/**
 * Nigerian Tax Calculation Utilities
 * Based on FIRS regulations as of 2026
 */

const TAX_RATES = {
  CIT: 0.30,      // Companies Income Tax - 30%
  VAT: 0.075,     // Value Added Tax - 7.5%
  WHT_DIVIDEND: 0.10,
  WHT_INTEREST: 0.10,
  WHT_RENT: 0.10,
  WHT_CONTRACT: 0.05,
  WHT_CONSULTANCY: 0.10
};

/**
 * Calculate Companies Income Tax (CIT)
 * @param {number} grossProfit - Gross profit
 * @param {number} allowableDeductions - Allowable deductions
 * @param {number} capitalAllowances - Capital allowances
 * @returns {object} Tax calculation result
 */
exports.calculateCIT = (grossProfit, allowableDeductions = 0, capitalAllowances = 0) => {
  const assessableProfit = Math.max(0, grossProfit - allowableDeductions - capitalAllowances);
  const taxLiability = assessableProfit * TAX_RATES.CIT;
  
  return {
    assessableProfit,
    taxLiability,
    effectiveRate: grossProfit > 0 ? (taxLiability / grossProfit) * 100 : 0,
    deductions: {
      allowable: allowableDeductions,
      capital: capitalAllowances,
      total: allowableDeductions + capitalAllowances
    }
  };
};

/**
 * Calculate Value Added Tax (VAT)
 * @param {number} taxableSupplies - Value of taxable supplies
 * @param {number} inputVat - Input VAT paid
 * @returns {object} VAT calculation result
 */
exports.calculateVAT = (taxableSupplies, inputVat = 0) => {
  const outputVat = taxableSupplies * TAX_RATES.VAT;
  const netVat = Math.max(0, outputVat - inputVat);
  
  return {
    outputVat,
    inputVat,
    netVatPayable: netVat,
    vatRate: TAX_RATES.VAT * 100
  };
};

/**
 * Calculate PAYE (Pay As You Earn)
 * Uses Nigerian progressive tax table
 * @param {number} annualIncome - Gross annual income
 * @param {number} pension - Pension contribution
 * @param {number} nhf - NHF contribution
 * @param {number} nhis - NHIS contribution
 * @returns {object} PAYE calculation result
 */
exports.calculatePAYE = (annualIncome, pension = 0, nhf = 0, nhis = 0) => {
  const consolidatedRelief = Math.min(annualIncome * 0.01, 200000) + 200000;
  const totalReliefs = pension + nhf + nhis + consolidatedRelief;
  const taxableIncome = Math.max(0, annualIncome - totalReliefs);
  
  let tax = 0;
  const bands = [];
  
  // First ₦300,000 @ 7%
  const band1 = Math.min(taxableIncome, 300000);
  tax += band1 * 0.07;
  bands.push({ from: 0, to: 300000, rate: 7, amount: band1 * 0.07 });
  
  // Next ₦300,000 @ 11%
  if (taxableIncome > 300000) {
    const band2 = Math.min(taxableIncome - 300000, 300000);
    tax += band2 * 0.11;
    bands.push({ from: 300000, to: 600000, rate: 11, amount: band2 * 0.11 });
  }
  
  // Next ₦500,000 @ 15%
  if (taxableIncome > 600000) {
    const band3 = Math.min(taxableIncome - 600000, 500000);
    tax += band3 * 0.15;
    bands.push({ from: 600000, to: 1100000, rate: 15, amount: band3 * 0.15 });
  }
  
  // Next ₦500,000 @ 19%
  if (taxableIncome > 1100000) {
    const band4 = Math.min(taxableIncome - 1100000, 500000);
    tax += band4 * 0.19;
    bands.push({ from: 1100000, to: 1600000, rate: 19, amount: band4 * 0.19 });
  }
  
  // Next ₦1,600,000 @ 21%
  if (taxableIncome > 1600000) {
    const band5 = Math.min(taxableIncome - 1600000, 1600000);
    tax += band5 * 0.21;
    bands.push({ from: 1600000, to: 3200000, rate: 21, amount: band5 * 0.21 });
  }
  
  // Above ₦3,200,000 @ 24%
  if (taxableIncome > 3200000) {
    const band6 = taxableIncome - 3200000;
    tax += band6 * 0.24;
    bands.push({ from: 3200000, to: Infinity, rate: 24, amount: band6 * 0.24 });
  }
  
  return {
    annualIncome,
    totalReliefs,
    taxableIncome,
    taxLiability: tax,
    monthlyTax: tax / 12,
    effectiveRate: annualIncome > 0 ? (tax / annualIncome) * 100 : 0,
    taxBands: bands
  };
};

/**
 * Calculate Withholding Tax (WHT)
 * @param {number} amount - Contract/transaction amount
 * @param {string} type - WHT type
 * @returns {object} WHT calculation result
 */
exports.calculateWHT = (amount, type = 'contract') => {
  const rates = {
    dividend: TAX_RATES.WHT_DIVIDEND,
    interest: TAX_RATES.WHT_INTEREST,
    rent: TAX_RATES.WHT_RENT,
    contract: TAX_RATES.WHT_CONTRACT,
    consultancy: TAX_RATES.WHT_CONSULTANCY
  };
  
  const rate = rates[type.toLowerCase()] || TAX_RATES.WHT_CONTRACT;
  const tax = amount * rate;
  
  return {
    grossAmount: amount,
    whtType: type,
    rate: rate * 100,
    taxWithheld: tax,
    netAmount: amount - tax
  };
};