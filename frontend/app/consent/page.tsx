"use client";

import { useRouter } from "next/navigation";

export default function ConsentPage() {
  const router = useRouter();

  const handleAgree = async () => {
    const token = localStorage.getItem("access_token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consent/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ accepted: true }), // Fixed: changed 'agreed' to 'accepted'
    });
    router.push("/discovery");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Informed Consent</h1>
      <p className="mb-6">
        By continuing, you agree to participate in the VitalPath research study.
        Your data will be stored securely and used solely for academic research
        as outlined in the IRB-approved study.
      </p>
      <button onClick={handleAgree} className="bg-blue-600 text-white px-4 py-2 rounded shadow">
        I Agree
      </button>
    </div>
  );
}
