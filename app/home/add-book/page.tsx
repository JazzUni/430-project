"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBook() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", author: "", ISBN: "", genre: "",
    publisher: "", description: "", location: "",
    copies: { total: 1, avail: 1, reserved: 0 },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess("Book added successfully!");
      setForm({ title: "", author: "", ISBN: "", genre: "", publisher: "", description: "", location: "", copies: { total: 1, avail: 1, reserved: 0 } });
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add a Book</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="title" placeholder="Title *" value={form.title}
            onChange={handleChange} required
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="author" placeholder="Author *" value={form.author}
            onChange={handleChange} required
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="ISBN" placeholder="ISBN *" value={form.ISBN}
            onChange={handleChange} required
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="genre" placeholder="Genre" value={form.genre}
            onChange={handleChange}
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="publisher" placeholder="Publisher" value={form.publisher}
            onChange={handleChange}
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="location" placeholder="Location / Section" value={form.location}
            onChange={handleChange}
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <input name="copies" type="number" min={1} placeholder="Total Copies"
            onChange={(e) => setForm({ ...form, copies: { total: +e.target.value, avail: +e.target.value, reserved: 0 } })}
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <button type="submit"
            className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition cursor-pointer">
            Add Book
          </button>

          <button type="button" onClick={() => router.push("/home")}
            className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer">
            ← Back to Dashboard
          </button>
        </form>
      </div>
    </main>
  );
}