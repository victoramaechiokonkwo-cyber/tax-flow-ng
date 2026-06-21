const TaxCalculation = require('../models/TaxCalculation');
const { v4: uuidv4 } = require('uuid');

// Nigerian Tax Calculation Logic
const calculateCIT = (inputs) => {
  const { grossProfit, allowableDeductions = 0, capitalAllowances = 0 } = inputs;
  const assessableProfit = Math.max(0, grossProfit - allowableDeductions - capitalAllowances);
  const taxLiability = assessableProfit * 0.30; // 30% CIT rate
  return {
    taxLiability,
    netAmount: grossProfit - taxLiability,
    effectiveRate: grossProfit > 0 ? (taxLiability / grossProfit) * 100 : 0,
    breakdown: {
      grossProfit,
      totalDeductions: allowableDeductions + capitalAllowances,
      assessableProfit,
      taxRate: 30,
      taxLiability
    }
  };
};

const calculateVAT = (inputs) => {
  const { taxableSupplies, inputVat = 0 } = inputs;
  const outputVat = taxableSupplies * 0.075; // 7.5% VAT rate
  const taxLiability = Math.max(0, outputVat - inputVat);
  return {
    taxLiability,
    netAmount: taxableSupplies - taxLiability,
    effectiveRate: taxableSupplies > 0 ? (taxLiability / taxableSupplies) * 100 : 0,
    breakdown: {
      taxableSupplies,
      outputVat,
      inputVat,
      netVatPayable: taxLiability
    }
  };
};

const calculatePAYE = (inputs) => {
  const {
    basicSalary = 0,
    housing = 0,
    transport = 0,
    otherAllowances = 0,
    pension = 0,
    nhf = 0,
    nhis = 0
  } = inputs;

  const grossIncome = basicSalary + housing + transport + otherAllowances;
  const consolidatedRelief = Math.min(grossIncome * 0.01, 200000) + 200000;
  const totalReliefs = pension + nhf + nhis + consolidatedRelief;
  const taxableIncome = Math.max(0, grossIncome - totalReliefs);
  
  let taxLiability = 0;
  
  // Nigerian PAYE progressive tax table (annual)
  if (taxableIncome <= 300000) {
    taxLiability = taxableIncome * 0.07;
  } else if (taxableIncome <= 600000) {
    taxLiability = 21000 + (taxableIncome - 300000) * 0.11;
  } else if (taxableIncome <= 1100000) {
    taxLiability = 54000 + (taxableIncome - 600000) * 0.15;
  } else if (taxableIncome <= 1600000) {
    taxLiability = 129000 + (taxableIncome - 1100000) * 0.19;
  } else if (taxableIncome <= 3200000) {
    taxLiability = 224000 + (taxableIncome - 1600000) * 0.21;
  } else {
    taxLiability = 560000 + (taxableIncome - 3200000) * 0.24;
  }

  return {
    taxLiability,
    netAmount: grossIncome - taxLiability,
    effectiveRate: grossIncome > 0 ? (taxLiability / grossIncome) * 100 : 0,
    breakdown: {
      grossIncome,
      totalReliefs,
      taxableIncome,
      taxBands: [
        { band: 'First ₦300,000 @ 7%', amount: Math.min(taxableIncome, 300000) * 0.07 },
        { band: 'Next ₦300,000 @ 11%', amount: Math.max(0, Math.min(taxableIncome - 300000, 300000)) * 0.11 },
        { band: 'Next ₦500,000 @ 15%', amount: Math.max(0, Math.min(taxableIncome - 600000, 500000)) * 0.15 },
        { band: 'Next ₦500,000 @ 19%', amount: Math.max(0, Math.min(taxableIncome - 1100000, 500000)) * 0.19 },
        { band: 'Next ₦1,600,000 @ 21%', amount: Math.max(0, Math.min(taxableIncome - 1600000, 1600000)) * 0.21 },
        { band: 'Above ₦3,200,000 @ 24%', amount: Math.max(0, taxableIncome - 3200000) * 0.24 }
      ],
      taxLiability
    }
  };
};

const calculateWHT = (inputs) => {
  const { contractAmount, whtType = 'contract' } = inputs;
  const rates = {
    dividend: 0.10,
    interest: 0.10,
    rent: 0.10,
    contract: 0.05,
    consultancy: 0.10
  };
  const rate = rates[whtType] || 0.10;
  const taxLiability = contractAmount * rate;
  
  return {
    taxLiability,
    netAmount: contractAmount - taxLiability,
    effectiveRate: rate * 100,
    breakdown: {
      contractAmount,
      whtType,
      rate: rate * 100,
      taxLiability
    }
  };
};

// @desc    Calculate tax
// @route   POST /api/tax/calculate
// @access  Private
exports.calculateTax = async (req, res, next) => {
  try {
    const { taxType, inputs, taxpayerTIN } = req.body;

    let result;
    switch (taxType) {
      case 'CIT':
        result = calculateCIT(inputs);
        break;
      case 'VAT':
        result = calculateVAT(inputs);
        break;
      case 'PAYE':
        result = calculatePAYE(inputs);
        break;
      case 'WHT':
        result = calculateWHT(inputs);
        break;
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid tax type'
        });
    }

    // Save calculation
    const calculation = await TaxCalculation.create({
      calculationId: `CALC-${uuidv4().slice(0, 8).toUpperCase()}`,
      taxType,
      taxpayerTIN,
      inputs,
      outputs: result,
      calculatedBy: req.user.id
    });

    res.status(200).json({
      status: 'success',
      data: {
        calculation,
        result
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tax calculations history
// @route   GET /api/tax/calculations
// @access  Private
exports.getCalculations = async (req, res, next) => {
  try {
    const calculations = await TaxCalculation.find({ calculatedBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      status: 'success',
      count: calculations.length,
      data: calculations
    });
  } catch (error) {
    next(error);
  }
};