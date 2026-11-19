
const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Filter through verified photo studios, sound stages, and podcast lounges.",
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description:
      "Pick your exact dates and hourly slots with real-time availability.",
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Secure reservation securely with instant confirmation and host chat.",
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Arrive at the studio and bring your creative vision to life.",
  },
];

export default function HowBookingWorks() {
  return (
    <section className="bg-[#f8fafc] px-4 py-12 transition-colors duration-300 dark:bg-zinc-950 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200/80 bg-[#f1f5f9] px-4 py-12 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-[28px] sm:px-8 sm:py-14 lg:px-9 lg:py-20">
        <div className="mb-10 text-center sm:mb-14 lg:mb-16">
          <p className="mb-3 text-xs font-bold tracking-[2px] text-orange-500 sm:text-sm">
            SEAMLESS WORKFLOW
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-[#172b45] dark:text-white sm:text-3xl md:text-4xl">
            How Booking Works
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-zinc-400 sm:text-base">
            Secure your dream studio space in four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex min-h-[220px] flex-col rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-orange-500/50 sm:min-h-[235px] sm:px-7 sm:py-8 lg:min-h-[255px] lg:rounded-[19px] lg:px-8"
            >
              <span className="absolute right-6 top-6 text-3xl font-bold text-orange-100 dark:text-orange-500/15 sm:text-4xl">
                {step.number}
              </span>

              <div className="relative mb-6 flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-lg font-bold text-white shadow-md shadow-amber-200/60 dark:shadow-none sm:size-[54px] sm:text-xl">
                {step.number}
              </div>

              <h3 className="mb-3 text-lg font-bold text-[#172b45] dark:text-white sm:text-xl">
                {step.title}
              </h3>

              <p className="text-sm leading-6 text-slate-500 dark:text-zinc-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
