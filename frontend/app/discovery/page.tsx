// frontend/app/discovery/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DiscoveryPage() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("access_token");
    await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/discovery/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ age, goal }),
    });
    router.push("/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto p-6 animate-slide-up">
      <h1 className="text-xl font-bold mb-4">Tell Us About Yourself</h1>
      <input
        className="p-2 border w-full mb-4 rounded"
        type="number"
        placeholder="Your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        className="p-2 border w-full mb-4 rounded"
        type="text"
        placeholder="What is your primary health goal?"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded shadow">
        Continue to Dashboard
      </button>
    </div>
  );
}
