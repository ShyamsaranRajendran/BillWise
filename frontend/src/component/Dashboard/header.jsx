import React from "react";
import {
  RefreshCcw,
  Plus,
  Users,
  Bell,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom"; // Import Link
import "./header.css";

const DashboardHeader = () => {
  return (
    <div className="dash-header">
      <div className="left-head">
        <div className="refresh-btn">
          <RefreshCcw />
        </div>
        <div className="search-box">
          <form action="">
            <input type="text" placeholder="Search in customers" />
          </form>
        </div>
      </div>
      <div className="right-head">
        <div className="newcustomer-box">
          <Link to="/Dashboard/customers/new-customer">
            <Plus />
          </Link>
        </div>
        <div className="group-list-icon">
          <Link to="/dashboard/customers">
            <Users />
          </Link>
        </div>
        <div className="bell-icon-subcript">
          <Bell />
        </div>
        <div className="settings-icon">
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
