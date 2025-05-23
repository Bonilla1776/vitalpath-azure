// frontend/app/discovery/page.tsx - ENHANCED RESEARCH-GRADE VERSION ✨
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

// Enhanced predefined goals with research categorization
const predefinedGoals = [
  { 
    id: "longevity", 
    label: "Longevity & Healthy Aging", 
    icon: "🌟", 
    gradient: "bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600",
    category: "Long-term Health",
    description: "Focus on sustainable practices for long-term vitality"
  },
  { 
    id: "stress", 
    label: "Stress Management", 
    icon: "🧘", 
    gradient: "bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600",
    category: "Mental Wellness",
    description: "Develop resilience and coping strategies"
  },
  { 
    id: "weight", 
    label: "Weight Management", 
    icon: "⚖️", 
    gradient: "bg-gradient-to-br from-green-600 via-emerald-500 to-green-500",
    category: "Physical Health",
    description: "Achieve and maintain healthy weight"
  },
  { 
    id: "sleep", 
    label: "Sleep Quality", 
    icon: "😴", 
    gradient: "bg-gradient-to-br from-indigo-600 via-purple-500 to-blue-600",
    category: "Recovery",
    description: "Improve sleep patterns and rest quality"
  },
  { 
    id: "strength", 
    label: "Strength & Muscle", 
    icon: "💪", 
    gradient: "bg-gradient-to-br from-red-600 via-orange-500 to-red-500",
    category: "Physical Fitness",
    description: "Build and maintain muscular strength"
  },
  { 
    id: "energy", 
    label: "Daily Energy", 
    icon: "⚡", 
    gradient: "bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-600",
    category: "Vitality",
    description: "Boost natural energy and reduce fatigue"
  },
  { 
    id: "nutrition", 
    label: "Nutritional Health", 
    icon: "🥗", 
    gradient: "bg-gradient-to-br from-green-500 via-lime-500 to-green-400",
    category: "Nutrition",
    description: "Optimize dietary habits and nutrition"
  },
  { 
    id: "mental", 
    label: "Mental Health", 
    icon: "🧠", 
    gradient: "bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-500",
    category: "Mental Wellness",
    description: "Enhance psychological well-being"
  },
  { 
    id: "cardio", 
    label: "Cardiovascular Health", 
    icon: "❤️", 
    gradient: "bg-gradient-to-br from-pink-600 via-rose-500 to-red-600",
    category: "Physical Health",
    description: "Improve heart health and endurance"
  },
  { 
    id: "purpose", 
    label: "Life Purpose", 
    icon: "🎯", 
    gradient: "bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-600",
    category: "Meaning",
    description: "Discover and pursue meaningful goals"
  }
];

// Validated wellness indicators with research backing
const wellnessIndicators = [
  {
    key: 'fulfillment',
    label: 'Life Fulfillment',
    icon: '✨',
    question: 'How fulfilled do you feel in your life overall?',
    gradient: 'from-purple-500 to-pink-500',
    category: 'Psychological Well-being',
    lowLabel: 'Not fulfilled',
    highLabel: 'Completely fulfilled',
    description: 'Overall satisfaction with life achievements and direction'
  },
  {
    key: 'happiness',
    label: 'Subjective Well-being',
    icon: '😊',
    question: 'How would you rate your overall happiness?',
    gradient: 'from-yellow-500 to-orange-500',
    category: 'Psychological Well-being',
    lowLabel: 'Very unhappy',
    highLabel: 'Very happy',
    description: 'General emotional state and life satisfaction'
  },
  {
    key: 'energy',
    label: 'Energy Vitality',
    icon: '⚡',
    question: 'How energetic do you feel on most days?',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'Physical Well-being',
    lowLabel: 'No energy',
    highLabel: 'Highly energetic',
    description: 'Physical and mental energy levels throughout the day'
  },
  {
    key: 'stress',
    label: 'Stress Resilience',
    icon: '🧘',
    question: 'How well do you manage daily stress?',
    gradient: 'from-green-500 to-emerald-500',
    category: 'Mental Health',
    lowLabel: 'Overwhelmed',
    highLabel: 'Very resilient',
    description: 'Ability to cope with and recover from stressful situations'
  },
  {
    key: 'sleep',
    label: 'Sleep Quality',
    icon: '😴',
    question: 'How would you rate your sleep quality?',
    gradient: 'from-indigo-500 to-purple-500',
    category: 'Physical Health',
    lowLabel: 'Very poor',
    highLabel: 'Excellent',
    description: 'Quality and restorative nature of sleep'
  },
  {
    key: 'activity',
    label: 'Physical Activity',
    icon: '🏃',
    question: 'How would you rate your current activity level?',
    gradient: 'from-red-500 to-pink-500',
    category: 'Physical Health',
    lowLabel: 'Sedentary',
    highLabel: 'Very active',
    description: 'Regular physical exercise and movement'
  },
  {
    key: 'nutrition',
    label: 'Nutritional Wellness',
    icon: '🥗',
    question: 'How healthy is your current diet?',
    gradient: 'from-lime-500 to-green-500',
    category: 'Lifestyle',
    lowLabel: 'Very poor',
    highLabel: 'Excellent',
    description: 'Quality and balance of dietary choices'
  },
  {
    key: 'purpose',
    label: 'Sense of Purpose',
    icon: '🎯',
    question: 'How clear is your sense of life purpose?',
    gradient: 'from-violet-500 to-purple-500',
    category: 'Existential Well-being',
    lowLabel: 'Very unclear',
    highLabel: 'Very clear',
    description: 'Clarity about life meaning and direction'
  },
  {
    key: 'motivation',
    label: 'Change Motivation',
    icon: '🚀',
    question: 'How motivated are you to make positive changes?',
    gradient: 'from-orange-500 to-red-500',
    category: 'Behavioral Readiness',
    lowLabel: 'Not motivated',
    highLabel: 'Highly motivated',
    description: 'Readiness and desire for positive lifestyle changes'
  },
  {
    key: 'confidence',
    label: 'Self-Efficacy',
    icon: '💪',
    question: 'How confident are you in your ability to create positive change?',
    gradient: 'from-teal-500 to-cyan-500',
    category: 'Behavioral Readiness',
    lowLabel: 'Not confident',
    highLabel: 'Very confident',
    description: 'Belief in your ability to successfully make and maintain changes'
  }
];

interface FormData {
  preferredName: string;
  age: number;
  gender: string;
  heightFeet: number;
  heightInches: number;
  weight: number;
  location: string;
  maritalStatus: string;
  selectedGoals: string[];
  indicators: Record<string, number>;
}

interface FormErrors {
  [key: string]: string;
}

export default function DiscoveryPage() {
  const router = useRouter();
  
  // Enhanced state management
  const [mounted, setMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [sectionAnimating, setSectionAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveProgress, setSaveProgress] = useState(false);
  
  // Form data with validation
  const [formData, setFormData] = useState<FormData>({
    preferredName: "",
    age: 25,
    gender: "",
    heightFeet: 5,
    heightInches: 6,
    weight: 150,
    location: "",
    maritalStatus: "",
    selectedGoals: [],
    indicators: Object.fromEntries(wellnessIndicators.map(ind => [ind.key, 50]))
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [completionTime, setCompletionTime] = useState<number>(Date.now());

  // Enhanced authentication with better error handling
  const makeAuthenticatedRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    const makeRequest = async (token: string): Promise<Response> => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    };

    // Get current access token
    let accessToken = localStorage.getItem("access");
    if (!accessToken) {
      throw new Error("AUTHENTICATION_REQUIRED");
    }

    // First attempt
    let response = await makeRequest(accessToken);

    // Handle token refresh if needed
    if (response.status === 401) {
      const refreshToken = localStorage.getItem("refresh");
      if (!refreshToken) {
        throw new Error("SESSION_EXPIRED");
      }

      try {
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error("REFRESH_FAILED");
        }

        const { access: newAccessToken, refresh: newRefreshToken } = await refreshResponse.json();
        
        localStorage.setItem("access", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh", newRefreshToken);
        }

        // Retry with new token
        response = await makeRequest(newAccessToken);
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        throw new Error("SESSION_EXPIRED");
      }
    }

    return response;
  }, []);

  // Form validation
  const validateSection = useCallback((section: number): FormErrors => {
    const errors: FormErrors = {};
    
    switch (section) {
      case 1:
        if (!formData.preferredName.trim()) {
          errors.preferredName = "Please enter your preferred name";
        } else if (formData.preferredName.length < 2) {
          errors.preferredName = "Name must be at least 2 characters";
        }
        
        if (!formData.gender) {
          errors.gender = "Please select your gender";
        }
        
        if (!formData.location.trim()) {
          errors.location = "Please enter your location";
        }
        
        if (formData.age < 18 || formData.age > 100) {
          errors.age = "Age must be between 18 and 100";
        }
        
        if (formData.weight < 70 || formData.weight > 500) {
          errors.weight = "Please enter a valid weight";
        }
        break;
        
      case 2:
        if (formData.selectedGoals.length === 0) {
          errors.goals = "Please select at least one health goal";
        }
        break;
        
      case 3:
        // All indicators should be between 0-100 (handled by sliders)
        break;
    }
    
    return errors;
  }, [formData]);

  // Enhanced form submission with research data validation
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      // Final validation
      const errors = validateSection(3);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setLoading(false);
        return;
      }

      // Calculate completion metrics for research
      const timeToComplete = Date.now() - completionTime;
      const completionMetrics = {
        duration_minutes: Math.round(timeToComplete / 60000),
        sections_completed: 3,
        goals_selected: formData.selectedGoals.length,
        avg_wellness_score: Math.round(
          Object.values(formData.indicators).reduce((a, b) => a + b, 0) / 
          Object.values(formData.indicators).length
        )
      };

      // Prepare research-compliant data structure
      const discoveryData = {
        // Demographics
        preferred_name: formData.preferredName.trim(),
        age: formData.age,
        gender: formData.gender,
        height_feet: formData.heightFeet,
        height_inches: formData.heightInches,
        weight: formData.weight,
        location: formData.location.trim(),
        marital_status: formData.maritalStatus || "",
        
        // Goals (prioritized)
        goal_1: formData.selectedGoals[0] || "",
        goal_2: formData.selectedGoals[1] || "",
        goal_3: formData.selectedGoals[2] || "",
        
        // Baseline wellness indicators
        baseline_fulfillment: formData.indicators.fulfillment,
        baseline_happiness: formData.indicators.happiness,
        baseline_energy: formData.indicators.energy,
        baseline_stress: formData.indicators.stress,
        baseline_sleep: formData.indicators.sleep,
        baseline_activity: formData.indicators.activity,
        baseline_nutrition: formData.indicators.nutrition,
        baseline_purpose: formData.indicators.purpose,
        baseline_motivation: formData.indicators.motivation,
        baseline_confidence: formData.indicators.confidence,
        
        // Research metadata
        completion_metrics: completionMetrics
      };

      // Submit discovery data
      const discoveryResponse = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/discovery/`,
        {
          method: "POST",
          body: JSON.stringify(discoveryData),
        }
      );

      if (!discoveryResponse.ok) {
        const errorData = await discoveryResponse.json();
        throw new Error(errorData.detail || `Discovery submission failed: ${discoveryResponse.status}`);
      }

      // Create initial dashboard entry
      try {
        await makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/`,
          {
            method: "POST",
            body: JSON.stringify(formData.indicators),
          }
        );
      } catch (dashboardError) {
        console.warn("Dashboard baseline creation failed:", dashboardError);
        // Continue anyway - this is not critical
      }

      // Success - navigate to dashboard
      router.push("/dashboard");
      
    } catch (err) {
      console.error("Discovery submission error:", err);
      
      if (err instanceof Error) {
        switch (err.message) {
          case "AUTHENTICATION_REQUIRED":
            setError("Please log in to continue");
            setTimeout(() => router.push("/login"), 2000);
            break;
          case "SESSION_EXPIRED":
          case "REFRESH_FAILED":
            setError("Your session has expired. Redirecting to login...");
            setTimeout(() => router.push("/login"), 2000);
            break;
          default:
            setError(`Submission failed: ${err.message}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [formData, makeAuthenticatedRequest, router, completionTime]);

  // Progressive enhancement
  useEffect(() => {
    setMounted(true);
    setCompletionTime(Date.now());
    
    // Load saved progress if available
    const savedProgress = localStorage.getItem('vitalpath_discovery_progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setFormData(prev => ({ ...prev, ...parsed }));
        setSaveProgress(true);
      } catch (e) {
        console.warn("Could not load saved progress");
      }
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (saveProgress && mounted) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('vitalpath_discovery_progress', JSON.stringify(formData));
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData, saveProgress, mounted]);

  // Enhanced navigation with validation
  const navigateSection = useCallback((direction: 'next' | 'prev') => {
    if (direction === 'next') {
      const errors = validateSection(currentSection);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
    }
    
    setSectionAnimating(true);
    setTimeout(() => {
      setCurrentSection(prev => 
        direction === 'next' 
          ? Math.min(prev + 1, 3)
          : Math.max(prev - 1, 1)
      );
      setSectionAnimating(false);
    }, 300);
  }, [currentSection, validateSection]);

  // Memoized computed values
  const progressPercentage = useMemo(() => 
    Math.round((currentSection / 3) * 100), [currentSection]
  );
  
  const isFormValid = useMemo(() => 
    Object.keys(validateSection(currentSection)).length === 0, 
    [validateSection, currentSection]
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">Loading VitalPath Discovery...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Accessibility skip navigation */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded-lg z-50">
        Skip to main content
      </a>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Enhanced hero section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8 shadow-2xl animate-bounce">
            <span className="text-4xl" role="img" aria-label="rocket">🚀</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
            Your VitalPath Discovery
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Welcome to your personalized health journey. This comprehensive assessment creates your unique wellness profile 
            and unlocks AI coaching tailored specifically for you. Your honest responses help us understand your starting point 
            and design the most effective path forward.
          </p>
        </div>

        {/* Enhanced progress indicator */}
        <div className="mb-16" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
          <div className="flex items-center justify-center space-x-8 mb-6">
            {[1, 2, 3].map((section) => (
              <div key={section} className="flex items-center">
                <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-500 shadow-2xl ${
                  section <= currentSection 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white scale-110' 
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
          
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-gray-800/50 px-8 py-4 rounded-full backdrop-blur-sm border border-white/20">
              <span className="text-gray-300 text-lg font-medium">
                Step {currentSection} of 3: {
                  currentSection === 1 ? '✨ About You' : 
                  currentSection === 2 ? '🎯 Your Goals' : 
                  '📊 Wellness Assessment'
                }
              </span>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-cyan-400 font-bold">{progressPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-500/20 border-2 border-red-500/50 rounded-2xl backdrop-blur-sm shadow-2xl" role="alert">
            <div className="flex items-center">
              <span className="text-3xl mr-4" role="img" aria-label="warning">⚠️</span>
              <div>
                <p className="text-red-300 font-bold text-lg">Something went wrong</p>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form validation errors */}
        {Object.keys(formErrors).length > 0 && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-amber-500/20 border-2 border-amber-500/50 rounded-2xl backdrop-blur-sm shadow-2xl" role="alert">
            <div className="flex items-start">
              <span className="text-3xl mr-4 mt-1" role="img" aria-label="attention">⚠️</span>
              <div>
                <p className="text-amber-300 font-bold text-lg mb-2">Please complete the following:</p>
                <ul className="text-amber-200 space-y-1">
                  {Object.values(formErrors).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Main content sections */}
        <main id="main-content" className={`transform transition-all duration-500 ${
          sectionAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>

          {/* Section 1: Personal Information */}
          {currentSection === 1 && (
            <section className="max-w-5xl mx-auto" aria-labelledby="section-1-title">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 border border-white/30 shadow-2xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl mb-6 shadow-2xl">
                    <span className="text-3xl" role="img" aria-label="wave">👋</span>
                  </div>
                  <h2 id="section-1-title" className="text-4xl font-bold text-white mb-4">Tell Us About Yourself</h2>
                  <p className="text-gray-300 text-lg">Help us personalize your VitalPath experience with some basic information</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name input */}
                  <div className="md:col-span-2">
                    <label htmlFor="preferred-name" className="block text-white font-semibold mb-4 text-lg">
                      What should we call you? ✨
                    </label>
                    <input
                      id="preferred-name"
                      className={`w-full p-6 bg-white/10 border-2 rounded-2xl text-white text-lg placeholder-gray-400 focus:bg-white/20 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 shadow-lg ${
                        formErrors.preferredName ? 'border-red-400' : 'border-white/30'
                      }`}
                      type="text"
                      placeholder="Your preferred name..."
                      value={formData.preferredName}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, preferredName: e.target.value }));
                        if (formErrors.preferredName) {
                          setFormErrors(prev => ({ ...prev, preferredName: '' }));
                        }
                      }}
                      required
                      aria-describedby={formErrors.preferredName ? "name-error" : undefined}
                    />
                    {formErrors.preferredName && (
                      <p id="name-error" className="text-red-300 text-sm mt-2">{formErrors.preferredName}</p>
                    )}
                  </div>

                  {/* Age slider */}
                  <div>
                    <label htmlFor="age-slider" className="block text-white font-semibold mb-4 text-lg">
                      Your Age: <span className="text-cyan-400 font-bold text-2xl">{formData.age}</span>
                    </label>
                    <input
                      id="age-slider"
                      type="range"
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      className="w-full h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #06b6d4 0%, #8b5cf6 ${(formData.age-18)/(100-18)*100}%, #374151 ${(formData.age-18)/(100-18)*100}%, #374151 100%)`
                      }}
                      aria-describedby="age-range"
                    />
                    <div id="age-range" className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>18</span>
                      <span>100</span>
                    </div>
                  </div>

                  {/* Gender selection */}
                  <div>
                    <fieldset>
                      <legend className="block text-white font-semibold mb-4 text-lg">Gender Identity</legend>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: "male", label: "Male", icon: "👨" },
                          { value: "female", label: "Female", icon: "👩" },
                          { value: "non-binary", label: "Non-binary", icon: "🧑" },
                          { value: "prefer-not-to-say", label: "Prefer not to say", icon: "❓" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, gender: option.value }));
                              if (formErrors.gender) {
                                setFormErrors(prev => ({ ...prev, gender: '' }));
                              }
                            }}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 ${
                              formData.gender === option.value
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 border-cyan-400 text-white shadow-2xl scale-105'
                                : 'bg-white/10 border-white/30 text-gray-300 hover:bg-white/20 hover:border-white/50'
                            } ${formErrors.gender ? 'border-red-400/50' : ''}`}
                            aria-pressed={formData.gender === option.value}
                          >
                            <div className="text-2xl mb-2">{option.icon}</div>
                            <div className="text-sm font-medium">{option.label}</div>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    {formErrors.gender && (
                      <p className="text-red-300 text-sm mt-2">{formErrors.gender}</p>
                    )}
                  </div>

                  {/* Height inputs */}
                  <div>
                    <label className="block text-white font-semibold mb-4 text-lg">
                      Height: <span className="text-cyan-400 font-bold text-xl">{formData.heightFeet}'{formData.heightInches}"</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="height-feet" className="text-sm text-gray-400 block mb-2">Feet</label>
                        <input
                          id="height-feet"
                          type="number"
                          min="3"
                          max="7"
                          value={formData.heightFeet}
                          onChange={(e) => setFormData(prev => ({ ...prev, heightFeet: parseInt(e.target.value) || 5 }))}
                          className="w-full p-4 bg-white/10 border-2 border-white/30 rounded-xl text-white text-center text-xl focus:bg-white/20 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 shadow-lg"
                        />
                      </div>
                      <div>
                        <label htmlFor="height-inches" className="text-sm text-gray-400 block mb-2">Inches</label>
                        <input
                          id="height-inches"
                          type="number"
                          min="0"
                          max="11"
                          value={formData.heightInches}
                          onChange={(e) => setFormData(prev => ({ ...prev, heightInches: parseInt(e.target.value) || 0 }))}
                          className="w-full p-4 bg-white/10 border-2 border-white/30 rounded-xl text-white text-center text-xl focus:bg-white/20 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 shadow-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Weight slider */}
                  <div>
                    <label htmlFor="weight-slider" className="block text-white font-semibold mb-4 text-lg">
                      Weight: <span className="text-cyan-400 font-bold text-2xl">{formData.weight} lbs</span>
                    </label>
                    <input
                      id="weight-slider"
                      type="range"
                      min="70"
                      max="425"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                      className="w-full h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #06b6d4 0%, #8b5cf6 ${(formData.weight-70)/(425-70)*100}%, #374151 ${(formData.weight-70)/(425-70)*100}%, #374151 100%)`
                      }}
                      aria-describedby="weight-range"
                    />
                    <div id="weight-range" className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>70 lbs</span>
                      <span>425 lbs</span>
                    </div>
                  </div>

                  {/* Location input */}
                  <div className="md:col-span-2">
                    <label htmlFor="location" className="block text-white font-semibold mb-4 text-lg">Where are you located? 📍</label>
                    <input
                      id="location"
                      className={`w-full p-6 bg-white/10 border-2 rounded-2xl text-white text-lg placeholder-gray-400 focus:bg-white/20 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 shadow-lg ${
                        formErrors.location ? 'border-red-400' : 'border-white/30'
                      }`}
                      type="text"
                      placeholder="City, State or Zip Code..."
                      value={formData.location}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, location: e.target.value }));
                        if (formErrors.location) {
                          setFormErrors(prev => ({ ...prev, location: '' }));
                        }
                      }}
                      required
                    />
                    {formErrors.location && (
                      <p className="text-red-300 text-sm mt-2">{formErrors.location}</p>
                    )}
                  </div>

                  {/* Marital status (optional) */}
                  <div className="md:col-span-2">
                    <fieldset>
                      <legend className="block text-white font-semibold mb-4 text-lg">Relationship Status (Optional) 💕</legend>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { value: "single", label: "Single" },
                          { value: "married", label: "Married" },
                          { value: "in-relationship", label: "In a Relationship" },
                          { value: "prefer-not-to-say", label: "Prefer not to say" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              maritalStatus: prev.maritalStatus === option.value ? "" : option.value 
                            }))}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-400/30 ${
                              formData.maritalStatus === option.value
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-pink-400 text-white shadow-2xl'
                                : 'bg-white/10 border-white/30 text-gray-300 hover:bg-white/20'
                            }`}
                            aria-pressed={formData.maritalStatus === option.value}
                          >
                            <div className="text-sm font-medium">{option.label}</div>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>

                <div className="mt-16">
                  <button
                    onClick={() => navigateSection('next')}
                    disabled={!isFormValid}
                    className="w-full py-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-xl rounded-2xl hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-400/30"
                  >
                    Continue to Goals 🎯
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Health Goals */}
          {currentSection === 2 && (
            <section className="max-w-7xl mx-auto" aria-labelledby="section-2-title">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 border border-white/30 shadow-2xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl mb-6 shadow-2xl">
                    <span className="text-3xl" role="img" aria-label="target">🎯</span>
                  </div>
                  <h2 id="section-2-title" className="text-4xl font-bold text-white mb-4">Choose Your Health Goals</h2>
                  <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                    Select up to 3 goals that resonate with you most. These will guide your personalized coaching experience. 
                    You can always adjust these later as your journey evolves.
                  </p>
                </div>

                {/* Goals grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {predefinedGoals.map((goal, index) => {
                    const isSelected = formData.selectedGoals.includes(goal.id);
                    const priority = formData.selectedGoals.indexOf(goal.id) + 1;
                    const isDisabled = !isSelected && formData.selectedGoals.length >= 3;
                    
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setFormData(prev => ({
                              ...prev,
                              selectedGoals: prev.selectedGoals.filter(id => id !== goal.id)
                            }));
                          } else if (formData.selectedGoals.length < 3) {
                            setFormData(prev => ({
                              ...prev,
                              selectedGoals: [...prev.selectedGoals, goal.id]
                            }));
                          }
                          if (formErrors.goals) {
                            setFormErrors(prev => ({ ...prev, goals: '' }));
                          }
                        }}
                        disabled={isDisabled}
                        className={`relative p-8 rounded-3xl border-2 transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400/30 group ${
                          isSelected
                            ? `${goal.gradient} border-white/50 text-white shadow-2xl scale-105`
                            : 'bg-white/10 border-white/30 text-gray-300 hover:bg-white/20 hover:border-white/50'
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        aria-pressed={isSelected}
                        aria-describedby={`goal-${goal.id}-desc`}
                      >
                        <div className="text-center">
                          {isSelected && (
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg shadow-2xl animate-bounce">
                              {priority}
                            </div>
                          )}
                          
                          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {goal.icon}
                          </div>
                          
                          <h3 className="font-bold text-lg mb-2 leading-tight">
                            {goal.label}
                          </h3>
                          
                          <p id={`goal-${goal.id}-desc`} className="text-sm opacity-80 mb-2">
                            {goal.description}
                          </p>
                          
                          <span className="inline-block px-3 py-1 text-xs bg-black/20 rounded-full">
                            {goal.category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected goals summary */}
                {formData.selectedGoals.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-white font-bold mb-6 text-xl">Your Selected Goals (Priority Order):</h3>
                    <div className="flex flex-wrap gap-4">
                      {formData.selectedGoals.map((goalId, index) => {
                        const goal = predefinedGoals.find(g => g.id === goalId);
                        if (!goal) return null;
                        
                        return (
                          <div key={goalId} className={`flex items-center px-6 py-3 rounded-full ${goal.gradient} text-white font-medium shadow-2xl animate-fade-in`}>
                            <span className="mr-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <span>{goal.label}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                selectedGoals: prev.selectedGoals.filter(id => id !== goalId)
                              }))}
                              className="ml-3 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                              aria-label={`Remove ${goal.label} goal`}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {formErrors.goals && (
                  <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300">{formErrors.goals}</p>
                  </div>
                )}

                <div className="flex space-x-6">
                  <button
                    onClick={() => navigateSection('prev')}
                    className="flex-1 py-6 bg-white/10 border-2 border-white/30 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400/30"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => navigateSection('next')}
                    disabled={!isFormValid}
                    className="flex-1 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xl rounded-2xl hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
                  >
                    Continue to Assessment 📊
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Wellness Assessment */}
          {currentSection === 3 && (
            <section className="max-w-7xl mx-auto" aria-labelledby="section-3-title">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 border border-white/30 shadow-2xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 to-pink-500 rounded-3xl mb-6 shadow-2xl">
                    <span className="text-3xl" role="img" aria-label="chart">📊</span>
                  </div>
                  <h2 id="section-3-title" className="text-4xl font-bold text-white mb-4">Wellness Assessment</h2>
                  <p className="text-gray-300 text-lg max-w-4xl mx-auto">
                    Rate how you feel right now across these key wellness dimensions. This creates your personalized baseline 
                    for tracking progress. Be honest - there are no right or wrong answers, only your authentic starting point.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {wellnessIndicators.map((indicator, index) => (
                    <div 
                      key={indicator.key} 
                      className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/10 transition-all duration-300 shadow-2xl"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start mb-6">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${indicator.gradient} flex items-center justify-center text-2xl mr-6 shadow-2xl flex-shrink-0`}>
                          {indicator.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-xl mb-2">{indicator.label}</h3>
                          <p className="text-gray-400 text-sm mb-1">{indicator.question}</p>
                          <p className="text-gray-500 text-xs">{indicator.description}</p>
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                            {indicator.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-400 font-medium">Current Level</span>
                          <span className={`text-3xl font-bold bg-gradient-to-r ${indicator.gradient} bg-clip-text text-transparent`}>
                            {formData.indicators[indicator.key]}
                          </span>
                        </div>
                        
                        <label htmlFor={`${indicator.key}-slider`} className="sr-only">
                          {indicator.label} level from 0 to 100
                        </label>
                        <input
                          id={`${indicator.key}-slider`}
                          type="range"
                          min="0"
                          max="100"
                          value={formData.indicators[indicator.key]}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            indicators: {
                              ...prev.indicators,
                              [indicator.key]: parseInt(e.target.value)
                            }
                          }))}
                          className="w-full h-4 bg-gray-700 rounded-full appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(147, 51, 234) ${formData.indicators[indicator.key]}%, rgb(55, 65, 81) ${formData.indicators[indicator.key]}%, rgb(55, 65, 81) 100%)`
                          }}
                          aria-describedby={`${indicator.key}-range`}
                        />
                        <div id={`${indicator.key}-range`} className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>{indicator.lowLabel}</span>
                          <span>{indicator.highLabel}</span>
                        </div>
                      </div>
                      
                      {/* Visual progress bar */}
                      <div className={`h-3 rounded-full bg-gradient-to-r ${indicator.gradient} opacity-20 relative overflow-hidden`}>
                        <div 
                          className={`h-full bg-gradient-to-r ${indicator.gradient} transition-all duration-500 ease-out shadow-lg`}
                          style={{ width: `${formData.indicators[indicator.key]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-6 mt-16">
                  <button
                    onClick={() => navigateSection('prev')}
                    className="flex-1 py-6 bg-white/10 border-2 border-white/30 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400/30"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid}
                    className="flex-1 py-6 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold text-xl rounded-2xl hover:from-pink-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-2xl relative overflow-hidden group focus:outline-none focus:ring-4 focus:ring-pink-400/30"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mr-4" role="status" aria-label="Loading"></div>
                        Creating Your VitalPath...
                      </div>
                    ) : (
                      <>
                        <span className="relative z-10">Complete Discovery & Launch Dashboard 🚀</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Enhanced custom styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
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
        
        input[type="range"]:focus {
          outline: none;
        }
        
        input[type="range"]:focus::-webkit-slider-thumb {
          ring: 4px;
          ring-color: rgba(6, 182, 212, 0.3);
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .bg-white\/10 {
            background-color: rgba(255, 255, 255, 0.2);
          }
          
          .border-white\/30 {
            border-color: rgba(255, 255, 255, 0.5);
          }
        }
        
        /* Focus indicators for keyboard navigation */
        button:focus-visible,
        input:focus-visible {
          outline: 2px solid #06b6d4;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}