import React, { useState } from "react";

const statuses = ["active", "inactive", "pending"];

export default function StatusFilter({ onChange }) {
  const [selected, setSelected] = useState([]);

  const toggleStatus = status => {
    const updated = selected.includes(status)
      ? selected.filter(s => s !== status)
      : [...selected, status];
    setSelected(updated);
    onChange(updated);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {statuses.map(status => (
        <label key={status} style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={selected.includes(status)}
            onChange={() => toggleStatus(status)}
          />
          {status}
        </label>
      ))}
    </div>
  );
}
