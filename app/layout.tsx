import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StickyPlayer from "../components/StickyPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Radio Agakiza — Live Christian Radio",
  description: "Listen live to Radio Agakiza. Programs, podcasts, news, and testimonies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900 dark:bg-black dark:text-zinc-100`}>
        <Header />
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 pb-28">
          {children}
        </main>
        <Footer />
        <StickyPlayer />
      </body>
    </html>
  );
}
