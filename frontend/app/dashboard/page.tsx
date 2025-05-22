"use client";

import { useEffect, useState } from "react";

interface MetricEntry {
  id: number;
  timestamp: string;
  energy: number;
  // Add other metrics as needed
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricEntry[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => res.json())
      .then((data: MetricEntry[]) => setMetrics(data))
      .catch((err) => console.error("Failed to load metrics:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {metrics.map((entry) => (
        <div key={entry.id} className="mb-2">
          <p>{entry.timestamp} - Energy: {entry.energy}</p>
        </div>
      ))}
    </div>
  );
}

