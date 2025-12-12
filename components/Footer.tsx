import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/70">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-10 flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-white">
          <span className="font-display text-base sm:text-lg text-cyan-neon">Pixo</span>
          <span className="text-white/60">Posters &amp; Polaroids</span>
        </div>
        <p>Crafted with cyan glow aesthetics. Minimal, sharp, and premium.</p>
        <div className="flex items-center gap-4">
          <p className="text-white/40">© {new Date().getFullYear()} Pixo.</p>
          <Link href="/admin/login" className="text-white/40 hover:text-cyan-neon transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

