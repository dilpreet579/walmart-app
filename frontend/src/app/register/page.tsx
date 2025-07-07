"use client";

import React, { useState } from "react";
import { executeRecaptcha, verifyCaptchaToken } from "@/utils/recaptcha";
import Link from "next/link";

import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Run Google reCAPTCHA v3
      const recaptchaToken = await executeRecaptcha('register');
      if (!recaptchaToken) {
        console.log("reCAPTCHA failed. Please try again.");
        throw new Error("reCAPTCHA failed. Please try again.");
      }
      // Verify token with backend
      const captchaOk = await verifyCaptchaToken(recaptchaToken);
      if (!captchaOk) {
        console.log("Bot verification failed. Please try again.");
        throw new Error("Bot verification failed. Please try again.");
      }
      // Proceed with registration
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }
      // Registration successful, redirect to login
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-wrapper section max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            className="input w-full"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="input w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
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
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            className="input w-full"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="text-center mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    </div>
  );
}
