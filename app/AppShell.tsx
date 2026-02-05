"use client";
import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StickyPlayer from "../components/StickyPlayer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/admin");

  return (
    <>
      {!hideChrome && <Header />}
      <main className={hideChrome ? "" : "min-h-screen pb-28"}>{children}</main>
      {!hideChrome && <Footer />}
      {!hideChrome && <StickyPlayer />}
    </>
  );
}
