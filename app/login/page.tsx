// app/login/page.tsx

"use client";



import { FormEvent, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";



export default function LoginPage() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const supabase = createClientComponentClient();



  const checkoutStatus = searchParams.get("checkout"); // "success" or null



  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState<string | null>(

    checkoutStatus === "success"

      ? "Login to activate your SesameTab Pro access."

      : null

  );

  const [loading, setLoading] = useState(false);



  const handleLogin = async (e: FormEvent) => {

    e.preventDefault();

    setLoading(true);

    setMessage(null);



    const { error } = await supabase.auth.signInWithPassword({

      email,

      password,

    });



    if (error) {

      console.error("Login error:", error);

      setMessage(error.message || "Invalid login credentials.");

      setLoading(false);

      return;

    }



    // If they just came back from Stripe, mark them as Pro

    if (checkoutStatus === "success") {

      try {

        localStorage.setItem("sesametab_isPro", "true");

      } catch (err) {

        console.warn("Unable to access localStorage:", err);

      }

    }



    // Normal flow: send user to /app

    router.push("/app");

  };



  return (

    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg">

        <h1 className="text-lg font-semibold">Sign in to SesameTab</h1>

        <p className="mt-1 text-xs text-slate-400">

          No credit card required for your trial. Just confirm your email and

          sign in.

        </p>



        {message && (

          <div className="mt-3 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">

            {message}

          </div>

        )}



        <form onSubmit={handleLogin} className="mt-4 space-y-3">

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

            {loading ? "Signing in..." : "Sign in"}

          </button>

        </form>



        <p className="mt-4 text-[11px] text-slate-500 text-center">

          Don&apos;t have an account?{" "}

          <a

            href="/signup"

            className="text-amber-300 hover:text-amber-200 underline offset-1"

          >

            Sign up

          </a>

        </p>

      </div>

    </main>

  );

}
