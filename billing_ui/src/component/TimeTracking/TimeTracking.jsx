import React, { useState, useEffect } from "react";
import {
  PlayCircle,
  PauseCircle,
  StopCircle,
  FileText,
  BarChart,
} from "lucide-react";
import TimeEntryModal from "./TimeEntryModal"; // Modal to add/edit time logs
import TimeLogList from "./TimeLogList"; // List of time logs
import { formatTime } from "./utils"; // Utility function to format time
import './styles.css'
export default function TimeTrackingPage() {
  const [tasks, setTasks] = useState(() => {
    // Retrieve tasks from localStorage, or set default if not available
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          { id: "1", name: "Order Processing", active: false, timeSpent: 0 },
          { id: "2", name: "Inventory Update", active: false, timeSpent: 0 },
          { id: "3", name: "Payment Handling", active: false, timeSpent: 0 },
          { id: "4", name: "Customer Service", active: false, timeSpent: 0 },
        ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const startTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, active: true } : task
    );
    setTasks(updatedTasks);
  };

  const stopTask = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, active: false, timeSpent: task.timeSpent + 1 };
      }
      return task;
    });
    setTasks(updatedTasks);
    logTime(taskId);
  };

  const logTime = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    const log = {
      taskId,
      taskName: task.name,
      timeSpent: task.timeSpent,
      timestamp: new Date().toISOString(),
    };
    setLogs([log, ...logs]);
  };

  const addTimeLog = (log) => {
    setLogs([log, ...logs]);
    setIsModalOpen(false);
  };

  const taskStats = tasks.reduce(
    (acc, task) => {
      acc.totalTime += task.timeSpent;
      if (task.active) acc.activeTasks.push(task.name);
      return acc;
    },
    { totalTime: 0, activeTasks: [] }
  );

  return (
    <div className="time-tracking-page">
      <div className="header">
        <h1>Time Tracking Dashboard</h1>
        <p>
          Track the time spent on different tasks related to the e-commerce
          operations.
        </p>
      </div>

      <div className="task-cards">
        {tasks.map((task) => (
          <div className="task-card" key={task.id}>
            <h3>{task.name}</h3>
            <div className="task-actions">
              {task.active ? (
                <button
                  onClick={() => stopTask(task.id)}
                  className="btn-danger"
                >
                  {<PauseCircle />} Stop
                </button>
              ) : (
                <button
                  onClick={() => startTask(task.id)}
                  className="btn-success"
                >
                  {<PlayCircle />} Start
                </button>
              )}
            </div>
            <div className="task-time">
              <p>Time Spent: {formatTime(task.timeSpent)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="time-stats">
        <div className="stats-card">
          <h3>Total Time</h3>
          <p>{formatTime(taskStats.totalTime)}</p>
        </div>
        <div className="stats-card">
          <h3>Active Tasks</h3>
          <p>{taskStats.activeTasks.join(", ") || "None"}</p>
        </div>
      </div>

      <div className="time-log">
        <h2>Time Logs</h2>
        <TimeLogList logs={logs} />
      </div>

      <button onClick={() => setIsModalOpen(true)} className="btn-primary">
        {<FileText />} Add Manual Time Entry
      </button>

      <TimeEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTimeLog}
      />
    </div>
  );
}
