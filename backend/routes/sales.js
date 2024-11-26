// routes/sales.js
const express = require("express");
const router = express.Router();
const Sales = require('../models/sales');
const Product = require('../models/products'); // Assuming you have a Product model
const Customer = require('../models/customer'); // Assuming you have a Customer model
const authenticate = require("../utils/AuthDecode"); // Assuming you have authentication middleware
const PDFDocument = require('pdfkit');

// Route to delete a sale record by ID
router.delete('/:id', async function (req, res) {
  try {
    const saleId = req.params.id;

    // Find and delete the sale record
    const deletedSale = await Sales.findByIdAndDelete(saleId);

    if (!deletedSale) {
      return res.status(404).json({ error: "Sale record not found" });
    }

    res.json({ message: "Sale record deleted successfully", deletedSale });
  } catch (err) {
    console.error("Error deleting sale record:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all products with pagination, search, and brand filtering
router.get('/all', authenticate, async function (req, res) {
  try {
    const { page = 1, limit = 12, search = "", brand = "" } = req.query;

    // Build search query for sales
    const searchQuery = {
      $and: [
        search
          ? {
              $or: [
                { 'product_id.name': { $regex: search, $options: "i" } },
                { 'product_id.description': { $regex: search, $options: "i" } },
              ],
            }
          : {},
        brand
          ? { 'product_id.brand': { $regex: brand, $options: "i" } }
          : {},
      ],
    };

    // Fetch sales with populated product and customer information
    const sales = await Sales.find(searchQuery)
      .populate('product_id', 'name brand description') // Populate product name, brand, and description
      .populate('customer_id', 'name email') // Populate customer name and email
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Log the fetched sales
    console.log("Fetched Sales:", JSON.stringify(sales, null, 2));

    // Count the total number of matching sales
    const total = await Sales.countDocuments(searchQuery);

    // Send sales data along with pagination details
    res.json({
      sales,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/data', async (req, res) => {
  try {
    const products = await Product.find({}, 'name');
    const customers = await Customer.find({}, 'name');

    res.json({ products, customers });
  } catch (error) {
    console.error('Error fetching products and customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// 1. Get total sales over time
router.get('/total-sales', async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$sale_date" } },
          total: { $sum: "$total_amount" }
        }
      },
      { $sort: { _id: 1 } } // Sort by date
    ]);
    res.json(sales);
  } catch (err) {
    console.error("Error fetching total sales:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Get sales by product
router.get('/sales-by-product', async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $group: {
          _id: "$product_id",
          total: { $sum: "$total_amount" }
        }
      },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: "$product" },
      { $project: { name: "$product.name", total: 1 } }
    ]);
    res.json(sales);
  } catch (err) {
    console.error("Error fetching sales by product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. Get sales by customer
router.get('/sales-by-customer', async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $group: {
          _id: "$customer_id",
          total: { $sum: "$total_amount" }
        }
      },
      { $lookup: { from: 'customers', localField: '_id', foreignField: '_id', as: 'customer' } },
      { $unwind: "$customer" },
      { $project: { name: "$customer.name", total: 1 } }
    ]);
    res.json(sales);
  } catch (err) {
    console.error("Error fetching sales by customer:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 4. Get sales distribution by discount percentage
router.get('/sales-by-discount', async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $group: {
          _id: "$discount_percent",
          total: { $sum: "$total_amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(sales);
  } catch (err) {
    console.error("Error fetching sales by discount:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 5. Get sales revenue vs. tax amount
router.get('/revenue-vs-tax', async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_amount" },
          totalTax: { $sum: "$tax_amount" }
        }
      }
    ]);
    res.json(sales);
  } catch (err) {
    console.error("Error fetching revenue vs. tax:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 6. Get sales trend by category (assuming you have categories)
router.get('/sales-by-category', async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $lookup: { from: 'products', localField: 'product_id', foreignField: '_id', as: 'product' }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category", // Assuming product has a category field
          total: { $sum: "$total_amount" }
        }
      }
    ]);
    res.json(sales);
  } catch (err) {
    console.error("Error fetching sales by category:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 7. Get average sale amount over time
router.get('/average-sale', async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$sale_date" } },
          average: { $avg: "$total_amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(sales);
  } catch (err) {
    console.error("Error fetching average sale:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 8. Get sales by location (assuming you have customer location)
router.get('/sales-by-location', async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $lookup: { from: 'customers', localField: 'customer_id', foreignField: '_id', as: 'customer' }
      },
      { $unwind: "$customer" },
      {
        $group: {
          _id: "$customer.location", // Assuming customer has a location field
          total: { $sum: "$total_amount" }
        }
      }
    ]);
    res.json(sales);
  } catch (err) {
    console.error("Error fetching sales by location:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 9. Get sales conversion rate
router.get('/conversion-rate', async (req, res) => {
  // Assuming you have a way to track leads/visits
  const leadsCount = 100; // Replace with actual leads count
  try {
    const sales = await Sales.countDocuments();
    const conversionRate = (sales / leadsCount) * 100; // Conversion rate as a percentage
    res.json({ conversionRate });
  } catch (err) {
    console.error("Error fetching conversion rate:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 10. Get profit margins analysis
router.get('/profit-margin', async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $project: {
          profitMargin: {
            $subtract: ["$total_amount", "$unit_price"] // Assuming unit_price represents cost price
          },
        },
      },
    ]);
    res.json(sales);
  } catch (err) {
    console.error("Error fetching profit margins:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/payment', async (req, res) => {
  try {
    // Fetch all sales records and populate product_id and customer_id
    const sales = await Sales.find().populate('product_id').populate('customer_id');

    if (!sales || sales.length === 0) {
      return res.status(404).json({ error: 'No sales data found' });
    }

    console.log('Fetched sales:', sales);

    // Sort sales by sale_date descending
    const sortedSales = sales.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));

    // Define current date for calculations
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();

    // Calculate Current Payment (e.g., total amount due for the current month)
    const currentPayments = sales.filter(sale => {
      const saleDate = sale.sale_date ? new Date(sale.sale_date) : null;
      return saleDate && saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });

    const currentPaymentAmount = currentPayments.reduce((acc, sale) => acc + sale.final_amount, 0);
    const currentPaymentDueDate = new Date(currentDate.setDate(currentDate.getDate() + 30)).toLocaleDateString();

    // Calculate Last Payment (e.g., total amount paid in the previous month)
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastPayments = sales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate.getMonth() === lastMonth && saleDate.getFullYear() === lastYear;
    });

    const lastPaymentAmount = lastPayments.reduce((acc, sale) => acc + sale.final_amount, 0);
    const lastPaymentDate = lastPayments.length > 0
      ? new Date(lastPayments[0].sale_date).toLocaleDateString()
      : 'N/A';

    // Card Details (This should ideally come from a secure source or user profile)
    const cardDetails = {
      cardNumber: '**** **** **** 1234', // Placeholder
    };

    // Pricing Calculator Info
    const pricingCalculator = {
      description: 'Want to have more pods or change the pod type?',
      link: '/calculate', // Adjust as necessary
    };

    // Prepare Invoices
    const invoices = sales.map(sale => ({
      id: sale._id,
      date: new Date(sale.sale_date).toLocaleString('default', { month: 'short', year: 'numeric' }),
      amount: `INR $${(sale.final_amount / 100).toFixed(2)}`, // Assuming amount is in cents
      plan: sale.product_id ? sale.product_id.name : 'Unknown Product', // Safely access product name
      status: 'Paid', // Assuming all sales are paid; adjust as necessary
    }));

    // Structure the response
    const paymentData = {
      currentPayment: {
        amount: (currentPaymentAmount / 100).toFixed(2), // Assuming amount is in cents
        dueDate: currentPaymentDueDate,
      },
      lastPayment: {
        amount: (lastPaymentAmount / 100).toFixed(2),
        paidDate: lastPaymentDate,
      },
      cardDetails: cardDetails,
      pricingCalculator: pricingCalculator,
      invoices: invoices,
    };

    console.log(paymentData);
    res.json(paymentData);
  } catch (err) {
    console.error("Error fetching payment data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// router.get('/payment', async (req, res) => {
//   try {
//     // Fetch all sales records
//     const sales = await Sales.find().populate('product_id').populate('customer_id');

//     if (!sales) {
//       return res.status(404).json({ error: 'No sales data found' });
//     }

//     // Sort sales by sale_date descending
//     const sortedSales = sales.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));

//     // Define current date for calculations
//     const currentDate = new Date();

//     // Calculate Current Payment (e.g., total amount due for the current month)
//     const currentMonth = currentDate.getMonth(); // 0-11
//     const currentYear = currentDate.getFullYear();

//     const currentPayments = sales.filter(sale => {
//       const saleDate = new Date(sale.sale_date);
//       return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
//     });

//     const currentPaymentAmount = currentPayments.reduce((acc, sale) => acc + sale.final_amount, 0);
//     const currentPaymentDueDate = new Date(currentDate.setDate(currentDate.getDate() + 30)).toLocaleDateString();

//     // Calculate Last Payment (e.g., total amount paid in the previous month)
//     const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
//     const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

//     const lastPayments = sales.filter(sale => {
//       const saleDate = new Date(sale.sale_date);
//       return saleDate.getMonth() === lastMonth && saleDate.getFullYear() === lastYear;
//     });

//     const lastPaymentAmount = lastPayments.reduce((acc, sale) => acc + sale.final_amount, 0);
//     const lastPaymentDate = lastPayments.length > 0
//       ? new Date(lastPayments[0].sale_date).toLocaleDateString()
//       : 'N/A';

//     // Card Details (This should ideally come from a secure source or user profile)
//     const cardDetails = {
//       cardNumber: '**** **** **** 1234', // Placeholder
//     };

//     // Pricing Calculator Info
//     const pricingCalculator = {
//       description: 'Want to have more pods or change the pod type?',
//       link: '/calculate', // Adjust as necessary
//     };

//     // Prepare Invoices
//     const invoices = sales.map(sale => ({
//       id: sale._id, // Add the sale ID
//       date: new Date(sale.sale_date).toLocaleString('default', { month: 'short', year: 'numeric' }),
//       amount: `INR $${(sale.final_amount / 100).toFixed(2)}`, // Assuming amount is in cents
//       plan: sale.product_id.name, // Assuming 'plan' corresponds to product name
//       status: 'Paid', // Assuming all sales are paid; adjust as necessary
//     }));

//     // Structure the response
//     const paymentData = {
//       currentPayment: {
//         amount: (currentPaymentAmount / 100).toFixed(2), // Assuming amount is in cents
//         dueDate: currentPaymentDueDate,
//       },
//       lastPayment: {
//         amount: (lastPaymentAmount / 100).toFixed(2),
//         paidDate: lastPaymentDate,
//       },
//       cardDetails: cardDetails,
//       pricingCalculator: pricingCalculator,
//       invoices: invoices,
//     };

//     console.log(paymentData);
//     res.json(paymentData);
//   } catch (err) {
//     console.error("Error fetching payment data:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });



router.get('/invoice/:id', async (req, res) => {
  try {
    const saleId = req.params.id;
    console.log(saleId);
    const sale = await Sales.findById(saleId)
      .populate('product_id')
      .populate('customer_id');

    if (!sale) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Check if customer and product exist
    const customerName = sale.customer_id ? sale.customer_id.name : 'Unknown Customer';
    const productName = sale.product_id ? sale.product_id.name : 'Unknown Product';
    const productBrand = sale.product_id ? sale.product_id.brand : 'Unknown Brand';

    // Create a PDF document
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${saleId}.pdf`);

    // Pipe the PDF into the response
    doc.pipe(res);

    // Add content to the PDF (Customize as needed)
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice ID: ${sale._id}`);
    doc.text(`Date: ${new Date(sale.sale_date).toLocaleDateString()}`);
    doc.text(`Customer: ${customerName}`);
    doc.moveDown();

    doc.text(`Product: ${productName}`);
    doc.text(`Brand: ${productBrand}`);
    doc.text(`Quantity Sold: ${sale.quantity_sold}`);
    doc.text(`Unit Price: INR $${(sale.unit_price / 100).toFixed(2)}`);
    doc.text(`Discount: ${sale.discount_percent}%`);
    doc.text(`Tax: ${sale.tax_percent}%`);
    doc.moveDown();

    doc.text(`Total Amount: INR $${(sale.total_amount / 100).toFixed(2)}`);
    doc.text(`Discount Amount: INR $${(sale.discount_amount / 100).toFixed(2)}`);
    doc.text(`Tax Amount: INR $${(sale.tax_amount / 100).toFixed(2)}`);
    doc.text(`Final Amount: INR $${(sale.final_amount / 100).toFixed(2)}`);
    doc.moveDown();

    doc.text('Thank you for your business!', { align: 'center' });

    // Finalize the PDF and end the stream
    doc.end();
  } catch (err) {
    console.error("Error generating invoice PDF:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.post('/add', authenticate, async (req, res) => {
  try {
    const {
      product_id,
      customer_id,
      quantity_sold,
      unit_price,
      discount_percent,
      tax_percent,
      sale_date,
    } = req.body;

    // Validate required fields
    if (!product_id || !customer_id || !quantity_sold || !unit_price || !sale_date) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    // Fetch product details to ensure product exists and get tax rate if needed
    const Product = require('../models/Product'); // Ensure correct path
    const Customer = require('../models/Customer'); // Ensure correct path

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const customer = await Customer.findById(customer_id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    // Calculate amounts
    const total_amount = quantity_sold * unit_price;
    const discount_amount = (total_amount * (discount_percent || 0)) / 100;
    const taxable_amount = total_amount - discount_amount;
    const tax_amount = (taxable_amount * (tax_percent || product.tax_rate || 0)) / 100;
    const final_amount = taxable_amount + tax_amount;

    // Create new sale instance
    const newSale = new Sales({
      product_id,
      customer_id,
      quantity_sold,
      unit_price,
      discount_percent: discount_percent || 0,
      tax_percent: tax_percent || product.tax_rate || 0,
      total_amount,
      discount_amount,
      tax_amount,
      final_amount,
      sale_date,
    });

    // Save sale to the database
    const savedSale = await newSale.save();

    // Populate product and customer fields
    const populatedSale = await savedSale
      .populate('product_id', 'name brand description')
      .populate('customer_id', 'name email');

    // Respond with the saved sale
    res.status(201).json({
      message: 'Sale added successfully.',
      sale: populatedSale,
    });
  } catch (error) {
    console.error('Error adding sale:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
