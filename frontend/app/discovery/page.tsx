// frontend/app/discovery/page.tsx - COMPLETE VERSION
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
        preferred_name: preferredName,
        age: age,
        gender: gender,
        height_feet: heightFeet,
        height_inches: heightInches,
        weight: weight,
        location: location,
        marital_status: maritalStatus,
        
        // Health Goals (use custom if provided, otherwise use selected)
        goal_1: customGoal1 || goal1,
        goal_2: customGoal2 || goal2,
        goal_3: customGoal3 || goal3,
        
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

      // Submit discovery data
      const discoveryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/discovery/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(discoveryData),
      });

      if (!discoveryResponse.ok) {
        const errorData = await discoveryResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || `Discovery submission failed: ${discoveryResponse.status}`);
      }

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
      setError(err instanceof Error ? err.message : "Failed to submit discovery data");
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
    <div className="max-w-3xl mx-auto p-6 animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome to Your Health Journey!</h1>
        <p className="text-gray-600 leading-relaxed">
          We're excited you're here. Before we get started, we'd like to learn a bit about you. 
          Your honest answers will help us tailor our coaching and ensure you get the support you need. Let's begin!
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {[1, 2, 3].map((section) => (
            <div
              key={section}
              className={`w-3 h-3 rounded-full ${
                section <= currentSection ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Part 1: Basic Information */}
      {currentSection === 1 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Part 1: Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Name *</label>
              <input
                className="w-full p-3 border rounded-lg"
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
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>18</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender *</label>
              <select
                className="w-full p-3 border rounded-lg"
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
                Height: {heightFeet}' {heightInches}" *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Feet</label>
                  <input
                    type="range"
                    min="3"
                    max="7"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>3'</span>
                    <span>7'</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Inches</label>
                  <input
                    type="range"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0"</span>
                    <span>11"</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Weight: {weight} lbs *</label>
              <input
                type="range"
                min="70"
                max="425"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>70 lbs</span>
                <span>425 lbs</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location (Zip Code or City) *</label>
              <input
                className="w-full p-3 border rounded-lg"
                type="text"
                placeholder="e.g., 72205 or Little Rock, AR"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Marital Status</label>
              <select
                className="w-full p-3 border rounded-lg"
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

          <button
            onClick={nextSection}
            disabled={!preferredName || !gender || !location}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Health Goals
          </button>
        </section>
      )}

      {/* Part 2: Health Goals */}
      {currentSection === 2 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Part 2: Top Three Health Goals</h2>
          <p className="text-center text-gray-600 mb-6">
            Select and rank your top three health goals (1, 2, 3). You can also write in your own if it's not listed.
          </p>

          <div className="space-y-6">
            {/* Goal 1 */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-blue-600">Goal #1 (Most Important) *</h3>
              <select
                className="w-full p-3 border rounded-lg mb-3"
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
                  className="w-full p-3 border rounded-lg"
                  type="text"
                  placeholder="Describe your custom goal"
                  value={customGoal1}
                  onChange={(e) => setCustomGoal1(e.target.value)}
                />
              )}
            </div>

            {/* Goal 2 */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-blue-600">Goal #2 (Second Priority)</h3>
              <select
                className="w-full p-3 border rounded-lg mb-3"
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
                  className="w-full p-3 border rounded-lg"
                  type="text"
                  placeholder="Describe your custom goal"
                  value={customGoal2}
                  onChange={(e) => setCustomGoal2(e.target.value)}
                />
              )}
            </div>

            {/* Goal 3 */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-blue-600">Goal #3 (Third Priority)</h3>
              <select
                className="w-full p-3 border rounded-lg mb-3"
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
                  className="w-full p-3 border rounded-lg"
                  type="text"
                  placeholder="Describe your custom goal"
                  value={customGoal3}
                  onChange={(e) => setCustomGoal3(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={prevSection}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={nextSection}
              disabled={!goal1 && !customGoal1}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Wellness Assessment
            </button>
          </div>
        </section>
      )}

      {/* Part 3: Wellness & Purpose Indicators */}
      {currentSection === 3 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Part 3: Wellness & Purpose</h2>
          <p className="text-center text-gray-600 mb-6">
            Rate how you feel right now on a scale from 0 (lowest) to 100 (highest).
          </p>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Wellness Indicators</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fulfillment: {fulfillment} - "How fulfilled do you feel in life?"
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fulfillment}
                    onChange={(e) => setFulfillment(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Happiness: {happiness} - "How happy do you feel overall?"
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={happiness}
                    onChange={(e) => setHappiness(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Energy: {energy} - "How energetic are you on most days?"
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energy}
                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stress Management: {stress} - "How well do you manage stress?" (higher = better)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stress}
                    onChange={(e) => setStress(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sleep Quality: {sleep} - "How well are you sleeping?"
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sleep}
                    onChange={(e) => setSleep(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Physical Activity: {activity} - "How active are you weekly?"
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activity}
                    onChange={(e) => setActivity(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nutrition Quality: {nutrition} - "How healthy is your diet?"
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={nutrition}
                    onChange={(e) => setNutrition(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Purpose Indicators</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sense of Purpose: {purpose} - "How clear is your life's purpose?"
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={purpose}
                    onChange={(e) => setPurpose(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Motivation to Change: {motivation} - "How motivated are you to make positive changes?"
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={motivation}
                    onChange={(e) => setMotivation(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confidence in Change: {confidence} - "How confident are you that you can create the future-self you desire?"
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={prevSection}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Your Dashboard..." : "Complete Setup"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
