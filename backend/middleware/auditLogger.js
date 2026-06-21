const AuditLog = require('../models/AuditLog');

const auditLog = (action, description, options = {}) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json;
    
    // Override json method to capture response
    res.json = function(data) {
      // Restore original method
      res.json = originalJson;
      
      // Log the action
      const logData = {
        action,
        description: typeof description === 'function' ? description(req, res) : description,
        user: req.user ? req.user._id : null,
        userEmail: req.user ? req.user.email : req.body.email,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        resourceType: options.resourceType,
        resourceId: req.params.id || (data && data.data && data.data._id),
        oldValues: req.body.oldValues,
        newValues: options.captureBody ? req.body : undefined,
        severity: options.severity || 'low'
      };

      // Fire and forget - don't block response
      AuditLog.create(logData).catch(console.error);

      // Call original json
      return res.json(data);
    };

    next();
  };
};

module.exports = auditLog;