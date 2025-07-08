import React, { useState, useEffect } from "react";
import debounce from "../utils/debounce";

export default function SearchBox({ onSearch }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const delayed = debounce(() => onSearch(input), 500);
    delayed();
  }, [input]);

  return (
    <input
      type="text"
      data-testid="search-input"
      placeholder="Search by name or email"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      style={{ padding: "8px", width: "100%", maxWidth: "400px" }}
    />
  );
}
