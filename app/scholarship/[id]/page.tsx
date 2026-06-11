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
  List,
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

function extractHeadings(html: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = []
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, "").trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    headings.push({ id, text })
  }
  return headings
}

function cleanBlogHtml(html: string): string {
  if (!html) return ""

  // Split content by asterisk bullet patterns and convert to lists
  // Handles: "include: * item1 * item2 * item3"
  const asteriskListPattern = /([^*<\n]*?):\s*\*\s+(.+?)(?=<\/p>|<h[23]|<div|$)/gs
  
  html = html.replace(asteriskListPattern, (match, intro, listContent) => {
    const items = listContent.split(/\s*\*\s+/).filter((s: string) => s.trim())
    if (items.length >= 2) {
      const listItems = items.map((item: string) => `<li>${item.trim()}</li>`).join("")
      return `${intro}:</p><ul>${listItems}</ul><p>`
    }
    return match
  })

  // Also handle standalone * at start of lines
  html = html.replace(/\n\s*\*\s+([^\n*]+)/g, "<li>$1</li>")
  
  // Wrap consecutive <li> not inside <ul>
  html = html.replace(/(<li>[^<]*<\/li>\s*)+/g, (match) => {
    if (match.trim()) {
      return `<ul>${match}</ul>`
    }
    return match
  })

  // Prevent nested <ul><ul>
  html = html.replace(/<ul>\s*<ul>/g, "<ul>")
  html = html.replace(/<\/ul>\s*<\/ul>/g, "</ul>")

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, "")

  return html
}
function addIdsToHeadings(html: string): string {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, "").trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    return `<h2${attrs} id="${id}">${content}</h2>`
  })
}

export default function ScholarshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [scholarship, setScholarship] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [showToc, setShowToc] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setScholarship(null)
      setRelated([])
      setLoading(true)
      setSaved(false)

      const { data, error } = await supabase
        .from("scholarship_details")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !data) {
        setLoading(false)
        return
      }

      setScholarship(data)

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
      await supabase.from("user_saved_scholarships").delete().eq("user_id", session.user.id).eq("scholarship_id", id)
      setSaved(false)
    } else {
      await supabase.from("user_saved_scholarships").insert({ user_id: session.user.id, scholarship_id: id })
      setSaved(true)
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <GradientOrbs />
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-purple-400" />
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
          <p className="text-xl text-gray-400">Scholarship not found</p>
          <Link href="/scholarships" className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white">
            Browse All Scholarships
          </Link>
        </div>
      </div>
    )
  }

  const s = scholarship
  const flag = getFlag(s.country)
  const daysLeft = getDaysLeft(s.deadline)
  const blogHtml = s.blog_post ? addIdsToHeadings(cleanBlogHtml(s.blog_post)) : ""
  const headings = s.blog_post ? extractHeadings(s.blog_post) : []

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
        <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-400">
          <button onClick={() => router.back()} className="hover:text-white transition-colors">← Back</button>
          <span className="mx-2 text-gray-600">|</span>
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="size-4" />
          <Link href="/scholarships" className="hover:text-white">Scholarships</Link>
          <ChevronRight className="size-4" />
          <span className="text-white line-clamp-1">{s.title}</span>
        </nav>

        {/* Header */}
        <div className="mt-5">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">{s.title}</h1>
          <div className="mt-3 flex items-center gap-2 text-gray-400">
            <span className="text-xl">{flag}</span>
            <span>{s.university_name || "Multiple Universities"}</span>
            <span className="text-gray-600">·</span>
            <span>{s.country || "International"}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {s.funding_type && <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ color: "oklch(0.8 0.16 155)", background: "oklch(0.55 0.16 150 / 0.18)" }}>{s.funding_type}</span>}
            {s.degree_level && <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ color: "oklch(0.78 0.14 300)", background: "oklch(0.62 0.21 280 / 0.2)" }}>{s.degree_level}</span>}
            {s.deadline && <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ color: "oklch(0.82 0.15 78)", background: "oklch(0.78 0.15 75 / 0.18)" }}>Deadline: {s.deadline}</span>}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${saved ? "border-purple-500 bg-purple-500/20 text-purple-300" : "border-white/15 text-white hover:bg-white/5"}`}
            >
              <Bookmark className="size-4" fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
            </button>
            {s.scholarship_link && (
              <a href={s.scholarship_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]">
                Apply Now <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </div>

        {/* Two columns */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <article className="lg:col-span-2">
            {/* Table of Contents */}
            {headings.length > 3 && (
              <div className="mb-8 rounded-2xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <button onClick={() => setShowToc(!showToc)} className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-purple-300">
                    <List className="size-4" /> Table of Contents
                  </span>
                  <span className="text-xs text-gray-500">{showToc ? "Hide" : "Show"}</span>
                </button>
                {showToc && (
                  <ul className="mt-4 flex flex-col gap-2">
                    {headings.map((h, i) => (
                      <li key={i}>
                        <a href={`#${h.id}`} className="text-sm text-gray-400 transition-colors hover:text-purple-300">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Blog Content */}
            {blogHtml ? (
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: blogHtml }} />
            ) : s.full_description ? (
              <div className="blog-content">
                <h2>About This Scholarship</h2>
                <p>{s.full_description}</p>
              </div>
            ) : (
              <div className="blog-content">
                <h2>About This Scholarship</h2>
                <p>
                  {s.title} is offered by {s.university_name || "the institution"} in {s.country || "multiple countries"}.
                  This is a {s.funding_type || "scholarship"} opportunity for {s.degree_level || "various degree"} level students.
                </p>
              </div>
            )}

            {/* Apply button */}
            {s.scholarship_link && (
              <div className="mt-10 flex justify-center">
                <a href={s.scholarship_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]">
                  Visit Official Website <ExternalLink className="size-4" />
                </a>
              </div>
            )}
          </article>

          {/* Sticky sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 p-6" style={{ background: "rgba(20,20,40,0.8)", backdropFilter: "blur(12px)" }}>
              <div className="flex flex-col gap-3">
                {infoRows.map((row) => {
                  const Icon = row.icon
                  return (
                    <div key={row.label} className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm text-gray-400">
                        <Icon className="size-4 text-purple-400" /> {row.label}
                      </span>
                      <span className="text-right text-sm font-medium text-white">{row.value}</span>
                    </div>
                  )
                })}
              </div>

              <div className="my-5 h-px bg-white/10" />

              <div className="flex flex-col gap-3">
                <button onClick={handleSave} className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${saved ? "border-purple-500 bg-purple-500/20 text-purple-300" : "border-white/15 text-white hover:bg-white/5"}`}>
                  <Bookmark className="size-4" fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
                </button>
                {s.scholarship_link && (
                  <a href={s.scholarship_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]">
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
            <h2 className="mb-5 text-2xl font-bold text-white">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ScholarshipCard key={r.id} scholarship={r} isSaved={false} onToggleSave={() => {}} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Blog Styling */}
      <style jsx global>{`
        .blog-content {
          color: rgba(255, 255, 255, 0.78);
          font-size: 16px;
          line-height: 1.8;
        }

        .blog-content h1 {
          display: none;
        }

        .blog-content h2 {
          color: #c4b5fd;
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          scroll-margin-top: 100px;
        }

        .blog-content h3 {
          color: #e9d5ff;
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 1.8rem;
          margin-bottom: 0.6rem;
        }

        .blog-content p {
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .blog-content strong {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 600;
        }

        .blog-content ul,
        .blog-content ol {
          margin: 1rem 0;
          padding-left: 0;
          list-style: none;
        }

        .blog-content ul li,
        .blog-content ol li {
          position: relative;
          padding: 0.6rem 1rem 0.6rem 1.5rem;
          margin-bottom: 0.4rem;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.78);
          font-size: 15px;
          line-height: 1.6;
        }

        .blog-content ul li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          border-radius: 3px;
          background: linear-gradient(to bottom, #8b5cf6, #6366f1);
        }

        .blog-content ol {
          counter-reset: step-counter;
        }

        .blog-content ol li {
          counter-increment: step-counter;
          padding-left: 3rem;
        }

        .blog-content ol li::before {
          content: counter(step-counter);
          position: absolute;
          left: 0.75rem;
          top: 0.6rem;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blog-content a {
          color: #a78bfa;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid rgba(167, 139, 250, 0.3);
          transition: all 0.2s;
        }

        .blog-content a:hover {
          color: #c4b5fd;
          border-bottom-color: #c4b5fd;
        }

        /* Internal link boxes - override inline styles */
        .blog-content div[style*="background:#f0f4ff"],
        .blog-content div[style*="background:#f5f3ff"],
        .blog-content div[style*="background:#faf5ff"] {
          background: rgba(139, 92, 246, 0.08) !important;
          border-left: 4px solid #8b5cf6 !important;
          border-radius: 12px !important;
          padding: 20px 24px !important;
          margin: 2rem 0 !important;
        }

        .blog-content div[style*="background:#f0f4ff"] p,
        .blog-content div[style*="background:#f5f3ff"] p,
        .blog-content div[style*="background:#faf5ff"] p {
          color: #c4b5fd !important;
          font-weight: 700 !important;
          margin-bottom: 12px !important;
        }

        .blog-content div[style*="background:#f0f4ff"] a,
        .blog-content div[style*="background:#f5f3ff"] a,
        .blog-content div[style*="background:#faf5ff"] a {
          color: #a78bfa !important;
          font-weight: 600 !important;
        }

        .blog-content div[style*="background:#f0f4ff"] ul,
        .blog-content div[style*="background:#f5f3ff"] ul,
        .blog-content div[style*="background:#faf5ff"] ul {
          margin: 0 !important;
        }

        .blog-content div[style*="background:#f0f4ff"] ul li,
        .blog-content div[style*="background:#f5f3ff"] ul li,
        .blog-content div[style*="background:#faf5ff"] ul li {
          background: transparent !important;
          border: none !important;
          padding: 0.3rem 0 0.3rem 1rem !important;
        }

        /* Warning/note boxes */
        .blog-content p[style*="background:#fef3c7"] {
          background: rgba(245, 158, 11, 0.1) !important;
          border-left: 4px solid #f59e0b !important;
          color: #fbbf24 !important;
          border-radius: 10px !important;
          padding: 14px 18px !important;
          margin: 1.5rem 0 !important;
        }

        /* Apply button at end */
        .blog-content div[style*="text-align:center"] {
          margin: 2.5rem 0 !important;
        }

        .blog-content div[style*="text-align:center"] a {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          background: linear-gradient(135deg, #7c3aed, #6366f1) !important;
          color: white !important;
          padding: 14px 32px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          text-decoration: none !important;
          border: none !important;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4) !important;
          transition: transform 0.2s, box-shadow 0.2s !important;
        }

        .blog-content div[style*="text-align:center"] a:hover {
          transform: scale(1.03) !important;
          box-shadow: 0 6px 25px rgba(124, 58, 237, 0.5) !important;
        }

        .blog-content div[style*="text-align:center"] p {
          color: rgba(255, 255, 255, 0.4) !important;
          font-size: 13px !important;
          margin-top: 8px !important;
        }

        /* Final thoughts colored text */
        .blog-content p[style*="color:#6366f1"] {
          color: #a78bfa !important;
          font-weight: 700 !important;
          font-size: 1.05rem !important;
          margin-top: 1rem !important;
          padding: 16px 20px !important;
          background: rgba(139, 92, 246, 0.08) !important;
          border-radius: 12px !important;
          border: 1px solid rgba(139, 92, 246, 0.2) !important;
        }

        /* First h2 has no top margin */
        .blog-content h2:first-of-type {
          margin-top: 0;
        }

        @media (max-width: 768px) {
          .blog-content {
            font-size: 15px;
          }
          .blog-content h2 {
            font-size: 1.3rem;
          }
          .blog-content ul li,
          .blog-content ol li {
            padding: 0.5rem 0.75rem 0.5rem 1.2rem;
            font-size: 14px;
          }
          .blog-content ol li {
            padding-left: 2.5rem;
          }
        }
        /* Internal link boxes - class based */
        .blog-content .internal-links-box {
          background: rgba(139, 92, 246, 0.06);
          border-left: 4px solid #8b5cf6;
          border-radius: 12px;
          padding: 20px 24px;
          margin: 2rem 0;
        }

        .blog-content .internal-links-box p {
          color: #c4b5fd !important;
          font-weight: 700 !important;
          margin-bottom: 10px !important;
          font-size: 15px !important;
        }

        .blog-content .internal-links-box ul {
          margin: 0 !important;
          padding: 0 !important;
        }

        .blog-content .internal-links-box ul li {
          background: transparent !important;
          border: none !important;
          padding: 6px 0 6px 12px !important;
          margin: 0 !important;
        }

        .blog-content .internal-links-box ul li::before {
          display: none !important;
        }

        .blog-content .internal-links-box a {
          color: #a78bfa !important;
          font-weight: 600 !important;
          border-bottom: 1px solid rgba(167, 139, 250, 0.3) !important;
        }

        .blog-content .internal-links-box a:hover {
          color: #c4b5fd !important;
        }
      `}</style>
    </div>
  )
}