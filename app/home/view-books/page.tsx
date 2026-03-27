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

  function startEdit(book: Book) {
    setEditingBookId(book._id);
    setMessage("");
    setError("");
    setEditForm({
      title: book.title,
      author: book.author,
      genre: book.genre || "",
      publisher: book.publisher || "",
      location: book.location || "",
      total: book.copies.total,
      avail: book.copies.avail,
      reserved: book.copies.reserved,
    });
  }
  function cancelEdit() {
    setEditingBookId(null);
  }

  async function handleUpdate(bookId: string) {
    setMessage("");
    setError("");

    const res = await fetch(`/api/books/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editForm.title,
        author: editForm.author,
        genre: editForm.genre,
        publisher: editForm.publisher,
        location: editForm.location,
        copies: {
          total: Number(editForm.total),
          avail: Number(editForm.avail),
          reserved: Number(editForm.reserved),
        },
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Book updated successfully!");
      setEditingBookId(null);
      fetchBooks();
    } else {
      setError(data.error || "Failed to update book.");
    }
  }
  async function handleDelete(bookId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (!confirmed) return;

    setMessage("");
    setError("");

    const res = await fetch(`/api/books/${bookId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Book deleted successfully!");
      setBooks(books.filter((book) => book._id !== bookId));
    } else {
      setError(data.error || "Failed to delete book.");
    }
  }

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
            <div key={book._id} className="bg-white shadow-md rounded-xl p-6">
              {editingBookId === book._id ? (
                <div className="grid gap-3">
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="p-2 rounded-lg bg-gray-200 text-gray-900"
                    placeholder="Title"
                  />
                  <input
                    value={editForm.author}
                    onChange={(e) =>
                      setEditForm({ ...editForm, author: e.target.value })
                    }
                    className="p-2 rounded-lg bg-gray-200 text-gray-900"
                    placeholder="Author"
                  />
                  <input
                    value={editForm.genre}
                    onChange={(e) =>
                      setEditForm({ ...editForm, genre: e.target.value })
                    }
                    className="p-2 rounded-lg bg-gray-200 text-gray-900"
                    placeholder="Genre"
                  />
                  <input
                    value={editForm.publisher}
                    onChange={(e) =>
                      setEditForm({ ...editForm, publisher: e.target.value })
                    }
                    className="p-2 rounded-lg bg-gray-200 text-gray-900"
                    placeholder="Publisher"
                  />
                  <input
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="p-2 rounded-lg bg-gray-200 text-gray-900"
                    placeholder="Location"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      value={editForm.total}
                      onChange={(e) =>
                        setEditForm({ ...editForm, total: Number(e.target.value) })
                      }
                      className="p-2 rounded-lg bg-gray-200 text-gray-900"
                      placeholder="Total"
                    />
                    <input
                      type="number"
                      value={editForm.avail}
                      onChange={(e) =>
                        setEditForm({ ...editForm, avail: Number(e.target.value) })
                      }
                      className="p-2 rounded-lg bg-gray-200 text-gray-900"
                      placeholder="Available"
                    />
                    <input
                      type="number"
                      value={editForm.reserved}
                      onChange={(e) =>
                        setEditForm({ ...editForm, reserved: Number(e.target.value) })
                      }
                      className="p-2 rounded-lg bg-gray-200 text-gray-900"
                      placeholder="Reserved"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate(book._id)}
                      className="p-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-900 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{book.title}</h2>
                    <p className="text-gray-600">by {book.author}</p>
                    <p className="text-gray-500 text-sm mt-1">ISBN: {book.ISBN}</p>
                    {book.genre && (
                      <p className="text-gray-500 text-sm">Genre: {book.genre}</p>
                    )}
                    {book.location && (
                      <p className="text-gray-500 text-sm">Location: {book.location}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total: {book.copies.total}</p>
                    <p className="text-sm text-green-600 font-semibold">
                      Available: {book.copies.avail}
                    </p>
                    <p className="text-sm text-yellow-600">
                      Reserved: {book.copies.reserved}
                    </p>

                    <div className="flex gap-2 mt-4 justify-end">
                      <button
                        onClick={() => startEdit(book)}
                        className="p-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="p-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}