"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const VERSES = [
  { text: "Every love story deserves to be beautifully told.", lang: "en" },
  { text: "Каждая история любви достойна красивых слов.", lang: "ru" },
  { text: "हर प्रेम कहानी ख़ूबसूरती से कही जानी चाहिए।", lang: "hi" },
  { text: "Two families. One beautiful beginning.", lang: "en" },
];

export function Verses({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % VERSES.length), 4800);
    return () => clearInterval(id);
  }, []);
  const v = VERSES[i];
  return (
    <div className={`relative min-h-[8rem] ${className}`}>
      <AnimatePresence mode="wait">
        <motion.p key={i} lang={v.lang} initial={{ opacity: 0, y: 16, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)" }} transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }} className="display text-4xl leading-[1.15] md:text-[3.4rem]">
          {v.text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
