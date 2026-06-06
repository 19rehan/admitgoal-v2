"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Bookmark,
  Send,
  Bell,
  User,
  Settings,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react"
import { GradientOrbs } from "@/components/gradient-orbs"
import { currentUser } from "@/lib/scholarships"

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Saved Scholarships", href: "/saved", icon: Bookmark },
  { label: "My Applications", href: "/applications", icon: Send },
  { label: "Reminders", href: "/reminders", icon: Bell },
  { label: "My Profile", href: "/profile/edit", icon: User },
]

const mobileNav = nav.slice(0, 5)

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
              active
                ? "bg-gradient-to-r from-brand to-brand-2 text-white shadow-[0_0_18px_rgba(139,92,246,0.4)]"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <Icon className="size-4.5 shrink-0" />
            {item.label}
          </Link>
        )
      })}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-foreground"
      >
        <Settings className="size-4.5 shrink-0" />
        Settings
      </Link>
    </nav>
  )
}

function UserCard() {
  return (
    <div className="glass flex items-center gap-3 rounded-xl p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-sm font-semibold text-white">
        {currentUser.initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{currentUser.name}</p>
        <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
      </div>
      <Link href="/login" aria-label="Log out" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
        <LogOut className="size-4" />
      </Link>
    </div>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <GradientOrbs />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-background/60 p-4 backdrop-blur-xl lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_18px_rgba(139,92,246,0.5)]">
            <GraduationCap className="size-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-gradient-brand">AdmitGoal</span>
        </Link>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <NavLinks />
        </div>
        <UserCard />
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-background/70 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2">
            <GraduationCap className="size-4 text-white" />
          </span>
          <span className="text-base font-bold text-gradient-brand">AdmitGoal</span>
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-foreground">
          <Menu className="size-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/10 bg-background/95 p-4 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold text-gradient-brand">AdmitGoal</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-foreground">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <UserCard />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="px-4 pb-24 pt-20 sm:px-6 lg:ml-64 lg:px-8 lg:pb-10 lg:pt-8">{children}</main>

      {/* Mobile bottom tab bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/80 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNav.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors ${
                  active ? "text-[oklch(0.72_0.18_300)]" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />
                {item.label.split(" ")[0]}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
