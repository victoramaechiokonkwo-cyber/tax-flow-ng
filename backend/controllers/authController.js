const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public (Admin only in production)
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, institution, department, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'tax_officer',
      institution,
      department,
      phone
    });

    // Log registration
    await AuditLog.create({
      action: 'USER_CREATED',
      description: `New user registered: ${email}`,
      user: user._id,
      userEmail: email,
      severity: 'medium'
    });

    res.status(201).json({
      status: 'success',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      // Log failed attempt
      await AuditLog.create({
        action: 'LOGIN_FAILED',
        description: `Failed login attempt for: ${email}`,
        userEmail: email,
        severity: 'medium'
      });

      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if locked
    if (user.isLocked()) {
      return res.status(423).json({
        status: 'error',
        message: 'Account is temporarily locked due to multiple failed attempts'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
      }
      await user.save();

      await AuditLog.create({
        action: 'LOGIN_FAILED',
        description: `Failed login attempt ${user.loginAttempts} for: ${email}`,
        userEmail: email,
        severity: 'medium'
      });

      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = Date.now();
    await user.save();

    // Log successful login
    await AuditLog.create({
      action: 'LOGIN',
      description: `User logged in: ${email}`,
      user: user._id,
      userEmail: email,
      ipAddress: req.ip,
      severity: 'low'
    });

    res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        department: user.department,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, department } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, department },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
};