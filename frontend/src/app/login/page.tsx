"use client";

import React, { useState } from "react";
import { executeRecaptcha, verifyCaptchaToken } from "@/utils/recaptcha";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

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
    <div className="container-wrapper section max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="input w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="input w-full"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="text-center mt-4">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
      </div>
    </div>
  );
}
