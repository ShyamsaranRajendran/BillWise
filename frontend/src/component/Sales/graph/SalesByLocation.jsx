// components/SalesByLocation.js
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";

const SalesByLocation = () => {
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:5000/sales/sales-by-location"
      );
      setLocationData(response.data);
    };
    fetchData();
  }, []);

  const data = {
    labels: locationData.map((item) => item._id),
    datasets: [
      {
        label: "Sales by Location",
        data: locationData.map((item) => item.total),
        backgroundColor: ["blue", "green", "yellow", "red", "orange"],
      },
    ],
  };

  return(
     <div style={{ width: "800px", height: "900px" }}>

     <Pie data={data} />
     </div>
  )
};

export default SalesByLocation;
