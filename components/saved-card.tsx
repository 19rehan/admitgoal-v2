"use client"

import Link from "next/link"
import { Bookmark, Bell, BarChart3, Calendar, GraduationCap } from "lucide-react"
import type { Scholarship } from "@/lib/scholarships"

export function matchBadge(pct: number) {
  if (pct >= 80) return { color: "oklch(0.8 0.16 155)", bg: "oklch(0.55 0.16 150 / 0.18)" }
  if (pct >= 65) return { color: "oklch(0.82 0.15 78)", bg: "oklch(0.78 0.15 75 / 0.18)" }
  return { color: "oklch(0.72 0.18 25)", bg: "oklch(0.62 0.2 25 / 0.18)" }
}

export function SavedCard({
  scholarship,
  savedLabel,
  urgentDays,
  onUnsave,
  onReminder,
  onTrack,
}: {
  scholarship: Scholarship
  savedLabel?: string
  urgentDays?: number
  onUnsave: (id: string) => void
  onReminder: (s: Scholarship) => void
  onTrack: (id: string) => void
}) {
  const s = scholarship
  const fully = s.funding_type === "Fully Funded"
  const mb = matchBadge(s.match_percentage)
  const urgent = typeof urgentDays === "number" && urgentDays <= 7

  return (
    <article
      className="group glass relative flex flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5"
      style={{ background: "rgba(26,26,46,0.55)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.5), 0 12px 40px rgba(139,92,246,0.25)" }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{s.flag}</span>
          <span className="text-sm font-medium text-muted-foreground">{s.country}</span>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{ background: mb.bg, color: mb.color }}
        >
          {s.match_percentage}% Match
        </span>
      </div>

      <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-foreground">{s.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{s.university_name}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
          <GraduationCap className="size-3.5" /> {s.degree_level}
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs"
          style={urgent ? { background: "oklch(0.62 0.2 25 / 0.18)", color: "oklch(0.72 0.18 25)" } : { background: "rgba(255,255,255,0.05)", color: "var(--muted-foreground)" }}
        >
          <Calendar className="size-3.5" /> {urgent ? `${urgentDays} days left` : s.deadline}
        </span>
        <span
          className="rounded-lg px-2.5 py-1 text-xs font-medium"
          style={fully ? { background: "oklch(0.55 0.16 150 / 0.15)", color: "oklch(0.8 0.16 155)" } : { background: "oklch(0.78 0.15 75 / 0.15)", color: "oklch(0.82 0.15 78)" }}
        >
          {s.funding_type}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-4">
        <IconBtn label="Unsave" active onClick={() => onUnsave(s.id)}>
          <Bookmark className="size-4" fill="currentColor" />
        </IconBtn>
        <IconBtn label="Set reminder" onClick={() => onReminder(s)}>
          <Bell className="size-4" />
        </IconBtn>
        <IconBtn label="Add to tracker" onClick={() => onTrack(s.id)}>
          <BarChart3 className="size-4" />
        </IconBtn>
        <Link
          href={`/scholarship/${s.id}`}
          className="flex-1 rounded-lg border border-white/15 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
        >
          View Details
        </Link>
      </div>

      {savedLabel && <p className="mt-3 text-xs text-muted-foreground">{savedLabel}</p>}
    </article>
  )
}

function IconBtn({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
        active
          ? "border-brand bg-brand/20 text-[oklch(0.8_0.14_300)]"
          : "border-white/15 text-muted-foreground hover:bg-white/5 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}
