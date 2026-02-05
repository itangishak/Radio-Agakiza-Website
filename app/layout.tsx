import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AppShell from "./AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Radio Agakiza — Radiyo y'icizere",
  description: "Tega amatwi Radio Agakiza. Ibiganiro, podikasti, inkuru n'ivyo bavuze.",
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="rn">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-white text-zinc-900`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
