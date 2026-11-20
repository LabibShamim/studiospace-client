"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { CalendarDays, Clock3, LoaderCircle } from "lucide-react";

type Booking = {
  _id: string;
  studioTitle: string;
  studioImage: string;
  date: string;
  startTime: string;
  endTime: string;
  total: number;
  status: string;
  hostEmail: string;
  customerEmail: string;
};
const statusStyle: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-emerald-100 text-emerald-700",
  Completed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-slate-100 text-slate-500",
};
export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  async function load() {
    try {
      setItems(await apiFetch<Booking[]>("/api/bookings"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (session?.user) load();
    else if (!isPending) setLoading(false);
  }, [session, isPending]);
  async function cancel(id: string) {
    setBusy(id);
    try {
      await apiFetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled.");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Cancellation failed.");
    } finally {
      setBusy("");
    }
  }
  async function setStatus(id: string, status: string) {
    setBusy(id);
    try {
      await apiFetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Booking ${status.toLowerCase()}.`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update booking.");
    } finally {
      setBusy("");
    }
  }
  if (isPending || loading)
    return (
      <main className="mx-auto min-h-[60vh] max-w-6xl animate-pulse p-10">
        <div className="h-64 rounded-2xl bg-slate-200 dark:bg-zinc-800" />
      </main>
    );
  if (!session?.user)
    return (
      <main className="py-20 text-center dark:text-white">
        Sign in to see your bookings.{" "}
        <button
          onClick={() => router.push("/login?next=/my-bookings")}
          className="ml-2 text-orange-500"
        >
          Sign in
        </button>
      </main>
    );
  return (
    <main className="min-h-[65vh] bg-slate-50 px-4 py-12 dark:bg-zinc-950 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold tracking-widest text-orange-500">
          RESERVATION MANAGER
        </p>
        <h1 className="mt-2 text-3xl font-extrabold dark:text-white">
          My bookings
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
          Track your studio requests and manage host responses.
        </p>
        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <CalendarDays className="mx-auto text-orange-500" size={32} />
            <h2 className="mt-3 text-xl font-bold dark:text-white">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Explore studios and reserve a space for your next project.
            </p>
            <button
              onClick={() => router.push("/studios")}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white"
            >
              Explore studios
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((b) => {
              const hostView = b.hostEmail === session.user.email;
              return (
                <article
                  key={b._id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center"
                >
                  <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-40">
                    <Image
                      src={b.studioImage || "/studiopic.jpg"}
                      alt={b.studioTitle}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold dark:text-white">
                        {b.studioTitle}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[b.status] || statusStyle.Pending}`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {b.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock3 size={13} />
                        {b.startTime}–{b.endTime}
                      </span>
                    </p>
                    <p className="mt-2 text-sm font-bold text-orange-500">
                      ${Number(b.total || 0).toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {hostView
                        ? `Creator: ${b.customerEmail}`
                        : `Host: ${b.hostEmail}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hostView && b.status === "Pending" && (
                      <>
                        <button
                          disabled={busy === b._id}
                          onClick={() => setStatus(b._id, "Confirmed")}
                          className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          disabled={busy === b._id}
                          onClick={() => setStatus(b._id, "Cancelled")}
                          className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 dark:bg-zinc-800 dark:text-white"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {!hostView && b.status === "Pending" && (
                      <button
                        disabled={busy === b._id}
                        onClick={() => cancel(b._id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50"
                      >
                        {busy === b._id ? (
                          <LoaderCircle size={14} className="animate-spin" />
                        ) : (
                          "Cancel booking"
                        )}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
