import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./css/graph.css";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the scales and elements
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = () => {
  const [stockHighToLow, setStockHighToLow] = useState([]);
  const [stockLowToHigh, setStockLowToHigh] = useState([]);
  const [minStock, setMinStock] = useState(0); // State for minimum stock value
  const [maxStock, setMaxStock] = useState(200); // State for maximum stock value

  useEffect(() => {
    const fetchData = async () => {
      try {
         const token = localStorage.getItem("authorization");
         if (!token) {
           throw new Error("No authorization token found");
         }
        const response = await fetch(
          "http://localhost:5000/products/products-repo",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        ); // Fetch data from the server
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json(); // Parse the response as JSON

        console.log("Fetched data:", data); // Log the fetched data

        // Update state for high to low and low to high stocks
        setStockHighToLow(data.stockHighToLow);
        setStockLowToHigh(data.stockLowToHigh);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter the data based on min and max stock values
  const filteredLowToHighStock = stockLowToHigh.filter(
    (item) =>
      item.quantity_available >= minStock && item.quantity_available <= maxStock
  );

  const filteredHighToLowStock = stockHighToLow.filter(
    (item) =>
      item.quantity_available >= minStock && item.quantity_available <= maxStock
  );

  const salesChartData = {
    labels: filteredLowToHighStock.map((item) => item.productDetails.name),
    datasets: [
      {
        label: "Stock",
        data: filteredLowToHighStock.map((item) => item.quantity_available),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const stockChartData = {
    labels: filteredHighToLowStock.map((item) => item.productDetails.name),
    datasets: [
      {
        label: "Stock",
        data: filteredHighToLowStock.map((item) => item.quantity_available),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const stockChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        padding: 10,
        caretSize: 8,
      },
      legend: {
        display: true,
      },
    },
    interaction: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        stacked: true,
        min: 0,
        max:
          Math.max(
            ...filteredHighToLowStock.map((item) => item.quantity_available)
          ) + 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  const salesChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        padding: 10,
        caretSize: 8,
      },
      legend: {
        display: true,
      },
    },
    interaction: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        stacked: true,
        min: 0,
        max:
          Math.max(
            ...filteredLowToHighStock.map((item) => item.quantity_available)
          ) + 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  const handleMinStockChange = (e) => {
    setMinStock(Number(e.target.value));
  };

  const handleMaxStockChange = (e) => {
    setMaxStock(Number(e.target.value));
  };

  return (
    <div className="product-graphs">
      <h3>Stock Graph</h3>
      <div className="graphs">
        <div className="stock-graph">
          <Bar data={salesChartData} options={salesChartOptions} height={400} />
        </div>
        <div className="stock-graph">
          <Bar data={stockChartData} options={stockChartOptions} height={400} />
        </div>
      </div>

      <form className="stock-inputs">
        <label>
          Min Stock:
          <input
            type="number"
            value={minStock}
            onChange={handleMinStockChange}
            min="0"
          />
        </label>
        <label>
          Max Stock:
          <input
            type="number"
            value={maxStock}
            onChange={handleMaxStockChange}
            min="0"
          />
        </label>
      </form>
    </div>
  );
};

export default Graph;
