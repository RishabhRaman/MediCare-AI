const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [
        function () {
          return !this.googleId;
        },
        'Please provide a password',
      ],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: {
      type: String,
      default: '',
      index: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient',
    },
    avatar: {
      type: String,
      default: '',
    },
    isDemoUser: {
      type: Boolean,
      default: false,
    },
    healthProfile: {
      age: { type: Number, min: 0, max: 130, default: null },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Non-Binary', 'Prefer not to say', ''],
        default: '',
      },
      bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', ''],
        default: '',
      },
      height: { type: Number, min: 30, max: 280, default: null }, // in cm
      weight: { type: Number, min: 1, max: 500, default: null }, // in kg
      allergies: [{ type: String, trim: true }],
      chronicConditions: [{ type: String, trim: true }],
      currentMedications: [{ type: String, trim: true }],
      emergencyContact: {
        name: { type: String, default: '' },
        relation: { type: String, default: '' },
        phone: { type: String, default: '' },
      },
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'dark',
      },
      emailNotifications: { type: Boolean, default: true },
      criticalAlerts: { type: Boolean, default: true },
      taskReminders: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for BMI calculation
userSchema.virtual('healthProfile.bmi').get(function () {
  if (this.healthProfile?.height && this.healthProfile?.weight) {
    const heightInMeters = this.healthProfile.height / 100;
    const bmi = this.healthProfile.weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(1));
  }
  return null;
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET || 'medicare_ai_super_secret_jwt_key_2026_clinical_platform',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = mongoose.model('User', userSchema);
