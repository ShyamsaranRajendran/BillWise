const express = require("express");
const router = express.Router();
const authenticate = require("../utils/AuthDecode"); // Assuming you have authentication middleware
const Products = require("../models/products");
const Invoice = require("../models/Invoice");
const Charts = require("../models/charts");
const Stock = require("../models/stock.js");
const mailer = require("../utils/mailer.js");

router.post("/add", async (req, res) => {
  const {
    dateOfIssue,
    invoiceNumber,
    billTo,
    billToEmail,
    billToAddress,
    billFrom,
    billFromEmail,
    billFromAddress,
    notes,
    items,
    currency,
    subTotal,
    taxAmount,
    discountAmount,
    total,
  } = req.body;

  const newInvoice = new Invoice({
    dateOfIssue,
    invoiceNumber,
    billTo,
    billToEmail,
    billToAddress,
    billFrom,
    billFromEmail,
    billFromAddress,
    notes,
    items,
    currency,
    subTotal,
    taxAmount,
    discountAmount,
    total,
  });

  try {
    const savedInvoice = await newInvoice.save();

    // // Send an email to the recipient
    // const emailSubject = "Invoice Details from Our Store";
    // const emailBody = `
    //   Dear ${billTo},

    //   Thank you for your purchase. Please find the details of your invoice below:

    //   Invoice Number: ${invoiceNumber}
    //   Date of Issue: ${dateOfIssue}
    //   Total Amount: ${currency} ${total}

    //   If you have any questions, feel free to contact us.

    //   Best regards,
    //   Our Store Team
    // `;

    // await mailer(billToEmail, emailSubject, emailBody);

    res
      .status(201)
      .json({ message: "Invoice saved successfully", invoice: savedInvoice });
  } catch (error) {
    console.error("Error saving invoice or sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to save invoice or send email", error: error.message });
  }
});

module.exports = router;
