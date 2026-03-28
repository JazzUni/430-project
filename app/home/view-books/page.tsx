"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookCard from "@/components/bookCard";

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
  const [message, setMessage] = useState("");
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    genre: "",
    publisher: "",
    location: "",
    total: 1,
    avail: 1,
    reserved: 0,
  });

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
  useEffect(() => {
    fetchBooks();
  }, []);

  
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Books</h1>
          <button
            onClick={() => router.push("/home")}
            className="p-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        {loading && <p className="text-gray-500">Loading books...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && books.length === 0 && (
          <p className="text-gray-500">No books found. Add some books first!</p>
        )}

        <div className="grid gap-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onRefresh={fetchBooks} />
           ))}
        </div>
      </div>
    </main>
  );
}