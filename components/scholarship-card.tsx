"use client"

import { Bookmark, Calendar, GraduationCap, Sparkles } from "lucide-react"
import type { Scholarship } from "@/lib/scholarships"

function matchColor(pct: number) {
  if (pct >= 85) return "oklch(0.75 0.16 155)"
  if (pct >= 70) return "oklch(0.78 0.15 75)"
  return "oklch(0.65 0.2 25)"
}

export function ScholarshipCard({
  scholarship,
  isLoggedIn,
  isSaved,
  onToggleSave,
}: {
  scholarship: Scholarship
  isLoggedIn: boolean
  isSaved: boolean
  onToggleSave: (id: string) => void
}) {
  const s = scholarship
  const fully = s.funding_type === "Fully Funded"

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
          {s.is_new && (
            <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[oklch(0.78_0.14_300)]">
              NEW
            </span>
          )}
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={
            fully
              ? { background: "oklch(0.55 0.16 150 / 0.18)", color: "oklch(0.8 0.16 155)" }
              : { background: "oklch(0.78 0.15 75 / 0.18)", color: "oklch(0.82 0.15 78)" }
          }
        >
          {s.funding_type}
        </span>
      </div>

      <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-foreground">{s.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{s.university_name}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
          <GraduationCap className="size-3.5" /> {s.degree_level}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
          <Calendar className="size-3.5" /> {s.deadline}
        </span>
      </div>

      {isLoggedIn && (
        <div className="mt-4 flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: matchColor(s.match_percentage) }} />
          <span className="text-sm font-semibold" style={{ color: matchColor(s.match_percentage) }}>
            {s.match_percentage}% Match
          </span>
          <Sparkles className="size-3.5 text-accent" />
        </div>
      )}

      <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
        <button
          onClick={() => onToggleSave(s.id)}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove bookmark" : "Save scholarship"}
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
            isSaved
              ? "border-brand bg-brand/20 text-[oklch(0.8_0.14_300)]"
              : "border-white/15 text-muted-foreground hover:bg-white/5"
          }`}
        >
          <Bookmark className="size-4" fill={isSaved ? "currentColor" : "none"} />
        </button>
        <a
          href={`/scholarship/${s.id}`}
          className="flex-1 rounded-lg border border-white/15 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
        >
          View Details
        </a>
      </div>
    </article>
  )
}

export function ScholarshipCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5" style={{ background: "rgba(26,26,46,0.55)" }}>
      <div className="flex items-center justify-between">
        <div className="shimmer h-5 w-24 rounded" />
        <div className="shimmer h-5 w-20 rounded-full" />
      </div>
      <div className="shimmer mt-4 h-6 w-3/4 rounded" />
      <div className="shimmer mt-2 h-4 w-1/2 rounded" />
      <div className="mt-4 flex gap-2">
        <div className="shimmer h-7 w-20 rounded-lg" />
        <div className="shimmer h-7 w-24 rounded-lg" />
      </div>
      <div className="mt-5 flex gap-3 border-t border-white/5 pt-4">
        <div className="shimmer size-10 rounded-lg" />
        <div className="shimmer h-10 flex-1 rounded-lg" />
      </div>
    </div>
  )
}
