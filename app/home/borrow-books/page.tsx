"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Book {
  _id: string;
  title: string;
  author: string;
  ISBN: string;
  copies: { total: number; avail: number; reserved: number };
}

export default function BorrowBooks() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberEmail, setMemberEmail] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data.filter((b: Book) => b.copies.avail > 0));
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  async function handleBorrow(e: React.FormEvent) {
    e.preventDefault();
    setMessage(""); setError("");

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: selectedBook, memberEmail }),
    });

    if (res.ok) {
      setMessage("Book borrowed successfully!");
      setMemberEmail(""); setSelectedBook("");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Borrow a Book</h1>
          <button onClick={() => router.push("/home")}
            className="p-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer">
            ← Back
          </button>
        </div>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleBorrow} className="flex flex-col gap-4">
          <input
            type="email" placeholder="Member Email *" value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)} required
            className="p-2 rounded-lg bg-gray-200 text-gray-900" />

          <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} required
            className="p-2 rounded-lg bg-gray-200 text-gray-900">
            <option value="">-- Select a Book --</option>
            {loading ? (
              <option disabled>Loading books...</option>
            ) : (
              books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} by {book.author} (Available: {book.copies.avail})
                </option>
              ))
            )}
          </select>

          <button type="submit"
            className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition cursor-pointer">
            Borrow Book
          </button>
        </form>
      </div>
    </main>
  );
}