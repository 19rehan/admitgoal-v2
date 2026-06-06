"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { scholarships, filterChips } from "@/lib/scholarships"
import { ScholarshipCard, ScholarshipCardSkeleton } from "@/components/scholarship-card"

const sortOptions = ["Latest", "Deadline", "Match %"]

export function ScholarshipsSection({
  isLoggedIn,
  savedIds,
  onToggleSave,
}: {
  isLoggedIn: boolean
  savedIds: string[]
  onToggleSave: (id: string) => void
}) {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [sort, setSort] = useState("Latest")
  const [visible, setVisible] = useState(6)
  const [loading] = useState(false)

  const filtered = useMemo(() => {
    let list = scholarships.filter((s) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.university_name.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q)
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Fully Funded" && s.funding_type === "Fully Funded") ||
        s.degree_level.toLowerCase().includes(activeFilter.toLowerCase()) ||
        s.country.toLowerCase().includes(activeFilter.toLowerCase())
      return matchesQuery && matchesFilter
    })
    if (sort === "Match %") list = [...list].sort((a, b) => b.match_percentage - a.match_percentage)
    return list
  }, [query, activeFilter, sort])

  return (
    <section id="scholarships" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Search container */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Search 250+ Scholarships</h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by country, university, or field..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-brand focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
            />
          </div>
          <button className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.4)] transition-transform hover:scale-[1.02]">
            Search
          </button>
        </div>

        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          {filterChips.map((chip) => {
            const active = activeFilter === chip
            return (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-brand to-brand-2 text-white shadow-[0_0_14px_rgba(139,92,246,0.4)]"
                    : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {chip}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Sort by:</span>
          {sortOptions
            .filter((o) => isLoggedIn || o !== "Match %")
            .map((o) => (
              <button
                key={o}
                onClick={() => setSort(o)}
                className={`transition-colors ${sort === o ? "font-semibold text-foreground" : "hover:text-foreground"}`}
              >
                {o}
              </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-12">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Latest Scholarships</h2>
          <p className="text-sm text-muted-foreground">Updated every 6 hours automatically</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ScholarshipCardSkeleton key={i} />)
            : filtered.slice(0, visible).map((s) => (
                <ScholarshipCard
                  key={s.id}
                  scholarship={s}
                  isLoggedIn={isLoggedIn}
                  isSaved={savedIds.includes(s.id)}
                  onToggleSave={onToggleSave}
                />
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">No scholarships match your search.</p>
        )}

        {!loading && visible < filtered.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisible((v) => v + 3)}
              className="rounded-xl border border-white/15 px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
