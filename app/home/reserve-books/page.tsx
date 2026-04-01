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

export default function ReserveBooks() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const selectedBookData = books.find((book) => book._id === selectedBook);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        if (!res.ok) {
          throw new Error("Failed to fetch books.");
        }
        const data = await res.json();
        setBooks(data);
      } 
      catch (error) {
        setFetchError("Could not load reservable books right now. Please try again later.");
      }
      finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  async function handleReserve(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId: selectedBook,
        memberEmail,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Book reserved successfully!");
      setMemberEmail("");
      setSelectedBook("");
    } else {
      setError(data.error || "Failed to reserve book.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reserve a Book</h1>
          <button
            onClick={() => router.push("/home")}
            className="p-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}
        {!loading && !fetchError && books.length === 0 && (
          <p className="text-gray-600 mb-4">
            No books were found in the database yet.
          </p>
        )}

        <form onSubmit={handleReserve} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Member Email *"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            required
            className="p-2 rounded-lg bg-gray-200 text-gray-900"
          />

          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            required
            disabled={loading || books.length === 0}
            className="p-2 rounded-lg bg-gray-200 text-gray-900"
          >
            <option value="">-- Select a Book to Reserve --</option>
            {loading ? (
              <option disabled>Loading books...</option>
            ) : (
              books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} by {book.author} (Available: {book.copies.avail}, Reserved: {book.copies.reserved})
                </option>
              ))
            )}
          </select>
          {selectedBookData && (
            <p className="text-sm text-gray-600">
              {selectedBookData.copies.avail === 0
                ? "This book can be reserved."
                : "This book still has available copies. The reservations are allowed only when available copies are 0."}
            </p>
          )}

          <button
            type="submit"
            disabled={!selectedBook || (selectedBookData?.copies.avail ?? 0) > 0}
            className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition cursor-pointer"
          >
            Reserve Book
          </button>
        </form>
      </div>
    </main>
  );
}
