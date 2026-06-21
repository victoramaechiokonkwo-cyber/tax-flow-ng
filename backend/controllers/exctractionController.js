const LegacyConnection = require('../models/LegacyConnection');
const Transaction = require('../models/Transaction');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all legacy connections
// @route   GET /api/extraction/connections
// @access  Private
exports.getConnections = async (req, res, next) => {
  try {
    const connections = await LegacyConnection.find({ isActive: true });
    res.status(200).json({
      status: 'success',
      count: connections.length,
      data: connections
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create legacy connection
// @route   POST /api/extraction/connections
// @access  Private (Admin only)
exports.createConnection = async (req, res, next) => {
  try {
    const connection = await LegacyConnection.create(req.body);
    res.status(201).json({
      status: 'success',
      data: connection
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Test connection
// @route   POST /api/extraction/test/:id
// @access  Private
exports.testConnection = async (req, res, next) => {
  try {
    const connection = await LegacyConnection.findById(req.params.id);
    
    if (!connection) {
      return res.status(404).json({
        status: 'error',
        message: 'Connection not found'
      });
    }

    // Simulate connection test
    const isConnected = Math.random() > 0.2; // 80% success rate for demo
    
    connection.status = isConnected ? 'active' : 'error';
    if (!isConnected) {
      connection.errorMessage = 'Connection timeout - check credentials';
    }
    await connection.save();

    res.status(200).json({
      status: 'success',
      data: {
        connected: isConnected,
        connection
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Run ETL extraction
// @route   POST /api/extraction/run/:id
// @access  Private
exports.runExtraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetTaxModule, dateRange } = req.body;

    const connection = await LegacyConnection.findById(id);
    
    if (!connection || connection.status !== 'active') {
      return res.status(400).json({
        status: 'error',
        message: 'Connection is not active'
      });
    }

    // Simulate ETL process
    const extractedRecords = Math.floor(Math.random() * 5000) + 1000;
    const transformedRecords = Math.floor(extractedRecords * 0.95); // 5% rejection rate
    
    // Create mock transactions from extracted data
    const mockTransactions = [];
    const taxTypes = ['VAT', 'CIT', 'PAYE', 'WHT'];
    
    for (let i = 0; i < Math.min(transformedRecords, 10); i++) {
      const taxType = taxTypes[Math.floor(Math.random() * taxTypes.length)];
      mockTransactions.push({
        transactionId: `EXT-${uuidv4().slice(0, 8).toUpperCase()}`,
        taxpayer: `Legacy Taxpayer ${i + 1}`,
        taxpayerTIN: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        taxType,
        amount: Math.floor(Math.random() * 1000000) + 50000,
        taxLiability: Math.floor(Math.random() * 300000) + 10000,
        taxRate: taxType === 'VAT' ? 7.5 : taxType === 'CIT' ? 30 : 10,
        assessmentYear: 2026,
        periodStart: new Date(dateRange?.start || '2026-01-01'),
        periodEnd: new Date(dateRange?.end || '2026-06-30'),
        status: 'pending',
        dueDate: new Date('2026-07-21'),
        legacyData: {
          sourceSystem: connection.name,
          originalId: `LEG-${Math.floor(Math.random() * 100000)}`,
          extractedAt: new Date(),
          rawData: { extracted: true }
        }
      });
    }

    // Save extracted transactions
    await Transaction.insertMany(mockTransactions);

    // Update connection
    connection.lastSync = new Date();
    await connection.save();

    res.status(200).json({
      status: 'success',
      data: {
        extractedRecords,
        transformedRecords,
        rejectedRecords: extractedRecords - transformedRecords,
        createdTransactions: mockTransactions.length,
        connection: connection.name,
        timestamp: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get extraction logs
// @route   GET /api/extraction/logs
// @access  Private
exports.getLogs = async (req, res, next) => {
  try {
    // Return mock logs for demo
    const logs = [
      {
        timestamp: new Date(Date.now() - 3600000),
        action: 'EXTRACTION_STARTED',
        connection: 'Legacy Oracle DB',
        recordsProcessed: 14203,
        status: 'success'
      },
      {
        timestamp: new Date(Date.now() - 7200000),
        action: 'TRANSFORMATION_COMPLETE',
        connection: 'Ministry SQL Server',
        recordsProcessed: 8934,
        status: 'success'
      }
    ];

    res.status(200).json({
      status: 'success',
      data: logs
    });
  } catch (error) {
    next(error);
  }
};