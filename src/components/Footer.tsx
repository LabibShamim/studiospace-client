
"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-300">
      <div className="mx-auto max-w-7xl py-10   pt-0 pb-5">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Logo & Description */}
          <div className="flex flex-col pt-3 items-start" >
            <Link href="/" className="mb-2 inline-flex items-center">
              <div className="relative  h-16 w-40 shrink-0">
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-7 text-gray-500 dark:text-gray-400">
              Discover inspiring creative spaces and bring your ideas to life.
              Connect with the perfect place to create, collaborate, and grow.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="https://x.com" target="_blank" rel="noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white dark:border-zinc-700">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.5L5.5 22H2.35l7.25-8.3L1.8 2h6.4l4.43 6.96L18.9 2Zm-1.1 17.9h1.73L7.28 4.02H5.43L17.8 19.9Z" />
                </svg>
              </a>

              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white dark:border-zinc-700">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>

              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white dark:border-zinc-700">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
                  <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.2V13H10v8h3.5Z" />
                </svg>
              </a>

              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white dark:border-zinc-700">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                  <path d="M5.2 3a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.3 9h3.8v12H3.3V9Zm6.1 0H13v1.6h.1c.5-.9 1.7-1.9 3.6-1.9 3.9 0 4.6 2.5 4.6 5.7V21h-3.8v-5.9c0-1.4 0-3.3-2-3.3s-2.3 1.5-2.3 3.2V21H9.4V9Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-gray-900 dark:text-white pt-8">
              Quick Links
            </h3>

            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="transition hover:text-orange-500">Home</Link></li>
              <li><Link href="/studios" className="transition hover:text-orange-500">Explore Studios</Link></li>
              <li><Link href="/add-studio" className="transition hover:text-orange-500">Become a Host</Link></li>
              <li><Link href="/about" className="transition hover:text-orange-500">About Us</Link></li>
              <li><Link href="/" className="transition hover:text-orange-500">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 pt-8 text-lg font-bold text-gray-900 dark:text-white">
              Popular Categories
            </h3>

            <ul className="space-y-4 text-sm">
              <li><Link href="/studios?category=photo" className="transition hover:text-orange-500">Photo Studios</Link></li>
              <li><Link href="/studios?category=film" className="transition hover:text-orange-500">Film Stages</Link></li>
              <li><Link href="/studios?category=podcast" className="transition hover:text-orange-500">Podcast Lounges</Link></li>
              <li><Link href="/studios?category=music" className="transition hover:text-orange-500">Music Suites</Link></li>
              <li><Link href="/studios?category=workshop" className="transition hover:text-orange-500">Creative Workshops</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-5 pt-8 text-lg font-bold text-gray-900 dark:text-white">
              Stay Inspired
            </h3>

            <p className="mb-5 text-sm leading-7 text-gray-500 dark:text-gray-400">
              Subscribe to our newsletter for creative spaces, updates, and exclusive offers.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white transition hover:bg-orange-600"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <p className="mt-3 text-xs text-gray-400">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="my-5 border-t border-gray-200 dark:border-zinc-800" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm sm:flex-row sm:text-left">
          <p className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/terms" className="transition hover:text-orange-500">
              Terms & Conditions
            </Link>

            <Link href="/privacy" className="transition hover:text-orange-500">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
