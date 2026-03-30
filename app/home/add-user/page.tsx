"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddUser() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    userType: "User",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess("User added successfully!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        userType: "User",
      });
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add User</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input name="firstName" placeholder="First Name *"
            value={form.firstName} onChange={handleChange} required
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="lastName" placeholder="Last Name *"
            value={form.lastName} onChange={handleChange} required
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="email" type="email" placeholder="Email *"
            value={form.email} onChange={handleChange} required
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="password" type="password" placeholder="Password *"
            value={form.password} onChange={handleChange} required
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="phoneNumber" placeholder="Phone Number"
            value={form.phoneNumber} onChange={handleChange}
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="address" placeholder="Address"
            value={form.address} onChange={handleChange}
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <select name="userType"
            value={form.userType}
            onChange={handleChange}
            className="p-2 rounded-lg bg-gray-200 text-gray-900">

            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit"
            className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition cursor-pointer">
            Add User
          </button>

          <button type="button"
            onClick={() => router.push("/home")}
            className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer">
            ← Back to Dashboard
          </button>

        </form>
      </div>
    </main>
  );
}