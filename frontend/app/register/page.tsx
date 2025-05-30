"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Registration failed");

      router.push("/consent");
    } catch {
      setError("Registration failed or email already exists");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <input
        className="p-2 border mb-2 w-64 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="p-2 border mb-4 w-64 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded shadow"
        onClick={handleRegister}
      >
        Register
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}

