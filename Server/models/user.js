const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },

  isAdmin: Boolean,

  verified_at: Date,

  verification_code: {
    type: Number,
    minlength: 6,
    maxlength: 6,
  },

  created_at: {
    type: Date,
    required: true,
  },

  updated_at: {
    type: Date,
    required: true,
  },

  deleted_at: Date,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}

function validateUpdatePassword(password) {
  const schema = {
    new_password: Joi.string().min(5).max(255).required(),
    new_password_confirmation: Joi.any()
      .valid(Joi.ref("new_password"))
      .required()
      .options({ language: { any: { allowOnly: "must match password" } } }),
  };

  return Joi.validate(password, schema);
}

function validateVerificationCode(verificationCode) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    verification_code: Joi.number().required(),
  };
  return Joi.validate(verificationCode, schema);
}

function reSendCode(email) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
  };
  return Joi.validate(email, schema);
}

exports.User = User;
exports.validate = validateUser;
exports.validateUpdatePassword = validateUpdatePassword;
exports.validateVerificationCode = validateVerificationCode;
exports.reSendCode = reSendCode;
