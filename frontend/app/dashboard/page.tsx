// frontend/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please login.");
      return;
    }

    fetch("${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const message = await res.text();
          throw new Error(`Server error: ${message}`);
        }
        return res.json();
      })
      .then(setEntries)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-4 animate-slide-up">
      <h1 className="text-2xl font-bold">My Progress</h1>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-2">
        {entries.map((entry, idx) => (
          <li key={idx} className="bg-white p-4 rounded shadow">
            {new Date(entry.timestamp).toLocaleString()} — Energy: {entry.energy}
          </li>
        ))}
      </ul>
    </div>
  );
}
