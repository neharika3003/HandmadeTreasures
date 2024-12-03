const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
// const { ensureBuyer } = require('../middleware/auth');


function ensureBuyer(req, res, next) {
    if (req.session.user && req.session.user.role === "buyer") {
      return next();
    }
    res.redirect("/auth/login");
  }

  
// Create order
router.post('/create', ensureBuyer, async (req, res) => {
  try {
    const cart = await Cart.findOne({ buyerId: req.session.user._id }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).send('Cart is empty');
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.productId.price, 0);

    // Create new order
    const newOrder = new Order({
      buyerId: req.session.user._id,
      items: cart.items,
      totalAmount,
    });

    await newOrder.save();

    // Clear cart after order is placed
    await Cart.findOneAndUpdate({ buyerId: req.session.user._id }, { items: [] });

    res.redirect('/orders'); // Redirect to order history
  } catch (err) {
    console.error(err);
    res.status(500).send('Error placing order');
  }
});

// View order history
router.get('/', ensureBuyer, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.session.user._id }).populate('items.productId');
    res.render('orders', { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading order history');
  }
});

module.exports = router;
