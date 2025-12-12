"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { getAllProducts } from "@/utils/products";
import type { Product } from "@/data/products";
import Link from "next/link";

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await getAllProducts();
      // Show first 4 products as featured, or all if less than 4
      setFeatured(allProducts.slice(0, 4));
    };
    
    loadProducts();
    window.addEventListener("productsUpdated", loadProducts);
    
    return () => {
      window.removeEventListener("productsUpdated", loadProducts);
    };
  }, []);

  return (
    <div className="space-y-10 sm:space-y-12 md:space-y-14">
      <Hero />

      {featured.length > 0 && (
        <ProductGrid
          title="Featured Drops"
          subtitle="Curated cyan-forward prints picked for their glow."
          products={featured}
        />
      )}

      <div className="grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-2">
        <Link
          href="/posters"
          className="glass group relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6 card-hover"
        >
          <div className="absolute right-4 sm:right-6 top-4 sm:top-6 h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-cyan-neon/50 blur-[80px]" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-cyan-neon">Posters</p>
              <h3 className="font-display text-xl sm:text-2xl">Big, bold wall statements.</h3>
              <p className="text-sm sm:text-base text-white/60">Clean geometry, cyan neon strokes, ready to frame.</p>
            </div>
            <span className="rounded-full border border-cyan-neon px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-cyan-neon transition group-hover:bg-cyan-neon group-hover:text-black whitespace-nowrap">
              Shop
            </span>
          </div>
        </Link>

        <Link
          href="/polaroids"
          className="glass group relative overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6 card-hover"
        >
          <div className="absolute left-3 sm:left-4 bottom-3 sm:bottom-4 h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-cyan-neon/50 blur-[80px]" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-cyan-neon">Polaroids</p>
              <h3 className="font-display text-xl sm:text-2xl">Soft cyan snapshots.</h3>
              <p className="text-sm sm:text-base text-white/60">Pocket-sized glow with soft 2xl corners.</p>
            </div>
            <span className="rounded-full border border-cyan-neon px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-cyan-neon transition group-hover:bg-cyan-neon group-hover:text-black whitespace-nowrap">
              Shop
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

