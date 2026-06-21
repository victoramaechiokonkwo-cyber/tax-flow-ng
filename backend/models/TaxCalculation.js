const mongoose = require('mongoose');

const taxCalculationSchema = new mongoose.Schema({
  calculationId: {
    type: String,
    unique: true,
    required: true
  },
  taxType: {
    type: String,
    enum: ['CIT', 'VAT', 'PAYE', 'WHT'],
    required: true
  },
  taxpayerTIN: {
    type: String,
    required: true
  },
  inputs: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  outputs: {
    taxLiability: Number,
    netAmount: Number,
    effectiveRate: Number,
    breakdown: mongoose.Schema.Types.Mixed
  },
  calculationDate: {
    type: Date,
    default: Date.now
  },
  calculatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isSaved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TaxCalculation', taxCalculationSchema);