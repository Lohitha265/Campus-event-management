import { useState } from "react";
import { useRegistrations } from "../context/RegistrationContext";
import { useEvents } from "../context/EventContext";
import { exportToCSV } from "../utils/helpers";

export default function RegistrationsList() {
  const { registrations, deleteRegistration } = useRegistrations();
  const { events } = useEvents();
  const [search, setSearch] = useState("");
  const [filterEvent, setFilterEvent] = useState("all");

  const filtered = registrations.filter((r) => {
    const event = events.find((e) => e.id === r.eventId);
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase());
    const matchEvent = filterEvent === "all" || r.eventId === filterEvent;
    return matchSearch && matchEvent;
  });

  return (
    <div className="reg-list-section">
      <div className="reg-list-header">
        <h2>📋 All Registrations</h2>
        <div className="reg-list-controls">
          <input
            type="text"
            placeholder="Search by name, email, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="reg-list-search"
            id="reg-search"
          />
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="sort-select"
            id="reg-filter-event"
          >
            <option value="all">All Events</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
          <button
            className="btn-export"
            onClick={() => exportToCSV(filtered, events)}
            id="export-csv"
            disabled={filtered.length === 0}
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No registrations yet</h3>
          <p>Registrations will appear here once students sign up.</p>
        </div>
      ) : (
        <div className="reg-table-wrap">
          <table className="reg-table">
            <thead>
              <tr>
                <th>Reg ID</th>
                <th>Event</th>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Department</th>
                <th>Year</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const event = events.find((e) => e.id === r.eventId);
                return (
                  <tr key={r.id}>
                    <td><code className="reg-id">{r.id.slice(0, 12)}…</code></td>
                    <td><span className="reg-event-name">{event?.title || r.eventId}</span></td>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.studentId}</td>
                    <td>{r.department}</td>
                    <td>{r.year}</td>
                    <td>{r.phone || "—"}</td>
                    <td>{new Date(r.registeredAt).toLocaleDateString("en-IN")}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => deleteRegistration(r.id)}
                        id={`del-reg-${r.id}`}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="reg-count">{filtered.length} registration{filtered.length !== 1 ? "s" : ""} shown</p>
        </div>
      )}
    </div>
  );
}
