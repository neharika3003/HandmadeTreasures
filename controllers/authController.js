const User = require("../models/User");
const bcrypt = require("bcryptjs");


// Render Signup Page
exports.getSignup = (req, res) => {
  res.render("signup");
};

// Handle Signup Form
exports.postSignup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error signing up");
  }
};

// Render Login Page
exports.getLogin = (req, res) => {
  res.render("login");
};

// Handle Login Form
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");
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
