import React from "react";

export default function UserTable({ users, onToggleSort }) {
  return (
    <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th onClick={onToggleSort} style={{ cursor: "pointer" }}>Last Login ⬍</th>
        </tr>
      </thead>
      <tbody data-testid="user-table-body">
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.status}</td>
            <td>{user.lastLogin}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
