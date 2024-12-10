require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: true }));

app.use(
    session({
      secret: "secret-key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: "mongodb+srv://batraneharika90:neha3003@cluster0.cdqls.mongodb.net/" }),
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    })
  );

const MONGO_URI = "mongodb+srv://batraneharika90:neha3003@cluster0.cdqls.mongodb.net/SmallBusinessMarketplace?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
const indexRoutes = require("./routes/index");
const productRoutes = require("./routes/products");

app.use("/", indexRoutes);
app.use("/products", productRoutes);


// Authentication Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

//Cart Routes
const cartRoutes = require("./routes/cart");
app.use("/cart", cartRoutes);

//order routes
const orderRoutes = require('./routes/orders');
app.use('/orders', orderRoutes);

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const sellerRoutes = require('./routes/seller');
app.use('/seller', sellerRoutes);



// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




