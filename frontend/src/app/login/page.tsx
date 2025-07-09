"use client";

import React, { useState } from "react";
import { executeRecaptcha, verifyCaptchaToken } from "@/utils/recaptcha";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { setCaptchaSuccess } from "@/utils/botSessionTracker";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { fetchUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Run Google reCAPTCHA v3
      const recaptchaToken = await executeRecaptcha('login');
      if (!recaptchaToken) {
        console.log("reCAPTCHA failed. Please try again.");
        throw new Error("reCAPTCHA failed. Please try again.");
      } else {
        console.log("reCAPTCHA passed.");
        setCaptchaSuccess(true);
      }
      // Verify token with backend
      const captchaOk = await verifyCaptchaToken(recaptchaToken);
      if (!captchaOk) {
        console.log("Bot verification failed. Please try again.");
        throw new Error("Bot verification failed. Please try again.");
      } else {
        console.log("Bot verification passed.");
      }
      // Proceed with login
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }
      // Store JWT token and redirect
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("jwt_token", data.token);
        fetchUser();
        router.push("/");
      } else {
        throw new Error("No token returned from backend");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-walmart-blue tracking-tight">Sign in to your account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center font-medium bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-walmart-blue hover:bg-blue-800 text-white font-bold rounded-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (<span className="flex items-center justify-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Logging in...</span>) : "Login"}
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-3 text-gray-400 text-xs">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <div className="text-center text-sm text-gray-600">Don't have an account?{' '}
          <Link href="/register" className="text-walmart-blue hover:underline font-semibold">Register</Link>
        </div>
      </div>
    </div>
  );
}
