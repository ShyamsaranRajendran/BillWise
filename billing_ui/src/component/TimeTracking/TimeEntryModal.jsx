import React, { useState } from "react";

export default function TimeEntryModal({ isOpen, onClose, onSave }) {
  const [taskName, setTaskName] = useState("");
  const [timeSpent, setTimeSpent] = useState(0);

  const handleSubmit = () => {
    const newLog = {
      taskId: Math.random().toString(36).slice(2, 11),
      taskName,
      timeSpent,
      timestamp: new Date().toISOString(),
    };
    onSave(newLog);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Time Log</h2>
        <label>Task Name:</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <label>Time Spent (in minutes):</label>
        <input
          type="number"
          value={timeSpent}
          onChange={(e) => setTimeSpent(Number(e.target.value))}
        />
        <button onClick={handleSubmit} className="btn-primary">
          Save Log
        </button>
        <button onClick={onClose} className="btn-secondary">
          Close
        </button>
      </div>
    </div>
  );
}
