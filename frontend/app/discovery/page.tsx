// FIXED: frontend/app/discovery/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DiscoveryPage() {
  const router = useRouter();
  const [goal1, setGoal1] = useState("");
  const [goal2, setGoal2] = useState("");
  const [goal3, setGoal3] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("access");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/discovery/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        goal_1: goal1, 
        goal_2: goal2, 
        goal_3: goal3 
      }),
    });
    router.push("/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto p-6 animate-slide-up">
      <h1 className="text-xl font-bold mb-4">Tell Us About Yourself</h1>
      <input
        className="p-2 border w-full mb-4 rounded"
        type="text"
        placeholder="Goal 1"
        value={goal1}
        onChange={(e) => setGoal1(e.target.value)}
      />
      <input
        className="p-2 border w-full mb-4 rounded"
        type="text"
        placeholder="Goal 2"
        value={goal2}
        onChange={(e) => setGoal2(e.target.value)}
      />
      <input
        className="p-2 border w-full mb-4 rounded"
        type="text"
        placeholder="Goal 3"
        value={goal3}
        onChange={(e) => setGoal3(e.target.value)}
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded shadow">
        Continue to Dashboard
      </button>
    </div>
  );
}

