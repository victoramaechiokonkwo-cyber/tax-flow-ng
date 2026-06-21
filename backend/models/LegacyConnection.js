const mongoose = require('mongoose');

const legacyConnectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  connectionType: {
    type: String,
    enum: ['oracle', 'mssql', 'mysql', 'postgresql', 'mongodb', 'csv', 'excel', 'api'],
    required: true
  },
  host: {
    type: String,
    trim: true
  },
  port: {
    type: Number
  },
  database: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    trim: true
  },
  // Password should be encrypted in production
  password: {
    type: String,
    select: false
  },
  connectionString: {
    type: String,
    select: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error', 'connecting'],
    default: 'inactive'
  },
  lastSync: {
    type: Date
  },
  syncSchedule: {
    type: String,
    enum: ['manual', 'hourly', 'daily', 'weekly'],
    default: 'manual'
  },
  tables: [{
    name: String,
    mappedTo: String,
    lastExtracted: Date,
    recordCount: Number
  }],
  configuration: {
    type: mongoose.Schema.Types.Mixed
  },
  errorMessage: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LegacyConnection', legacyConnectionSchema);