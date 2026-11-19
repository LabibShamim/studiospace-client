
import Image from "next/image";
import { CheckCircle } from "lucide-react";

const features = [
  "$1M Liability Protection",
  "Verified Creator Profiles",
  "Secure Equipment Safety",
  "24/7 Concierge Support",
];

export default function HostGuarantee() {
  return (
    <section className="bg-[#f8fafc] px-4 py-14 transition-colors duration-300 dark:bg-zinc-950 sm:px-6 sm:py-16 md:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">

        {/* Left Content */}
        <div className="w-full">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-[11px] font-bold tracking-wide text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 sm:text-xs">
            TOTAL PEACE OF MIND
          </span>

          <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-[#172b45] dark:text-white sm:text-3xl md:text-4xl lg:mt-6">
            Host Guarantee & Creator Support
          </h2>

          <p className="mt-5 max-w-[680px] text-sm leading-7 text-slate-500 dark:text-zinc-400 sm:text-base">
            We protect every session with comprehensive liability coverage,
            verified creator profiles, equipment safety guarantees, and
            dedicated 24/7 host support.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-9">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex min-h-[60px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500/50 sm:px-5"
              >
                <CheckCircle
                  size={21}
                  strokeWidth={2}
                  className="shrink-0 text-emerald-500"
                />

                <span className="text-sm font-semibold leading-5 text-[#172b45] dark:text-zinc-200 sm:text-[15px]">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="relative h-[260px] w-full overflow-hidden rounded-2xl shadow-xl sm:h-[350px] sm:rounded-[22px] md:h-[420px] lg:h-[430px] lg:rounded-[26px]">
          <Image
            src="/studiopic.jpg"
            alt="Professional music recording studio"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
}
