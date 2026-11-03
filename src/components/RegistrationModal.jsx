import { useState } from "react";
import { useRegistrations } from "../context/RegistrationContext";
import { useEvents } from "../context/EventContext";
import { formatDate, getCapacityPercent } from "../utils/helpers";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Business Administration",
  "Arts & Science",
  "Law",
  "Medicine",
  "Other",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Postgraduate"];

const EMPTY_FORM = {
  name: "",
  email: "",
  studentId: "",
  department: "",
  year: "",
  phone: "",
};

export default function RegistrationModal({ event, onClose, onSuccess }) {
  const { addRegistration, isAlreadyRegistered } = useRegistrations();
  const { incrementRegistered } = useEvents();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!event) return null;

  const capacityPct = getCapacityPercent(event.registered, event.capacity);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required.";
    if (!form.studentId.trim()) e.studentId = "Student ID is required.";
    if (!form.department) e.department = "Select your department.";
    if (!form.year) e.year = "Select your year.";
    if (form.phone && !form.phone.match(/^\d{10}$/)) e.phone = "Enter a valid 10-digit phone number.";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (isAlreadyRegistered(event.id, form.email)) {
      setErrors({ email: "You have already registered for this event with this email." });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const reg = addRegistration(form, event.id);
      incrementRegistered(event.id);
      setSubmitting(false);
      onSuccess(reg);
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal reg-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="reg-modal-header">
          <h2 className="modal-title">Register for Event</h2>
          <div className="reg-event-info">
            <img src={event.image} alt={event.title} className="reg-event-thumb" />
            <div>
              <p className="reg-event-title">{event.title}</p>
              <p className="reg-event-meta">📅 {formatDate(event.date)} · 🕐 {event.time}</p>
              <p className="reg-event-meta">📍 {event.location}</p>
              <div className="reg-capacity">
                <div className="capacity-bar" style={{ marginTop: "6px" }}>
                  <div
                    className="capacity-fill"
                    style={{
                      width: `${capacityPct}%`,
                      background: capacityPct >= 90 ? "#FF6584" : capacityPct >= 70 ? "#FFB347" : "#4ECDC4",
                    }}
                  />
                </div>
                <span className="reg-seats">{event.capacity - event.registered} seats remaining</span>
              </div>
            </div>
          </div>
        </div>

        <form className="reg-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-name">Full Name *</label>
              <input
                id="reg-name"
                type="text"
                placeholder="e.g. Arjun Sharma"
                value={form.name}
                onChange={handleChange("name")}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email Address *</label>
              <input
                id="reg-email"
                type="email"
                placeholder="e.g. arjun@college.edu"
                value={form.email}
                onChange={handleChange("email")}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-sid">Student ID *</label>
              <input
                id="reg-sid"
                type="text"
                placeholder="e.g. CS2023045"
                value={form.studentId}
                onChange={handleChange("studentId")}
                className={errors.studentId ? "input-error" : ""}
              />
              {errors.studentId && <span className="field-error">{errors.studentId}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number</label>
              <input
                id="reg-phone"
                type="tel"
                placeholder="10-digit number"
                value={form.phone}
                onChange={handleChange("phone")}
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-dept">Department *</label>
              <select
                id="reg-dept"
                value={form.department}
                onChange={handleChange("department")}
                className={errors.department ? "input-error" : ""}
              >
                <option value="">Select department…</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="reg-year">Year *</label>
              <select
                id="reg-year"
                value={form.year}
                onChange={handleChange("year")}
                className={errors.year ? "input-error" : ""}
              >
                <option value="">Select year…</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              {errors.year && <span className="field-error">{errors.year}</span>}
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={submitting} id="submit-registration">
            {submitting ? (
              <span className="spinner-text">⏳ Registering…</span>
            ) : (
              "✓ Confirm Registration"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
