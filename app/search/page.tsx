"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BookCard from "@/components/bookCard";

export default function SearchPage() {

    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const router = useRouter();

    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [userTransactions, setUserTransactions] = useState<any>({});

    useEffect(() => {
        if (!query) return;

    const fetchResults = async () => {
        setLoading(true);
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
        setLoading(false);
    };

    fetchResults();
    }, [query]);

    const toggleUser = async (userId: string) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
            return;
        }

        setExpandedUser(userId);

        if (!userTransactions[userId]) {
            const res = await fetch(`/api/users/${userId}/transactions`);
            const data = await res.json();
        

        setUserTransactions((prev: any) => ({
            ...prev,
            [userId]: data,
        }));
    }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-8">

            <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl text-gray-900 font-bold mb-4">
            Results for "{query}"
            </h1>

            {loading && <p className="text-gray-500">Searching...</p>}

            <div className="w-full flex justify-end mb-4">
                <button onClick={() => router.push("/home")}
                className="p-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer ">
                ← Back
                </button>
            </div>

            {results?.users?.length > 0 && (
            <div className="mb-8">
                <h2 className="text-xl text-gray-900 font-semibold mb-2">Users</h2>

                <div className="grid gap-4 hover:shadow-lg transition">
                    {results.users.map((user: any) => (
                        <div
                        key={user._id}
                        className="bg-white shadow-md rounded-xl p-6 cursor-pointer"
                        onClick={() => toggleUser(user._id)}
                        >
                        <div className="flex justify-between items-start ">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <p className="text-gray-600">{user.email}</p>
                                <p className="text-gray-600">{user.phoneNumber}</p>
                            </div>
                        </div>
                        
                        {expandedUser === user._id && (
                            <div className="mt-4 border-t pt-4">
                                <h3 className="font-semibold mb-2 text-gray-900">Borrowed Books</h3>

                                {!userTransactions[user._id] ? (
                                    <p className="text-gray-500">Loading...</p>
                                ) : userTransactions[user._id].length > 0 ? (
                                    <ul className="list-disc pl-5 text-gray-500">
                                        {userTransactions[user._id].map((t: any) => (
                                            <li key={t._id}>
                                                {t.book?.title} by {t.book?.author} | Due Date: {t.dueDate.split("T")[0]}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No active loans</p>
                                )}
                            </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

            {results?.books?.length > 0 && (
                <div>
                    <h2 className="text-xl text-gray-900 font-semibold mb-4">Books</h2>
                    <div className="grid gap-4 hover:shadow-lg transition">
                        {results.books.map((book: any) => (
                            <BookCard
                            key={book._id}
                            book={book}
                            onRefresh={async () => {
                                const res = await fetch(`/api/search?q=${query}`);
                                const data = await res.json();
                                setResults(data);
                            }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {!loading &&
            results &&
            results.users.length === 0 &&
            results.books.length === 0 && (
                <p className="text-gray-500 mt-4">
                    No Results found.
                </p>
            )}
    </div>
    </main>
  );
}