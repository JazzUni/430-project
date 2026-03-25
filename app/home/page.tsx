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
        <div className="text-center border-b pb-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Library Management Dashboard
        </h1>

        <p className="text-gray-500 mt-2 text-lg">Manage books, users, and system activity</p>
        </div><br/>

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
        
        <section className="bg-gray-50 rounded-xl p-6 text-left">
          <h2 className="text-xl font-semibold mb-4 text-gray-900" >
            Book Management
          </h2>
          <div className="w-10 h-1 bg-blue-500 rounded mb-4"></div>
          
          <div className="grid grid-cols-2 gap-4 ">
              <Link href="/home/add-book" className="block p-4 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-900 cursor-pointer transition">
                Add Books
              </Link>
              <button className="block p-4 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed text-center">
                Update Books (Coming Soon)
              </button>
              <button className="block p-4 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed text-center">
                Remove Books (Coming Soon)
              </button>
              <Link href="/home/view-books" className="block p-4 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-900 cursor-pointer transition">
                View Books
              </Link>
              <Link href="/home/borrow-books" className="block p-4 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-900 cursor-pointer transition">
                Borrow Books
              </Link>
              <Link href="/home/return-books" className="block p-4 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-900 cursor-pointer transition">
                Return Books
              </Link>
              <button className="block p-4 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed text-center">
                Reserve Books (Coming Soon)
              </button>
          </div>
        </section><br/>

        <section className="bg-gray-50 rounded-xl p-6 text-left">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            User Management  
          </h2>
          <div className="w-10 h-1 bg-blue-500 rounded mb-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <button className="block p-4 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed text-center">
              Add User (Coming Soon)
            </button>
            <button className="block p-4 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed text-center">
              Remove User (Coming Soon)
            </button>
            <button className="block p-4 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed text-center">
              Update User (Coming Soon)
            </button>
          </div>

        </section><br/>

        <section className="bg-gray-50 rounded-xl p-6 text-left">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Other Tools
          </h2>
          <div className="w-10 h-1 bg-blue-500 rounded mb-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/adminlog" className="block p-4 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-900 cursor-pointer transition">
                Admin Log
            </Link>
          </div>
        </section>
          
      </div>
    </main>
  );
}