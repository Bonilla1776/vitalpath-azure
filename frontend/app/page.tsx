export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">Welcome to VitalPath</h1>
      <p className="text-lg mb-8">Start your journey toward personalized health coaching.</p>
      <a href="/register" className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700">
        Get Started
      </a>
    </div>
  );
}

