
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { establishApiSession } from "@/lib/api";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const finishSignIn = async () => {
      try {
        const { data: session, error } = await authClient.getSession();

        if (error || !session) {
          throw new Error("Google sign in failed. Please try again.");
        }

        await establishApiSession();

        if (active) {
          router.replace("/");
        }
      } catch (error) {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not finish sign in."
          );
          router.replace("/login");
        }
      }
    };

    finishSignIn();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="grid min-h-[60vh] place-items-center text-sm text-slate-500">
      Finishing your StudioSpace sign in…
    </main>
  );
}
