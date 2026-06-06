"use client"

import Link from "next/link"
import { use, useState } from "react"
import {
  ChevronRight,
  Bookmark,
  Bell,
  Sparkles,
  ExternalLink,
  DollarSign,
  Calendar,
  Clock,
  GraduationCap,
  Globe,
  FileText,
  Target,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GradientOrbs } from "@/components/gradient-orbs"
import { FaqAccordion } from "@/components/faq-accordion"
import { ScholarshipCard } from "@/components/scholarship-card"
import { getScholarship, scholarships, detailContent } from "@/lib/scholarships"

export default function ScholarshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const s = getScholarship(id) ?? scholarships[0]
  const c = detailContent.default
  const related = scholarships.filter((x) => x.id !== s.id).slice(0, 3)

  const [saved, setSaved] = useState(false)

  const infoRows = [
    { icon: DollarSign, label: "Funding", value: s.funding_type },
    { icon: Calendar, label: "Deadline", value: s.deadline },
    { icon: Clock, label: "Time Left", value: `${c.timeLeft} days` },
    { icon: GraduationCap, label: "Degree", value: s.degree_level },
    { icon: Globe, label: "Eligible", value: c.eligible },
    { icon: FileText, label: "IELTS", value: c.ielts },
    { icon: Target, label: "GPA", value: c.gpa },
  ]

  return (
    <div className="relative min-h-screen">
      <GradientOrbs />
      <Navbar isLoggedIn />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="size-4" />
          <Link href="/#scholarships" className="hover:text-foreground">Scholarships</Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{s.title}</span>
        </nav>

        {/* Header */}
        <div className="mt-5">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{s.title}</h1>
          <div className="mt-3 flex items-center gap-2 text-muted-foreground">
            <span className="text-xl">{s.flag}</span>
            <span>{s.university_name}</span>
            <span className="text-muted-foreground/50">·</span>
            <span>{s.country}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge color="oklch(0.8 0.16 155)" bg="oklch(0.55 0.16 150 / 0.18)">{s.funding_type}</Badge>
            <Badge color="oklch(0.78 0.14 300)" bg="oklch(0.62 0.21 280 / 0.2)">{s.degree_level}</Badge>
            <Badge color="oklch(0.82 0.15 78)" bg="oklch(0.78 0.15 75 / 0.18)">Deadline: {s.deadline}</Badge>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.55_0.16_150_/_0.18)] px-3 py-1 text-sm font-semibold text-[oklch(0.8_0.16_155)] shadow-[0_0_16px_oklch(0.55_0.16_150_/_0.3)]">
              <Sparkles className="size-4" /> {s.match_percentage}% Match for You
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setSaved((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                saved ? "border-brand bg-brand/20 text-[oklch(0.8_0.14_300)]" : "border-white/15 text-foreground hover:bg-white/5"
              }`}
            >
              <Bookmark className="size-4" fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-white/5">
              <Bell className="size-4" /> Set Reminder
            </button>
          </div>
        </div>

        {/* Two columns */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <article className="lg:col-span-2">
            <div className="flex flex-col gap-6">
              {c.body.map((block, i) => (
                <section key={i}>
                  <h2 className="text-xl font-bold text-[oklch(0.78_0.14_300)]">{block.heading}</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{block.text}</p>
                  {i === 1 && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {["Strong academic record", "Demonstrated leadership", "Clear career plan"].map((li) => (
                        <li key={li} className="flex items-center gap-2 text-muted-foreground">
                          <span className="size-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2" />
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* You may also like inline box */}
              <div className="rounded-xl bg-brand/5 p-5" style={{ borderLeft: "3px solid oklch(0.62 0.21 280)" }}>
                <p className="font-semibold text-foreground">You May Also Like</p>
                <div className="mt-3 flex flex-col gap-2">
                  {related.slice(0, 2).map((r) => (
                    <Link key={r.id} href={`/scholarship/${r.id}`} className="flex items-center gap-2 text-sm font-medium text-[oklch(0.72_0.18_300)] hover:underline">
                      <span>{r.flag}</span> {r.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-foreground">Frequently Asked Questions</h2>
                <FaqAccordion faqs={c.faqs} />
              </section>

              <div className="flex justify-center pt-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
                >
                  Visit Official Website <ExternalLink className="size-4" />
                </a>
              </div>
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
                  onClick={() => setSaved((v) => !v)}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                    saved ? "border-brand bg-brand/20 text-[oklch(0.8_0.14_300)]" : "border-white/15 text-foreground hover:bg-white/5"
                  }`}
                >
                  <Bookmark className="size-4" fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
                </button>
                <button className="rounded-xl py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
                  Set Reminder
                </button>
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
                >
                  Visit Official Website <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold text-foreground">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ScholarshipCard key={r.id} scholarship={r} isLoggedIn isSaved={false} onToggleSave={() => {}} />
            ))}
          </div>
        </section>
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
