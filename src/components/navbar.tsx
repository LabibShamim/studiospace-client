
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  Moon,
  Sun,
  X,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  apiFetch,
  establishApiSession,
} from "@/lib/api";

import toast from "react-hot-toast";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Theme initialization
  useEffect(() => {
    const saved = localStorage.getItem("studiospace-theme");

    const enabled = saved
      ? saved === "dark"
      : window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(enabled);

    document.documentElement.classList.toggle(
      "dark",
      enabled
    );
  }, []);

  // Synchronize Better Auth session with Backend JWT
  useEffect(() => {
    if (isPending || !session?.user?.id) {
      return;
    }

    let active = true;

    establishApiSession()
      .then(() => {
        if (active) {
          console.log(
            "StudioSpace: Backend session synchronized."
          );
        }
      })
      .catch((error) => {
        if (active) {
          console.error(
            "StudioSpace: Session synchronization failed:",
            error
          );

          toast.error(
            "Session synchronization failed. Please sign in again."
          );
        }
      });

    return () => {
      active = false;
    };
  }, [isPending, session?.user?.id]);

  // Theme toggle
  const toggleTheme = () => {
    const next = !dark;

    setDark(next);

    document.documentElement.classList.toggle(
      "dark",
      next
    );

    localStorage.setItem(
      "studiospace-theme",
      next ? "dark" : "light"
    );
  };

  // Active navigation link
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.toLowerCase() === href ||
        pathname
          .toLowerCase()
          .startsWith(`${href}/`);

  // Logout
  async function logout() {
    try {
      await authClient.signOut();

      await apiFetch("/api/logout", {
        method: "POST",
      });

      toast.success("You have signed out.");

      setProfileOpen(false);
      setMobileOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error(
        "Could not sign out. Please try again."
      );
    }
  }

  // Profile dropdown items
  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/add-studio",
      label: "Add New Studio",
      icon: PlusCircle,
    },
    {
      href: "/my-listings",
      label: "My Studio Listings",
      icon: Building2,
    },
    {
      href: "/my-bookings",
      label: "My Bookings",
      icon: CalendarDays,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95">

      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
        >
          <Image
            src="/Logo.png"
            alt="StudioSpace"
            width={180}
            height={44}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "text-orange-500"
                  : "text-zinc-600 hover:text-orange-500 dark:text-zinc-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          {/* Theme Toggle */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {dark ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* Authentication */}
          {!isPending &&
            (session?.user ? (
              <div className="relative hidden sm:block">

                {/* Profile Button */}
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen((v) => !v)
                  }
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 dark:border-zinc-700"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-8 place-items-center rounded-full bg-orange-500 text-sm font-bold text-white">
                      {session.user.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </span>
                  )}

                  <span className="max-w-28 truncate text-sm font-semibold text-slate-700 dark:text-zinc-200">
                    {session.user.name}
                  </span>

                  <ChevronDown size={15} />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">

                    {menuItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() =>
                            setProfileOpen(false)
                          }
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                          <Icon size={16} />
                          {item.label}
                        </Link>
                      );
                    })}

                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>

                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 sm:flex dark:border-zinc-700 dark:text-zinc-200"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="flex h-10 items-center rounded-lg bg-orange-500 px-4 text-sm font-bold text-white hover:bg-orange-600"
                >
                  Register
                </Link>
              </>
            ))}

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen((v) => !v)
            }
            className="flex size-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100 lg:hidden dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="border-t border-black/[0.06] bg-white px-5 py-4 lg:hidden dark:border-white/10 dark:bg-zinc-950">

          <div className="flex flex-col gap-1">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  isActive(link.href)
                    ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10"
                    : "text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile User Menu */}
            {session?.user && (
              <>
                <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />

                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300"
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold text-red-500"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </>
            )}

          </div>
        </nav>
      )}

    </header>
  );
}
