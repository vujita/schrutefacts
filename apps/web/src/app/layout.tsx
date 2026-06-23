import type { Metadata } from "next";
import { Geist, Geist_Mono, Special_Elite } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Schrutefacts — Bears. Beets. Battlestar Galactica.",
  description:
    "The world's foremost repository of Schrute family wisdom, beet-based intelligence, and hard facts. A Schrute Farms production.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${specialElite.variable} antialiased`}
      >
        <Providers>
          <div className="grid grid-rows-[auto_1fr] min-h-svh">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
