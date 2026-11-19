"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { establishApiSession } from "@/lib/api";
import toast from "react-hot-toast";
import { Camera, LoaderCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message || "Unable to sign in.");
      await establishApiSession();
      toast.success("Welcome back to StudioSpace.");
      router.replace(typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") || "/" : "/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed.");
    } finally { setLoading(false); }
  }

  async function googleLogin() {
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/auth/callback` });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign in is unavailable.");
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f8fafc] px-4 py-14 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-500 text-white"><Camera size={26}/></div>
          <p className="mt-5 text-xs font-bold tracking-[.2em] text-orange-500">CREATIVE SPACE, YOUR WAY</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Sign in to manage your studio sessions.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-200">Email
            <input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"/>
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-200">Password
            <input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"/>
          </label>
          <div className="text-right"><span className="text-xs text-slate-400">Forgot password? Contact support.</span></div>
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white transition hover:bg-orange-600 disabled:opacity-60">{loading && <LoaderCircle className="animate-spin" size={17}/>}Sign in</button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200 dark:bg-zinc-700"/>OR CONTINUE WITH<span className="h-px flex-1 bg-slate-200 dark:bg-zinc-700"/></div>
        <button onClick={googleLogin} className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800">Continue with Google</button>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-400">New to StudioSpace? <Link href="/register" className="font-bold text-orange-500">Create account</Link></p>
      </div>
    </main>
  );
}
