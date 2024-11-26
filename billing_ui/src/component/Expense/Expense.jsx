import React, { useState } from "react";
import ExpenseList from "./ExpenseList";
import ExpenseModal from "./ExpenseModal";
import ExpenseStats from "./ExpenseStats";
import ExpenseFilters from "./ExpenseFilters";
import "./ExpensePage.css";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleAddExpense = (newExpense) => {
    const expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses([expense, ...expenses]);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleSaveEdit = (updatedExpense) => {
    if (selectedExpense) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === selectedExpense.id
            ? { ...updatedExpense, id: selectedExpense.id }
            : expense
        )
      );
      setSelectedExpense(null);
    }
  };

  const handleExport = () => {
    console.log("Exporting expenses...");
  };

  return (
    <div className="expense-page">
      <div className="header">
        <div>
          <h1 className="title">Track Expenses</h1>
          <p className="subtitle">Manage and monitor your business expenses</p>
        </div>
        <div className="buttons">
          <button onClick={() => setIsModalOpen(true)} className="btn">
            Add Expense
          </button>
          <button onClick={handleExport} className="btn">
            Export
          </button>
          <button onClick={() => setShowFilters(!showFilters)} className="btn">
            Filter
          </button>
        </div>
      </div>

      {showFilters && (
        <ExpenseFilters onFilterChange={(filters) => console.log(filters)} />
      )}

      {/* Expense Stats with Chart */}
      <ExpenseStats expenses={expenses} />

      <ExpenseList
        expenses={expenses}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={selectedExpense ? handleSaveEdit : handleAddExpense}
        expense={selectedExpense}
      />
    </div>
  );
}
