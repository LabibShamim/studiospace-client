"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { establishApiSession } from "@/lib/api";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    establishApiSession().then(() => router.replace("/")).catch((error) => {
      toast.error(error instanceof Error ? error.message : "Could not finish sign in.");
      router.replace("/login");
    });
  }, [router]);
  return <main className="grid min-h-[60vh] place-items-center text-sm text-slate-500">Finishing your StudioSpace sign in…</main>;
}
