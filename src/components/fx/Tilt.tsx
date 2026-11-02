"use client";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";

// Gentle 3D tilt with a moving sheen — makes paper feel held in the hand.
export function Tilt({ children, className = "", max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 120, damping: 18 });
  const gx = useTransform(mx, [0, 1], ["0%", "100%"]);
  const gy = useTransform(my, [0, 1], ["0%", "100%"]);
  const sheen = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.35), transparent 55%)`;
  return (
    <motion.div
      className={`relative [perspective:1200px] ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative">
        {children}
        <motion.div aria-hidden style={{ background: sheen }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
      </motion.div>
    </motion.div>
  );
}
