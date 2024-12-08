const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Middleware to ensure the user is a buyer
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

  router.get('/orders', ensureSeller, async (req, res) => {
    try {
      // Fetch seller's products
      const sellerProducts = await Product.find({ sellerId: req.session.user._id });
      console.log("Seller Products:", sellerProducts);
  
      if (!sellerProducts || sellerProducts.length === 0) {
        console.log("No products found for this seller");
        return res.render('seller-orders', { orders: [] });
      }
  
      // Extract product IDs
      const sellerProductIds = sellerProducts.map((product) => product._id);
      console.log("Seller Product IDs:", sellerProductIds);
  
      // Fetch orders containing seller's products
      const orders = await Order.find({ 'items.productId': { $in: sellerProductIds } })
        .populate('buyerId')
        .populate('items.productId');
  
      console.log("Fetched Orders:", orders);
  
      res.render('seller-orders', { orders });
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).send('Error fetching orders');
    }
  });
  
  

// View specific order details
router.get('/orders/:id',async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate({
          path: 'buyerId', // This will populate the buyerId field
          select: 'name address contact' // Only select the relevant fields from the User model
        })
        .populate({
          path: 'items.productId',
          select: 'title image price' // Select necessary fields from Product model
        });
  
      // Make sure the order is found and pass it to the template
      if (!order) {
        return res.status(404).send('Order not found');
      }
  
      res.render('order-details', { order });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching order details');
    }
  });

// Update order status (e.g., Shipped, Delivered, Cancelled)
router.post('/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send('Order not found');
    
    order.status = status;
    await order.save();
    
    res.redirect(`/seller/orders/${order._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating order status');
  }
});

module.exports = router;
