"use client"

import { useEffect, useState } from "react"
import { Menu, X, GraduationCap, ChevronDown } from "lucide-react"

const links = [
  { label: "Home", href: "#home" },
  { label: "Scholarships", href: "#scholarships" },
  { label: "About", href: "#how-it-works" },
  { label: "Contact", href: "#footer" },
]

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-xl" : "bg-transparent"
      }`}
      style={{ borderBottom: "1px solid rgba(139,92,246,0.15)", boxShadow: scrolled ? "0 1px 24px rgba(139,92,246,0.12)" : "none" }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_18px_rgba(139,92,246,0.5)]">
            <GraduationCap className="size-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-gradient-brand">AdmitGoal</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-white/5"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-sm font-semibold text-white">
                  A
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
              {menuOpen && (
                <div className="glass absolute right-0 mt-2 w-44 rounded-xl p-1.5 text-sm">
                  {["My Profile", "Saved", "Sign out"].map((i) => (
                    <button
                      key={i}
                      className="block w-full rounded-lg px-3 py-2 text-left text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                      {i}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
                Login
              </button>
              <button className="rounded-lg bg-gradient-to-r from-brand to-brand-2 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.03]">
                Get Started
              </button>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-foreground md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-6" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-lg font-bold text-gradient-brand">AdmitGoal</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="rounded-lg p-2">
              <X className="size-6 text-foreground" />
            </button>
          </div>
          <div className="flex flex-col gap-2 px-6 pt-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/5 py-4 text-2xl font-semibold text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              <button className="rounded-xl border border-white/15 py-3 text-base font-medium text-foreground">
                Login
              </button>
              <button className="rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-base font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)]">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
