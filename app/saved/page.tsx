"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Search, Bookmark, Loader2 } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const countryFlags: Record<string, string> = {
  "United Kingdom": "🇬🇧", "UK": "🇬🇧", "Germany": "🇩🇪", "Turkey": "🇹🇷",
  "China": "🇨🇳", "USA": "🇺🇸", "United States": "🇺🇸", "Canada": "🇨🇦",
  "Australia": "🇦🇺", "Japan": "🇯🇵", "South Korea": "🇰🇷", "France": "🇫🇷",
  "Netherlands": "🇳🇱", "Sweden": "🇸🇪", "Italy": "🇮🇹", "Spain": "🇪🇸",
  "Europe": "🇪🇺", "Malaysia": "🇲🇾",
}

function getFlag(country: string) {
  if (!country) return "🌍"
  for (const [key, flag] of Object.entries(countryFlags)) {
    if (country.toLowerCase().includes(key.toLowerCase())) return flag
  }
  return "🌍"
}

function getDaysLeft(deadline: string) {
  if (!deadline) return null
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : null
}

function getTimeSinceSaved(savedAt: string) {
  const diff = Date.now() - new Date(savedAt).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return "Saved today"
  if (days === 1) return "Saved yesterday"
  if (days < 7) return `Saved ${days} days ago`
  if (days < 30) return `Saved ${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`
  return `Saved ${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`
}

const chips = ["All", "Fully Funded", "Masters", "PhD", "Deadline Soon"]
const sorts = ["Date Saved", "Deadline"]

export default function SavedPage() {
  const [savedScholarships, setSavedScholarships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [chip, setChip] = useState("All")
  const [sort, setSort] = useState("Date Saved")

  useEffect(() => {
    const fetchSaved = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Get saved scholarship IDs with saved_at
      const { data: savedData } = await supabase
        .from("user_saved_scholarships")
        .select("scholarship_id, saved_at")
        .eq("user_id", session.user.id)
        .order("saved_at", { ascending: false })

      if (!savedData || savedData.length === 0) {
        setLoading(false)
        return
      }

      const ids = savedData.map((s: any) => s.scholarship_id)

      // Get scholarship details
      const { data: schData } = await supabase
        .from("scholarship_details")
        .select("id, title, university_name, country, degree_level, funding_type, deadline")
        .in("id", ids)

      if (schData) {
        // Merge saved_at into scholarship data
        const merged = schData.map((sch: any) => {
          const savedInfo = savedData.find((s: any) => s.scholarship_id === sch.id)
          return { ...sch, saved_at: savedInfo?.saved_at }
        })
        setSavedScholarships(merged)
      }

      setLoading(false)
    }
    fetchSaved()
  }, [])

  const handleUnsave = async (scholarshipId: number) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase
      .from("user_saved_scholarships")
      .delete()
      .eq("user_id", session.user.id)
      .eq("scholarship_id", scholarshipId)

    setSavedScholarships((prev) => prev.filter((s) => s.id !== scholarshipId))
  }

  // Filter and sort
  let list = [...savedScholarships]

  if (query.trim()) {
    const q = query.toLowerCase()
    list = list.filter((s) =>
      (s.title || "").toLowerCase().includes(q) ||
      (s.country || "").toLowerCase().includes(q) ||
      (s.university_name || "").toLowerCase().includes(q)
    )
  }

  if (chip === "Fully Funded") list = list.filter((s) => (s.funding_type || "").toLowerCase().includes("fully"))
  if (chip === "Masters") list = list.filter((s) => (s.degree_level || "").toLowerCase().includes("master"))
  if (chip === "PhD") list = list.filter((s) => (s.degree_level || "").toLowerCase().includes("phd"))
  if (chip === "Deadline Soon") list = list.filter((s) => {
    const days = getDaysLeft(s.deadline)
    return days !== null && days <= 30
  })

  if (sort === "Deadline") {
    list = [...list].sort((a, b) => {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    })
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Saved Scholarships</h1>
        <span className="rounded-full bg-brand/20 px-3 py-1 text-sm font-semibold text-[oklch(0.78_0.14_300)]">{savedScholarships.length}</span>
      </div>

      {/* Search + sort */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search saved scholarships..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-brand"
        >
          {sorts.map((s) => (
            <option key={s} value={s} className="bg-[#1a1a2e]">
              Sort: {s}
            </option>
          ))}
        </select>
      </div>

      {/* Filter chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => setChip(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
              chip === c
                ? "bg-gradient-to-r from-brand to-brand-2 text-white shadow-[0_0_14px_rgba(139,92,246,0.4)]"
                : "border border-white/10 text-muted-foreground hover:bg-white/5"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid or empty */}
      {list.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => {
            const flag = getFlag(s.country)
            const daysLeft = getDaysLeft(s.deadline)
            const urgent = daysLeft !== null && daysLeft <= 7
            const fully = (s.funding_type || "").toLowerCase().includes("fully")

            return (
              <article
                key={s.id}
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
                      {s.degree_level}
                    </span>
                  )}
                  {s.deadline && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs"
                      style={urgent ? { background: "oklch(0.62 0.2 25 / 0.18)", color: "oklch(0.72 0.18 25)" } : { background: "rgba(255,255,255,0.05)", color: "var(--muted-foreground)" }}
                    >
                      {urgent ? `${daysLeft} days left` : s.deadline}
                    </span>
                  )}
                </div>

                <div className="mt-auto flex items-center gap-2 border-t border-white/5 pt-4 mt-5">
                  <button
                    onClick={() => handleUnsave(s.id)}
                    aria-label="Unsave"
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-brand bg-brand/20 text-[oklch(0.8_0.14_300)] transition-colors"
                  >
                    <Bookmark className="size-4" fill="currentColor" />
                  </button>
                  <Link
                    href={`/scholarship/${s.id}`}
                    className="flex-1 rounded-lg border border-white/15 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
                  >
                    View Details
                  </Link>
                </div>

                {s.saved_at && (
                  <p className="mt-3 text-xs text-muted-foreground">{getTimeSinceSaved(s.saved_at)}</p>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_24px_rgba(139,92,246,0.45)]">
            <Bookmark className="size-8 text-white" />
          </span>
          <p className="mt-5 text-lg font-bold text-foreground">No saved scholarships yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Start saving scholarships to keep track of them here.</p>
          <Link
            href="/scholarships"
            className="mt-5 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
          >
            Browse Scholarships
          </Link>
        </div>
      )}
    </DashboardShell>
  )
}