const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  taxpayer: {
    type: String,
    required: [true, 'Taxpayer name is required'],
    trim: true
  },
  taxpayerTIN: {
    type: String,
    required: [true, 'Taxpayer TIN is required'],
    trim: true,
    match: [/^\d{10,12}$/, 'TIN must be 10-12 digits']
  },
  taxType: {
    type: String,
    enum: ['CIT', 'VAT', 'PAYE', 'WHT', 'EDT', 'PIT'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  taxLiability: {
    type: Number,
    required: true
  },
  taxRate: {
    type: Number,
    required: true
  },
  assessmentYear: {
    type: Number,
    required: true
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'filed', 'approved', 'rejected', 'overdue'],
    default: 'draft'
  },
  filingDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  paymentDate: {
    type: Date
  },
  paymentReference: {
    type: String
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  filedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  legacyData: {
    sourceSystem: String,
    originalId: String,
    extractedAt: Date,
    rawData: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for faster queries
transactionSchema.index({ taxpayerTIN: 1, taxType: 1, assessmentYear: 1 });
transactionSchema.index({ status: 1, dueDate: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);