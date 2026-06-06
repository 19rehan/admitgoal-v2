"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Menu, X, GraduationCap, ChevronDown, Bell } from "lucide-react"
import { notifications as notifData, currentUser } from "@/lib/scholarships"

const links = [
  { label: "Home", href: "/#home" },
  { label: "Scholarships", href: "/#scholarships" },
  { label: "About", href: "/#how-it-works" },
  { label: "Contact", href: "/#footer" },
]

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Saved", href: "/saved" },
  { label: "Applications", href: "/applications" },
  { label: "Reminders", href: "/reminders" },
  { label: "Profile", href: "/profile/edit" },
  { label: "Logout", href: "/login" },
]

function dotFor(icon: string) {
  if (icon === "deadline") return "oklch(0.65 0.2 25)"
  if (icon === "match") return "oklch(0.75 0.16 155)"
  return "oklch(0.72 0.18 300)"
}

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setBellOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const unread = notifData.filter((n) => n.unread).length

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-xl" : "bg-transparent"
      }`}
      style={{
        borderBottom: "1px solid rgba(139,92,246,0.15)",
        boxShadow: scrolled ? "0 1px 24px rgba(139,92,246,0.12)" : "none",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/#home" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_18px_rgba(139,92,246,0.5)]">
            <GraduationCap className="size-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-gradient-brand">AdmitGoal</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex" ref={ref}>
          {isLoggedIn ? (
            <>
              <div className="relative">
                <button
                  onClick={() => {
                    setBellOpen((v) => !v)
                    setMenuOpen(false)
                  }}
                  aria-label="Notifications"
                  className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  <Bell className="size-5" />
                  {unread > 0 && (
                    <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[oklch(0.62_0.22_25)] text-[9px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="glass absolute right-0 mt-2 w-80 rounded-2xl p-2" style={{ background: "rgba(26,26,46,0.95)" }}>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-semibold text-foreground">Notifications</span>
                      <button className="text-xs font-medium text-[oklch(0.72_0.18_300)] hover:underline">Mark all read</button>
                    </div>
                    <div className="flex flex-col gap-1">
                      {notifData.map((n) => (
                        <div key={n.id} className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5">
                          <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: dotFor(n.icon) }} />
                          <div className="min-w-0">
                            <p className="text-sm text-foreground">{n.text}</p>
                            <p className="text-xs text-muted-foreground">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href="/reminders" className="mt-1 block rounded-xl px-3 py-2.5 text-center text-sm font-medium text-[oklch(0.72_0.18_300)] transition-colors hover:bg-white/5">
                      View All Notifications
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setMenuOpen((v) => !v)
                    setBellOpen(false)
                  }}
                  className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-white/5"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-sm font-semibold text-white">
                    {currentUser.initials}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
                {menuOpen && (
                  <div className="glass absolute right-0 mt-2 w-48 rounded-xl p-1.5 text-sm" style={{ background: "rgba(26,26,46,0.95)" }}>
                    {menuItems.map((i) => (
                      <Link
                        key={i.label}
                        href={i.href}
                        className="block rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                      >
                        {i.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
                Login
              </Link>
              <Link href="/signup" className="rounded-lg bg-gradient-to-r from-brand to-brand-2 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.03]">
                Get Started
              </Link>
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
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/5 py-4 text-2xl font-semibold text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-center text-base font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)]">
                    Dashboard
                  </Link>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/15 py-3 text-center text-base font-medium text-foreground">
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/15 py-3 text-center text-base font-medium text-foreground">
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-center text-base font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)]">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
