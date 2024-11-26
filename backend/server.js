const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// // Connect flash middleware
// app.use(flash());


// CORS middleware
app.use(cors());

//Routes
const user = require('./routes/users');
const customer = require('./routes/customer');
const products = require('./routes/products');
const sales = require('./routes/sales');
const invoice = require('./routes/Invoice');

app.use("/products/", products);
app.use("/sales/", sales); 
app.use("/cus/", customer);
app.use("/invoices/",invoice);
app.use("/usr/", user);


// Server start
const port = 5000;
app.listen(port, function () {
  console.log('Server is running on port ' + port);
});
