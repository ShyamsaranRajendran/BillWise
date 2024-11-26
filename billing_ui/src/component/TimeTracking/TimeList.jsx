import React from "react";
import { Edit, Trash } from "lucide-react";
import { format } from "date-fns";

export default function TimeList({ entries, projects, onEdit, onDelete }) {
  const getProjectDetails = (projectId) => {
    return projects.find((project) => project.id === projectId) || {};
  };

  return (
    <div className="time-list">
      <h2>Time Entries</h2>
      {entries.length === 0 ? (
        <p>
          No time entries available. Start tracking or add an entry manually!
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const project = getProjectDetails(entry.projectId);
              return (
                <tr key={entry.id}>
                  <td style={{ borderLeft: `4px solid ${project.color}` }}>
                    {project.name}
                  </td>
                  <td>{format(new Date(entry.date), "dd MMM yyyy")}</td>
                  <td>{entry.duration.toFixed(1)}h</td>
                  <td>
                    <button onClick={() => onEdit(entry)} className="btn-icon">
                      <Edit />
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="btn-icon danger"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
