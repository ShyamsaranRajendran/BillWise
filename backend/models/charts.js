const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the charts collection
const chartSchema = new Schema({
  chart_name: {
    type: String,
    required: true, // This field is mandatory
    unique: true, // Ensures unique chart names
    trim: true // Removes leading and trailing spaces
  },
  image: {
    type: Buffer, // To store binary data
    required: true // This field is mandatory
  }
});

// Create a model based on the schema
const Chart = mongoose.model('Chart', chartSchema);

module.exports = Chart;
