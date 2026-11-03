import { useState } from "react";
import { useEvents } from "../context/EventContext";
import { formatShortDate } from "../utils/helpers";

const CATEGORIES = ["Tech", "Academic", "Cultural", "Sports", "Workshop"];

const EMPTY_FORM = {
  title: "",
  category: "Tech",
  date: "",
  time: "",
  location: "",
  capacity: "",
  description: "",
  image: "",
  tags: "",
  speakers: "",
};

export default function AdminPanel({ events, onEdit, editingEvent, setEditingEvent, onAddSuccess }) {
  const { addEvent, updateEvent } = useEvents();
  const [form, setForm] = useState(editingEvent ? {
    ...editingEvent,
    tags: editingEvent.tags?.join(", ") || "",
    speakers: editingEvent.speakers?.join(", ") || "",
  } : EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("add");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Event title is required.";
    if (!form.date) e.date = "Date is required.";
    if (!form.time.trim()) e.time = "Time is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.capacity || isNaN(form.capacity) || +form.capacity < 1) e.capacity = "Valid capacity required.";
    if (!form.description.trim()) e.description = "Description is required.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      ...form,
      capacity: parseInt(form.capacity),
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      speakers: form.speakers ? form.speakers.split(",").map((s) => s.trim()).filter(Boolean) : [],
      image: form.image || `https://placehold.co/800x400/6C63FF/ffffff?text=${encodeURIComponent(form.category)}`,
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, payload);
      setEditingEvent(null);
      onAddSuccess("Event updated successfully!");
    } else {
      addEvent(payload);
      onAddSuccess("New event added successfully!");
    }
    setForm(EMPTY_FORM);
    setErrors({});
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>⚙ Admin Panel</h2>
        <p className="admin-subtitle">Manage campus events</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "add" ? "admin-tab-active" : ""}`}
          onClick={() => setActiveTab("add")}
          id="tab-add-event"
        >
          {editingEvent ? "✏ Edit Event" : "+ Add Event"}
        </button>
        <button
          className={`admin-tab ${activeTab === "manage" ? "admin-tab-active" : ""}`}
          onClick={() => setActiveTab("manage")}
          id="tab-manage"
        >
          📋 All Events ({events.length})
        </button>
      </div>

      {activeTab === "add" && (
        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="admin-title">Event Title *</label>
              <input
                id="admin-title"
                type="text"
                placeholder="e.g. Tech Fest 2026"
                value={form.title}
                onChange={handleChange("title")}
                className={errors.title ? "input-error" : ""}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="admin-category">Category *</label>
              <select
                id="admin-category"
                value={form.category}
                onChange={handleChange("category")}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="admin-date">Date *</label>
              <input
                id="admin-date"
                type="date"
                value={form.date}
                onChange={handleChange("date")}
                className={errors.date ? "input-error" : ""}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="admin-time">Time *</label>
              <input
                id="admin-time"
                type="text"
                placeholder="e.g. 10:00 AM"
                value={form.time}
                onChange={handleChange("time")}
                className={errors.time ? "input-error" : ""}
              />
              {errors.time && <span className="field-error">{errors.time}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="admin-location">Location *</label>
              <input
                id="admin-location"
                type="text"
                placeholder="e.g. Main Auditorium, Block A"
                value={form.location}
                onChange={handleChange("location")}
                className={errors.location ? "input-error" : ""}
              />
              {errors.location && <span className="field-error">{errors.location}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="admin-capacity">Capacity *</label>
              <input
                id="admin-capacity"
                type="number"
                placeholder="e.g. 200"
                value={form.capacity}
                onChange={handleChange("capacity")}
                min="1"
                className={errors.capacity ? "input-error" : ""}
              />
              {errors.capacity && <span className="field-error">{errors.capacity}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-desc">Description *</label>
            <textarea
              id="admin-desc"
              placeholder="Describe the event…"
              value={form.description}
              onChange={handleChange("description")}
              rows={4}
              className={errors.description ? "input-error" : ""}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="admin-speakers">Speakers (comma separated)</label>
              <input
                id="admin-speakers"
                type="text"
                placeholder="e.g. Dr. John, Prof. Jane"
                value={form.speakers}
                onChange={handleChange("speakers")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="admin-tags">Tags (comma separated)</label>
              <input
                id="admin-tags"
                type="text"
                placeholder="e.g. AI, Workshop, Tech"
                value={form.tags}
                onChange={handleChange("tags")}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-image">Image URL (optional)</label>
            <input
              id="admin-image"
              type="url"
              placeholder="https://…"
              value={form.image}
              onChange={handleChange("image")}
            />
          </div>

          <div className="admin-form-actions">
            {editingEvent && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setEditingEvent(null); setForm(EMPTY_FORM); }}
              >
                Cancel Edit
              </button>
            )}
            <button type="submit" className="btn-primary" id="admin-submit">
              {editingEvent ? "✓ Update Event" : "+ Add Event"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "manage" && (
        <div className="admin-event-list">
          {events.map((event) => (
            <div key={event.id} className="admin-event-row">
              <img
                src={event.image}
                alt={event.title}
                className="admin-event-thumb"
                onError={(e) => { e.target.src = "https://placehold.co/60x60/6C63FF/fff?text=E"; }}
              />
              <div className="admin-event-info">
                <p className="admin-event-title">{event.title}</p>
                <p className="admin-event-meta">{event.category} · {formatShortDate(event.date)} · {event.registered}/{event.capacity} registered</p>
              </div>
              <div className="admin-row-actions">
                <button className="btn-edit" onClick={() => { onEdit(event); setActiveTab("add"); }} id={`admin-edit-${event.id}`}>✏</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
