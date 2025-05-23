// frontend/app/discovery/page.tsx - COMPLETE UPDATED VERSION
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const predefinedGoals = [
  "Longevity",
  "Stress reduction", 
  "Weight management",
  "Better sleep quality",
  "Build strength and muscle",
  "Increase daily energy",
  "Healthier nutrition",
  "Improve mental health and resilience",
  "Boost cardiovascular fitness",
  "Explore new activities/hobbies"
];

export default function DiscoveryPage() {
  const router = useRouter();
  
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
  const [goal1, setGoal1] = useState("");
  const [goal2, setGoal2] = useState("");  
  const [goal3, setGoal3] = useState("");
  const [customGoal1, setCustomGoal1] = useState("");
  const [customGoal2, setCustomGoal2] = useState("");
  const [customGoal3, setCustomGoal3] = useState("");
  
  // Part 3: Wellness & Purpose Indicators (0-100 scale)
  const [fulfillment, setFulfillment] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [stress, setStress] = useState(50);
  const [sleep, setSleep] = useState(50);
  const [activity, setActivity] = useState(50);
  const [nutrition, setNutrition] = useState(50);
  const [purpose, setPurpose] = useState(50);
  const [motivation, setMotivation] = useState(50);
  const [confidence, setConfidence] = useState(50);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSection, setCurrentSection] = useState(1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setError("Authentication required");
        return;
      }

      // Prepare discovery data
      const discoveryData = {
        // Basic Information
        preferred_name: preferredName.trim(),
        age: age,
        gender: gender,
        height_feet: heightFeet,
        height_inches: heightInches,
        weight: weight,
        location: location.trim(),
        marital_status: maritalStatus || "",
        
        // Health Goals (use custom if provided, otherwise use selected)
        goal_1: (customGoal1 || goal1).trim(),
        goal_2: (customGoal2 || goal2).trim(),
        goal_3: (customGoal3 || goal3).trim(),
        
        // Wellness & Purpose Indicators (baseline)
        baseline_fulfillment: fulfillment,
        baseline_happiness: happiness,
        baseline_energy: energy,
        baseline_stress: stress,
        baseline_sleep: sleep,
        baseline_activity: activity,
        baseline_nutrition: nutrition,
        baseline_purpose: purpose,
        baseline_motivation: motivation,
        baseline_confidence: confidence
      };

      console.log("Submitting discovery data:", discoveryData); // Debug log

      // Submit discovery data
      const discoveryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/discovery/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(discoveryData),
      });

      console.log("Discovery response status:", discoveryResponse.status); // Debug log

      if (!discoveryResponse.ok) {
        const errorText = await discoveryResponse.text();
        console.error("Discovery error response:", errorText); // Debug log
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: `Server error: ${discoveryResponse.status}` };
        }
        
        throw new Error(errorData.detail || `Discovery submission failed: ${discoveryResponse.status}`);
      }

      const discoveryResult = await discoveryResponse.json();
      console.log("Discovery success:", discoveryResult); // Debug log

      // Create initial dashboard entry with baseline data
      const dashboardResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fulfillment,
          happiness,
          energy,
          stress,
          sleep,
          activity,
          nutrition,
          purpose,
          motivation,
          confidence
        }),
      });

      if (!dashboardResponse.ok) {
        console.warn("Dashboard entry creation failed, but continuing...");
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Discovery submission error:", err);
      setError(`Submission failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return preferredName.trim() && gender && location.trim() && (goal1 || customGoal1);
  };

  const nextSection = () => {
    if (currentSection < 3) setCurrentSection(currentSection + 1);
  };

  const prevSection = () => {
    if (currentSection > 1) setCurrentSection(currentSection - 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome to Your Health Journey!</h1>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          We&rsquo;re excited you&rsquo;re here. Before we get started, we&rsquo;d like to learn a bit about you. 
          Your honest answers will help us tailor our coaching and ensure you get the support you need. Let&rsquo;s begin!
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((section) => (
            <div key={section} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  section <= currentSection 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {section}
              </div>
              {section < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  section < currentSection ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-sm text-gray-500">
          Step {currentSection} of 3: {
            currentSection === 1 ? 'Basic Information' : 
            currentSection === 2 ? 'Health Goals' : 
            'Wellness Assessment'
          }
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Part 1: Basic Information */}
      {currentSection === 1 && (
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-8 text-blue-600">Part 1: Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Preferred Name *</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                placeholder="What would you like us to call you?"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Age: {age} *</label>
              <input
                type="range"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>18</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender *</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Height: {heightFeet}&apos;{heightInches}&quot; *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Feet</label>
                  <input
                    type="number"
                    min="3"
                    max="7"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(parseInt(e.target.value) || 5)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Inches</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(parseInt(e.target.value) || 6)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="6"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter whole numbers only</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Weight: {weight} lbs *</label>
              <input
                type="range"
                min="70"
                max="425"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>70 lbs</span>
                <span>425 lbs</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Location (Zip Code or City) *</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                placeholder="e.g., 72205 or Little Rock, AR"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Marital Status (Optional)</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
              >
                <option value="">Select Status (Optional)</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
                <option value="in-relationship">In a Relationship</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={nextSection}
              disabled={!preferredName || !gender || !location}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              Continue to Health Goals →
            </button>
          </div>
        </section>
      )}

      {/* Part 2: Health Goals */}
      {currentSection === 2 && (
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">Part 2: Top Three Health Goals</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Select and rank your top three health goals (1, 2, 3). You can also write in your own if it&rsquo;s not listed.
          </p>

          <div className="space-y-6">
            {/* Goal 1 */}
            <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
              <h3 className="font-semibold mb-4 text-blue-700 text-lg">🥇 Goal #1 (Most Important) *</h3>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={goal1}
                onChange={(e) => setGoal1(e.target.value)}
              >
                <option value="">Select your top priority goal</option>
                {predefinedGoals.map((goal) => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
                <option value="other">Other (specify below)</option>
              </select>
              {goal1 === "other" && (
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="text"
                  placeholder="Describe your custom goal"
                  value={customGoal1}
                  onChange={(e) => setCustomGoal1(e.target.value)}
                />
              )}
            </div>

            {/* Goal 2 */}
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-gray-700 text-lg">🥈 Goal #2 (Second Priority)</h3>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={goal2}
                onChange={(e) => setGoal2(e.target.value)}
              >
                <option value="">Select your second priority goal</option>
                {predefinedGoals.filter(goal => goal !== goal1).map((goal) => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
                <option value="other">Other (specify below)</option>
              </select>
              {goal2 === "other" && (
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="text"
                  placeholder="Describe your custom goal"
                  value={customGoal2}
                  onChange={(e) => setCustomGoal2(e.target.value)}
                />
              )}
            </div>

            {/* Goal 3 */}
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-gray-700 text-lg">🥉 Goal #3 (Third Priority)</h3>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={goal3}
                onChange={(e) => setGoal3(e.target.value)}
              >
                <option value="">Select your third priority goal</option>
                {predefinedGoals.filter(goal => goal !== goal1 && goal !== goal2).map((goal) => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
                <option value="other">Other (specify below)</option>
              </select>
              {goal3 === "other" && (
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="text"
                  placeholder="Describe your custom goal"
                  value={customGoal3}
                  onChange={(e) => setCustomGoal3(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={prevSection}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              ← Back
            </button>
            <button
              onClick={nextSection}
              disabled={!goal1 && !customGoal1}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Continue to Wellness Assessment →
            </button>
          </div>
        </section>
      )}

      {/* Part 3: Wellness & Purpose Indicators */}
      {currentSection === 3 && (
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">Part 3: Wellness &amp; Purpose</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Rate how you feel right now on a scale from 0 (lowest) to 100 (highest). This will be your baseline for tracking progress.
          </p>

          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-6 text-blue-600">💪 Wellness Indicators</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Fulfillment: <span className="text-blue-600 font-bold">{fulfillment}</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-3">&ldquo;How fulfilled do you feel in life?&rdquo;</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fulfillment}
                    onChange={(e) => setFulfillment(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Not at all)</span>
                    <span>100 (Completely)</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Happiness: <span className="text-blue-600 font-bold">{happiness}</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-3">&ldquo;How happy do you feel overall?&rdquo;</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={happiness}
                    onChange={(e) => setHappiness(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Very unhappy)</span>
                    <span>100 (Very happy)</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Energy: <span className="text-blue-600 font-bold">{energy}</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-3">&ldquo;How energetic are you on most days?&rdquo;</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energy}
                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (No energy)</span>
                    <span>100 (Very energetic)</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Stress Management: <span className="text-blue-600 font-bold">{stress}</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-3">&ldquo;How well do you manage stress?&rdquo; (higher = better)</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stress}
                    onChange={(e) => setStress(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Very stressed)</span>
                    <span>100 (Very calm)</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Sleep Quality: <span className="text-blue-600 font-bold">{sleep}</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-3">&ldquo;How well are you sleeping?&rdquo;</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sleep}
                    onChange={(e) => setSleep(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Very poor)</span>
                    <span>100 (Excellent)</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Physical Activity: <span className="text-blue-600 font-bold">{activity}</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-3">&ldquo;How active are you weekly?&rdquo;</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activity}
                    onChange={(e) => setActivity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Not active)</span>
                    <span>100 (Very active)</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Nutrition Quality: <span className="text-blue-600 font-bold">{nutrition}</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-3">&ldquo;How healthy is your diet?&rdquo;</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={nutrition}
                    onChange={(e) => setNutrition(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Very poor)</span>
                    <span>100 (Excellent)</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-blue-600">🎯 Purpose Indicators</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Sense of Purpose: <span className="text-blue-600 font-bold">{purpose}</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-3">&ldquo;How clear is your life&rsquo;s purpose?&rdquo;</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={purpose}
                    onChange={(e) => setPurpose(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Very unclear)</span>
                    <span>100 (Very clear)</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">
                    Motivation to Change: <span className="text-blue-600 font-bold">{motivation}</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-3">&ldquo;How motivated are you to make positive changes?&rdquo;</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={motivation}
                    onChange={(e) => setMotivation(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Not motivated)</span>
                    <span>100 (Very motivated)</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Confidence in Change: <span className="text-blue-600 font-bold">{confidence}</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-3">&ldquo;How confident are you that you can create the future-self you desire?&rdquo;</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Not confident)</span>
                    <span>100 (Very confident)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={prevSection}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Your Dashboard...
                </div>
              ) : (
                "Complete Setup & Go to Dashboard 🚀"
              )}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}