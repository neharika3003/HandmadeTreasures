const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require('../utils/emailService');  // Assuming email service is in utils folder
const crypto = require('crypto');


const renderAuth = (res, opts = {}) => {
  const {
    isSignUp = false,
    error = null,
    success = null,
    formData = {},
    showOtp = false,
  } = opts;
  res.render("auth", { isSignUp, error, success, formData, showOtp });
};

// Render Signup Page
exports.getSignup = (req, res) => {
  renderAuth(res, { isSignUp: true });
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
    if (existingUser) {
      return renderAuth(res, {
        isSignUp: true,
        error: "User already exists.",
        formData: { name, email, role: role || "buyer" },
      });
    }

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

    return renderAuth(res, {
      showOtp: true,
      formData: { email },
      success: "Check your email for the verification code.",
    });
  } catch (err) {
    console.error(err);
    renderAuth(res, {
      isSignUp: true,
      error: "Error registering user. Please try again.",
      formData: {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role || "buyer",
      },
    });
  }
};

// Render OTP Verification Page (same UI as login/signup)
exports.getVerifyOtp = (req, res) => {
  renderAuth(res, { showOtp: true, formData: {} });
};

// POST Verify OTP
exports.postVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return renderAuth(res, {
        showOtp: true,
        error: "User not found.",
        formData: { email },
      });
    }

    // Check if OTP matches and is not expired
    if (user.verificationToken !== otp || Date.now() > user.tokenExpiry) {
      return renderAuth(res, {
        showOtp: true,
        error: "Invalid or expired OTP.",
        formData: { email },
      });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear OTP
    user.tokenExpiry = undefined; // Clear expiry
    await user.save();

    renderAuth(res, {
      isSignUp: false,
      success: "Account verified! You can now log in.",
    });
  } catch (err) {
    console.error(err);
    renderAuth(res, {
      showOtp: true,
      error: "Error verifying account. Please try again.",
      formData: { email: req.body.email || "" },
    });
  }
};


// Render Login Page
exports.getLogin = (req, res) => {
  renderAuth(res, { isSignUp: false });
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
    if (!user) {
      return renderAuth(res, {
        isSignUp: false,
        error: "User not found.",
        formData: { email },
      });
    }

    // Check if the user has verified their email
    if (!user.isVerified) {
      return renderAuth(res, {
        isSignUp: false,
        error: "Please verify your email before logging in.",
        formData: { email },
      });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return renderAuth(res, {
        isSignUp: false,
        error: "Invalid password.",
        formData: { email },
      });
    }

    // Set session and redirect if everything is valid
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    renderAuth(res, {
      isSignUp: false,
      error: "Error logging in. Please try again.",
      formData: { email: req.body.email || "" },
    });
  }
};


// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
