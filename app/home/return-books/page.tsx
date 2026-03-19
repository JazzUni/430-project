"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReturnBooks() {
  const router = useRouter();
  const [memberEmail, setMemberEmail] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setTransactions([]);
    try {
      const res = await fetch(`/api/transactions?email=${memberEmail}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTransactions(data);
    } catch {
      setError("Could not find transactions.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReturn(transactionId: string) {
    setMessage(""); setError("");
    const res = await fetch("/api/transactions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    });
    if (res.ok) {
      setMessage("Book returned successfully!");
      setTransactions(transactions.filter((t) => t._id !== transactionId));
    } else {
      setError("Failed to return book.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Return a Book</h1>
          <button onClick={() => router.push("/home")}
            className="p-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer">
            ← Back
          </button>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input type="email" placeholder="Enter member email" value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)} required
              className="flex-1 p-2 rounded-lg bg-gray-200 text-gray-900" />
            <button type="submit"
              className="p-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition cursor-pointer">
              Search
            </button>
          </form>
        </div>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-gray-500">Searching...</p>}

        {transactions.length > 0 && (
          <div className="grid gap-4">
            {transactions.map((t) => (
              <div key={t._id} className="bg-white shadow-md rounded-xl p-6 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">{t.bookISBN}</p>
                  <p className="text-gray-500 text-sm">Borrowed: {new Date(t.borrowDate).toLocaleDateString()}</p>
                  <p className="text-gray-500 text-sm">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleReturn(t._id)}
                  className="p-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white transition cursor-pointer">
                  Return
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && transactions.length === 0 && memberEmail && (
          <p className="text-gray-500">No active borrows found for this email.</p>
        )}
      </div>
    </main>
  );
}