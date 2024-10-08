import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import DashHeader from "./header.jsx";
import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";
import SpLoader from "../utils/SpLoader";

const Dashboard = () => {
  const [showLoader, setShowLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("authorization");
      if (!token) {
        navigate("/user");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/usr/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setShowLoader(false);
        } else {
          localStorage.removeItem("authorization");
          navigate("/user");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("authorization");
        navigate("/user");
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className={`Dashboard-container ${showLoader ? "blur" : ""}`}>
      {showLoader ? (
        <SpLoader onComplete={() => setShowLoader(false)} />
      ) : (
        <>
          <Sidebar />
          <div className="content1">
            <DashHeader />
            <div className="content">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
