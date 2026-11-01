"use client";

import { motion } from "framer-motion";

export default function MarqueeTicker() {
  const items = [
    "ARISE OSC",
    "BUILD. LAUNCH. SCALE.",
    "OPEN SOURCE COMMUNITY",
    "SMVITM BANTAKAL",
    "OSC // GDSC // IEEE CS // ARC",
    "STUDENT COLLABORATION",
    "PEER-REVIEWED CODE",
  ];

  return (
    <div className="w-full overflow-hidden border-y border-black bg-[#0A0A0A] py-3.5 select-none text-white">
      <motion.div
        className="flex w-max whitespace-nowrap cursor-default"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30,
        }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {/* Set 1 */}
        <div className="flex items-center gap-12 pr-12 font-mono text-xs font-bold uppercase tracking-[0.1em] text-white">
          {items.map((item, idx) => (
            <span key={`a-${idx}`} className="flex items-center gap-12">
              <span>{item}</span>
              <span className="text-white/30">/</span>
            </span>
          ))}
        </div>

        {/* Set 2 (Seamless loop) */}
        <div className="flex items-center gap-12 pr-12 font-mono text-xs font-bold uppercase tracking-[0.1em] text-white">
          {items.map((item, idx) => (
            <span key={`b-${idx}`} className="flex items-center gap-12">
              <span>{item}</span>
              <span className="text-white/30">/</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
