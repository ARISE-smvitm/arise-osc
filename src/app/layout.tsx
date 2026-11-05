import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import CinematicLoader from "@/components/CinematicLoader";
import SakuraBackground from "@/components/SakuraBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARISE — Open Source Community | SMVITM",
  description:
    "The open source community at SMVITM. Learn Git, contribute to open source projects, and build software together across OSC, GDSC, IEEE CS, and ARC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[#FF2A6D] selection:text-white">
        <CinematicLoader />
        <SakuraBackground />
        <CustomCursor />
        <Navbar />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
