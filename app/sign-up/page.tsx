"use client";

import { FormEvent, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("signup");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError(null);

    setBusy(true);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,

          password,
        });

        if (signUpError) {
          setError(signUpError.message);

          setBusy(false);

          return;
        }

        const user = data.user;

        if (!user) {
          setError("Sign-up incomplete. Please check your email and try again.");

          setBusy(false);

          return;
        }

        // Create profile with 3-day trial

        const now = new Date();

        const trialEnds = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,

          email: user.email,

          trial_ends_at: trialEnds.toISOString(),

          plan: "trial",
        });

        if (profileError) {
          console.error("Profile error:", profileError);

          // Not fatal for UX, but log it.
        }

        // Go to app

        router.push("/app");
      } else {
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email,

            password,
          });

        if (loginError) {
          setError(loginError.message);

          setBusy(false);

          return;
        }

        router.push("/app");
      }
    } catch (err: any) {
      console.error(err);

      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />

        <div className="absolute top-40 -left-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
        <h1 className="text-lg font-semibold">SesameTab</h1>

        <p className="mt-1 text-xs text-slate-400">
          Create an account to start your 3-day trial. No credit card required.
        </p>

        <div className="mt-4 flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-full border px-3 py-1 ${
              mode === "signup"
                ? "border-amber-400 bg-amber-500/20 text-amber-100"
                : "border-white/15 text-slate-300"
            }`}
          >
            Sign up
          </button>

          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full border px-3 py-1 ${
              mode === "login"
                ? "border-amber-400 bg-amber-500/20 text-amber-100"
                : "border-white/15 text-slate-300"
            }`}
          >
            Log in
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-sm">
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

          {error && (
            <p className="mt-1 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-amber-400/40 hover:bg-amber-300 disabled:opacity-60"
          >
            {busy
              ? "Working..."
              : mode === "signup"
              ? "Start 3-day trial"
              : "Log in"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => (window.location.href = "/")}
          className="mt-4 inline-flex items-center text-[11px] text-slate-400 hover:text-amber-200"
        >
          ← Back to home
        </button>
      </div>
    </main>
  );
}
