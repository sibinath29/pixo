"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setOrderId(params.get("orderId"));
    }
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="glass rounded-2xl border border-white/10 p-8 sm:p-10 max-w-md w-full text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-neon/20 border-2 border-cyan-neon flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-neon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl text-cyan-neon">Payment Successful!</h1>
            <p className="text-white/60 text-sm sm:text-base">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {orderId && (
            <div className="rounded-lg border border-white/10 bg-black/50 p-4">
              <p className="text-xs text-white/60 mb-1">Order ID</p>
              <p className="text-sm font-mono text-cyan-neon">{orderId}</p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <p className="text-sm text-white/80">
              A confirmation email has been sent to your email address with order details.
            </p>
            <p className="text-sm text-white/60">
              We&apos;ll start processing your order and you&apos;ll receive updates via email.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/" className="cta-btn flex-1 text-center">
              Continue Shopping
            </Link>
            <Link
              href="/posters"
              className="rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-neon hover:text-cyan-neon text-center"
            >
              View Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
