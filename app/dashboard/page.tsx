"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, Bookmark, Send, Sparkles, Clock, ArrowRight, Edit3 } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { StatCard } from "@/components/stat-card"
import { SavedCard } from "@/components/saved-card"
import { ReminderModal } from "@/components/reminder-modal"
import {
  scholarships,
  applications,
  currentUser,
  notifications,
  type Scholarship,
  type AppStatus,
} from "@/lib/scholarships"

const statusStyles: Record<AppStatus, { color: string; bg: string }> = {
  Planning: { color: "oklch(0.75 0.02 285)", bg: "rgba(255,255,255,0.08)" },
  Applying: { color: "oklch(0.7 0.15 250)", bg: "oklch(0.6 0.15 250 / 0.18)" },
  Submitted: { color: "oklch(0.78 0.14 300)", bg: "oklch(0.62 0.21 280 / 0.2)" },
  Accepted: { color: "oklch(0.8 0.16 155)", bg: "oklch(0.55 0.16 150 / 0.18)" },
  Rejected: { color: "oklch(0.72 0.18 25)", bg: "oklch(0.62 0.2 25 / 0.18)" },
}

const recentSaved = scholarships.slice(0, 3)
const deadlines = scholarships.slice(0, 3).map((s, i) => ({ s, days: [6, 21, 33][i] }))

export default function DashboardPage() {
  const [reminderFor, setReminderFor] = useState<Scholarship | null>(null)
  const unread = notifications.filter((n) => n.unread).length

  return (
    <DashboardShell>
      <ReminderModal open={!!reminderFor} scholarshipTitle={reminderFor?.title ?? ""} onClose={() => setReminderFor(null)} />

      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Good morning, {currentUser.firstName}! 👋</h1>
          <p className="mt-1 text-muted-foreground">You have 12 scholarships matching your profile</p>
        </div>
        <button aria-label="Notifications" className="relative rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[oklch(0.62_0.22_25)] text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Bookmark} value={8} label="Saved" glow="oklch(0.7 0.18 300)" />
        <StatCard icon={Send} value={3} label="Applications" glow="oklch(0.7 0.16 155)" />
        <StatCard icon={Sparkles} value={72} suffix="%" label="Profile Match" glow="oklch(0.78 0.15 75)" />
        <StatCard icon={Clock} value={2} label="Deadlines Soon" glow="oklch(0.65 0.2 25)" />
      </div>

      {/* AI Match Banner */}
      <div
        className="glass relative mt-6 overflow-hidden rounded-2xl p-6"
        style={{ background: "rgba(26,26,46,0.55)", borderLeft: "3px solid oklch(0.62 0.21 280)", boxShadow: "inset 12px 0 30px -20px oklch(0.62 0.21 280)" }}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_20px_rgba(139,92,246,0.5)]">
              <Sparkles className="size-6 text-white" />
            </span>
            <div>
              <p className="text-lg font-bold text-foreground">Your AI Match Score: {currentUser.completion}%</p>
              <p className="text-sm text-muted-foreground">Complete your profile to find better matches</p>
              <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10 sm:w-64">
                <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2" style={{ width: `${currentUser.completion}%` }} />
              </div>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="shrink-0 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
          >
            Complete Profile
          </Link>
        </div>
      </div>

      {/* Recently Saved */}
      <SectionHeader title="Recently Saved" href="/saved" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {recentSaved.map((s) => (
          <SavedCard
            key={s.id}
            scholarship={s}
            onUnsave={() => {}}
            onReminder={(sc) => setReminderFor(sc)}
            onTrack={() => {}}
          />
        ))}
      </div>

      {/* Applications */}
      <SectionHeader title="My Applications" href="/applications" />
      <div className="glass overflow-hidden rounded-2xl" style={{ background: "rgba(26,26,46,0.55)" }}>
        {applications.slice(0, 3).map((a, i) => {
          const st = statusStyles[a.status]
          const urgent = a.daysLeft <= 7
          return (
            <div
              key={a.id}
              className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${i > 0 ? "border-t border-white/5" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{a.flag}</span>
                <div>
                  <p className="font-semibold text-foreground">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.university}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: st.bg, color: st.color }}>
                  {a.status}
                </span>
                <span className="text-xs" style={urgent ? { color: "oklch(0.72 0.18 25)" } : { color: "var(--muted-foreground)" }}>
                  {a.deadline} · {a.daysLeft}d left
                </span>
                <Link href="/applications" aria-label="Edit application" className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                  <Edit3 className="size-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upcoming Deadlines */}
      <SectionHeader title="Deadlines Coming Up" />
      <div className="glass overflow-hidden rounded-2xl" style={{ background: "rgba(26,26,46,0.55)" }}>
        {deadlines.map(({ s, days }, i) => {
          const urgent = days <= 7
          return (
            <div key={s.id} className={`flex items-center justify-between gap-3 p-4 ${i > 0 ? "border-t border-white/5" : ""}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{s.flag}</span>
                <div>
                  <p className="font-semibold text-foreground">{s.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {s.deadline} · {days} days remaining
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {urgent && (
                  <span className="rounded-full bg-[oklch(0.62_0.2_25_/_0.18)] px-2.5 py-1 text-xs font-semibold text-[oklch(0.72_0.18_25)]">
                    Urgent
                  </span>
                )}
                <button onClick={() => setReminderFor(s)} aria-label="Set reminder" className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                  <Bell className="size-4" />
                </button>
                <Link href={`/scholarship/${s.id}`} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-white/5">
                  View
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardShell>
  )
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 mt-8 flex items-center justify-between">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-medium text-[oklch(0.72_0.18_300)] hover:underline">
          View All <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}
