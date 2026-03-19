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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/home");
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {["title","author","ISBN","genre","publisher","location"].map((field) => (
            <input key={field} name={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              onChange={handleChange}
              className="p-2 rounded-lg bg-gray-200 text-gray-900"
              required={["title","author","ISBN"].includes(field)}
            />
          ))}
          <input name="copies.total" type="number" min={1} placeholder="Total Copies"
            onChange={(e) => setForm({ ...form, copies: { ...form.copies, total: +e.target.value, avail: +e.target.value } })}
            className="p-2 rounded-lg bg-gray-200 text-gray-900"
          />
          <button type="submit"
            className="p-3 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-900 transition cursor-pointer">
            Add Book
          </button>
          <button type="button" onClick={() => router.push("/home")}
            className="p-3 rounded-lg bg-gray-100 hover:bg-gray-300 text-gray-700 transition cursor-pointer">
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}