import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './component/Header/header';
import Footer from './component/Footer/footer';
import Land from './component/landing';
import User from './component/User/UserDash';
import Dashboard from './component/Dashboard/Dashboard';
import Customers from './component/Customers/Customers.jsx';
import Home from './component/home/home.jsx';
import ProductCatalog from './component/ProductCatalog/ProductCatalog.jsx';
import Sales from './component/Sales/Sales';
import Payments from './component/Payments/Payments.jsx';
import Expense from './component/Expense/Expense.jsx';
import TimeTracking from './component/TimeTracking/TimeTracking.jsx';
import Events from './component/Events/Events.jsx';
import Reports from './component/Reports/Reports.jsx';
import NewCustomer from './component/Customers/NewCustomer.jsx';
import EditCustomer from './component/Customers/EditCustomer.jsx';
import WebTabs from './component/WebTabs/WebTabs.jsx';
import NewProduct from './component/ProductCatalog/AddProduct.jsx';
import EditProduct from './component/ProductCatalog/EditProduct.jsx';
import NewSales from './component/Sales/AddSales.jsx';
import EditSales from './component/Sales/EditSales.jsx'; 
import 'leaflet/dist/leaflet.css';
import  InvoiceForm  from './component/Invoices/InvoiceForm.jsx';
import  Blog  from './component/Blog/Blog.jsx';
import  Tools  from './component/Tools/Tools.jsx';
import  Services  from './component/Services/Services.jsx';
import  Contact  from './component/Contact/Contact.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/Dashboard/*" element={<Dashboard />}>
            <Route path="" element={<Home />} />
            <Route path="customers" element={<Customers />}>
              <Route path="new-customer" element={<NewCustomer />} />
              <Route path="edit-customer/:id" element={<EditCustomer />} />
            </Route>
            <Route path="product-catalog" element={<ProductCatalog />}>
              <Route path="new-product" element={<NewProduct />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
            </Route>
            <Route path="sales" element={<Sales />} >
             <Route path="new-sales" element={<NewSales />} />
              <Route path="edit-sales/:id" element={<EditSales />} />
            </Route>
            <Route path="payments" element={<Payments />} />
            <Route path="invoices" element={<InvoiceForm />} />

            <Route path="expense" element={<Expense />} />
            <Route path="time-tracking" element={<TimeTracking />} />
            <Route path="events" element={<Events />} />
            <Route path="reports" element={<Reports />} />
            <Route path="web-tabs" element={<WebTabs />} />
          </Route>

          <Route path="/user" element={<User />} /> 
          <Route path="/blog" element={<Blog />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/' element={<Land/>}/>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
