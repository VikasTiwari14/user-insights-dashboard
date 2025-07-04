import React, { useEffect, useState } from "react";
import UserTable from "./components/UserTable.jsx";
import StatusFilter from "./components/StatusFilter.jsx";
import SearchBox from "./components/SearchBox.jsx";
import { fetchUsers } from "./utils/mockApi";

export default function App() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setFiltered(users);
      return;
    }

    const data = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(data);
  };

  const handleStatuses = () => {
    if (!statuses.length) {
      setFiltered(users);
      return;
    }

    const data = users.filter(user => statuses.includes(user.status));
    setFiltered(data);
  };

  const handleSort = () => {
    const data = users.sort((a, b) =>
      sortAsc ? a.lastLogin.localeCompare(b.lastLogin) : b.lastLogin.localeCompare(a.lastLogin)
    );
    setFiltered(data);
  };

  useEffect(() => {
    handleSearch();
  }, [users, search]);

  useEffect(() => {
    handleStatuses();
  }, [users, statuses]);

  useEffect(() => {
    handleSort();
  }, [users, sortAsc]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>User Insights Dashboard</h2>
      <SearchBox onSearch={setSearch} />
      <StatusFilter onChange={setStatuses} />
      <UserTable users={filtered} onToggleSort={() => setSortAsc(!sortAsc)} />
      {!filtered.length && <p>No users found</p>}
    </div>
  );
}
