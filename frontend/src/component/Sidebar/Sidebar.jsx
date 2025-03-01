import React, { useState, useRef, useLayoutEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  ShoppingCart,
  DollarSign,
  CreditCard,
  FileText,
  Clock,
  Calendar,
  BarChart2,
  Globe,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef(null);

  useLayoutEffect(() => {
    // Ensure smooth transition when toggling sidebar
    sidebarRef.current.style.width = isCollapsed ? "80px" : "250px";
  }, [isCollapsed]);

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard/" },
    { id: "customers", label: "Customers", icon: Users, path: "/dashboard/customers" },
    { id: "invoices", label: "Invoices", icon: Globe, path: "/dashboard/invoices" },
    { id: "products", label: "Product Catalog", icon: ShoppingCart, path: "/dashboard/product-catalog" },
    { id: "sales", label: "Sales", icon: DollarSign, path: "/dashboard/sales" },
    { id: "payments", label: "Payments", icon: CreditCard, path: "/dashboard/payments" },
    { id: "expense", label: "Expense", icon: FileText, path: "/dashboard/expense" },
    { id: "time-tracking", label: "Time Tracking", icon: Clock, path: "/dashboard/time-tracking" },
    { id: "events", label: "Events", icon: Calendar, path: "/dashboard/events" },
    { id: "reports", label: "Reports", icon: BarChart2, path: "/dashboard/reports" },
    { id: "web-tabs", label: "Web Tabs", icon: Globe, path: "/dashboard/web-tabs" },
  ];

  return (
    <div ref={sidebarRef} className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">{!isCollapsed && "Dashboard"}</span>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          ☰
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.id}>
            <NavLink to={item.path} className={({ isActive }) => (isActive ? "active-link" : "")}>
              <item.icon className="icon" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
