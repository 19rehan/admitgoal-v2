"use client"

import { Bookmark, Calendar, GraduationCap } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const countryFlags: Record<string, string> = {
  "United Kingdom": "🇬🇧", "UK": "🇬🇧", "Germany": "🇩🇪", "Turkey": "🇹🇷",
  "China": "🇨🇳", "USA": "🇺🇸", "United States": "🇺🇸", "Canada": "🇨🇦",
  "Australia": "🇦🇺", "Japan": "🇯🇵", "South Korea": "🇰🇷", "France": "🇫🇷",
  "Netherlands": "🇳🇱", "Sweden": "🇸🇪", "Italy": "🇮🇹", "Spain": "🇪🇸",
  "Europe": "🇪🇺", "Malaysia": "🇲🇾", "New Zealand": "🇳🇿", "Ireland": "🇮🇪",
  "Switzerland": "🇨🇭", "Denmark": "🇩🇰", "Norway": "🇳🇴", "Finland": "🇫🇮",
  "Belgium": "🇧🇪", "Austria": "🇦🇹", "Singapore": "🇸🇬", "Hungary": "🇭🇺",
  "Poland": "🇵🇱", "Czech Republic": "🇨🇿", "Portugal": "🇵🇹",
}

function getFlag(country: string) {
  if (!country) return "🌍"
  for (const [key, flag] of Object.entries(countryFlags)) {
    if (country.toLowerCase().includes(key.toLowerCase())) return flag
  }
  return "🌍"
}

export function ScholarshipCard({
  scholarship,
  isSaved: initialSaved,
  onToggleSave,
}: {
  scholarship: any
  isSaved: boolean
  onToggleSave: (id: string) => void
}) {
  const s = scholarship
  const fully = (s.funding_type || "").toLowerCase().includes("fully")
  const flag = getFlag(s.country)
  const [saved, setSaved] = useState(initialSaved)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Check if user has saved this scholarship
    const checkSaved = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from("user_saved_scholarships")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("scholarship_id", s.id)
        .single()

      setSaved(!!data)
    }
    checkSaved()
  }, [s.id])

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      window.location.href = "/login"
      return
    }

    setSaving(true)

    if (saved) {
      await supabase
        .from("user_saved_scholarships")
        .delete()
        .eq("user_id", session.user.id)
        .eq("scholarship_id", s.id)
      setSaved(false)
    } else {
      await supabase
        .from("user_saved_scholarships")
        .insert({ user_id: session.user.id, scholarship_id: s.id })
      setSaved(true)
    }

    setSaving(false)
    onToggleSave(String(s.id))
  }

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
          <span className="text-xl">{flag}</span>
          <span className="text-sm font-medium text-muted-foreground">{s.country || "International"}</span>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={
            fully
              ? { background: "oklch(0.55 0.16 150 / 0.18)", color: "oklch(0.8 0.16 155)" }
              : { background: "oklch(0.78 0.15 75 / 0.18)", color: "oklch(0.82 0.15 78)" }
          }
        >
          {s.funding_type || "Scholarship"}
        </span>
      </div>

      <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-foreground">{s.title}</h3>
      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{s.university_name || "Multiple Universities"}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {s.degree_level && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
            <GraduationCap className="size-3.5" /> {s.degree_level}
          </span>
        )}
        {s.deadline && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
            <Calendar className="size-3.5" /> {s.deadline}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-white/5 pt-4 mt-5">
        <button
          onClick={handleSave}
          disabled={saving}
          aria-pressed={saved}
          aria-label={saved ? "Remove bookmark" : "Save scholarship"}
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
            saved
              ? "border-brand bg-brand/20 text-[oklch(0.8_0.14_300)]"
              : "border-white/15 text-muted-foreground hover:bg-white/5"
          } ${saving ? "opacity-50" : ""}`}
        >
          <Bookmark className="size-4" fill={saved ? "currentColor" : "none"} />
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