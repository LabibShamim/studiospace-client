
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import StudioCard from "@/components/StudioCard";
import {
  fetchDestinations,
  type Destination,
} from "@/lib/destinations";

export default function TopDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchDestinations(true)
      .then((data) => {
        if (!cancelled) {
          setDestinations(data);
        }
      })
      .catch((error) => {
        console.error(error);

        if (!cancelled) {
          setDestinations([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || destinations.length === 0) return null;

  return (
    <section className="bg-[#f8fafc] px-4 py-14 transition-colors duration-300 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[2px] text-orange-500">
              Handpicked Spaces
            </p>

            <h2 className="text-2xl font-extrabold tracking-tight text-[#172b45] dark:text-white sm:text-3xl">
              Featured Creative Spaces
            </h2>
          </div>

          <Link
            href="/studios"
            className="group mb-1 flex shrink-0 items-center gap-1 text-xs font-semibold text-orange-500 transition-colors hover:text-red-600"
          >
            View All Studios
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-h-[380px]">
          {destinations.slice(0, 6).map((studio, index) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
