// components/SalesByCustomer.js
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";

const SalesByCustomer = () => {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:5000/sales/sales-by-customer"
      );
      setCustomerData(response.data);
    };
    fetchData();
  }, []);

  const data = {
    labels: customerData.map((item) => item.name),
    datasets: [
      {
        label: "Sales by Customer",
        data: customerData.map((item) => item.total),
        backgroundColor: ["red", "green", "blue", "yellow", "purple"],
      },
    ],
  };

  return (
     <div style={{ width: "800px", height: "900px" }}>

       <Pie data={data} />
     </div>
  )
};

export default SalesByCustomer;
