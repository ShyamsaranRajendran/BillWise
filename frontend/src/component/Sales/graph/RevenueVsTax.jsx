// components/RevenueVsTax.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(...registerables); // Register all necessary components
const RevenueVsTax = () => {
  const [revenueData, setRevenueData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:5000/sales/revenue-vs-tax"
      );
      setRevenueData(response.data[0]); // Assuming it's an array with one object
    };
    fetchData();
  }, []);

  const data = {
    labels: ["Total Revenue", "Total Tax"],
    datasets: [
      {
        label: "Amount",
        data: [revenueData.totalRevenue || 0, revenueData.totalTax || 0],
        backgroundColor: ["green", "red"],
      },
    ],
  };

  return (
     <div style={{ width: "800px", height: "900px" }}>
       <Bar data={data} />
     </div>
  )
};

export default RevenueVsTax;
