import React from "react";
import {
  Refresh,
  Add,
  Group,
  Notifications,
  Settings,
} from "@material-ui/icons";
import { Link } from "react-router-dom"; // Import Link
import "./header.css";

const DashboardHeader = () => {
  return (
    <div className="dash-header">
      <div className="left-head">
        <div className="refresh-btn">
          <Refresh />
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
            {" "}
            {/* Use Link for navigation */}
            <Add />
          </Link>
        </div>
        <div className="group-list-icon">
          <Link to="/dashboard/customers">
            {" "}
            {/* Use Link for navigation */}
            <Group />
          </Link>
        </div>
        <div className="bell-icon-subcript">
          <Notifications />
        </div>
        <div className="settings-icon">
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
