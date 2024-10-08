// components/SalesByProduct.js
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const SalesByProduct = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:5000/sales/sales-by-product"
      );
      setProductData(response.data);
    };
    fetchData();
  }, []);

  const data = {
    labels: productData.map((item) => item.name),
    datasets: [
      {
        label: "Sales Amount",
        data: productData.map((item) => item.total),
        backgroundColor: "orange",
      },
    ],
  };

  return (
    <div style={{ width: "800px", height: "900px" }}>
      <Bar data={data} />
    </div>
  );
};

export default SalesByProduct;
