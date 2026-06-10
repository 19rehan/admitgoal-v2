"use client"

import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import { ScholarshipCard, ScholarshipCardSkeleton } from "@/components/scholarship-card"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const filterChips = [
  "All",
  "Fully Funded",
  "Partial",
  "Masters",
  "PhD",
  "Bachelor",
  "UK",
  "Germany",
  "USA",
  "Canada",
  "Australia",
  "Turkey",
  "China",
  "Europe",
]

export function ScholarshipsSection({
  savedIds,
  onToggleSave,
}: {
  savedIds: string[]
  onToggleSave: (id: string) => void
}) {
  const [scholarships, setScholarships] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true)

      const { count } = await supabase
        .from("scholarship_details")
        .select("*", { count: "exact", head: true })

      setTotalCount(count || 0)

      // Load ALL scholarships for proper search/filter
      const { data, error } = await supabase
        .from("scholarship_details")
        .select("id, title, university_name, country, degree_level, funding_type, deadline, last_updated")
        .order("last_updated", { ascending: false })

      if (error) {
        console.error("Fetch error:", error)
      } else {
        setScholarships(data || [])
      }

      setLoading(false)
    }
    fetchScholarships()
  }, [])

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        (s.title || "").toLowerCase().includes(q) ||
        (s.university_name || "").toLowerCase().includes(q) ||
        (s.country || "").toLowerCase().includes(q) ||
        (s.degree_level || "").toLowerCase().includes(q)

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Fully Funded" && (s.funding_type || "").toLowerCase().includes("fully")) ||
        (activeFilter === "Partial" && (s.funding_type || "").toLowerCase().includes("partial")) ||
        (s.degree_level || "").toLowerCase().includes(activeFilter.toLowerCase()) ||
        (s.country || "").toLowerCase().includes(activeFilter.toLowerCase())

      return matchesQuery && matchesFilter
    })
  }, [scholarships, query, activeFilter])

  return (
    <section id="scholarships" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Search container */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Search {totalCount > 0 ? `${totalCount}+` : ""} Scholarships
        </h2>
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
          <Link
            href="/scholarships"
            className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-8 py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.4)] transition-transform hover:scale-[1.02]"
          >
            View All
          </Link>
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

        {/* Show result count when searching */}
        {(query.trim() || activeFilter !== "All") && !loading && (
          <p className="mt-4 text-sm text-muted-foreground">
            Found {filtered.length} scholarship{filtered.length !== 1 ? "s" : ""}
            {query.trim() && ` for "${query}"`}
            {activeFilter !== "All" && ` in ${activeFilter}`}
          </p>
        )}
      </div>

      {/* Grid — show only 9 on homepage */}
      <div className="mt-12">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {query.trim() || activeFilter !== "All" ? "Search Results" : "Latest Scholarships"}
          </h2>
          <p className="text-sm text-muted-foreground">Updated every 6 hours automatically</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <ScholarshipCardSkeleton key={i} />)
            : filtered.slice(0, 9).map((s) => (
                <ScholarshipCard
                  key={s.id}
                  scholarship={s}
                  isSaved={savedIds.includes(String(s.id))}
                  onToggleSave={onToggleSave}
                />
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">No scholarships match your search.</p>
        )}

        {/* View All button */}
        {!loading && filtered.length > 9 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/scholarships"
              className="rounded-xl border border-white/15 px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
            >
              View All {totalCount}+ Scholarships →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}