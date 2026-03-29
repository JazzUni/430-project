"use client";
import "../styles.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {

  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      router.push("/");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">
        <div className="center-text">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Library Management System
            </h1>

            <p className="text-gray-700 mb-6">
              Fill in your details below
            </p>

            <form className="form" onSubmit={handleSubmit}>
              <input
                className="text-gray-700 p-2 rounded-lg bg-gray-200"
                type="text"
                placeholder="First Name"
                required
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                className="text-gray-700 p-2 rounded-lg bg-gray-200"
                type="text"
                placeholder="Last Name"
                required
                onChange={(e) => setLastName(e.target.value)}
              />

              <input
                className="text-gray-700 p-2 rounded-lg bg-gray-200"
                type="text"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="text-gray-700 p-2 rounded-lg bg-gray-200"
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="p-3 rounded-lg bg-gray-200 hover:bg-blue-500 text-gray-900 hover:text-gray-100 cursor-pointer transition"
                type="submit"
              >
                Register
              </button>
            </form>

            {/* Back to login */}
            <p className="mt-4 text-gray-700">
              Already have an account?{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}