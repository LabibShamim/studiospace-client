
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  CalendarDays,
  Check,
  Users,
  RefreshCw,
} from "lucide-react";

import {
  FALLBACK_IMAGES,
  fetchDestinations,
  type Destination,
} from "@/lib/destinations";

export default function StudioDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [studio, setStudio] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [activeImage, setActiveImage] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(
    () => new Set()
  );

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    fetchDestinations()
      .then((destinations) => {
        if (cancelled) return;

        const match =
          destinations.find((item) => item._id === id) ?? null;

        setStudio(match);
        setActiveImage(0);

        if (!match) {
          setError(
            "This studio listing does not exist or has been removed."
          );
        } else {
          setError(null);
        }
      })
      .catch((fetchError) => {
        console.error(fetchError);

        if (!cancelled) {
          setStudio(null);
          setError(
            "We could not reach the studio listings. Make sure the backend is running on port 5000."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  const gallery = useMemo(() => {
    if (!studio) return [];

    const extra = Array.isArray(studio.images)
      ? studio.images.filter(Boolean)
      : [];

    const primary = studio.imageUrl?.trim();

    const urls = primary
      ? [primary, ...extra.filter((url) => url !== primary)]
      : extra;

    return urls.length > 0 ? urls : [FALLBACK_IMAGES[0]];
  }, [studio]);

  const hourlyRate = Number(studio?.hourlyRate ?? 0) || 0;
  const securityDeposit =
    Number(studio?.securityDeposit ?? 0) || 0;
  const maxCapacity = Number(studio?.maxCapacity ?? 0) || 0;
  const rating = Number(studio?.rating ?? 0) || 0;
  const reviews = Number(studio?.reviews ?? 0) || 0;
  const amenities = studio?.amenities ?? [];

  const start = startTime.split(":").map(Number);
  const end = endTime.split(":").map(Number);

  const hours =
    end[0] - start[0] + (end[1] - start[1]) / 60;



  const subtotal = hours * hourlyRate;
  const total = subtotal + securityDeposit;

  async function submitBooking() {
    setBookingLoading(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ studioId: id, date, startTime, endTime }),
      });
      toast.success("Booking request sent to the host.");
      setBookingOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking could not be completed.");
    } finally {
      setBookingLoading(false);
    }
  }

  const srcFor = (url: string) =>
    failedImages.has(url) ? FALLBACK_IMAGES[0] : url;

  const mainImage =
    gallery[activeImage] ?? gallery[0] ?? FALLBACK_IMAGES[0];

  const retry = () => {
    setError(null);
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const markFailed = (url: string) =>
    setFailedImages((previous) =>
      previous.has(url)
        ? previous
        : new Set(previous).add(url)
    );

  if (loading) {
    return (
      <section className="min-h-screen bg-[#f8fafc] px-4 py-8 dark:bg-zinc-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-5">
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-[350px] rounded-2xl bg-slate-200 dark:bg-zinc-800 sm:h-[450px] lg:h-[600px]" />
          <div className="h-40 rounded-2xl bg-slate-200 dark:bg-zinc-800" />
        </div>
      </section>
    );
  }

  if (!studio) {
    return (
      <section className="min-h-screen bg-[#f8fafc] px-4 py-16 dark:bg-zinc-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-lg font-bold text-[#172b45] dark:text-white">
            Studio not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">
            {error ??
              "This studio listing does not exist or has been removed."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              <ArrowLeft size={14} />
              Back to Studios
            </Link>

            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8fafc] px-4 py-6 transition-colors duration-300 dark:bg-zinc-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/studios"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-orange-500 transition hover:text-red-600 sm:mb-7"
        >
          <ArrowLeft size={15} />
          Back to Studios
        </Link>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          <div
            className={`relative h-[350px] overflow-hidden rounded-2xl sm:h-[450px] lg:h-[600px] ${
              gallery.length > 1
                ? "md:col-span-2"
                : "md:col-span-3"
            }`}
          >
            <Image
              src={srcFor(mainImage)}
              alt={studio.title || "Creative Studio"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              onError={() => markFailed(mainImage)}
              className="object-cover object-center"
            />
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-1">
              {gallery.slice(1).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index + 1)}
                  aria-label={`Show studio view ${index + 2}`}
                  className={`relative h-40 overflow-hidden rounded-xl sm:h-52 md:h-[292px] ${
                    activeImage === index + 1
                      ? "ring-2 ring-orange-500"
                      : ""
                  }`}
                >
                  <Image
                    src={srcFor(image)}
                    alt={`Studio view ${index + 2}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    onError={() => markFailed(image)}
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-7 grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-3">
          <div className="min-w-0 space-y-5 lg:col-span-2">
            <div>
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                {studio.category || "Creative Space"}
              </span>

              <h1 className="mt-2 break-words text-2xl font-extrabold tracking-tight text-[#172b45] dark:text-white sm:text-3xl">
                {studio.title || "Creative Studio"}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                <MapPin
                  size={14}
                  className="shrink-0 text-orange-500"
                />
                {studio.location || "Location unavailable"}

                {maxCapacity > 0 && (
                  <>
                    <span>•</span>
                    <Users size={14} />
                    Max Capacity: {maxCapacity} Creators
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <h2 className="text-base font-bold text-[#172b45] dark:text-white">
                Detailed Overview
              </h2>

              <p className="mt-3 whitespace-pre-line text-xs leading-6 text-slate-500 dark:text-zinc-400">
                {studio.overview ||
                  "No overview has been provided yet."}
              </p>
            </div>

            {amenities.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                <h2 className="text-base font-bold text-[#172b45] dark:text-white">
                  Amenities &amp; Equipment
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      <Check
                        size={14}
                        className="shrink-0 text-orange-500"
                      />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <h2 className="text-base font-bold text-[#172b45] dark:text-white">Meet your host</h2>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-100 font-bold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                  {(studio.hostName || "Studio Host").slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white">{studio.hostName || "Studio Host"}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-zinc-400">{studio.hostEmail || "Host contact available after booking"}</p>
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Creator reviews</h3>
                <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-zinc-400">
                  {reviews > 0 ? `${reviews} creator review${reviews === 1 ? "" : "s"} · average rating ${rating.toFixed(1)} out of 5.` : "This studio is waiting for its first creator review."}
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-zinc-800">
                <div>
                  <span className="text-2xl font-extrabold text-orange-500">
                    ${hourlyRate}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    /hour
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  <Star
                    size={13}
                    fill="#fbbf24"
                    className="text-amber-400"
                  />
                  {rating} ({reviews})
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase text-slate-400">
                    Reservation Date
                  </label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-orange-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase text-slate-400">
                      Start Time
                    </label>

                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-700 outline-none focus:border-orange-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase text-slate-400">
                      End Time
                    </label>

                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-700 outline-none focus:border-orange-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="my-4 space-y-3 border-t border-slate-100 pt-4 text-xs dark:border-zinc-800">
                <div className="flex justify-between gap-2 text-slate-500 dark:text-zinc-400">
                  <span>
                    {hours.toFixed(2)} Hours @ ${hourlyRate}/hr
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between gap-2 text-slate-500 dark:text-zinc-400">
                  <span>Security Deposit (Refundable)</span>
                  <span>${securityDeposit}</span>
                </div>

                <div className="flex justify-between gap-2 border-t border-slate-100 pt-3 font-extrabold text-[#172b45] dark:border-zinc-800 dark:text-white">
                  <span>Total Due</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                disabled={!date || hours <= 0 || new Date(`${date}T${startTime}:00`) <= new Date()}
                onClick={() => setBookingOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Book Workspace Now
                <ArrowLeft size={14} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {bookingOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/65 p-4" role="dialog" aria-modal="true" aria-labelledby="booking-confirm-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <p className="text-xs font-bold tracking-widest text-orange-500">RESERVATION REVIEW</p>
            <h2 id="booking-confirm-title" className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">Confirm your booking request</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Your request will be sent to the host as Pending until they confirm it.</p>
            <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-zinc-800">
              <div className="flex justify-between gap-3"><span className="text-slate-500 dark:text-zinc-400">Studio</span><strong className="text-right text-slate-900 dark:text-white">{studio.title}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-zinc-400">Date</span><strong className="text-slate-900 dark:text-white">{date}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-zinc-400">Time</span><strong className="text-slate-900 dark:text-white">{startTime} – {endTime}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-zinc-400">Estimated total</span><strong className="text-orange-500">${total.toFixed(2)}</strong></div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setBookingOpen(false)} disabled={bookingLoading} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 dark:border-zinc-700 dark:text-white">Go back</button>
              <button onClick={submitBooking} disabled={bookingLoading} className="flex-1 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white disabled:opacity-50">{bookingLoading ? "Sending…" : "Send request"}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
