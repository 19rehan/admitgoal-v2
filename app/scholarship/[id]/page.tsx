"use client"

import Link from "next/link"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Bookmark,
  ExternalLink,
  DollarSign,
  Calendar,
  Clock,
  GraduationCap,
  Globe,
  FileText,
  Target,
  Loader2,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GradientOrbs } from "@/components/gradient-orbs"
import { ScholarshipCard } from "@/components/scholarship-card"
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
  "Europe": "🇪🇺", "Malaysia": "🇲🇾", "New Zealand": "🇳🇿", "Ireland": "🇮🇪",
  "Switzerland": "🇨🇭", "Denmark": "🇩🇰", "Norway": "🇳🇴", "Finland": "🇫🇮",
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

export default function ScholarshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [scholarship, setScholarship] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setScholarship(null)
      setRelated([])
      setLoading(true)
      setSaved(false)

      // Fetch scholarship details
      const { data, error } = await supabase
        .from("scholarship_details")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !data) {
        console.error("Fetch error:", error)
        setLoading(false)
        return
      }

      setScholarship(data)

      // Fetch related scholarships with null-safe filters
      let relatedData: any[] = []

      const filters: string[] = []
      if (data.country) filters.push(`country.eq.${data.country}`)
      if (data.degree_level) filters.push(`degree_level.eq.${data.degree_level}`)
      if (data.funding_type) filters.push(`funding_type.eq.${data.funding_type}`)

      if (filters.length > 0) {
        const { data: rData } = await supabase
          .from("scholarship_details")
          .select("id, title, university_name, country, degree_level, funding_type, deadline, last_updated")
          .neq("id", id)
          .or(filters.join(","))
          .limit(6)
        relatedData = rData || []
      }

      // Fallback: if no related found, get latest scholarships
      if (relatedData.length === 0) {
        const { data: fallback } = await supabase
          .from("scholarship_details")
          .select("id, title, university_name, country, degree_level, funding_type, deadline, last_updated")
          .neq("id", id)
          .order("last_updated", { ascending: false })
          .limit(6)
        relatedData = fallback || []
      }

      setRelated(relatedData)

      // Check if user has saved this
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: savedData } = await supabase
          .from("user_saved_scholarships")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("scholarship_id", id)
          .single()

        setSaved(!!savedData)
      }

      setLoading(false)
    }
    fetchData()
  }, [id])

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      window.location.href = "/login"
      return
    }

    if (saved) {
      await supabase
        .from("user_saved_scholarships")
        .delete()
        .eq("user_id", session.user.id)
        .eq("scholarship_id", id)
      setSaved(false)
    } else {
      await supabase
        .from("user_saved_scholarships")
        .insert({ user_id: session.user.id, scholarship_id: id })
      setSaved(true)
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <GradientOrbs />
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!scholarship) {
    return (
      <div className="relative min-h-screen">
        <GradientOrbs />
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-xl text-muted-foreground">Scholarship not found</p>
          <Link href="/scholarships" className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-6 py-3 text-sm font-semibold text-white">
            Browse All Scholarships
          </Link>
        </div>
      </div>
    )
  }

  const s = scholarship
  const flag = getFlag(s.country)
  const daysLeft = getDaysLeft(s.deadline)

  const infoRows = [
    { icon: DollarSign, label: "Funding", value: s.funding_type || "—" },
    { icon: Calendar, label: "Deadline", value: s.deadline || "—" },
    { icon: Clock, label: "Time Left", value: daysLeft ? `${daysLeft} days` : "—" },
    { icon: GraduationCap, label: "Degree", value: s.degree_level || "—" },
    { icon: Globe, label: "Eligible Countries", value: s.eligible_countries || "—" },
    { icon: FileText, label: "IELTS", value: s.ielts_score || "—" },
    { icon: Target, label: "GPA", value: s.gpa_required || "—" },
  ]

  return (
    <div className="relative min-h-screen">
      <GradientOrbs />
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <button onClick={() => router.back()} className="hover:text-foreground transition-colors">
            ← Back
          </button>
          <span className="text-muted-foreground/50 mx-2">|</span>
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="size-4" />
          <Link href="/scholarships" className="hover:text-foreground">Scholarships</Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground line-clamp-1">{s.title}</span>
        </nav>

        {/* Header */}
        <div className="mt-5">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{s.title}</h1>
          <div className="mt-3 flex items-center gap-2 text-muted-foreground">
            <span className="text-xl">{flag}</span>
            <span>{s.university_name || "Multiple Universities"}</span>
            <span className="text-muted-foreground/50">·</span>
            <span>{s.country || "International"}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {s.funding_type && <Badge color="oklch(0.8 0.16 155)" bg="oklch(0.55 0.16 150 / 0.18)">{s.funding_type}</Badge>}
            {s.degree_level && <Badge color="oklch(0.78 0.14 300)" bg="oklch(0.62 0.21 280 / 0.2)">{s.degree_level}</Badge>}
            {s.deadline && <Badge color="oklch(0.82 0.15 78)" bg="oklch(0.78 0.15 75 / 0.18)">Deadline: {s.deadline}</Badge>}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                saved ? "border-brand bg-brand/20 text-[oklch(0.8_0.14_300)]" : "border-white/15 text-foreground hover:bg-white/5"
              }`}
            >
              <Bookmark className="size-4" fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
            </button>
            {s.scholarship_link && (
              <a
                href={s.scholarship_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
              >
                Apply Now <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </div>

        {/* Two columns */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <article className="lg:col-span-2">
            <div className="flex flex-col gap-8">
              {/* Blog post content */}
              {s.blog_post ? (
                <div
                  className="prose prose-invert max-w-none prose-headings:text-[oklch(0.78_0.14_300)] prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground"
                  dangerouslySetInnerHTML={{ __html: s.blog_post }}
                />
              ) : s.full_description ? (
                <div className="flex flex-col gap-6">
                  <section>
                    <h2 className="text-xl font-bold text-[oklch(0.78_0.14_300)]">About This Scholarship</h2>
                    <p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">{s.full_description}</p>
                  </section>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <section>
                    <h2 className="text-xl font-bold text-[oklch(0.78_0.14_300)]">About This Scholarship</h2>
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {s.title} is offered by {s.university_name || "the institution"} in {s.country || "multiple countries"}.
                      This is a {s.funding_type || "scholarship"} opportunity for {s.degree_level || "various degree"} level students.
                    </p>
                  </section>
                  {s.benefits && (
                    <section>
                      <h2 className="text-xl font-bold text-[oklch(0.78_0.14_300)]">Benefits</h2>
                      <p className="mt-2 leading-relaxed text-muted-foreground">{s.benefits}</p>
                    </section>
                  )}
                </div>
              )}

              {/* Benefits section if blog_post exists */}
              {s.blog_post && s.benefits && (
                <section>
                  <h2 className="text-xl font-bold text-[oklch(0.78_0.14_300)]">Benefits</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{s.benefits}</p>
                </section>
              )}

              {/* Apply button */}
              {s.scholarship_link && (
                <div className="flex justify-center pt-2">
                  <a
                    href={s.scholarship_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
                  >
                    Visit Official Website <ExternalLink className="size-4" />
                  </a>
                </div>
              )}
            </div>
          </article>

          {/* Sticky sidebar */}
          <aside className="lg:col-span-1">
            <div className="glass sticky top-24 rounded-2xl p-6" style={{ background: "rgba(26,26,46,0.6)" }}>
              <div className="flex flex-col gap-3">
                {infoRows.map((row) => {
                  const Icon = row.icon
                  return (
                    <div key={row.label} className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className="size-4 text-[oklch(0.72_0.18_300)]" /> {row.label}
                      </span>
                      <span className="text-right text-sm font-medium text-foreground">{row.value}</span>
                    </div>
                  )
                })}
              </div>

              <div className="my-5 h-px bg-white/10" />

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSave}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                    saved ? "border-brand bg-brand/20 text-[oklch(0.8_0.14_300)]" : "border-white/15 text-foreground hover:bg-white/5"
                  }`}
                >
                  <Bookmark className="size-4" fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
                </button>
                {s.scholarship_link && (
                  <a
                    href={s.scholarship_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
                  >
                    Apply Now <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-2xl font-bold text-foreground">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ScholarshipCard key={r.id} scholarship={r} isSaved={false} onToggleSave={() => {}} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ color, background: bg }}>
      {children}
    </span>
  )
}