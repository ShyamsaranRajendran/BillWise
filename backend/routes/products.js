const express = require("express");
const router = express.Router();
const authenticate = require("../utils/AuthDecode"); // Assuming you have authentication middleware
const Products = require('../models/products');
const Charts = require('../models/charts');
const Stock =require('../models/stock.js')
// Route to get all products with pagination, search, and brand filtering
router.get('/all',authenticate, async function (req, res) {
  try {
    const { page = 1, limit = 12, search = "", brand = "" } = req.query;

    // Build search query
    const searchQuery = {
      $and: [
        search ? { $or: [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }] } : {},
        brand ? { brand: { $regex: brand, $options: "i" } } : {}
      ]
    };

    const products = await Products.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Products.countDocuments(searchQuery);
    console.log(products);
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/products-repo', authenticate,async function (req, res) {
  try {
    // Extract minStock and maxStock from query parameters
    const { minStock, maxStock } = req.query;

    // Create a filter object based on form input
    const stockFilter = {};
    
    if (minStock) {
      stockFilter.quantity_available = { $gte: parseInt(minStock) }; // Minimum stock condition
    }
    
    if (maxStock) {
      // Combine with the existing minStock condition or create a new one
      stockFilter.quantity_available = {
        ...stockFilter.quantity_available,
        $lte: parseInt(maxStock), // Maximum stock condition
      };
    }

    // Use MongoDB aggregation with $lookup to join products and stock collections
    const stockHighToLow = await Stock.aggregate([
      { $match: stockFilter },
      { $sort: { quantity_available: -1 } }, // Sort in descending order
      {
        $lookup: {
          from: "products", // The product collection name
          localField: "product_id", // Field from stock collection
          foreignField: "_id", // Field from product collection
          as: "productDetails", // Output array with product details
        },
      },
      {
        $unwind: "$productDetails", // Unwind to flatten the array
      },
      {
        $project: {
          product_id: 1,
          quantity_available: 1,
          "productDetails.name": 1, // Include the product name
          "productDetails.category": 1, // Include other fields if needed
        },
      },
    ]).exec();

    const stockLowToHigh = await Stock.aggregate([
      { $match: stockFilter },
      { $sort: { quantity_available: 1 } }, // Sort in ascending order
      {
        $lookup: {
          from: "products", // The product collection name
          localField: "product_id", // Field from stock collection
          foreignField: "_id", // Field from product collection
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails", // Flatten the product details array
      },
      {
        $project: {
          product_id: 1,
          quantity_available: 1,
          "productDetails.name": 1, // Include the product name
        },
      },
    ]).exec();

    // Log for debugging
    console.log("Stock (High to Low):", stockHighToLow);
    console.log("Stock (Low to High):", stockLowToHigh);

    // Send the stock data with product names as JSON
    res.json({ stockHighToLow, stockLowToHigh });
  } catch (err) {
    // Log the error and send an internal server error response
    console.error("Error fetching product stock:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get the list of unique brands
router.get('/brandlist', async function (req, res) {
  try {
    const brands = await Products.distinct("brand");
    res.json({ brands });
  } catch (err) {
    console.error("Error fetching brand list:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/add", async (req, res) => {
  const {
    product_id,
    name,
    category,
    sub_category,
    brand,
    SKU,
    price,
    discount,
    quantity_available,
    tax_rate,
    supplier,
    supplier_contact,
  } = req.body;

  try {
    // Validate required fields
    if (
      !product_id ||
      !name ||
      !category ||
      !sub_category ||
      !brand ||
      !SKU ||
      price === undefined || // Allow price=0
      quantity_available === undefined // Allow quantity_available=0
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check for duplicate product_id or SKU
    const existingProduct = await Products.findOne({
      $or: [{ product_id }, { SKU }],
    });

    if (existingProduct) {
      return res.status(409).json({ message: "Product ID or SKU already exists." });
    }

    // Create a new product instance
    const newProduct = new Products({
      product_id,
      name,
      category,
      sub_category,
      brand,
      SKU,
      price,
      discount,
      quantity_available,
      tax_rate,
      supplier,
      supplier_contact,
    });

    // Save the product to the database
    await newProduct.save();

    // Respond with success message
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
});

router.get('/charts', async function (req, res) {
  try {
    const charts = await Charts.find({});
    const chartsWithUrls = charts.map(chart => ({
      chart_name: chart.chart_name,
      image: `data:image/png;base64,${chart.image.toString('base64')}`
    }));
    res.json(chartsWithUrls);
  } catch (err) {
    console.error("Error fetching charts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
