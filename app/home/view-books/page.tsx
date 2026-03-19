"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Book {
  _id: string;
  title: string;
  author: string;
  ISBN: string;
  genre?: string;
  publisher?: string;
  location?: string;
  copies: { total: number; avail: number; reserved: number };
}

export default function ViewBooks() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        setError("Could not load books. Check your connection.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Books</h1>
          <button onClick={() => router.push("/home")}
            className="p-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer">
            ← Back
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading books...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && books.length === 0 && (
          <p className="text-gray-500">No books found. Add some books first!</p>
        )}

        <div className="grid gap-4">
          {books.map((book) => (
            <div key={book._id} className="bg-white shadow-md rounded-xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{book.title}</h2>
                  <p className="text-gray-600">by {book.author}</p>
                  <p className="text-gray-500 text-sm mt-1">ISBN: {book.ISBN}</p>
                  {book.genre && <p className="text-gray-500 text-sm">Genre: {book.genre}</p>}
                  {book.location && <p className="text-gray-500 text-sm">Location: {book.location}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total: {book.copies.total}</p>
                  <p className="text-sm text-green-600 font-semibold">Available: {book.copies.avail}</p>
                  <p className="text-sm text-yellow-600">Reserved: {book.copies.reserved}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}