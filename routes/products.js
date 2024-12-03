const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Middleware to ensure only sellers can access certain routes
function ensureSeller(req, res, next) {
  if (req.session.user && req.session.user.role === "seller") {
    return next();
  }
  res.redirect("/auth/login");
}

// Route to fetch products with multiple filters (search, category, price)
router.get("/", async (req, res) => {
  const { search = "", category = "", minPrice = 0, maxPrice = 999999 } = req.query;

  try {
    // Building the filter query
    const query = {
      title: { $regex: search, $options: "i" },  // Filter by title (case-insensitive)
      category: { $regex: category, $options: "i" },  // Filter by category
      price: { $gte: minPrice, $lte: maxPrice },  // Filter by price range
    };

    // Remove any empty filter parameters
    for (let key in query) {
      if (query[key] === "" || query[key] === 0) {
        delete query[key];
      }
    }

    // Get the filtered products
    const products = await Product.find(query);

    // Get distinct categories for the filter dropdown
    const categories = await Product.distinct("category");

    // Render the products page with filters
    res.render("products", {
      products,
      searchQuery: search,
      category,
      minPrice,
      maxPrice,
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products");
  }
});

// Route to show product details page
// router.get('/product/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);  // Fetch product by ID
//     if (!product) {
//       return res.status(404).send('Product not found');
//     }
//     res.render('product-detail', { product });  // Render the product-detail view with product data
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Error fetching product details');
//   }
// });

// Route for product detail page
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('product-detail', { product });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching product details');
  }
});



// Route to get products by category (optional, for category-specific navigation)
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.render("products", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products by category");
  }
});

// Add a new product form (accessible only to sellers)
router.get("/add", ensureSeller, (req, res) => {
  res.render("addProduct");
});

// Handle the form submission for adding a new product
router.post("/add", ensureSeller, async (req, res) => {
  const { title, image, description, category, price } = req.body;
  try {
    const newProduct = new Product({
      title,
      description,
      category,
      price,
      image,
      createdBy: req.session.user._id, // Associate product with the seller
    });
    await newProduct.save();
    res.redirect("/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding product");
  }
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");

// // Middleware to ensure only sellers can access certain routes
// function ensureSeller(req, res, next) {
//   if (req.session.user && req.session.user.role === "seller") {
//     return next();
//   }
//   res.redirect("/auth/login");
// }

// // Get all products (public for everyone)


// // routes/products.js

// router.get("/", async (req, res) => {
//   const searchQuery = req.query.search || "";
//   const products = await Product.find({
//     $or: [
//       { title: { $regex: searchQuery, $options: "i" } },
//       { category: { $regex: searchQuery, $options: "i" } },
//     ],
//   });

//   res.render("products", { products, searchQuery });
// });

// // Route to fetch products
// router.get("/", async (req, res) => {
//   const { category } = req.query;

//   try {
//     const categories = await Product.distinct("category"); // Get all unique categories
//     const filter = category ? { category } : {};          // Filter if category is selected
//     const products = await Product.find(filter);

//     res.render("products", {
//       products,
//       categories,
//       selectedCategory: category || "",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching products");
//   }
// });


// // Add a new product form (accessible only to sellers)
// router.get("/add", ensureSeller, (req, res) => {
//   res.render("addProduct");
// });

// // Get products by category
// router.get("/category/:category", async (req, res) => {
//     try {
//       const category = req.params.category;
//       const products = await Product.find({ category });
//       res.render("products", { products });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Error loading products by category");
//     }
//   });
  

// // Handle the form submission for adding a new product
// router.post("/add", ensureSeller, async (req, res) => {
//   const { title, image, description, category, price } = req.body;
//   try {
//     const newProduct = new Product({
//       title,
//       description,
//       category,
//       price,
//       image,
//       createdBy: req.session.user._id, // Associate product with the seller
//     });
//     await newProduct.save();
//     res.redirect("/products");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error adding product");
//   }
// });

// module.exports = router;
