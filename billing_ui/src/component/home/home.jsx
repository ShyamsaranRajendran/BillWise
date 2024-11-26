import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./home.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    revenueData: [],
    customerTypeData: [],
    recentInvoices: [],
    topProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/products/home");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p>Loading dashboard data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const { stats, revenueData, customerTypeData, recentInvoices, topProducts } =
    dashboardData;

  return (
    <div className="dashboard">
      <div className="header">
        <p>Welcome back! Here's what's happening with your business today.</p>
      </div>

      <div className="stats">
        {stats.map((item) => (
          <div className="stat-card" key={item.name}>
            <div className="stat-icon">
              {item.name === "Revenue" ? "💰" : "👤"}
            </div>
            <div className="stat-info">
              <p className="stat-name">{item.name}</p>
              <div className="stat-values">
                <p className="stat-value">{item.value}</p>
                <p className={`stat-change ${item.changeType}`}>
                  {item.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts">
        <div className="chart-card">
          <h2>Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#FF6B6B"
                fill="#FF6B6B"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#4ECDC4"
                fill="#4ECDC4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Customer Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerTypeData}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
              >
                {customerTypeData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="invoices">
        <h2>Recent Invoices</h2>
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.billTo}</td>
                <td>${invoice.total}</td>
                {/* <td className={invoice.status.toLowerCase() || "paid"}>
                  {invoice.status || "paid"}
                </td> */}
                <td className={"paid"}>{"paid"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="chart-card">
        <h2>Top Products</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#FF6B6B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
