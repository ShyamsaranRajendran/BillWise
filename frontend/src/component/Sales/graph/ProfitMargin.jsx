// components/ProfitMargin.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(...registerables); // Register all necessary components
const ProfitMargin = () => {
  const [profitData, setProfitData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:5000/sales/profit-margin");
      setProfitData(response.data);
    };
    fetchData();
  }, []);

  const data = {
    labels: profitData.map((_, index) => `Sale ${index + 1}`),
    datasets: [
      {
        label: "Profit Margin",
        data: profitData.map((item) => item.profitMargin),
        backgroundColor: "purple",
      },
    ],
  };

  return (
     <div style={{ width: "800px", height: "900px" }}>
       <Bar data={data} />
     </div>
  )
};

export default ProfitMargin;
