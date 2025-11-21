"use client";



import { useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Link from "next/link";



export default function LoginPage() {

  const supabase = createClientComponentClient();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [status, setStatus] = useState("");



  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setStatus("");



    const { data, error } = await supabase.auth.signInWithPassword({

      email,

      password,

    });



    if (error) {

      console.error(error);

      setStatus(error.message);

      return;

    }



    // Login success

    setStatus("Logged in! Redirecting…");

    window.location.href = "/app";

  };



  return (

    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6">

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">



        <h1 className="text-xl font-semibold mb-2">Log in</h1>

        <p className="text-sm text-slate-400 mb-6">

          Welcome back to SesameTab.

        </p>



        <form onSubmit={handleLogin} className="space-y-4">

          <div>

            <label className="block text-xs font-medium text-slate-300">

              Email

            </label>

            <input

              type="email"

              required

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              className="w-full mt-1 rounded-md border border-white/15 bg-slate-950/60 px-3 py-2 text-sm"

            />

          </div>



          <div>

            <label className="block text-xs font-medium text-slate-300">

              Password

            </label>

            <input

              type="password"

              required

              value={password}

              onChange={(e) => setPassword(e.target.value)}

              className="w-full mt-1 rounded-md border border-white/15 bg-slate-950/60 px-3 py-2 text-sm"

            />

          </div>



          {status && (

            <p className="text-xs text-amber-300">{status}</p>

          )}



          <button

            type="submit"

            className="w-full rounded-xl bg-amber-400 py-2 text-slate-950 font-semibold text-sm hover:bg-amber-300"

          >

            Log in

          </button>

        </form>



        <div className="mt-6 text-center text-xs text-slate-400">

          Don't have an account?{" "}

          <Link href="/signup" className="text-amber-300 hover:text-amber-200">

            Create one

          </Link>

        </div>

      </div>

    </main>

  );

}
