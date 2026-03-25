"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminLog {
  _id: string;
  userId?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
  };
  action: string;
  target?: string;
  targetId?: string;
  timestamp: string;
}

export default function AdminLogPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/adminlog");
        if (!res.ok) throw new Error("Failed to fetch admin logs");
        const data: AdminLog[] = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
        setError("Could not load admin logs. Check your connection.");
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Logs</h1>
          <button
            onClick={() => router.push("/home")}
            className="p-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading logs...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && logs.length === 0 && (
          <p className="text-gray-500">No admin logs found.</p>
        )}

        <div className="grid gap-4">
          {logs.map((log) => (
            <div key={log._id} className="bg-white shadow-md rounded-xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {log.action}
                  </h2>
                  <p className="text-gray-600">
                    Admin: {log.userId?.firstName || "Unknown"} {log.userId?.lastName || ""} ({log.userId?._id})
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Target: {log.target || "-"} ({log.targetId || "-"})
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Time: {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}