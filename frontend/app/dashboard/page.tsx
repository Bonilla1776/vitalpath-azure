// frontend/app/dashboard/page.tsx - ENHANCED VERSION
"use client";

import { useEffect, useState } from "react";

interface MetricEntry {
  id: number;
  timestamp: string;
  fulfillment: number;
  happiness: number;  
  energy: number;
  stress: number;
  sleep: number;
  activity: number;
  nutrition: number;
  purpose: number;
  motivation: number;
  confidence: number;
}

interface DiscoveryData {
  preferred_name: string;
  goal_1: string;
  goal_2: string;
  goal_3: string;
  baseline_fulfillment: number;
  baseline_happiness: number;
  baseline_energy: number;
  baseline_stress: number;
  baseline_sleep: number;
  baseline_activity: number;
  baseline_nutrition: number;
  baseline_purpose: number;
  baseline_motivation: number;
  baseline_confidence: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricEntry[]>([]);
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        // Fetch discovery data (goals and baseline)
        const discoveryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/discovery/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (discoveryResponse.ok) {
          const discovery = await discoveryResponse.json();
          setDiscoveryData(discovery);
        }

        // Fetch progress metrics
        const metricsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!metricsResponse.ok) {
          throw new Error(`API Error: ${metricsResponse.status}`);
        }

        const data = await metricsResponse.json();
        console.log("Dashboard API Response:", data);
        
        if (Array.isArray(data)) {
          setMetrics(data);
        } else {
          console.warn("API returned non-array data:", data);
          setMetrics([]);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProgressChange = (current: number, baseline: number) => {
    const change = current - baseline;
    return {
      value: change,
      isPositive: change > 0,
      isNeutral: change === 0
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Your VitalPath Dashboard</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-300 rounded mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Your VitalPath Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const latestEntry = metrics.length > 0 ? metrics[0] : null;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Welcome back{discoveryData?.preferred_name ? `, ${discoveryData.preferred_name}` : ''}!
        </h1>
        <p className="text-gray-600">Track your progress on your health journey.</p>
      </div>

      {/* Health Goals Section */}
      {discoveryData && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Your Health Goals</h2>
          <div className="space-y-3">
            {discoveryData.goal_1 && (
              <div className="flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                <span className="font-medium">{discoveryData.goal_1}</span>
              </div>
            )}
            {discoveryData.goal_2 && (
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                <span className="font-medium">{discoveryData.goal_2}</span>
              </div>
            )}
            {discoveryData.goal_3 && (
              <div className="flex items-center">
                <span className="bg-blue-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                <span className="font-medium">{discoveryData.goal_3}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Wellness Indicators */}
      {latestEntry && discoveryData && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-600">Current Wellness Indicators</h2>
            <span className="text-sm text-gray-500">Last updated: {formatDate(latestEntry.timestamp)}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { key: 'fulfillment', label: 'Fulfillment', current: latestEntry.fulfillment, baseline: discoveryData.baseline_fulfillment },
              { key: 'happiness', label: 'Happiness', current: latestEntry.happiness, baseline: discoveryData.baseline_happiness },
              { key: 'energy', label: 'Energy', current: latestEntry.energy, baseline: discoveryData.baseline_energy },
              { key: 'stress', label: 'Stress Management', current: latestEntry.stress, baseline: discoveryData.baseline_stress },
              { key: 'sleep', label: 'Sleep Quality', current: latestEntry.sleep, baseline: discoveryData.baseline_sleep },
              { key: 'activity', label: 'Physical Activity', current: latestEntry.activity, baseline: discoveryData.baseline_activity },
              { key: 'nutrition', label: 'Nutrition Quality', current: latestEntry.nutrition, baseline: discoveryData.baseline_nutrition },
              { key: 'purpose', label: 'Sense of Purpose', current: latestEntry.purpose, baseline: discoveryData.baseline_purpose },
              { key: 'motivation', label: 'Motivation to Change', current: latestEntry.motivation, baseline: discoveryData.baseline_motivation },
              { key: 'confidence', label: 'Confidence in Change', current: latestEntry.confidence, baseline: discoveryData.baseline_confidence }
            ].map((indicator) => {
              const progress = getProgressChange(indicator.current, indicator.baseline);
              return (
                <div key={indicator.key} className="bg-gray-50 rounded-lg p-4 text-center">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{indicator.label}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{indicator.current}</div>
                  <div className="text-xs text-gray-500 mb-2">Baseline: {indicator.baseline}</div>
                  <div className={`text-sm font-medium ${
                    progress.isPositive ? 'text-green-600' : 
                    progress.isNeutral ? 'text-gray-500' : 'text-red-600'
                  }`}>
                    {progress.isPositive ? '+' : ''}{progress.value}
                    {progress.isPositive && ' ↗️'}
                    {progress.value < 0 && ' ↘️'}
                    {progress.isNeutral && ' →'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress History */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-600">Progress History</h2>
          <span className="text-sm text-gray-500">{metrics.length} total entries</span>
        </div>
        
        {metrics.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No progress entries yet.</p>
            <a 
              href="/dashboard/update" 
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Record Your First Update
            </a>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {metrics.map((entry, index) => (
              <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">
                    Entry #{metrics.length - index} 
                    {index === 0 && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Latest</span>}
                  </h3>
                  <span className="text-sm text-gray-500">{formatDate(entry.timestamp)}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  <div>Fulfillment: <span className="font-medium">{entry.fulfillment}</span></div>
                  <div>Happiness: <span className="font-medium">{entry.happiness}</span></div>
                  <div>Energy: <span className="font-medium">{entry.energy}</span></div>
                  <div>Stress Mgmt: <span className="font-medium">{entry.stress}</span></div>
                  <div>Sleep: <span className="font-medium">{entry.sleep}</span></div>
                  <div>Activity: <span className="font-medium">{entry.activity}</span></div>
                  <div>Nutrition: <span className="font-medium">{entry.nutrition}</span></div>
                  <div>Purpose: <span className="font-medium">{entry.purpose}</span></div>
                  <div>Motivation: <span className="font-medium">{entry.motivation}</span></div>
                  <div>Confidence: <span className="font-medium">{entry.confidence}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <a 
          href="/dashboard/update" 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Update Your Progress
        </a>
        <button 
          onClick={() => window.location.reload()} 
          className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 font-medium"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}
