"use client";

import { useState, useEffect } from "react";

export default function UserCard({ user, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editForm, setEditForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
    userType: user.userType,
  });

  async function handleUpdate() {
    setLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user._id, ...editForm }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("User updated successfully!");
      setEditing(false);
      onRefresh?.();
    } else {
      setError(data.error || "Failed to update user.");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this user?")) return;

    setMessage("");
    setError("");

    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user._id }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("User deleted successfully!");
      onRefresh?.();
    } else {
      setError(data.error || "Failed to delete user.");
    }
  }

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
    <div className="bg-white shadow-md rounded-xl p-6">

      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {editing ? (
        <div className="grid gap-3">

          <input
            value={editForm.firstName}
            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
            placeholder="First Name"
            className="p-2 rounded-lg bg-gray-200 text-gray-900"
          />

          <input
            value={editForm.lastName}
            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
            placeholder="Last Name"
            className="p-2 rounded-lg bg-gray-200 text-gray-900"
          />

          <input
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            placeholder="Email"
            className="p-2 rounded-lg bg-gray-200 text-gray-900"
          />

          <input
            value={editForm.phoneNumber}
            onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
            placeholder="Phone"
            className="p-2 rounded-lg bg-gray-200 text-gray-900"
          />

          <input
            value={editForm.address}
            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            placeholder="Address"
            className="p-2 rounded-lg bg-gray-200 text-gray-900"
          />

          <select
            value={editForm.userType}
            onChange={(e) => setEditForm({ ...editForm, userType: e.target.value })}
            className="p-2 rounded-lg bg-gray-200 text-gray-900"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="p-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition cursor-pointer"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => {
                setEditing(false);
                setEditForm({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phoneNumber: user.phoneNumber || "",
                  address: user.address || "",
                  userType: user.userType,
                });
              }}
              className="p-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-900 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">Role: {user.userType}</p>
          </div>

          <div className="flex gap-2 mt-4 justify-end">
            <button
              onClick={() => setEditing(true)}
              className="p-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition cursor-pointer"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="p-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}