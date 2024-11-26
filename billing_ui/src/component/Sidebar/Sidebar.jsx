import React from "react";
import { NavLink } from "react-router-dom";
import {
  People,
  ShoppingCart,
  MonetizationOn,
  Payment,
  Receipt,
  AccessTime,
  Event,
  BarChart,
  Web,
} from "@material-ui/icons";
import { IoHome } from "react-icons/io5";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="Sidebar">
      <div className="title-billing">Billing</div>
      <ul className="sidebar-nav">
        <li>
          <NavLink
            to=" "
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <IoHome className="icon" /> Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="customers"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <People className="icon" /> Customers
          </NavLink>
        </li>
        <li>
          <NavLink
            to="invoices"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <Web className="icon" /> Invoices
          </NavLink>
        </li>
        <li>
          <NavLink
            to="product-catalog"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <ShoppingCart className="icon" /> Product Catalog
          </NavLink>
        </li>
        <li>
          <NavLink
            to="sales"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <MonetizationOn className="icon" /> Sales
          </NavLink>
        </li>
        <li>
          <NavLink
            to="payments"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <Payment className="icon" /> Payments
          </NavLink>
        </li>
        <li>
          <NavLink
            to="expense"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <Receipt className="icon" /> Expense
          </NavLink>
        </li>
        <li>
          <NavLink
            to="time-tracking"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <AccessTime className="icon" /> Time Tracking
          </NavLink>
        </li>
        <li>
          <NavLink
            to="events"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <Event className="icon" /> Events
          </NavLink>
        </li>
        <li>
          <NavLink
            to="reports"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <BarChart className="icon" /> Reports
          </NavLink>
        </li>
        <li>
          {/* <NavLink
            to="web-tabs"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <Web className="icon" /> Web Tabs
          </NavLink> */}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
