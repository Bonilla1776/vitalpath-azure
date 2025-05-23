// frontend/app/discovery/page.tsx - COMPLETE ACTUALLY PREMIUM VERSION ✨
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const predefinedGoals = [
  { id: "longevity", label: "Longevity", icon: "🌟", gradient: "bg-gradient-to-br from-purple-600 to-pink-600" },
  { id: "stress", label: "Stress reduction", icon: "🧘", gradient: "bg-gradient-to-br from-blue-600 to-cyan-600" },
  { id: "weight", label: "Weight management", icon: "⚖️", gradient: "bg-gradient-to-br from-green-600 to-emerald-600" },
  { id: "sleep", label: "Better sleep quality", icon: "😴", gradient: "bg-gradient-to-br from-indigo-600 to-purple-600" },
  { id: "strength", label: "Build strength and muscle", icon: "💪", gradient: "bg-gradient-to-br from-red-600 to-orange-600" },
  { id: "energy", label: "Increase daily energy", icon: "⚡", gradient: "bg-gradient-to-br from-yellow-500 to-orange-600" },
  { id: "nutrition", label: "Healthier nutrition", icon: "🥗", gradient: "bg-gradient-to-br from-green-500 to-lime-600" },
  { id: "mental", label: "Improve mental health", icon: "🧠", gradient: "bg-gradient-to-br from-teal-600 to-cyan-600" },
  { id: "cardio", label: "Boost cardiovascular fitness", icon: "❤️", gradient: "bg-gradient-to-br from-pink-600 to-red-600" },
  { id: "hobbies", label: "Explore new activities", icon: "🎨", gradient: "bg-gradient-to-br from-violet-600 to-purple-600" }
];

export default function DiscoveryPage() {
  const router = useRouter();
  
  // Animation states
  const [mounted, setMounted] = useState(false);
  const [sectionAnimating, setSectionAnimating] = useState(false);
  
  // Part 1: Basic Information
  const [preferredName, setPreferredName] = useState("");
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("");
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(6);
  const [weight, setWeight] = useState(150);
  const [location, setLocation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  
  // Part 2: Health Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  // Part 3: Wellness & Purpose Indicators (0-100 scale)
  const [indicators, setIndicators] = useState({
    fulfillment: 50,
    happiness: 50,
    energy: 50,
    stress: 50,
    sleep: 50,
    activity: 50,
    nutrition: 50,
    purpose: 50,
    motivation: 50,
    confidence: 50
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSection, setCurrentSection] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🪄 AUTO-REFRESH MAGIC - Automatically refreshes expired tokens
  const makeAuthRequest = async (url: string, options: RequestInit) => {
    const token = localStorage.getItem("access");
    
    if (!token) {
      throw new Error("Please login to continue");
    }

    // Helper function to make the actual request
    const makeRequest = async (authToken: string) => {
      return await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${authToken}`,
        },
      });
    };

    // First attempt with current token
    let response = await makeRequest(token);

    // 🔄 Auto-refresh magic happens here!
    if (response.status === 401) {
      console.log("🔄 Token expired, auto-refreshing...");
      
      const refreshToken = localStorage.getItem("refresh");
      if (!refreshToken) {
        throw new Error("SESSION_EXPIRED");
      }

      try {
        // Attempt to refresh the token
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error("REFRESH_EXPIRED");
        }

        const refreshData = await refreshResponse.json();
        localStorage.setItem("access", refreshData.access);
        
        // If refresh token was also renewed, update it
        if (refreshData.refresh) {
          localStorage.setItem("refresh", refreshData.refresh);
        }
        
        console.log("✅ Token refreshed successfully!");
        
        // Retry the original request with new token
        response = await makeRequest(refreshData.access);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        throw new Error("SESSION_EXPIRED");
      }
    }

    return response;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Check if we have any tokens at all
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");
      
      if (!accessToken && !refreshToken) {
        setError("Please login to continue");
        router.push("/login");
        return;
      }

      const discoveryData = {
        preferred_name: preferredName.trim(),
        age: age,
        gender: gender,
        height_feet: heightFeet,
        height_inches: heightInches,
        weight: weight,
        location: location.trim(),
        marital_status: maritalStatus || "",
        goal_1: selectedGoals[0] || "",
        goal_2: selectedGoals[1] || "",
        goal_3: selectedGoals[2] || "",
        baseline_fulfillment: indicators.fulfillment,
        baseline_happiness: indicators.happiness,
        baseline_energy: indicators.energy,
        baseline_stress: indicators.stress,
        baseline_sleep: indicators.sleep,
        baseline_activity: indicators.activity,
        baseline_nutrition: indicators.nutrition,
        baseline_purpose: indicators.purpose,
        baseline_motivation: indicators.motivation,
        baseline_confidence: indicators.confidence
      };

      console.log("🚀 Submitting discovery data...");

      // 🪄 Magic happens here - auto-refresh if needed!
      const discoveryResponse = await makeAuthRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/discovery/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discoveryData),
      });

      if (!discoveryResponse.ok) {
        const errorText = await discoveryResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: `Server error: ${discoveryResponse.status}` };
        }
        throw new Error(errorData.detail || `Discovery submission failed: ${discoveryResponse.status}`);
      }

      console.log("✅ Discovery data saved successfully!");

      // Create initial dashboard entry with auto-refresh magic
      try {
        const dashboardResponse = await makeAuthRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(indicators),
        });

        if (!dashboardResponse.ok) {
          console.warn("⚠️ Dashboard entry creation failed, but continuing...");
        } else {
          console.log("✅ Dashboard baseline created!");
        }
      } catch (dashboardError) {
        console.warn("⚠️ Dashboard creation error:", dashboardError);
      }

      // 🎉 Success! Navigate to dashboard
      router.push("/dashboard");
      
    } catch (err) {
      console.error("❌ Discovery submission error:", err);
      
      // Handle different error types gracefully
      if (err instanceof Error) {
        if (err.message === "SESSION_EXPIRED" || err.message === "REFRESH_EXPIRED") {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setError("Your session has expired. Redirecting to login...");
          setTimeout(() => router.push("/login"), 2000);
        } else if (err.message === "Please login to continue") {
          setError("Please login to continue");
          setTimeout(() => router.push("/login"), 1000);
        } else {
          setError(`Submission failed: ${err.message}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return preferredName.trim() && gender && location.trim() && selectedGoals.length > 0;
  };

  const nextSection = () => {
    if (currentSection < 3) {
      setSectionAnimating(true);
      setTimeout(() => {
        setCurrentSection(currentSection + 1);
        setSectionAnimating(false);
      }, 300);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setSectionAnimating(true);
      setTimeout(() => {
        setCurrentSection(currentSection - 1);
        setSectionAnimating(false);
      }, 300);
    }
  };

  const handleGoalSelection = (goalId: string) => {
    const newSelected = [...selectedGoals];
    const index = newSelected.indexOf(goalId);
    
    if (index > -1) {
      newSelected.splice(index, 1);
    } else if (newSelected.length < 3) {
      newSelected.push(goalId);
    }
    
    setSelectedGoals(newSelected);
  };

  const updateIndicator = (key: string, value: number) => {
    setIndicators(prev => ({ ...prev, [key]: value }));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8 shadow-2xl animate-bounce">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
            Welcome to Your Journey
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We&rsquo;re excited you&rsquo;re here! Let&rsquo;s create your personalized health experience. 
            Your honest answers will unlock tailored coaching designed just for you.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((section) => (
              <div key={section} className="flex items-center">
                <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-500 shadow-2xl ${
                  section <= currentSection 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white scale-110 animate-pulse' 
                    : 'bg-gray-800 text-gray-400 border-2 border-gray-600'
                }`}>
                  {section < currentSection ? '✓' : section}
                  {section <= currentSection && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-ping opacity-30"></div>
                  )}
                </div>
                {section < 3 && (
                  <div className={`w-32 h-2 mx-6 rounded-full transition-all duration-500 ${
                    section < currentSection ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <span className="text-gray-300 text-lg font-medium bg-gray-800/50 px-6 py-2 rounded-full backdrop-blur-sm">
              Step {currentSection} of 3: {
                currentSection === 1 ? '✨ About You' : 
                currentSection === 2 ? '🎯 Your Goals' : 
                '📊 Your Baseline'
              }
            </span>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-500/20 border-2 border-red-500/50 rounded-2xl backdrop-blur-sm shadow-2xl">
            <div className="flex items-center">
              <span className="text-3xl mr-4">⚠️</span>
              <div>
                <p className="text-red-300 font-bold text-lg">Oops! Something went wrong</p>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Section Content */}
        <div className={`transform transition-all duration-500 ${
          sectionAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>
          
          {/* Part 1: Basic Information */}
          {currentSection === 1 && (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 border border-white/30 shadow-2xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl mb-6 shadow-2xl">
                    <span className="text-3xl">👋</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Let&rsquo;s Get to Know You</h2>
                  <p className="text-gray-300 text-lg">Tell us a bit about yourself to personalize your experience</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-white font-semibold mb-4 text-lg">What should we call you? ✨</label>
                    <input
                      className="w-full p-6 bg-white/10 border-2 border-white/30 rounded-2xl text-white text-lg placeholder-gray-400 focus:bg-white/20 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 shadow-lg"
                      type="text"
                      placeholder="Your preferred name..."
                      value={preferredName}
                      onChange={(e) => setPreferredName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-4 text-lg">Your Age: <span className="text-cyan-400 font-bold text-2xl">{age}</span></label>
                    <input
                      type="range"
                      min="18"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value))}
                      className="w-full h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #06b6d4 0%, #8b5cf6 ${(age-18)/(100-18)*100}%, #374151 ${(age-18)/(100-18)*100}%, #374151 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>18</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-4 text-lg">Gender</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: "male", label: "Male", icon: "👨" },
                        { value: "female", label: "Female", icon: "👩" },
                        { value: "non-binary", label: "Non-binary", icon: "🧑" },
                        { value: "prefer-not-to-say", label: "Prefer not to say", icon: "❓" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setGender(option.value)}
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                            gender === option.value
                              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 border-cyan-400 text-white shadow-2xl scale-105'
                              : 'bg-white/10 border-white/30 text-gray-300 hover:bg-white/20 hover:border-white/50'
                          }`}
                        >
                          <div className="text-2xl mb-2">{option.icon}</div>
                          <div className="text-sm font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-4 text-lg">
                      Height: <span className="text-cyan-400 font-bold text-xl">{heightFeet}&apos;{heightInches}&quot;</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 block mb-2">Feet</label>
                        <input
                          type="number"
                          min="3"
                          max="7"
                          value={heightFeet}
                          onChange={(e) => setHeightFeet(parseInt(e.target.value) || 5)}
                          className="w-full p-4 bg-white/10 border-2 border-white/30 rounded-xl text-white text-center text-xl focus:bg-white/20 focus:border-cyan-400 transition-all duration-300 shadow-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-2">Inches</label>
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={heightInches}
                          onChange={(e) => setHeightInches(parseInt(e.target.value) || 6)}
                          className="w-full p-4 bg-white/10 border-2 border-white/30 rounded-xl text-white text-center text-xl focus:bg-white/20 focus:border-cyan-400 transition-all duration-300 shadow-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-4 text-lg">Weight: <span className="text-cyan-400 font-bold text-2xl">{weight} lbs</span></label>
                    <input
                      type="range"
                      min="70"
                      max="425"
                      value={weight}
                      onChange={(e) => setWeight(parseInt(e.target.value))}
                      className="w-full h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #06b6d4 0%, #8b5cf6 ${(weight-70)/(425-70)*100}%, #374151 ${(weight-70)/(425-70)*100}%, #374151 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>70 lbs</span>
                      <span>425 lbs</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white font-semibold mb-4 text-lg">Where are you located? 📍</label>
                    <input
                      className="w-full p-6 bg-white/10 border-2 border-white/30 rounded-2xl text-white text-lg placeholder-gray-400 focus:bg-white/20 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 shadow-lg"
                      type="text"
                      placeholder="City, State or Zip Code..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white font-semibold mb-4 text-lg">Relationship Status (Optional) 💕</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { value: "single", label: "Single" },
                        { value: "married", label: "Married" },
                        { value: "in-relationship", label: "In a Relationship" },
                        { value: "prefer-not-to-say", label: "Prefer not to say" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setMaritalStatus(maritalStatus === option.value ? "" : option.value)}
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                            maritalStatus === option.value
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-pink-400 text-white shadow-2xl'
                              : 'bg-white/10 border-white/30 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          <div className="text-sm font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-16">
                  <button
                    onClick={nextSection}
                    disabled={!preferredName || !gender || !location}
                    className="w-full py-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-xl rounded-2xl hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  >
                    Continue to Goals 🎯
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Part 2: Health Goals */}
          {currentSection === 2 && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 border border-white/30 shadow-2xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl mb-6 shadow-2xl">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Choose Your Health Goals</h2>
                  <p className="text-gray-300 text-lg">Select up to 3 goals that excite you most (tap to select/deselect)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {predefinedGoals.map((goal, index) => {
                    const isSelected = selectedGoals.includes(goal.id);
                    const priority = selectedGoals.indexOf(goal.id) + 1;
                    
                    return (
                      <button
                        key={goal.id}
                        onClick={() => handleGoalSelection(goal.id)}
                        disabled={!isSelected && selectedGoals.length >= 3}
                        className={`relative p-8 rounded-3xl border-2 transition-all duration-500 transform hover:scale-105 ${
                          isSelected
                            ? `${goal.gradient} border-white/50 text-white shadow-2xl scale-105`
                            : 'bg-white/10 border-white/30 text-gray-300 hover:bg-white/20 hover:border-white/50'
                        } ${!isSelected && selectedGoals.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''} group`}
                        style={{
                          animationDelay: `${index * 100}ms`
                        }}
                      >
                        {isSelected && (
                          <div className="absolute -top-3 -right-3 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg shadow-2xl">
                            {priority}
                          </div>
                        )}
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {goal.icon}
                        </div>
                        <div className="font-semibold text-lg leading-tight">
                          {goal.label}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedGoals.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-white font-bold mb-6 text-xl">Selected Goals Priority:</h3>
                    <div className="flex flex-wrap gap-4">
                      {selectedGoals.map((goalId, index) => {
                        const goal = predefinedGoals.find(g => g.id === goalId);
                        return (
                          <div key={goalId} className={`flex items-center px-6 py-3 rounded-full ${goal?.gradient} text-white font-medium shadow-2xl`}>
                            <span className="mr-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            {goal?.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex space-x-6">
                  <button
                    onClick={prevSection}
                    className="flex-1 py-6 bg-white/10 border-2 border-white/30 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextSection}
                    disabled={selectedGoals.length === 0}
                    className="flex-1 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xl rounded-2xl hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  >
                    Continue to Assessment 📊
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Part 3: Wellness Indicators */}
          {currentSection === 3 && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 border border-white/30 shadow-2xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 to-pink-500 rounded-3xl mb-6 shadow-2xl">
                    <span className="text-3xl">📊</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Your Wellness Baseline</h2>
                  <p className="text-gray-300 text-lg">Rate how you feel right now (0-100). This becomes your starting point for tracking progress!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { key: 'fulfillment', label: 'Life Fulfillment', icon: '✨', question: 'How fulfilled do you feel in life?', gradient: 'from-purple-500 to-pink-500' },
                    { key: 'happiness', label: 'Overall Happiness', icon: '😊', question: 'How happy do you feel overall?', gradient: 'from-yellow-500 to-orange-500' },
                    { key: 'energy', label: 'Daily Energy', icon: '⚡', question: 'How energetic are you most days?', gradient: 'from-blue-500 to-cyan-500' },
                    { key: 'stress', label: 'Stress Management', icon: '🧘', question: 'How well do you manage stress?', gradient: 'from-green-500 to-emerald-500' },
                    { key: 'sleep', label: 'Sleep Quality', icon: '😴', question: 'How well are you sleeping?', gradient: 'from-indigo-500 to-purple-500' },
                    { key: 'activity', label: 'Physical Activity', icon: '🏃', question: 'How active are you weekly?', gradient: 'from-red-500 to-pink-500' },
                    { key: 'nutrition', label: 'Nutrition Quality', icon: '🥗', question: 'How healthy is your diet?', gradient: 'from-lime-500 to-green-500' },
                    { key: 'purpose', label: 'Life Purpose', icon: '🎯', question: 'How clear is your life\'s purpose?', gradient: 'from-violet-500 to-purple-500' },
                    { key: 'motivation', label: 'Motivation to Change', icon: '🚀', question: 'How motivated are you to improve?', gradient: 'from-orange-500 to-red-500' },
                    { key: 'confidence', label: 'Confidence in Change', icon: '💪', question: 'How confident are you in creating your future self?', gradient: 'from-teal-500 to-cyan-500' }
                  ].map((indicator, index) => (
                    <div 
                      key={indicator.key} 
                      className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/10 transition-all duration-300 shadow-2xl"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${indicator.gradient} flex items-center justify-center text-2xl mr-6 shadow-2xl`}>
                          {indicator.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-xl">{indicator.label}</h3>
                          <p className="text-gray-400 text-sm">{indicator.question}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-400 font-medium">Current Level</span>
                          <span className={`text-3xl font-bold bg-gradient-to-r ${indicator.gradient} bg-clip-text text-transparent`}>
                            {indicators[indicator.key as keyof typeof indicators]}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={indicators[indicator.key as keyof typeof indicators]}
                          onChange={(e) => updateIndicator(indicator.key, parseInt(e.target.value))}
                          className="w-full h-4 bg-gray-700 rounded-full appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(147, 51, 234) ${indicators[indicator.key as keyof typeof indicators]}%, rgb(55, 65, 81) ${indicators[indicator.key as keyof typeof indicators]}%, rgb(55, 65, 81) 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>0 (Lowest)</span>
                          <span>100 (Highest)</span>
                        </div>
                      </div>
                      
                      <div className={`h-3 rounded-full bg-gradient-to-r ${indicator.gradient} opacity-20 relative overflow-hidden`}>
                        <div 
                          className={`h-full bg-gradient-to-r ${indicator.gradient} transition-all duration-500 ease-out shadow-lg`}
                          style={{ width: `${indicators[indicator.key as keyof typeof indicators]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-6 mt-16">
                  <button
                    onClick={prevSection}
                    className="flex-1 py-6 bg-white/10 border-2 border-white/30 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid()}
                    className="flex-1 py-6 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold text-xl rounded-2xl hover:from-pink-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-2xl relative overflow-hidden group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mr-4"></div>
                        Creating Your Experience...
                      </div>
                    ) : (
                      <>
                        <span className="relative z-10">Complete Setup & Launch Dashboard 🚀</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
          transition: all 0.3s ease;
        }
        
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.3);
          box-shadow: 0 12px 24px rgba(139, 92, 246, 0.6);
        }
        
        .slider-thumb::-moz-range-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-track {
          background: transparent;
          height: 16px;
          border-radius: 8px;
        }
        
        input[type="range"]::-moz-range-track {
          background: transparent;
          height: 16px;
          border-radius: 8px;
          border: none;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}