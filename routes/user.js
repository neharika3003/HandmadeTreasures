const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to ensure only buyers can access the profile page
function ensureBuyer(req, res, next) {
  if (req.session.user && req.session.user.role === "buyer") {
    return next();
  }
  res.redirect("/auth/login");
}

// Display profile page
router.get("/profile", ensureBuyer, (req, res) => {
  res.render("profile", { user: req.session.user });
});

// Handle profile update
router.post("/profile", ensureBuyer, async (req, res) => {
  const { name, email } = req.body;

  // Input validation
  if (!name || !email) {
    return res.status(400).send("Name and email are required");
  }

  // Validate email format (optional, recommended)
  if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
    return res.status(400).send("Invalid email format");
  }

  try {
    // Check if the email is already in use by another user (optional)
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.session.user._id.toString()) {
      return res.status(400).send("Email is already in use");
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user._id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    // Update session with the new details
    req.session.user.name = updatedUser.name;
    req.session.user.email = updatedUser.email;

    res.redirect("/profile");
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("Error updating profile");
  }
});

module.exports = router;
