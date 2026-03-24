"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {

  // Search bar function
  const [query, setQuery] = useState("");

  const handleSearch = async() => {
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();

    if (!query.trim()) return;
    window.location.href = `/search?q=${query}`;

    console.log(data);
  };

  // logout button
  const logout = async () => {
    await fetch("/api/logout");
    window.location.href = "/"
  };


  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">

      <div className="w-full flex justify-end mb-4">
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-6xl text-center">

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Library Management System
        </h1>

        <p className="text-gray-700 mb-6">Welcome to the library admin dashboard</p>
        <p className="text-gray-700 mb-6">Search for users or books</p>

        <div className="flex gap-2 mb-8">
          <input type="text" placeholder="Search users or books..." value={query} 
          onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="flex-1 p-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch} className="bg-gray-200 text-gray-900 px-6 rounded-lg hover:bg-blue-500 hover:text-white transition"
            >
              Search
          </button>
        </div>
          
        <ul className="grid grid-cols-2 gap-4">
          <li>
            <Link href="/home/add-book" className="block p-4 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-900 cursor-pointer transition">
              Add Books
            </Link>
          </li>
          <li>
            <Link href="/home/view-books" className="block p-4 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-900 cursor-pointer transition">
              View Books
            </Link>
          </li>
          <li>
            <Link href="/home/borrow-books" className="block p-4 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-900 cursor-pointer transition">
              Borrow Books
            </Link>
          </li>
          <li>
            <Link href="/home/return-books" className="block p-4 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-900 cursor-pointer transition">
              Return Books
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}