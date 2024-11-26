import React from "react";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <div className="expense-list">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Notes</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.date}</td>
              <td>{expense.category}</td>
              <td>{expense.notes}</td>
              <td>${expense.amount}</td>
              <td>
                <button onClick={() => onEdit(expense)} className="btn-edit">
                  Edit
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
