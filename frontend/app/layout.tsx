// frontend/app/layout.tsx
import Link from "next/link";
import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-white shadow-md p-4 flex justify-between items-center animate-fade-in">
          <h1 className="text-xl font-bold">VitalPath</h1>
          <div className="space-x-4">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/dashboard/update" className="hover:underline">Update</Link>
            <Link href="/register" className="hover:underline">Register</Link>
            <Link href="/login" className="hover:underline">Login</Link>
          </div>
        </nav>
        <main className="p-6 animate-slide-up fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}