"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useUser } from "@/contexts/UserContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Posters", href: "/posters" },
  { label: "Polaroids", href: "/polaroids" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCount } = useCart();
  const { data: session } = useSession();
  const { user: backendUser, logout: logoutBackend } = useUser();
  const cartCount = getTotalCount();
  
  // Use backend user or NextAuth session
  const currentUser = backendUser || (session?.user ? {
    id: session.user.id || "",
    name: session.user.name || "",
    email: session.user.email || "",
    image: session.user.image || undefined,
  } : null);

  const handleLogout = () => {
    if (backendUser) {
      logoutBackend();
    } else {
      signOut({ callbackUrl: "/" });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="mt-2 sm:mt-4 flex items-center justify-between rounded-full border border-white/10 bg-black/70 px-3 sm:px-4 py-2 sm:py-3 shadow-[0_10px_50px_rgba(0,0,0,0.35)]">
          <Link href="/" className="flex items-center">
            <Image
              src="/Pixo_logopng.png"
              alt="Pixo Logo"
              width={120}
              height={40}
              className="h-8 sm:h-10 md:h-12 w-auto"
              priority
              style={{ objectFit: "contain" }}
            />
          </Link>

          <nav className="hidden items-center gap-5 sm:gap-7 text-sm font-semibold md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-underline ${isActive ? "active text-cyan-neon" : "text-white/80 hover:text-white"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/posters"
              className="hidden rounded-full border border-cyan-neon px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-cyan-neon transition hover:bg-cyan-neon hover:text-black sm:inline-flex"
            >
              Shop
            </Link>
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {currentUser.image && (
                    <Image
                      src={currentUser.image}
                      alt={currentUser.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full border border-cyan-neon/50"
                    />
                  )}
                  <span className="text-xs text-white/80 hidden md:block">{currentUser.name || currentUser.email}</span>
                </div>
                <Link
                  href="/orders"
                  className="rounded-full border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:border-cyan-neon hover:text-cyan-neon"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:border-red-500 hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-full border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:border-cyan-neon hover:text-cyan-neon sm:inline-flex"
              >
                Login
              </Link>
            )}
            <Link href="/cart" className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/10 bg-glass">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h15l-1.5 9h-12zM9 10v6m6-6v6M5 6l-1-2M9 21a.75.75 0 100-1.5.75.75 0 000 1.5zm8 0a.75.75 0 100-1.5.75.75 0 000 1.5z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] items-center justify-center rounded-full bg-cyan-neon px-0.5 sm:px-1 text-[10px] sm:text-xs font-bold text-black shadow-neon">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-glass text-white"
              aria-label="Toggle menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[72px] left-3 right-3 z-30 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-lg shadow-[0_10px_50px_rgba(0,0,0,0.5)]"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-cyan-neon/20 text-cyan-neon border border-cyan-neon/50"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {currentUser && (
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white text-center transition hover:border-cyan-neon hover:text-cyan-neon"
                >
                  My Orders
                </Link>
              )}
              <Link
                href="/posters"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 rounded-lg border border-cyan-neon px-4 py-3 text-sm font-semibold text-cyan-neon text-center transition hover:bg-cyan-neon hover:text-black"
              >
                Shop Now
              </Link>
              {currentUser && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 rounded-lg border border-red-500/50 px-4 py-3 text-sm font-semibold text-red-400 text-center transition hover:bg-red-500/10"
                >
                  Logout
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

