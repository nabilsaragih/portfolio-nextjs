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
  description: "AI & IoT Engineer",
  keywords: ["AI", "IoT", "Edge AI", "Machine Learning", "Blog"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Nabil Saragih",
    title: "Nabil Saragih",
    description: "AI & IoT Engineer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nabil Saragih",
    description: "AI & IoT Engineer",
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
