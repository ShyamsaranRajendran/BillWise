import React, { useState, useEffect } from "react";
import { format } from "date-fns"; // To format dates
import { Info, Filter, RefreshCw } from "lucide-react"; // Icons
import './styles.css'
// Sample event data
const sampleEvents = [
  {
    id: "1",
    type: "Payment",
    message: "Payment of $150 received",
    status: "Success",
    date: new Date(),
  },
  {
    id: "2",
    type: "Order Update",
    message: "Order #1234 shipped",
    status: "Shipped",
    date: new Date(),
  },
  {
    id: "3",
    type: "Refund",
    message: "Refund of $50 processed",
    status: "Pending",
    date: new Date(),
  },
  {
    id: "4",
    type: "Payment",
    message: "Payment of $200 received",
    status: "Success",
    date: new Date(),
  },
  {
    id: "5",
    type: "Order Update",
    message: "Order #1235 cancelled",
    status: "Cancelled",
    date: new Date(),
  },
];

function Events() {
  const [events, setEvents] = useState(sampleEvents);
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    // Apply filter based on status
    if (filterStatus) {
      setFilteredEvents(
        events.filter((event) => event.status === filterStatus)
      );
    } else {
      setFilteredEvents(events);
    }
  }, [filterStatus, events]);

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const resetFilters = () => {
    setFilterStatus("");
  };

  return (
    <div className="events-page">
      <div className="header">
        <h1>Events</h1>
        <p>
          Track events related to orders, payments, and other billing system
          activities.
        </p>
      </div>

      <div className="filter-bar">
        <div className="filter-options">
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Filter by Status</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button className="btn-clear" onClick={resetFilters}>
          <RefreshCw /> Clear Filters
        </button>
      </div>

      <div className="event-list">
        <table className="event-table">
          <thead>
            <tr>
              <th>Event Type</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.type}</td>
                  <td>{event.message}</td>
                  <td className={event.status.toLowerCase()}>{event.status}</td>
                  <td>{format(new Date(event.date), "MMM dd, yyyy HH:mm")}</td>
                  <td>
                    <button className="btn-details">
                      <Info /> Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-events">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Events;
