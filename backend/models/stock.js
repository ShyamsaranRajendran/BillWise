// models/Stock.js
const mongoose = require('mongoose');

// Define the schema for stock
const stockSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
  quantity_available: { type: Number, required: true },
  last_updated: { type: Date, default: Date.now }, // Timestamp for the last update
});

// Create the model
const Stock = mongoose.model('stock', stockSchema);

module.exports = Stock;
