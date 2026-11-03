import { useState } from "react";
import { useProfile, getInitials, getAvatarColor } from "../context/ProfileContext";

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

export default function ProfileSetupModal({ onClose, mode = "setup" }) {
  const { profile, updateProfile } = useProfile();
  const [form, setForm] = useState({ ...profile });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required.";
    if (!form.studentId.trim()) e.studentId = "Student ID is required.";
    if (!form.department) e.department = "Select your department.";
    if (!form.year) e.year = "Select your year.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    updateProfile(form);
    onClose();
  };

  const initials = getInitials(form.name);
  const avatarColor = getAvatarColor(form.name);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal profile-setup-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="profile-setup-header">
          <div className="profile-avatar-preview" style={{ background: avatarColor }}>
            {initials}
          </div>
          <div>
            <h2 className="modal-title">
              {mode === "setup" ? "Set Up Your Profile" : "Edit Profile"}
            </h2>
            <p className="profile-setup-sub">
              {mode === "setup"
                ? "Create your student profile to track your registrations."
                : "Update your profile information."}
            </p>
          </div>
        </div>

        <form className="reg-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ps-name">Full Name *</label>
              <input
                id="ps-name"
                type="text"
                placeholder="e.g. Arjun Sharma"
                value={form.name}
                onChange={handleChange("name")}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="ps-email">Email Address *</label>
              <input
                id="ps-email"
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
              <label htmlFor="ps-sid">Student ID *</label>
              <input
                id="ps-sid"
                type="text"
                placeholder="e.g. CS2023045"
                value={form.studentId}
                onChange={handleChange("studentId")}
                className={errors.studentId ? "input-error" : ""}
              />
              {errors.studentId && <span className="field-error">{errors.studentId}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="ps-phone">Phone Number</label>
              <input
                id="ps-phone"
                type="tel"
                placeholder="10-digit number"
                value={form.phone}
                onChange={handleChange("phone")}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ps-dept">Department *</label>
              <select
                id="ps-dept"
                value={form.department}
                onChange={handleChange("department")}
                className={errors.department ? "input-error" : ""}
              >
                <option value="">Select department…</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="ps-year">Year *</label>
              <select
                id="ps-year"
                value={form.year}
                onChange={handleChange("year")}
                className={errors.year ? "input-error" : ""}
              >
                <option value="">Select year…</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              {errors.year && <span className="field-error">{errors.year}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="ps-bio">Bio (optional)</label>
            <textarea
              id="ps-bio"
              placeholder="Tell us a little about yourself…"
              value={form.bio}
              onChange={handleChange("bio")}
              rows={3}
            />
          </div>

          <button type="submit" className="btn-submit" id="save-profile">
            {mode === "setup" ? "✓ Create Profile" : "✓ Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
