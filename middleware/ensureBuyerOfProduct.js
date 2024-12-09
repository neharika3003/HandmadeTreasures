const Order = require('../models/Order');

const ensureBuyerOfProduct = async (req, res, next) => {
  try {
    const userId = req.session.user._id; // Logged-in user ID
    const productId = req.params.id; // Product ID from route parameter

    // Check if the user has purchased the product
    const order = await Order.findOne({
      buyerId: userId,
      'items.productId': productId,
    });

    if (!order) {
      res.status(500).send('You can only review products you have purchased!!');
    }

    next(); // User has purchased the product, allow them to proceed
  } catch (err) {
    console.error('Error verifying purchase:', err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = ensureBuyerOfProduct;

