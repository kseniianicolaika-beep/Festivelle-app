"use client";
import { motion } from "motion/react";

// A celebratory burst of hearts (used when a guest says yes).
export function HeartBurst({ color = "#c06c78" }: { color?: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const d = 90 + (i % 3) * 40;
        return (
          <motion.svg key={i} viewBox="0 0 24 24" className="absolute h-5 w-5" initial={{ x: 0, y: 0, scale: 0, opacity: 1 }} animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d - 30, scale: [0, 1.2, 0.9], opacity: [1, 1, 0], rotate: (i % 2 ? 1 : -1) * 30 }} transition={{ duration: 1.6, ease: "easeOut", delay: (i % 4) * 0.04 }}>
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z" fill={i % 3 ? color : "#e9cf98"} />
          </motion.svg>
        );
      })}
    </div>
  );
}
