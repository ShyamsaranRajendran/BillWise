// components/TotalSales.js
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const TotalSales = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:5000/sales/total-sales"
      );
      setSalesData(response.data);
    };
    fetchData();
  }, []);

  const data = {
    labels: salesData.map((item) => item._id),
    datasets: [
      {
        label: "Total Sales",
        data: salesData.map((item) => item.total),
        fill: false,
        borderColor: "blue",
        tension: 0.1,
      },
    ],
  };

  return (
  <div style={{ width: "800px", height: "500px" }}>
    {" "}
    <Line data={data} />
  </div>
  );
};

export default TotalSales;
