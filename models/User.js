const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // New field
  verificationToken: { type: String }, // New field
  tokenExpiry: { type: Date }, // Optional: Token expiry time
  role: { type: String, enum: ["seller", "buyer"], default: "buyer" },
});


module.exports = mongoose.model("User", userSchema);
