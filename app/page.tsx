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
  async function handleSubmit(e: React.SyntheticEvent) {

    e.preventDefault();

    // connection to api, sends email and password
    const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    });

    //debugging in browswer console
    const data = await res.json();
    console.log(data);

    if (res.ok) {
      router.push("/home");
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
            <input className="text-gray-700 p-1 rounded-lg bg-gray-200"
            type = "text"
            placeholder = "Email"
            onChange = {(e) => setEmail(e.target.value)}
            />

            <input className="text-gray-700 p-1 rounded-lg bg-gray-200"
            type = "password"
            placeholder = "Password"
            onChange = {(e) => setPassword(e.target.value)}
            />

            <button className="p-3 rounded-lg bg-gray-200 hover:bg-blue-500 text-gray-900 hover:text-gray-100 cursor-pointer transition" type = "submit">Login</button>
          </form>

          </div>
        </div>
      </div>
    </main> 

  );
}