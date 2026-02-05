"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-brand-100/50 shadow-lg shadow-brand-900/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src="/logo.png" alt="Radio Agakiza" className="h-10 w-10 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent">
              RADIO AGAKIZA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-brand-700 hover:text-accent-600 transition-colors relative group">
              Iyakiriro
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full" />
            </Link>
            <Link href="/programs" className="text-sm font-medium text-brand-700 hover:text-accent-600 transition-colors relative group">
              Gahunda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full" />
            </Link>
            <Link href="/podcasts" className="text-sm font-medium text-brand-700 hover:text-accent-600 transition-colors relative group">
              Ibiganiro
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full" />
            </Link>
            <Link href="/news" className="text-sm font-medium text-brand-700 hover:text-accent-600 transition-colors relative group">
              Ivyanditswe
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full" />
            </Link>
            <Link href="/about" className="text-sm font-medium text-brand-700 hover:text-accent-600 transition-colors relative group">
              Turi Bande
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-brand-100 bg-white/95 backdrop-blur-xl">
            <nav className="py-4 space-y-2">
              <Link href="/" className="block px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                Ahabanza
              </Link>
              <Link href="/programs" className="block px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                Ibiganiro
              </Link>
              <Link href="/podcasts" className="block px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                Podikasti
              </Link>
              <Link href="/news" className="block px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                Inkuru
              </Link>
              <Link href="/about" className="block px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                Turi Bande
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
