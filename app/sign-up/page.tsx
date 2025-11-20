"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm your account.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900/70 border border-white/10 p-6 rounded-xl">
        <h1 className="text-xl text-white font-semibold">Create account</h1>

        <div className="mt-4 space-y-2">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded-md bg-slate-950 border border-white/15 text-white"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-md bg-slate-950 border border-white/15 text-white"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={signUp}
            className="w-full bg-amber-400 text-slate-900 py-2 rounded-lg font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

