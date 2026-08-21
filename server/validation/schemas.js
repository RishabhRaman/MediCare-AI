const Joi = require('joi');

const email = Joi.string().email().lowercase().trim().required();

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required(),
  email,
  password: Joi.string().min(6).max(128).required(),
  healthProfile: Joi.object({
    age: Joi.number().min(0).max(130).allow(null),
    gender: Joi.string().allow('', 'Male', 'Female', 'Non-Binary', 'Prefer not to say'),
    bloodType: Joi.string().allow('', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
  }).unknown(true),
});

const loginSchema = Joi.object({
  email,
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email,
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).max(128).required(),
});

const analyzeTextSchema = Joi.object({
  text: Joi.string().trim().min(20).required(),
  title: Joi.string().trim().allow('', null),
  reportType: Joi.string().trim().allow('', null),
});

const symptomSearchSchema = Joi.object({
  query: Joi.string().trim().min(3).max(500).required(),
});

const profileUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60),
  avatar: Joi.string().allow(''),
  healthProfile: Joi.object().unknown(true),
  preferences: Joi.object().unknown(true),
}).min(1);

const chatSchema = Joi.object({
  messages: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().valid('user', 'assistant', 'system').required(),
        content: Joi.string().allow('').required(),
      }).unknown(true)
    )
    .min(1)
    .required(),
  userContext: Joi.object().unknown(true).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  analyzeTextSchema,
  symptomSearchSchema,
  profileUpdateSchema,
  chatSchema,
};
