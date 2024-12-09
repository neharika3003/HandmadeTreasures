const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
});


const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: [ String ], // Add this field for image URL
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviews: [reviewSchema],
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});



module.exports = mongoose.model("Product", productSchema);
