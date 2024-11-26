const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  dateOfIssue: String,
  invoiceNumber: Number,
  billTo: String,
  billToEmail: String,
  billToAddress: String,
  billFrom: String,
  billFromEmail: String,
  billFromAddress: String,
  notes: String,
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
      name: String,
      description: String,
      price: String,
      quantity: Number,
    },
  ],
  currency: String,
  subTotal: String,
  taxAmount: String,
  discountAmount: String,
  total: String,
});

module.exports = mongoose.model('Invoice', invoiceSchema);
