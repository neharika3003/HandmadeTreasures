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

// POST Signup Logic
exports.postSignup = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('User already exists.');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user object
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role 
    });
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    newUser.verificationToken = verificationToken;
    newUser.tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours
    
    // Save the user in the database
    await newUser.save();
    
    // Send verification email
    const verifyLink = `http://localhost:3000/verify-email/${verificationToken}`;
    await sendEmail(
      email,
      'Email Verification',
      `<p>Please verify your email by clicking the link below:</p><a href="${verifyLink}">${verifyLink}</a>`
    );
    
    // Send response
    res.status(200).send('Registration successful! Please check your email to verify your account.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user.');
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
