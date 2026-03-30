"use client";
import './styles.css';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {

  // route to home page if logged in
  const router = useRouter();

  // email and pass constants set to '' by default
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // handle login form submit
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    // connection to api, sends email and password
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/home");

    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // UI
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">
        <div className="center-text">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Library Management System
            </h1>
            <p className="text-gray-700 mb-6">
              Welcome to the Library Management System dashboard<br />
              Please login to continue
            </p>

            <form className="form" onSubmit={handleSubmit}>
              <input
                className="text-gray-700 p-2 rounded-lg bg-gray-200"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="text-gray-700 p-2 rounded-lg bg-gray-200"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                className={`p-3 rounded-lg transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-blue-500 text-gray-900 hover:text-gray-100"
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main> 
  );
}