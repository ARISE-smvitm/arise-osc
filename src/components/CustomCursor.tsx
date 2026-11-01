"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only run on desktop/fine pointers
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Fast, smooth hardware-accelerated 60/120fps GSAP quickTo
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3.out" });

    // Initial positioning offscreen
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    let hasMoved = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
        hasMoved = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest("a, button, input, [role='button'], .hover-trigger");
      setIsHovered(!!isInteractive);
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
      hasMoved = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[99999] rounded-full mix-blend-difference border border-black bg-white transition-transform duration-200 ease-out ${
        isHovered ? "w-20 h-20 scale-100" : "w-8 h-8 scale-100"
      }`}
      style={{
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}
