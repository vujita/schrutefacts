import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Geist_Mono, VT323 } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
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
        className={`${dmSans.variable} ${bebasNeue.variable} ${geistMono.variable} ${vt323.variable} antialiased`}
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
