
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Camera, LoaderCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const valid =
      form.password.length >= 6 &&
      /[A-Z]/.test(form.password) &&
      /[a-z]/.test(form.password);

    if (!valid) {
      setPasswordError(
        "Use at least 6 characters with one uppercase and one lowercase letter."
      );
      return;
    }

    setPasswordError("");
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.image || undefined,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Registration failed."
        );
      }

      toast.success("Account created successfully.");

      router.replace("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function googleLogin() {
    if (googleLoading) return;

    setGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL:
          "https://studiospace-client-nine-neon.vercel.app/auth/callback",
        errorCallbackURL:
          "https://studiospace-client-nine-neon.vercel.app/register",
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Google sign in failed."
        );
      }
    } catch (error) {
      setGoogleLoading(false);

      toast.error(
        error instanceof Error
          ? error.message
          : "Google sign in is unavailable."
      );
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f8fafc] px-4 py-14 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-9">

        <div className="mb-7 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-500 text-white">
            <Camera size={26} />
          </div>

          <p className="mt-5 text-xs font-bold tracking-[.2em] text-orange-500">
            JOIN THE CREATIVE COMMUNITY
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            Find your next space or share your own.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">

          <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-200">
            Full name

            <input
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) =>
                setForm((old) => ({
                  ...old,
                  name: e.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-200">
            Email

            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) =>
                setForm((old) => ({
                  ...old,
                  email: e.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-200">
            Profile photo URL (optional)

            <input
              type="url"
              value={form.image}
              onChange={(e) =>
                setForm((old) => ({
                  ...old,
                  image: e.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-200">
            Password

            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) =>
                setForm((old) => ({
                  ...old,
                  password: e.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </label>

          {passwordError && (
            <p className="text-xs text-red-500">
              {passwordError}
            </p>
          )}

          <p className="text-xs text-slate-400">
            Password must include uppercase and lowercase letters
            and be at least 6 characters.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {loading && (
              <LoaderCircle
                className="animate-spin"
                size={17}
              />
            )}
            Create account
          </button>

        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-zinc-700" />
          OR
          <span className="h-px flex-1 bg-slate-200 dark:bg-zinc-700" />
        </div>

        <button
          type="button"
          onClick={googleLogin}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
        >
          {googleLoading && (
            <LoaderCircle
              className="animate-spin"
              size={17}
            />
          )}
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-400">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-bold text-orange-500"
          >
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}
