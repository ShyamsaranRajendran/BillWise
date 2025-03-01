import React from "react";
import { Doughnut } from "react-chartjs-2";

export default function ExpenseStats({ expenses }) {
  const expenseCategories = expenses.reduce((acc, expense) => {
    const category = expense.category || "Others";
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(expenseCategories),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="expense-stats">
      <h2>Expense Overview</h2>
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
