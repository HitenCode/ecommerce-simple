// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// serve everything in "public" folder as static files
app.use(express.static(path.join(__dirname, "public")));

// simple API endpoint to get products (in real life this would come from DB)
const products = [
  {
    id: 1,
    name: "Red Hoodie",
    description: "Cozy cotton hoodie for everyday wear.",
    price: 39.99,
    category: "Clothing",
    imageUrl:
      "https://images.pexels.com/photos/6311578/pexels-photo-6311578.jpeg",
  },
  {
    id: 2,
    name: "Blue Sneakers",
    description: "Comfortable sneakers perfect for walking.",
    price: 59.99,
    category: "Footwear",
    imageUrl:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
  },
  {
    id: 3,
    name: "Black T-Shirt",
    description: "Basic black tee, 100% cotton.",
    price: 19.99,
    category: "Clothing",
    imageUrl:
      "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg",
  },
  {
    id: 4,
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones.",
    price: 129.99,
    category: "Electronics",
    imageUrl:
      "https://images.pexels.com/photos/3394664/pexels-photo-3394664.jpeg",
  },
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
