const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User'); // Make sure User model is imported
const { sendEmail } = require('../utils/emailService'); // Ensure sendEmail is correctly imported

async function sendEmailSafely(to, subject, html) {
  try {
    await sendEmail(to, subject, html);
  } catch (err) {
    console.error(`Email sending failed for "${subject}" to ${to}:`, err.message);
  }
}

// Middleware to ensure the user is a buyer
function ensureBuyer(req, res, next) {
  if (req.session.user && req.session.user.role === "buyer") {
    return next();
  }
  res.redirect("/auth/login");
}

// Place Order and Send Email
router.post('/create', ensureBuyer, async (req, res) => {
  const { address, contact } = req.body;

  try {
    // Validate input
    if (!address || !contact) {
      return res.status(400).send('Address and contact number are required.');
    }

    // Check if cart exists and has items
    const cart = await Cart.findOne({ buyerId: req.session.user._id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).send('Cart is empty.');
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.productId.price, 0);

    // Create a new order
    const newOrder = new Order({
      buyerId: req.session.user._id,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      totalAmount,
      status: 'Placed',
    });
    // const newOrder = new Order({
    //   buyerId: req.session.user._id,
    //   items: cart.items,
    //   totalAmount,
    //   status: 'Placed',
    // });

    await newOrder.save();

    res.render('order-success', {
      orderId: newOrder._id,
      totalAmount,
    });

    void (async () => {
      let updatedUser = null;

      try {
        updatedUser = await User.findByIdAndUpdate(
          req.session.user._id,
          { address, contact },
          { new: true, runValidators: true }
        );
      } catch (err) {
        console.error('Profile update after order failed:', err.message);
      }

      try {
        await Cart.findOneAndUpdate({ buyerId: req.session.user._id }, { items: [] });
      } catch (err) {
        console.error('Cart clear after order failed:', err.message);
      }

      if (updatedUser) {
        await sendEmailSafely(
          updatedUser.email,
          'Order Confirmation',
          `<p>Dear ${updatedUser.name},</p>
           <p>Thank you for placing an order with us! Your order details are as follows:</p>
           <p>Order ID: ${newOrder._id}</p>
           <p>Total Amount: ₹${totalAmount}</p>
           <p>Shipping Address: ${address}</p>
           <p>Contact Number: ${contact}</p>
           <p>We will notify you once your order is shipped.</p>
           <p>Thank you!</p>`
        );
      }
    })();
    return;
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
      await sendEmailSafely(
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
    // Fetch all orders for the logged-in buyer
    const orders = await Order.find({ buyerId: req.session.user._id })
      .populate({
        path: 'items.productId',
        select: 'title image price',
      })
      .populate({
        path: 'buyerId',
        select: 'name address contact',
      });

    // Render the orders view with the fetched data
    res.render('orders', { orders: orders || [], userId: req.session.user._id });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Error loading order history.');
  }
});


module.exports = router;
