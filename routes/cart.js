const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
// const { ensureBuyer } = require('../middleware/auth');

// Middleware to ensure only buyers can access the cart
function ensureBuyer(req, res, next) {
  if (req.session.user && req.session.user.role === "buyer") {
    return next();
  }
  res.redirect("/auth/login");
}

// // View Cart
// router.get("/", ensureBuyer, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ buyerId: req.session.user._id }).populate("items.productId");
//     res.render("cart", { cart });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error loading cart");
//   }
// });


// Display cart
router.get('/', ensureBuyer, async (req, res) => {
  try {
    const cart = await Cart.findOne({ buyerId: req.session.user._id }).populate('items.productId');
    res.render('cart', { cart });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error displaying cart');
  }
});

// // Add Product to Cart
// router.post("/add", ensureBuyer, async (req, res) => {
//   const { productId } = req.body;
//   try {
//     let cart = await Cart.findOne({ buyerId: req.session.user._id });

//     if (!cart) {
//       cart = new Cart({ buyerId: req.session.user._id, items: [] });
//     }

//     const existingItem = cart.items.find(item => item.productId.equals(productId));

//     if (existingItem) {
//       existingItem.quantity += 1;
//     } else {
//       cart.items.push({ productId });
//     }

//     await cart.save();
//     res.redirect("/cart");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error adding product to cart");
//   }
// });

// Add product to cart
router.post('/add', ensureBuyer, async (req, res) => {
  try {
    const { productId, quantity } = req.body; // Ensure quantity is being passed
    const userId = req.session.user._id;

    // If quantity is not provided or invalid, set a default of 1
    if (!quantity || quantity <= 0) {
      return res.status(400).send('Invalid quantity');
    }

    let cart = await Cart.findOne({ buyerId: userId });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({
        buyerId: userId,
        items: [{ productId, quantity }]
      });
    } else {
      // If cart exists, add/update the product in the cart
      const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (existingItemIndex !== -1) {
        // Update quantity if the product is already in the cart
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding product to cart');
  }
});


// // Remove Product from Cart
// router.post("/remove", ensureBuyer, async (req, res) => {
//   const { productId } = req.body;
//   try {
//     const cart = await Cart.findOne({ buyerId: req.session.user._id });
//     cart.items = cart.items.filter(item => !item.productId.equals(productId));
//     await cart.save();
//     res.redirect("/cart");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error removing product from cart");
//   }
// });


// Remove product from cart
router.post('/remove', ensureBuyer, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.session.user._id;

    let cart = await Cart.findOne({ buyerId: userId });

    if (!cart) {
      return res.redirect('/cart');
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error removing product from cart');
  }
});




// validation of cart
router.get("/", ensureBuyer, async (req, res) => {
    try {
      const cart = await Cart.findOne({ buyerId: req.session.user._id }).populate("items.productId");
  
      // Remove items with null productId
      if (cart) {
        cart.items = cart.items.filter(item => item.productId !== null);
        await cart.save();
      }
  
      res.render("cart", { cart });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading cart");
    }
  });
  

module.exports = router;
