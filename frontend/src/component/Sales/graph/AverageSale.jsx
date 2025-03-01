// components/AverageSale.js
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Register all necessary components
const AverageSale = () => {
  const [averageSalesData, setAverageSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:5000/sales/average-sale"
      );
      setAverageSalesData(response.data);
    };
    fetchData();
  }, []);

  const data = {
    labels: averageSalesData.map((item) => item._id),
    datasets: [
      {
        label: "Average Sale Amount",
        data: averageSalesData.map((item) => item.average),
        fill: false,
        borderColor: "purple",
        tension: 0.1,
      },
    ],
  };

  return (
 <div style={{ width: "800px", height: "500px" }}>
   <Line data={data} />
 </div>
  )
};

export default AverageSale;
