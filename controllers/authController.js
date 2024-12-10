const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require('../utils/emailService');  // Assuming email service is in utils folder
const crypto = require('crypto');


// Render Signup Page
exports.getSignup = (req, res) => {
  res.render("signup");
};

// Handle Signup Form
// exports.postSignup = async (req, res) => {
//   const { name, email, password, role } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword, role });
//     await newUser.save();
//     res.redirect("/auth/login");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error signing up");
//   }
// };

// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const { sendEmail } = require('./utils/emailService');  // Assuming email service is in utils folder
// const User = require('../models/User');  // Path to your User model


// POST Signup with OTP
exports.postSignup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists.");

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiry = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

    // Create new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken: otp, // Store OTP
      tokenExpiry: otpExpiry, // Store OTP expiry
      isVerified: false, // Default as not verified
    });

    // Save the user in the database
    await newUser.save();

    // Send OTP to the user's email
    await sendEmail(
      email,
      "Verify Your Account",
      `<p>Your OTP for verifying your account is:</p><h3>${otp}</h3><p>This OTP is valid for 15 minutes.</p>`
    );

    // res.status(200).send("Registration successful! Please check your email for the OTP to verify your account.");
    res.render('verifyOtp');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user.");
  }
};

// Render OTP Verification Page
exports.getVerifyOtp = (req, res) => {
  res.render("verifyOtp"); // Ensure you have a verifyOtp.ejs file in views
};

// POST Verify OTP
exports.postVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found.");

    // Check if OTP matches and is not expired
    if (user.verificationToken !== otp || Date.now() > user.tokenExpiry) {
      return res.status(400).send("Invalid or expired OTP.");
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear OTP
    user.tokenExpiry = undefined; // Clear expiry
    await user.save();

    // res.status(200).send("Account verified successfully! You can now log in.");
    res.render('login');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error verifying account.");
  }
};


// Render Login Page
exports.getLogin = (req, res) => {
  res.render("login");
};

// Handle Login Form
// exports.postLogin = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).send("User not found");
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).send("Invalid password");
//     req.session.user = user;
//     res.redirect("/");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error logging in");
//   }
// };


// Handle Login Form
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    // Check if the user has verified their email
    if (!user.isVerified) {
      return res.status(403).send("Please verify your email before logging in.");
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");

    // Set session and redirect if everything is valid
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
};


// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
