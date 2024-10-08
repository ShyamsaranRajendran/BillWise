// components/ConversionRate.js
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Register all necessary components
const ConversionRate = () => {
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:5000/sales/conversion-rate"
      );
      setConversionRate(response.data.conversionRate);
    };
    fetchData();
  }, []);

  const data = {
    labels: ["Converted", "Not Converted"],
    datasets: [
      {
        label: "Conversion Rate",
        data: [conversionRate, 100 - conversionRate],
        backgroundColor: ["green", "gray"],
      },
    ],
  };

  return (
     <div style={{ width: "800px", height: "900px" }}>

       <Doughnut data={data} />
     </div>
  )
};

export default ConversionRate;
