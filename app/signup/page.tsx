"use client";

import { FormEvent, useState } from "react";

import { supabase } from "@/lib/supabase-browser";

import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setStatus(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,

        password,
      });

      if (error) {
        console.error("Supabase signup error:", error);

        setStatus(error.message);

        return;
      }

      setStatus(
        "Check your email to confirm. Once confirmed, you can use your 3-day SesameTab trial."
      );

      setEmail("");

      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg">
        <h1 className="text-lg font-semibold">Sign up for SesameTab</h1>

        <p className="mt-1 text-xs text-slate-400">
          No credit card. Just confirm your email to start your free trial.
        </p>

        <form onSubmit={handleSignup} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-200">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-200">
              Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-white/15 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-amber-400/40 hover:bg-amber-300 disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign up for free trial"}
          </button>
        </form>

        {status && (
          <p className="mt-3 text-[11px] text-amber-100">{status}</p>
        )}

        <p className="mt-4 text-[11px] text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-200 hover:text-amber-100">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}


