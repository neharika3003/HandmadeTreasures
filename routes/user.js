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

// Middleware to ensure the user is a seller
function ensureSeller(req, res, next) {
  if (req.session.user && req.session.user.role === 'seller') {
    return next();
  }
  res.redirect('/auth/login'); // Redirect if not a seller
}


// Display profile page
router.get("/profile", ensureBuyer, (req, res) => {
  res.render("profile", { user: req.session.user });
});

// Render seller profile page
router.get('/seller-profile', ensureSeller, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('sellerProfile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading seller profile');
  }
});

// Handle seller profile update
router.post('/seller-profile', ensureSeller, async (req, res) => {
  try {
    const { businessName, businessAddress, paymentDetails, contact } = req.body;
    const user = await User.findById(req.session.user._id);

    // Update seller information
    user.businessName = businessName;
    user.businessAddress = businessAddress;
    user.paymentDetails = paymentDetails;
    user.contact = contact;

    await user.save();
    res.redirect('/user/seller-profile'); // Redirect to profile page after update
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating profile');
  }
});

// Handle buyer profile update
router.post("/profile", ensureBuyer, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id); // Fetch user data
    if (!user) {
      return res.redirect('/auth/login'); // Redirect if user not found
    }
    res.render('profile', { user }); // Pass user data to the template
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading profile page.');
  }
  const { name, email, address, contact } = req.body;

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
      { name, email, address, contact },
      { new: true, runValidators: true }
    );

    req.session.user = updatedUser; // Update session details
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    // Update session with the new details
    req.session.user.name = updatedUser.name;
    req.session.user.email = updatedUser.email;

    res.render("profile");
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("Error updating profile");
  }
});

module.exports = router;
