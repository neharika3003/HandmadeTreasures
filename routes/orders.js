const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User'); // Make sure User model is imported
const { sendEmail } = require('../utils/emailService'); // Ensure sendEmail is correctly imported

// Middleware to ensure the user is a buyer
function ensureBuyer(req, res, next) {
  if (req.session.user && req.session.user.role === "buyer") {
    return next();
  }
  res.redirect("/auth/login");
}

// Place Order and Send Email
router.post('/create', ensureBuyer, async (req, res) => {
  try {
    // Check if cart exists and has items
    const cart = await Cart.findOne({ buyerId: req.session.user._id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).send('Cart is empty');
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.productId.price, 0);

    // Create a new order
    const newOrder = new Order({
      buyerId: req.session.user._id,
      items: cart.items,
      totalAmount,
      status: 'Placed',
    });

    await newOrder.save();

    // Clear the cart after order is placed
    await Cart.findOneAndUpdate({ buyerId: req.session.user._id }, { items: [] });

    // Send an email to the user
    const user = await User.findById(req.session.user._id);
    if (user) {
      await sendEmail(
        user.email,
        'Order Confirmation',
        `<p>Dear ${user.name},</p>
         <p>Thank you for placing an order with us! Your order details are as follows:</p>
         <p>Order ID: ${newOrder._id}</p>
         <p>Total Amount: $${totalAmount}</p>
         <p>We will notify you once your order is shipped.</p>
         <p>Thank you!</p>`
      );
    }

    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error placing order.');
  }
});

// Cancel Order and Send Email
router.post('/cancel', async (req, res) => {
  const { orderId, userId } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId, buyerId: userId });
    if (!order) return res.status(404).send('Order not found.');

    order.status = 'Cancelled';
    await order.save();

    const user = await User.findById(userId);
    if (user) {
      await sendEmail(
        user.email,
        'Order Cancellation',
        `<p>Dear ${user.name},</p>
         <p>Your order with ID: ${order._id} has been successfully cancelled.</p>
         <p>If you have any questions, feel free to contact us.</p>
         <p>Thank you!</p>`
      );
    }

    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error cancelling order.');
  }
});

// View Order History
router.get('/', ensureBuyer, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.session.user._id }).populate('items.productId');
    res.render('orders', { orders, userId: req.session.user._id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading order history');
  }
});

module.exports = router;
