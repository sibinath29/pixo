"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentFailedPage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setOrderId(params.get("orderId"));
      setError(params.get("error"));
    }
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="glass rounded-2xl border border-white/10 p-8 sm:p-10 max-w-md w-full text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl text-red-400">Payment Failed</h1>
            <p className="text-white/60 text-sm sm:text-base">
              We couldn&apos;t process your payment. Please try again.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{decodeURIComponent(error)}</p>
            </div>
          )}

          {orderId && (
            <div className="rounded-lg border border-white/10 bg-black/50 p-4">
              <p className="text-xs text-white/60 mb-1">Order ID</p>
              <p className="text-sm font-mono text-white/80">{orderId}</p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <p className="text-sm text-white/80">
              If money was deducted from your account, it will be refunded within 5-7 business days.
            </p>
            <p className="text-sm text-white/60">
              If the problem persists, please contact our support team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/cart" className="cta-btn flex-1 text-center">
              Try Again
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-neon hover:text-cyan-neon text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
