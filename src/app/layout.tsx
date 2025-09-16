import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Nabil Saragih",
    template: "%s | Nabil Saragih",
  },
  description:
    "Nabil Saragih is an AI & IoT Engineer specialising in edge AI, machine learning, and intelligent connected systems.",
  keywords: [
    "Muhammad Nabil Saragih",
    "Nabil Saragih",
    "AI engineer",
    "IoT engineer",
    "Edge AI",
    "Machine Learning",
    "AI & IoT portfolio",
    "AI blog",
    "IoT blog",
  ],
  authors: [{ name: "Muhammad Nabil Saragih" }, { name: "Nabil Saragih" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Muhammad Nabil Saragih | Nabil Saragih",
    title: "Muhammad Nabil Saragih (Nabil Saragih) | AI & IoT Engineer",
    description:
      "Portfolio and blog of Muhammad Nabil Saragih (also known as Nabil Saragih), an AI & IoT Engineer focused on edge AI, machine learning, and IoT systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Nabil Saragih | Nabil Saragih",
    description: "AI & IoT Engineer covering edge AI, machine learning, and smart IoT solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Init tema SEBELUM hydration (anti flicker & mismatch)
const ThemeInit = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
      (function() {
        try {
          const ls = localStorage.getItem('theme');
          // Default to light when no preference saved
          const wantDark = ls ? ls === 'dark' : false;
          const html = document.documentElement;
          if (wantDark) html.classList.add('dark'); else html.classList.remove('dark');
        } catch (e) {}
      })();
      `,
    }}
  />
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInit />
      </head>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased
          bg-white text-gray-900
          dark:bg-neutral-950 dark:text-white
        `}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
