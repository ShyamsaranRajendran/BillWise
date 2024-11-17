import React from "react";
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
import './home.css';
// Dummy data
const stats = [
  {
    name: "Revenue",
    value: "$12,000",
    change: "+12%",
    changeType: "positive",
    icon: () => <div>💰</div>,
  },
  {
    name: "Customers",
    value: "1,234",
    change: "+5%",
    changeType: "positive",
    icon: () => <div>👤</div>,
  },
];

const revenueData = [
  { date: "2024-01", revenue: 4000, expenses: 2400 },
  { date: "2024-02", revenue: 3000, expenses: 1398 },
];

const customerTypeData = [
  { name: "New Customers", value: 400, color: "#FF6B6B" },
  { name: "Returning Customers", value: 300, color: "#4ECDC4" },
];

const recentInvoices = [
  { id: "INV001", customer: "John Doe", amount: "$1,200", status: "Paid" },
  { id: "INV002", customer: "Jane Smith", amount: "$980", status: "Pending" },
];

const topProducts = [
  { name: "Product A", sales: 2400 },
  { name: "Product B", sales: 1398 },
];

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="header">
        <p>Welcome back! Here's what's happening with your business today.</p>
      </div>

      <div className="stats">
        {stats.map((item) => (
          <div className="stat-card" key={item.name}>
            <div className="stat-icon">{item.icon()}</div>
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
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.customer}</td>
                <td>{invoice.amount}</td>
                <td className={invoice.status.toLowerCase()}>
                  {invoice.status}
                </td>
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
