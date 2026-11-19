
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Heart, Star, ArrowRight, ImageOff } from "lucide-react";

import { imageCandidates, type Destination } from "@/lib/destinations";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

export default function StudioCard({
  studio,
  index,
}: {
  studio: Destination;
  index: number;
}) {
  const [favorite, setFavorite] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.user) return;
    apiFetch<string[]>("/api/wishlist").then(ids => setFavorite(ids.includes(studio._id))).catch(() => undefined);
  }, [session, studio._id]);

  async function toggleFavorite() {
    if (!session?.user) { toast.error("Sign in to save studios to your wishlist."); return; }
    const next = !favorite;
    setFavorite(next);
    try {
      await apiFetch(`/api/wishlist/${studio._id}`, { method: next ? "POST" : "DELETE" });
      toast.success(next ? "Saved to your wishlist." : "Removed from wishlist.");
    } catch (error) {
      setFavorite(!next);
      toast.error(error instanceof Error ? error.message : "Wishlist update failed.");
    }
  }

  const [failedSources, setFailedSources] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  const candidates = imageCandidates(studio, index);
  const image = candidates.find((source) => !failedSources.has(source)) ?? null;

  const handleImageError = (source: string) => {
    setFailedSources((previous) => {
      if (previous.has(source)) return previous;

      const updated = new Set(previous);
      updated.add(source);
      return updated;
    });
  };

  const rate = formatRate(studio.hourlyRate);
  const rating = formatRating(studio.rating);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-black/40">
      <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-zinc-800">
        {image ? (
          <Image
            src={image}
            alt={studio.title || "Creative Studio"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => handleImageError(image)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-200 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500">
            <ImageOff size={28} />
            <span className="text-xs font-semibold">No photo yet</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          {studio.category || "Creative Space"}
        </span>

        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={favorite ? "Remove favorite" : "Add favorite"}
          className={`absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
            favorite
              ? "border-red-400/40 bg-red-500 text-white shadow-lg shadow-red-500/40"
              : "border-white/20 bg-black/30 text-white hover:scale-110 hover:bg-red-500/90"
          }`}
        >
          <Heart size={17} fill={favorite ? "currentColor" : "none"} />
        </button>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-4 text-white">
          <p className="drop-shadow-sm">
            {rate ? (
              <>
                <span className="text-2xl font-extrabold tracking-tight">
                  ${rate}
                </span>
                <span className="ml-1 text-xs font-medium text-white/70">
                  /hr
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-white/80">N/A</span>
            )}
          </p>

          {rating && (
            <p className="flex items-center gap-1 text-sm font-bold drop-shadow-sm">
              <Star size={15} fill="#fbbf24" className="text-amber-400" />
              {rating}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="truncate text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-orange-600 dark:text-white">
          {studio.title || "Creative Studio"}
        </h3>

        <p className=" mb-4 flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-zinc-400">
          <MapPin size={15} className="shrink-0 text-orange-500" />
          <span className="truncate">
            {studio.location || "Location unavailable"}
          </span>
        </p>

        <Link
          href={`/studios/${studio._id}`}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 mt-5 text-[13px] font-semibold text-slate-700 transition-all hover:border-[#e63329] hover:bg-[#e63329] hover:text-white hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-slate-200 dark:hover:border-[#e63329] dark:hover:bg-[#e63329]"
        >
          View Details
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}

function formatRate(rate?: number | string): string | null {
  if (rate === undefined || rate === null) return null;

  const text = String(rate).trim().replace(/^\$/, "");

  if (!text) return null;

  const numeric = Number(text);

  return Number.isNaN(numeric) || numeric <= 0 ? null : text;
}

function formatRating(rating?: number | string): string {
  if (rating === undefined || rating === null) return "";

  const text = String(rating).trim();

  if (!text) return "";

  const numeric = Number(text);

  return Number.isNaN(numeric) ? text : String(numeric);
}
