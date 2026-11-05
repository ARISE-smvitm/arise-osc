import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const isLarge = size === "lg";

  return (
    <Link
      href="/"
      prefetch={false}
      className={`group inline-flex items-center gap-2 select-none ${className}`}
      aria-label="ARISE Open Source Community"
    >
      <div className="flex items-center tracking-[-0.03em]">
        <span
          className={`          font-black text-[var(--text-primary)] group-hover:text-[#FF2A6D] transition-colors ${
            isLarge ? "text-2xl" : "text-xl"
          }`}
        >
          ARISE
        </span>
        <span className="mx-1.5 font-light text-[var(--text-muted)]">/</span>
        <span className="border border-[var(--border-subtle)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-secondary)]">
          OSC
        </span>
      </div>
      {/* Minimal subtle sakura petal */}
      <span className="sakura-petal ml-0.5 group-hover:scale-110 transition-transform" />
    </Link>
  );
}
