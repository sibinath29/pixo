"use client";

import { useEffect, useState } from "react";

export default function NeonCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  // Enable only on non-touch / larger viewports to avoid getting stuck on mobile
  useEffect(() => {
    const updateEnabled = () => {
      const isTouch =
        typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);
      const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;
      setEnabled(prefersFinePointer && !isTouch && window.innerWidth > 768);
    };

    updateEnabled();
    window.addEventListener("resize", updateEnabled);
    return () => window.removeEventListener("resize", updateEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (event: MouseEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="cursor-glow" style={{ left: pos.x, top: pos.y }} />
      <div className="cursor-dot" style={{ left: pos.x, top: pos.y }} />
    </>
  );
}


