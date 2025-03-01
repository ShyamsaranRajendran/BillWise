import React from 'react';

export default function TimeStats({ entries }) {
  const projectStats = entries.reduce((stats, entry) => {
    if (!stats[entry.projectId]) {
      stats[entry.projectId] = { hours: 0, projectName: entry.projectName, color: entry.color };
    }
    stats[entry.projectId].hours += entry.duration;
    return stats;
  }, {});

  return (
    <div className="time-stats">
      <h2>Project Summary</h2>
      <ul>
        {Object.entries(projectStats).map(([projectId, stat]) => (
          <li key={projectId} style={{ borderLeft: `4px solid ${stat.color}` }}>
            <span>{stat.projectName}</span>
            <span>{stat.hours.toFixed(1)}h</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
