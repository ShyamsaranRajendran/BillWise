
// models/Sales.js
const mongoose = require('mongoose');


const salesSchema = new mongoose.Schema({
  sale_id: { type: String, required: true }, 
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
  product_name: { type: String, required: true }, 
  quantity_sold: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  discount_percent: { type: Number, default: 0 },
  discount_amount: { type: Number, default: 0 }, 
  tax_percent: { type: Number, default: 18 }, 
  tax_amount: { type: Number, default: 0 }, 
  total_amount: { type: Number, required: true }, 
  final_amount: { type: Number, required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, 
  sale_date: { type: Date, default: Date.now }, 
});


// Create the model
const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
