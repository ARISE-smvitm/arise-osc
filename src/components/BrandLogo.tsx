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
      className={`group inline-flex items-center gap-2 select-none ${className}`}
      aria-label="ARISE Open Source Community"
    >
      <div className="flex items-center tracking-[-0.03em]">
        <span
          className={`font-black text-black group-hover:text-[#E11D48] transition-colors ${
            isLarge ? "text-2xl" : "text-xl"
          }`}
        >
          ARISE
        </span>
        <span className="mx-1.5 text-black/20 font-light">/</span>
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373] bg-black/[0.04] px-1.5 py-0.5 border border-black/10">
          OSC
        </span>
      </div>
      {/* Minimal subtle sakura petal */}
      <span className="sakura-petal ml-0.5 group-hover:scale-110 transition-transform" />
    </Link>
  );
}
