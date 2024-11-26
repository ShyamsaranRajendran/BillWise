import React from "react";
import { formatTime } from "./utils";  // Utility to format time

export default function TimeLogList({ logs }) {
  return (
    <div className="time-log-list">
      {logs.length === 0 ? (
        <p>No time logs yet.</p>
      ) : (
        <ul>
          {logs.map((log, index) => (
            <li key={index} className="time-log-entry">
              <p>{log.taskName}</p>
              <p>Time Spent: {formatTime(log.timeSpent)}</p>
              <p>Date: {new Date(log.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
