"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserCard from "@/components/userCard";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  userType: "Admin" | "User";
  memberSince: string;
}

export default function ViewUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Could not load users. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
          <button
            onClick={() => router.push("/home")}
            className="p-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        {loading && <p className="text-gray-500">Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p className="text-gray-500">No users found.</p>
        )}

        <div className="grid gap-4">
          {users.map((user) => (
            <UserCard key={user._id} user={user} onRefresh={fetchUsers} />
          ))}
        </div>

      </div>
    </main>
  );
}