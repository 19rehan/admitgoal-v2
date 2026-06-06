"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Bookmark } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { SavedCard } from "@/components/saved-card"
import { ReminderModal } from "@/components/reminder-modal"
import { scholarships, type Scholarship } from "@/lib/scholarships"

const chips = ["All", "Fully Funded", "Masters", "PhD", "Deadline Soon"]
const sorts = ["Date Saved", "Deadline", "Match %"]

const savedMeta: Record<string, { savedAgo: string; days: number }> = {
  chevening: { savedAgo: "Saved 3 days ago", days: 6 },
  daad: { savedAgo: "Saved 1 week ago", days: 21 },
  turkiye: { savedAgo: "Saved 2 weeks ago", days: 120 },
  csc: { savedAgo: "Saved 5 days ago", days: 150 },
  erasmus: { savedAgo: "Saved yesterday", days: 78 },
  commonwealth: { savedAgo: "Saved today", days: 33 },
}

export default function SavedPage() {
  const [saved, setSaved] = useState<string[]>(scholarships.map((s) => s.id))
  const [query, setQuery] = useState("")
  const [chip, setChip] = useState("All")
  const [sort, setSort] = useState("Date Saved")
  const [reminderFor, setReminderFor] = useState<Scholarship | null>(null)

  let list = scholarships.filter((s) => saved.includes(s.id))

  if (query.trim()) {
    const q = query.toLowerCase()
    list = list.filter((s) => s.title.toLowerCase().includes(q) || s.country.toLowerCase().includes(q))
  }
  if (chip === "Fully Funded") list = list.filter((s) => s.funding_type === "Fully Funded")
  if (chip === "Masters") list = list.filter((s) => s.degree_level.includes("Masters"))
  if (chip === "PhD") list = list.filter((s) => s.degree_level.includes("PhD"))
  if (chip === "Deadline Soon") list = list.filter((s) => (savedMeta[s.id]?.days ?? 99) <= 30)

  if (sort === "Match %") list = [...list].sort((a, b) => b.match_percentage - a.match_percentage)
  if (sort === "Deadline") list = [...list].sort((a, b) => (savedMeta[a.id]?.days ?? 0) - (savedMeta[b.id]?.days ?? 0))

  return (
    <DashboardShell>
      <ReminderModal open={!!reminderFor} scholarshipTitle={reminderFor?.title ?? ""} onClose={() => setReminderFor(null)} />

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Saved Scholarships</h1>
        <span className="rounded-full bg-brand/20 px-3 py-1 text-sm font-semibold text-[oklch(0.78_0.14_300)]">{saved.length}</span>
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
          {list.map((s) => (
            <SavedCard
              key={s.id}
              scholarship={s}
              savedLabel={savedMeta[s.id]?.savedAgo}
              urgentDays={savedMeta[s.id]?.days}
              onUnsave={(id) => setSaved((prev) => prev.filter((x) => x !== id))}
              onReminder={(sc) => setReminderFor(sc)}
              onTrack={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_24px_rgba(139,92,246,0.45)]">
            <Bookmark className="size-8 text-white" />
          </span>
          <p className="mt-5 text-lg font-bold text-foreground">No saved scholarships yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Start saving scholarships to keep track of them here.</p>
          <Link
            href="/#scholarships"
            className="mt-5 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
          >
            Browse Scholarships
          </Link>
        </div>
      )}
    </DashboardShell>
  )
}
