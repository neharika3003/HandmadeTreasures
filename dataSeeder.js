const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

// mongoose.connect('mongodb://localhost:27017/SmallBusinessMarketplacemongodb+srv://batraneharika90:neha3003@cluster0.cdqls.mongodb.net/SmallBusinessMarketplace?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// async function updateProducts() {
//   const sellerId = "6755c43ec0fad6705e11abee"; // Replace with the correct seller ID
//   await Product.updateMany({}, { $set: { sellerId: sellerId } });
//   console.log("Products updated successfully!");
//   mongoose.connection.close();
// }

// updateProducts();

mongoose.connect('mongodb+srv://batraneharika90:neha3003@cluster0.cdqls.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");

    // Seed Product Data
    Product.insertMany([
    //   { title: "Ocean Resin Art Tray", description: "Beautiful ocean-themed resin art tray, perfect for home decor.", category: "Resin Art", price: 1500 },
    //   { title: "Geode Resin Coasters", description: "Set of 4 handmade geode-style resin coasters.", category: "Resin Art", price: 800 },
    //   { title: "Vanilla Scented Candle", description: "Eco-friendly soy wax candle with a calming vanilla fragrance.", category: "Handmade Candles", price: 500 },
    //   { title: "Lavender Aromatherapy Candle", description: "Hand-poured lavender candle to help you relax.", category: "Handmade Candles", price: 600 },
    //   { title: "Sunset Landscape", description: "Acrylic painting of a serene sunset landscape.", category: "Paintings", price: 2000 },
    //   { title: "Abstract Art Canvas", description: "Modern abstract art for your living space.", category: "Paintings", price: 2500 },
    //   { title: "Charcoal Portrait", description: "Hand-drawn charcoal portrait on high-quality paper.", category: "Drawings", price: 1800 },
    //   { title: "Nature Sketch", description: "Detailed pencil sketch of a forest landscape.", category: "Drawings", price: 1200 }
        {
          title: "Ocean Wave Resin Coaster Set",
          description: "A set of 4 resin coasters capturing the beauty of ocean waves. Each coaster is unique and handmade with love.",
          image: "https://i.etsystatic.com/13259926/r/il/3d248e/3410195575/il_1140xN.3410195575_p5ns.jpg",
          price: 2500,
          category: "Resin Art",
        },
        {
          title: "Lavender Scented Soy Candle",
          description: "A calming lavender-scented soy candle, perfect for relaxation. Made with natural ingredients.",
          image: "https://www.debellecosmetix.com/cdn/shop/files/Lavender_2de0839c-fdda-4ace-a709-57fd6bac1237_2_-min_1000x.webp?v=1690624978",
          price: 1800,
          category: "Handmade Candles",
        },
        {
          title: "Abstract Resin Wall Art",
          description: "A striking abstract wall art piece created with high-quality resin. Perfect for modern home decor.",
          image: "https://i.etsystatic.com/19879367/r/il/e4b776/2694014174/il_fullxfull.2694014174_3whx.jpg",
          price: 1200,
          category: "Resin Art",
        },
        {
          title: "Hand-Poured Beeswax Candle",
          description: "A natural beeswax candle with a subtle honey scent. Burns clean and lasts long.",
          image: "https://i.etsystatic.com/20168070/r/il/5e3633/1936219273/il_794xN.1936219273_p76h.jpg",
          price: 1500,
          category: "Handmade Candles",
        },
        {
          title: "Floral Resin Keychains",
          description: "Set of 5 resin keychains with embedded dried flowers. Lightweight and durable, perfect as gifts.",
          image: "https://a.media-amazon.com/images/I/811bi3T4XqL._SY879_.jpg",
          price: 200,
          category: "Resin Art",
        },
        {
          title: "Custom Pet Portrait",
          description: "Hand-painted custom pet portraits on canvas. Capture your furry friend’s personality in vibrant colors.",
          image: "https://images.nightcafe.studio/jobs/miQORLes9A5fQf1WHuBF/miQORLes9A5fQf1WHuBF--1--p0fsp.jpg?tr=w-1600,c-at_max",
          price: 180,
          category: "Paintings",
        },
        {
          title: "Aromatherapy Candle Set",
          description: "A set of 3 aromatherapy candles infused with essential oils. Scents include eucalyptus, peppermint, and citrus.",
          image: "https://a.media-amazon.com/images/I/41uecPCRAiS._SY445_SX342_QL70_FMwebp_.jpg",
          price: 145,
          category: "Handmade Candles",
        },
        {
          title: "Geode Resin Coasters",
          description: "Stunning geode-inspired resin coasters, perfect for adding a touch of luxury to your coffee table.",
          image: "https://modpodgerocksblog.b-cdn.net/wp-content/uploads/2021/05/Resin-Geode-Coasters.jpg.webp",
          price: 130,
          category: "Resin Art",
        },
        {
          title: "Minimalist Line Art Illustration",
          description: "A simple yet elegant black and white line art illustration, printed on high-quality paper.",
          image: "https://i.pinimg.com/originals/4a/e4/1e/4ae41ec2cb15e641b547d2f5e68fd6a7.jpg",
          price: 1250,
          category: "Drawings",
        },
        {
          title: "Scented Tea Light Candle Set",
          description: "A set of 10 scented tea light candles, available in various fragrances. Perfect for small spaces.",
          image: "https://wishingchair.in/cdn/shop/products/candle-marquess-of-moonlight-tea-light-candle-set-of-12-37892803100928_720x.jpg?v=1665154003",
          price: 120,
          category: "Handmade Candles",
        },
        {
          title: "Galaxy Resin Tray",
          description: "A beautiful resin tray with galaxy-inspired colors and patterns. Perfect for serving or as a decorative piece.",
          image: "https://i.etsystatic.com/24803836/r/il/eb8c86/2600277687/il_1588xN.2600277687_qjne.jpg",
          price: 400,
          category: "Resin Art",
        },
        {
          title: "Hand-Painted Floral Canvas",
          description: "A vibrant floral painting on canvas, capturing the beauty of nature with bold colors.",
          image: "https://m.media-amazon.com/images/I/71SNgzsia7L._AC_UF1000,1000_QL80_.jpg",
          price: 190,
          category: "Paintings",
        },
        {
          title: "Custom Name Resin Keychain",
          description: "Personalized resin keychains with your name or a loved one's name. Available in various colors.",
          image: "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/e4364e78f93c7609fc6e879c15dfad01.jpg?imageView2/2/w/500/q/60/format/webp ",
          price: 110,
          category: "Resin Art",
        },
        {
          title: "Soy Wax Candle in Mason Jar",
          description: "A rustic soy wax candle in a mason jar, available in various scents like vanilla, cinnamon, and sandalwood.",
          image: "https://a.media-amazon.com/images/I/41-XqIWe6BL._SY445_SX342_QL70_FMwebp_.jpg",
          price: 200,
          category: "Handmade Candles",
        },
        {
          title: "Abstract Watercolor Illustration",
          description: "A vibrant abstract watercolor illustration, perfect for adding a splash of color to any room.",
          image: "https://img.freepik.com/premium-vector/colorful-watercolor-abstract-wallpaper_1034-2363.jpg",
          price: 350,
          category: "Drawings",
        },
        {
          title: "Epoxy Resin Jewelry Box",
          description: "A stunning epoxy resin jewelry box with intricate designs and a glossy finish.",
          image: "https://rukminim2.flixcart.com/image/850/1000/kuh9yfk0/art-craft-kit/0/c/n/12-jewelry-box-molds-with-lid-resin-jewelry-container-box-epoxy-original-imag7h8vej5ru3rs.jpeg?q=90&crop=false",
          price: 500,
          category: "Resin Art",
        },
        {
          title: "Hand-Painted Mandala Canvas",
          description: "A calming and intricate mandala painting on canvas, perfect for meditation spaces.",
          image: "https://i.etsystatic.com/19115189/r/il/91a4a1/3639431407/il_570xN.3639431407_71yd.jpg",
          price: 700,
          category: "Paintings",
        },
        {
          title: "Botanical Resin Bookmark",
          description: "A unique resin bookmark with embedded dried leaves and flowers, perfect for book lovers.",
          image: "https://images.squarespace-cdn.com/content/v1/62ec1fc995263d65f21175de/56d21a26-c9c0-4573-b903-16cc0dedf7ae/How+to+Make+Botanical+Pressed+Flower+Bookmarks%3A+An+Edwardian+Inspired+Craft?format=1500w",
          price: 48,
          category: "Resin Art",
        },
        {
          title: "Handmade Coffee Bean Candle",
          description: "A coffee-scented candle with real coffee beans embedded, perfect for coffee lovers.",
          image: "https://m.media-amazon.com/images/I/51ELlda0amL._AC_UF1000,1000_QL80_.jpg",
          price: 150,
          category: "Handmade Candles",
        },
        {
          title: "Resin Flower Wall Art",
          description: "Beautiful flower wall art created with resin, adding a touch of nature to any space.",
          image: "https://i.pinimg.com/564x/56/d7/a7/56d7a736190973f64695565884dbaa46.jpg",
          price: 600,
          category: "Resin Art",
        },
        {
          title: "Hand-Drawn Portrait Illustration",
          description: "Custom hand-drawn portrait illustrations, perfect for gifts or personal keepsakes.",
          image: "https://media.istockphoto.com/id/520053650/vector/female-portrait-pencil-drawing.jpg?s=612x612&w=0&k=20&c=WJhE6EacYeixT1Lv5B0CZ4w9PfDT11J1-c6wS8P8_8g=",
          price: 850,
          category: "Drawings",
        },
      
    ])
      .then(() => console.log("Products Seeded"));

    // Seed User Data
//     User.insertMany([
//       { name: "Resin Creations", email: "resinartist@example.com", password: "hashed_password", role: "seller" },
//       { name: "Candle Makers", email: "candlemaker@example.com", password: "hashed_password", role: "seller" },
//       { name: "John Doe", email: "johndoe@example.com", password: "hashed_password", role: "buyer" },
//       { name: "Jane Smith", email: "janesmith@example.com", password: "hashed_password", role: "buyer" }
//     ])
//       .then(() => console.log("Users Seeded"));

  })
  .catch(err => console.log(err));
