"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CinematicLoader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ delay: 0.18 });
      timeline
        .fromTo(".loader-logo", { opacity: 0, scale: 0.86, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.55, ease: "power3.out" })
        .fromTo(".loader-slash", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.24, ease: "power4.in" })
        .to(".loader-flash", { opacity: 1, duration: 0.06 })
        .to(".loader-logo-top", { x: "-18vw", y: "-13vh", rotation: -3, opacity: 0, duration: 0.48, ease: "power4.in" }, "<")
        .to(".loader-logo-bottom", { x: "18vw", y: "13vh", rotation: 3, opacity: 0, duration: 0.48, ease: "power4.in" }, "<")
        .to(".loader-flash", { opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.35")
        .to(".loader-plane", { opacity: 0, duration: 0.9, ease: "power2.out" }, "-=0.4")
        .to(".loader-caption", { opacity: 0, duration: 0.3 }, "<")
        .to(root.current, { opacity: 0, duration: 0.45, ease: "power2.out" })
        .set(root.current, { display: "none" });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root} className="loader-panel fixed inset-0 z-[100] overflow-hidden bg-[#070a12]">
      <div className="loader-plane" />
      <div className="loader-logo" aria-label="ARISE / OSC">
        <div className="loader-logo-slice loader-logo-top"><img src="/arise-logo.jpeg" alt="" />{/* eslint-disable-line @next/next/no-img-element */}<span>ARISE / OSC</span></div>
        <div className="loader-logo-slice loader-logo-bottom"><img src="/arise-logo.jpeg" alt="" />{/* eslint-disable-line @next/next/no-img-element */}<span>ARISE / OSC</span></div>
      </div>
      <div className="loader-slash" aria-hidden="true"><span /></div>
      <div className="loader-flash" aria-hidden="true" />
      <p className="loader-caption">Enter the open source dimension</p>
    </div>
  );
}
