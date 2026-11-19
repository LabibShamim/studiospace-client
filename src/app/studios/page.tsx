
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE } from "@/lib/api";
import type { Destination } from "@/lib/destinations";

const categories = [
  "All",
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const AllDestinationspage = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { const category = new URLSearchParams(window.location.search).get("category"); if (category) setActiveCategory(category); }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/studios`);

        if (!res.ok) {
          throw new Error("Failed to fetch studios");
        }

        const data = await res.json();

        const studioData = Array.isArray(data)
          ? data
          : data.studios || data.destinations || data.data || [];

        setDestinations(studioData);
      } catch {
        setError("Could not load studios. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        destination.title?.toLowerCase().includes(searchText) ||
        destination.location?.toLowerCase().includes(searchText);

      const matchesCategory =
        activeCategory === "All" ||
        destination.category?.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [destinations, search, activeCategory]);

  return (
    <main className="min-h-screen bg-[#f5f8fc] px-4 py-10 dark:bg-zinc-950 md:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#101827] dark:text-white md:text-4xl">
            Explore Our Studios
          </h1>

          <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400">
            Find the perfect creative space for your next project.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#dce4ef] bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:flex-row">

          <input
            type="text"
            placeholder="Search by studio name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-[#f0f4f9] px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-orange-400 dark:bg-zinc-800 dark:text-white md:max-w-[300px]"
          />

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  activeCategory === category
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-[#f0f4f9] text-gray-700 hover:bg-orange-100 dark:bg-zinc-800 dark:text-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 dark:text-zinc-400">
            Loading studios...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500">
            {error}
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="py-20 text-center text-gray-500 dark:text-zinc-400">
            No studios found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((destination) => (
              <div
                key={destination._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dce4ef] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative h-[280px] w-full overflow-hidden bg-gray-200 dark:bg-zinc-800 sm:h-[300px]">
                  <Image
                    src={destination.imageUrl || "/studiopic.jpg"}
                    alt={destination.title || "Studio"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-3 top-3 rounded-md bg-[#101827]/90 px-3 py-1.5 text-xs font-semibold text-white">
                    {destination.category || "Studio"}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-[#101827]/85 px-5 py-3 text-sm text-white">
                    <p>
                      <span className="font-bold text-yellow-400">
                        ${destination.hourlyRate ?? 0}
                      </span>
                      <span className="text-gray-300"> / hr</span>
                    </p>

                    <p className="text-xs text-gray-300">
                      Capacity: {destination.maxCapacity ?? "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="truncate text-lg font-semibold text-[#101827] dark:text-white">
                    {destination.title || "Untitled Studio"}
                  </h2>

                  <p className="mt-2 truncate text-sm text-gray-500 dark:text-zinc-400">
                    <span className="text-orange-500">⌖</span>{" "}
                    {destination.location || "Location unavailable"}
                  </p>

                  <Link
                    href={`/studios/${destination._id}`}
                    className="mt-5 flex w-full items-center justify-center rounded-lg bg-[#f0f4f9] py-3 text-sm font-semibold text-[#101827] transition hover:bg-orange-500 hover:text-white dark:bg-zinc-800 dark:text-white"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AllDestinationspage;
