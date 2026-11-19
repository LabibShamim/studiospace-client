
"use client";

import Link from "next/link";
import {
  Camera,
  Video,
  Mic,
  Music,
  Palette,
} from "lucide-react";

const categories = [
  {
    name: "Photo Studio",
    description: "Cyc walls, strobe lighting & gear",
    icon: Camera,
  },
  {
    name: "Film Stage",
    description: "Sound stages & grid rigging",
    icon: Video,
  },
  {
    name: "Podcast Lounge",
    description: "Acoustic booths & 4K multi-cam",
    icon: Mic,
  },
  {
    name: "Music Suite",
    description: "Mixing consoles & instruments",
    icon: Music,
  },
  {
    name: "Workshop",
    description: "Daylight studios for artisans",
    icon: Palette,
  },
];

export default function StudioCategories() {
  return (
    <section className="bg-[#f8fafc] px-4 py-14 transition-colors duration-300 dark:bg-zinc-950 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-12 lg:mb-14">
          <p className="mb-3 text-xs font-bold tracking-[2px] text-orange-500 sm:text-sm">
            EXPLORE BY TYPE
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-[#172b45] dark:text-white sm:text-3xl md:text-4xl">
            Browse Studio Categories
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-zinc-400 sm:text-base">
            Find specialized production spaces tailored precisely to your creative craft.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                href={`/studios?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="group flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-7 text-center transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/60 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-500/50 dark:hover:shadow-orange-950/20 sm:min-h-[214px] sm:rounded-[26px]"
              >
                <div className="mb-5 flex size-16 shrink-0 items-center justify-center rounded-[20px] bg-orange-50 text-orange-500 shadow-md transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-500/10 dark:shadow-none dark:group-hover:bg-orange-500 sm:size-[74px] sm:rounded-[22px]">
                  <Icon size={32} strokeWidth={2} className="sm:hidden" />
                  <Icon size={34} strokeWidth={2} className="hidden sm:block" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {category.name}
                </h3>

                <p className="mt-1.5 max-w-[190px] text-sm leading-5 text-slate-400 dark:text-zinc-400">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
