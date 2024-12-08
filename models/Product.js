const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: [ String ], // Add this field for image URL
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});



module.exports = mongoose.model("Product", productSchema);
