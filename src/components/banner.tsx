"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";

const slides = [
  {
    image: "/banner.jpg",
    badge: "PEER-TO-PEER CREATIVE MARKETPLACE",
    title: "Acoustic Perfection for Musicians.",
    description:
      "Book world-class music suites equipped with vintage consoles, vocal booths, and analog synthesizers.",
  },
  {
    image: "/banner1.jpg",
    badge: "PROFESSIONAL RECORDING STUDIOS",
    title: "Create Music Without Limits.",
    description:
      "Discover inspiring recording spaces with professional equipment to bring your creative vision to life.",
  },
  {
    image: "/hero-studio.jpg",
    badge: "YOUR SPACE. YOUR OPPORTUNITY.",
    title: "Turn Your Studio Into Income.",
    description:
      "List your creative space and connect with musicians, artists, and creators looking for their perfect studio.",
  },
];

export default function Banner() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative isolate overflow-hidden bg-[#21150f]">
      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1200}
        slidesPerView={1}
        loop={true}
        onSwiper={(instance) => setSwiper(instance)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="relative z-0 w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative flex min-h-[560px] items-center lg:min-h-[620px]">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt="Professional creative studio"
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/20" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

              {/* Content */}
              <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16">
                <div className="max-w-[680px]">
                  {/* Badge */}
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/15 px-4 py-2 text-[11px] font-bold tracking-[2px] text-orange-300 backdrop-blur-md sm:text-xs">
                    <span className="size-2 rounded-full bg-orange-400" />
                    {slide.badge}
                  </span>

                  {/* Heading */}
                  <h1 className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="mt-6 max-w-[590px] text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div className="mt-9 flex flex-wrap gap-4">
                    <Link
                      href="/studios"
                      className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-orange-500 px-8 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600"
                    >
                      Explore Studios
                      <span className="text-lg">→</span>
                    </Link>

                    <Link
                      href="/add-studio"
                      className="inline-flex h-14 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-8 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/20"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Center Pagination */}
      <div className="pointer-events-auto absolute bottom-7 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={index}
            type="button"
            onClick={() => swiper?.slideToLoop(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              activeIndex === index
                ? "w-10 bg-orange-500"
                : "w-5 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>

      {/* Previous Arrow */}
      <button
        type="button"
        onClick={() => swiper?.slidePrev()}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-50 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:border-orange-500 hover:bg-orange-500 sm:left-6 lg:left-10"
      >
        <span className="block -translate-y-0.5 text-2xl leading-none">‹</span>
      </button>

      {/* Next Arrow */}
      <button
        type="button"
        onClick={() => swiper?.slideNext()}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-50 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:border-orange-500 hover:bg-orange-500 sm:right-6 lg:right-10"
      >
        <span className="block -translate-y-0.5 text-2xl leading-none">›</span>
      </button>
    </section>
  );
}
