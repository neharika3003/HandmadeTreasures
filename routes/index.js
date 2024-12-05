const express = require("express");
const router = express.Router();
const Product = require('../models/Product'); // Assuming you have a Product model

// Function to get top picks based on the time
const getTopPicks = async () => {
  const now = new Date();
  const hour = now.getHours();

  // You can implement your own logic to pick the top products, this is just an example
  const topProducts = await Product.find({}).skip(hour % 10).limit(4); // Randomize picks
  return topProducts;
};

// Home page route
router.get('/', async (req, res) => {
  try {
    const topPicks = await getTopPicks();
    res.render('home', { topPicks });
  } catch (error) {
    console.error('Error fetching top picks:', error);
    res.status(500).send('Error fetching top picks');
  }
});

// router.get("/", (req, res) => {
//   res.render("home");
// });

module.exports = router;
