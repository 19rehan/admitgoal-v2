"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
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
  "Japan",
  "South Korea",
  "Malaysia",
]

const sortOptions = ["Latest", "Deadline", "A-Z"]
const PER_PAGE = 50

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [sort, setSort] = useState("Latest")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true)

      const { count } = await supabase
        .from("scholarship_details")
        .select("*", { count: "exact", head: true })

      setTotalCount(count || 0)

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
    let list = scholarships.filter((s) => {
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

    if (sort === "Deadline") {
      list = [...list].sort((a, b) => {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      })
    } else if (sort === "A-Z") {
      list = [...list].sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    }

    return list
  }, [scholarships, query, activeFilter, sort])

  useEffect(() => {
    setPage(1)
  }, [query, activeFilter, sort])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginatedItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleSave = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />

      {/* Background orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-orb-a absolute -left-20 top-10 size-[420px] rounded-full bg-[oklch(0.55_0.22_280)] opacity-15 blur-[120px]" />
        <div className="animate-orb-b absolute right-0 top-1/4 size-[380px] rounded-full bg-[oklch(0.58_0.2_310)] opacity-10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            <GraduationCap className="size-8 text-primary" />
            All Scholarships
          </h1>
          <p className="text-muted-foreground">
            Browse {totalCount}+ scholarships from 50+ countries. Updated every 6 hours.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="glass mt-8 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by country, university, degree, or keyword..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-brand focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
              />
            </div>
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

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Sort by:</span>
              {sortOptions.map((o) => (
                <button
                  key={o}
                  onClick={() => setSort(o)}
                  className={`transition-colors ${sort === o ? "font-semibold text-foreground" : "hover:text-foreground"}`}
                >
                  {o}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {filtered.length} results
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          <p className="mb-6 text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} scholarships
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <ScholarshipCardSkeleton key={i} />)
              : paginatedItems.map((s) => (
                  <ScholarshipCard
                    key={s.id}
                    scholarship={s}
                    isSaved={savedIds.includes(String(s.id))}
                    onToggleSave={toggleSave}
                  />
                ))}
          </div>

          {!loading && filtered.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">No scholarships match your search.</p>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                  disabled={page === 1}
                  className="flex size-10 items-center justify-center rounded-lg border border-white/15 text-foreground transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 7) {
                    pageNum = i + 1
                  } else if (page <= 4) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 6 + i
                  } else {
                    pageNum = page - 3 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                      className={`flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        page === pageNum
                          ? "bg-gradient-to-r from-brand to-brand-2 text-white shadow-[0_0_14px_rgba(139,92,246,0.4)]"
                          : "border border-white/15 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                  disabled={page === totalPages}
                  className="flex size-10 items-center justify-center rounded-lg border border-white/15 text-foreground transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
