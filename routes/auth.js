const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");


// routes/auth.js
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');


router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);



  // routes/auth.js
// Handle email verification
router.get('/verify-email/:token', async (req, res) => {
  console.log('Verification route hit!');
  const { token } = req.params;

  try {
      // Find the user by the verification token
      const user = await User.findOne({
          verificationToken: token,
          tokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
      });

      if (!user) {
          return res.status(400).send('Invalid or expired token.');
      }

      // Mark user as verified
      user.isVerified = true;
      user.verificationToken = undefined; // Clear the token after successful verification
      user.tokenExpiry = undefined; // Clear token expiry
      await user.save();

      res.status(200).send('Email successfully verified! You can now log in.');
  } catch (err) {
      console.error('Error verifying email:', err);
      res.status(500).send('Error verifying email.');
  }
});
  

  router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send('User not found.');
  
      // If the user is already verified, no need to resend the verification
      if (user.isVerified) return res.status(400).send('User already verified.');
  
      // Generate a new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      user.tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours
  
      // Save the updated user
      await user.save();
  
      // Create the verification link
      const verifyLink = `http://localhost:3000/auth/verify-email/${verificationToken}`;
      console.log("Verification link:", verifyLink); // Log the link for debugging
  
      // Send the verification email
      await sendEmail(
        email,
        'Email Verification',
        `<p>Please verify your email by clicking the link below:</p><a href="${verifyLink}">${verifyLink}</a>`
      );
  
      // Send success response
      res.status(200).send('Verification email resent.');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error resending verification email.');
    }
  });

module.exports = router;
