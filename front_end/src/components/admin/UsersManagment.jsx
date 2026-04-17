import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from "./usersmanagment.module.css";

export default function UsersManagment() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("All Users");
  useEffect(() => {
    const fetchUsers = async () => {
      setUsers([]);
      try {
        let url = "http://localhost:3030/admin/allUsers";
        if (role === "Chiefs") url = "http://localhost:3030/admin/role/Chief";
        else if (role === "Halls_Owner")
          url = "http://localhost:3030/admin/role/Hall_Owner";
        else if (role === "Customers")
          url = "http://localhost:3030/admin/role/Customer";

        const response = await axios.get(url, { withCredentials: true });
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [role]);

  const handleToggleActive = async (userId, userActive) => {
    const newStatus = userActive === 1 ? 0 : 1;
    try {
      const response = await axios.put(
        "http://localhost:3030/admin/deactivate",
        { userId, status: newStatus },
        { withCredentials: true },
      );

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === userId ? { ...u, is_active: newStatus } : u,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };
  return (
    <div>
      <div className={classes.filterSection}>
        <label>Filter by Role: </label>
        <select
          className={classes.filterSelect}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="All Users">All Users</option>
          <option value="Chiefs">Chiefs</option>
          <option value="Halls_Owner">Halls Owners</option>
          <option value="Customers">Customers</option>
        </select>
      </div>
      {users.length === 0 ? (
        <p>No users found for this category.</p>
      ) : (
        <table className={classes.customtable}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td
                  style={{
                    color: user.is_active ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {user.is_active === 1 ? "Active" : "Inactive"}
                </td>
                <td>
                  <button
                    onClick={() => handleToggleActive(user.id, user.is_active)}
                    className={
                      user.is_active
                        ? classes.deactivateBtn
                        : classes.activateBtn
                    }
                  >
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
