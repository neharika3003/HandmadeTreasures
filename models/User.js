const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String }, // New field for address
  contact: { type: Number }, // New field for contact number
  isVerified: { type: Boolean, default: false }, // New field
  verificationToken: { type: String }, // New field
  tokenExpiry: { type: Date }, // Optional: Token expiry time
  role: { type: String, enum: ["seller", "buyer"], default: "buyer" },

  // Seller-specific fields
  businessName: { type: String }, // Business name
  businessAddress: { type: String }, // Business address
  paymentDetails: { type: String }, // Payment information like bank details
});


module.exports = mongoose.model("User", userSchema);
