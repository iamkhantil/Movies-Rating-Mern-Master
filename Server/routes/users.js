require("dotenv").config();
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
  User,
  validate,
  validateUpdatePassword,
  validateVerificationCode,
  reSendCode,
} = require("../models/user");
const express = require("express");
const router = express.Router();
const { randomCode } = require("../utils/code");
const { mailer } = require("../utils/mailer");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.delete("/delete", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user && user.deleted_at === null) {
    user.deleted_at = new Date();
    await user.save();
    res.send("Account Deleted Successfully");
  } else {
    return res.status(400).send("User doesn't exists.");
  }
});

router.post("/verifyCode", async (req, res) => {
  const { error } = validateVerificationCode(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email });

  if (user && user.deleted_at === null && user.verified_at === null) {
    if (req.body.verification_code === user.verification_code) {
      user.verification_code = null;
      user.verified_at = new Date();
      await user.save();
      return res.status(200).send("User Verified");
    } else {
      return res.status(404).send("Code Doesn't match from Database");
    }
  } else {
    return res.status(404).send("Please Check Your Details");
  }
});

router.post("/reSendCode", async (req, res) => {
  const { error } = reSendCode(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email });

  if (user && user.deleted_at === null && user.verified_at === null) {
    user.verification_code = randomCode();
    user.verified_at = null;
    await user.save();
    mailer(user.name, user.email, user.verification_code);
    return res.status(200).send("Verification Code Sent Again");
  } else {
    return res
      .status(404)
      .send("User is already Verified OR User doesn't exists");
  }
});

router.put("/changePassword", auth, async (req, res) => {
  const { error } = validateUpdatePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);

  if (user.verified_at == null)
    return res.status(403).send("You need to verify your account first");

  if (!user || user.deleted_at !== null) {
    return res.status(400).send("User doesn't exists.");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.new_password, salt);
  user.updated_at = new Date();
  await user.save();
  return res.status(200).send("Password Changed Successfully");
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (user && user.deleted_at === null) {
    return res.status(400).send("User already registered.");
  }

  const salt = await bcrypt.genSalt(10);

  if (user && user.deleted_at != null) {
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = await bcrypt.hash(req.body.password, salt);
  } else {
    user = new User(_.pick(req.body, ["name", "email", "password"]));
    user.password = await bcrypt.hash(user.password, salt);
    user.created_at = new Date();
  }
  user.verification_code = randomCode();
  user.verified_at = null;
  user.updated_at = new Date();
  user.deleted_at = null;
  await user.save();

  mailer(user.name, user.email, user.verification_code);

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
