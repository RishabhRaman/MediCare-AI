const crypto = require('crypto');
const User = require('../models/User');
const Report = require('../models/Report');
const HealthMetric = require('../models/HealthMetric');
const Recommendation = require('../models/Recommendation');
const SearchHistory = require('../models/SearchHistory');

// Helper to send token response with cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: userObj,
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, healthProfile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      healthProfile: healthProfile || {},
    });

    sendTokenResponse(user, 201, res);
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    1-Click Demo Login (for portfolio & instant testing)
// @route   POST /api/auth/demo
// @access  Public
exports.demoLogin = async (req, res, next) => {
  try {
    const demoEmail = 'demo.patient@medicare.ai';
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Mercer',
        email: demoEmail,
        password: 'MedicareDemoPassword2026!',
        isDemoUser: true,
        role: 'patient',
        healthProfile: {
          age: 38,
          gender: 'Male',
          bloodType: 'O+',
          height: 178,
          weight: 76,
          allergies: ['Penicillin', 'Peanuts (Mild)'],
          chronicConditions: ['Mild Hyperlipidemia', 'Seasonal Rhinitis'],
          currentMedications: ['Omega-3 1000mg', 'Vitamin D3 2000IU'],
          emergencyContact: {
            name: 'Sarah Mercer',
            relation: 'Spouse',
            phone: '+1 (555) 234-5678',
          },
        },
        preferences: {
          theme: 'dark',
          emailNotifications: true,
          criticalAlerts: true,
          taskReminders: true,
        },
      });
    }

    sendTokenResponse(demoUser, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile and settings
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, healthProfile, preferences, avatar } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;
    if (healthProfile) fieldsToUpdate.healthProfile = healthProfile;
    if (preferences) fieldsToUpdate.preferences = preferences;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Health profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export all user data (Privacy / HIPAA Compliance)
// @route   GET /api/auth/export
// @access  Private
exports.exportData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    const reports = await Report.find({ user: userId });
    const metrics = await HealthMetric.find({ user: userId });
    const recommendations = await Recommendation.find({ user: userId });
    const searches = await SearchHistory.find({ user: userId });

    res.status(200).json({
      success: true,
      exportTimestamp: new Date().toISOString(),
      userData: {
        profile: user,
        reports,
        healthMetrics: metrics,
        recommendations,
        symptomSearches: searches,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account and purge all records
// @route   DELETE /api/auth/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Promise.all([
      User.findByIdAndDelete(userId),
      Report.deleteMany({ user: userId }),
      HealthMetric.deleteMany({ user: userId }),
      Recommendation.deleteMany({ user: userId }),
      SearchHistory.deleteMany({ user: userId }),
    ]);

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Your account and all associated health records have been permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Successfully signed out.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List available auth providers (Google OAuth is optional)
// @route   GET /api/auth/providers
// @access  Public
exports.getAuthProviders = async (req, res) => {
  res.status(200).json({
    success: true,
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  });
};

// @desc    Request a password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const genericMessage =
      'If an account exists for that email, a password reset link has been issued.';

    if (!user || user.googleId) {
      return res.status(200).json({ success: true, message: genericMessage });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    console.log(`[Auth] Password reset URL for ${user.email}: ${resetUrl}`);

    const payload = {
      success: true,
      message: genericMessage,
    };

    if (process.env.NODE_ENV !== 'production') {
      payload.resetUrl = resetUrl;
      payload.message =
        'Password reset link generated. In production this would be emailed; use the link below to continue.';
    }

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token from email / local reset URL
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired. Please request a new one.',
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const googleRedirectUri = () =>
  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

// @desc    Start Google OAuth
// @route   GET /api/auth/google
// @access  Public
exports.googleAuthStart = (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(501).json({
      success: false,
      message: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
    });
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: googleRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

// @desc    Google OAuth callback — issues JWT and returns to the SPA
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleAuthCallback = async (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  try {
    const { code, error } = req.query;
    if (error || !code) {
      return res.redirect(`${clientUrl}/login?oauth=denied`);
    }

    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: googleRedirectUri(),
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.redirect(`${clientUrl}/login?oauth=failed`);
    }

    const profileRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    if (!profile.email) {
      return res.redirect(`${clientUrl}/login?oauth=failed`);
    }

    let user = await User.findOne({
      $or: [{ googleId: profile.sub }, { email: profile.email.toLowerCase() }],
    });

    if (!user) {
      user = await User.create({
        name: profile.name || profile.email.split('@')[0],
        email: profile.email.toLowerCase(),
        googleId: profile.sub,
        avatar: profile.picture || '',
        password: crypto.randomBytes(24).toString('hex'),
      });
    } else if (!user.googleId) {
      user.googleId = profile.sub;
      if (profile.picture && !user.avatar) user.avatar = profile.picture;
      await user.save({ validateBeforeSave: false });
    }

    const token = user.generateAuthToken();
    res.redirect(`${clientUrl}/auth/callback?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error('[Google OAuth]', error);
    res.redirect(`${clientUrl}/login?oauth=failed`);
  }
};
