const Transaction = require('../models/Transaction');
const xlsx = require('xlsx');

// @desc    Generate FIRS-compliant report
// @route   POST /api/reports/generate
// @access  Private
exports.generateReport = async (req, res, next) => {
  try {
    const { reportType, periodStart, periodEnd, format = 'json' } = req.body;

    const query = {
      taxType: reportType,
      periodStart: { $gte: new Date(periodStart) },
      periodEnd: { $lte: new Date(periodEnd) }
    };

    const transactions = await Transaction.find(query)
      .populate('filedBy', 'name')
      .sort({ createdAt: -1 });

    const reportData = {
      reportType,
      period: `${periodStart} to ${periodEnd}`,
      generatedAt: new Date(),
      generatedBy: req.user.name,
      totalTransactions: transactions.length,
      totalTaxLiability: transactions.reduce((sum, t) => sum + t.taxLiability, 0),
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      transactions: transactions.map(t => ({
        transactionId: t.transactionId,
        taxpayer: t.taxpayer,
        taxpayerTIN: t.taxpayerTIN,
        amount: t.amount,
        taxLiability: t.taxLiability,
        taxRate: t.taxRate,
        periodStart: t.periodStart,
        periodEnd: t.periodEnd,
        status: t.status,
        filingDate: t.filingDate
      }))
    };

    if (format === 'excel') {
      const ws = xlsx.utils.json_to_sheet(reportData.transactions);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Report');
      
      const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=FIRS_${reportType}_${Date.now()}.xlsx`);
      return res.send(buffer);
    }

    res.status(200).json({
      status: 'success',
      data: reportData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available report templates
// @route   GET /api/reports/templates
// @access  Private
exports.getTemplates = async (req, res, next) => {
  try {
    const templates = [
      {
        id: 'vat_monthly',
        name: 'Monthly VAT Return (Form 002)',
        type: 'VAT',
        description: 'Monthly Value Added Tax return for FIRS submission',
        requiredFields: ['taxableSupplies', 'inputVat', 'outputVat']
      },
      {
        id: 'cit_annual',
        name: 'Companies Income Tax Return',
        type: 'CIT',
        description: 'Annual Companies Income Tax return',
        requiredFields: ['grossProfit', 'allowableDeductions', 'capitalAllowances']
      },
      {
        id: 'paye_monthly',
        name: 'PAYE Remittance Schedule',
        type: 'PAYE',
        description: 'Monthly PAYE remittance schedule',
        requiredFields: ['basicSalary', 'housing', 'transport', 'pension']
      },
      {
        id: 'wht_quarterly',
        name: 'Withholding Tax Summary',
        type: 'WHT',
        description: 'Quarterly Withholding Tax summary',
        requiredFields: ['contractAmount', 'whtType']
      }
    ];

    res.status(200).json({
      status: 'success',
      data: templates
    });
  } catch (error) {
    next(error);
  }
};