const express = require("express");
const router = express.Router();
const { buildHomeViewModel } = require("../utils/homeView");

// Home page route
router.get('/', async (req, res) => {
  try {
    const viewModel = await buildHomeViewModel(req);
    res.render("home", viewModel);
  } catch (error) {
    console.error('Error fetching top picks:', error);
    res.status(500).send('Error fetching top picks');
  }
});

// router.get("/", (req, res) => {
//   res.render("home");
// });

module.exports = router;
