export function generateId() {
  return "reg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
}

export function formatDate(dateStr) {
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-IN", options);
}

export function formatShortDate(dateStr) {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-IN", options);
}

export function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr);
  eventDate.setHours(0, 0, 0, 0);
  const diff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Past Event";
  if (diff === 0) return "Today!";
  if (diff === 1) return "Tomorrow";
  return `${diff} days away`;
}

export function getCapacityPercent(registered, capacity) {
  return Math.min(Math.round((registered / capacity) * 100), 100);
}

export function getCapacityColor(percent) {
  if (percent >= 90) return "#FF6584";
  if (percent >= 70) return "#FFB347";
  return "#4ECDC4";
}

export function exportToCSV(registrations, events) {
  const rows = [
    ["Registration ID", "Event Title", "Name", "Email", "Student ID", "Department", "Year", "Phone", "Registered At"],
  ];
  registrations.forEach((r) => {
    const event = events.find((e) => e.id === r.eventId);
    rows.push([
      r.id,
      event ? event.title : r.eventId,
      r.name,
      r.email,
      r.studentId,
      r.department,
      r.year,
      r.phone,
      new Date(r.registeredAt).toLocaleString("en-IN"),
    ]);
  });
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "registrations.csv";
  a.click();
  URL.revokeObjectURL(url);
}
