"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Bell, Bookmark, Send, Sparkles, Clock, ArrowRight, Edit3, Loader2 } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { StatCard } from "@/components/stat-card"
import { ReminderModal } from "@/components/reminder-modal"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [savedCount, setSavedCount] = useState(0)
  const [appCount, setAppCount] = useState(0)
  const [savedScholarships, setSavedScholarships] = useState<any[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([])

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      setUser(session.user)

      // Load profile
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single()

      setProfile(profileData)

      // Count saved scholarships
      const { count: savedC } = await supabase
        .from("user_saved_scholarships")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id)

      setSavedCount(savedC || 0)

      // Count applications
      const { count: appC } = await supabase
        .from("user_applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id)

      setAppCount(appC || 0)

      // Get recently saved scholarships (last 3)
      const { data: savedData } = await supabase
        .from("user_saved_scholarships")
        .select("scholarship_id, saved_at")
        .eq("user_id", session.user.id)
        .order("saved_at", { ascending: false })
        .limit(3)

      if (savedData && savedData.length > 0) {
        const ids = savedData.map((s: any) => s.scholarship_id)
        const { data: schData } = await supabase
          .from("scholarship_details")
          .select("id, title, university_name, country, degree_level, funding_type, deadline")
          .in("id", ids)

        setSavedScholarships(schData || [])
      }

      // Get upcoming deadlines (scholarships with nearest deadlines)
      const { data: deadlineData } = await supabase
        .from("scholarship_details")
        .select("id, title, university_name, country, deadline")
        .gte("deadline", new Date().toISOString().split("T")[0])
        .order("deadline", { ascending: true })
        .limit(3)

      setUpcomingDeadlines(deadlineData || [])

      setLoading(false)
    }
    loadDashboard()
  }, [])

  // Calculate profile completion
  const getCompletion = () => {
    if (!profile) return 0
    const fields = [profile.full_name, profile.country, profile.nationality, profile.degree_level, profile.field_of_study, profile.gpa, profile.ielts_score, profile.preferred_countries, profile.funding_preference]
    const filled = fields.filter((f: any) => f && String(f).trim() !== "").length
    return Math.round((filled / fields.length) * 100)
  }

  const getFirstName = () => {
    if (profile?.full_name) return profile.full_name.split(" ")[0]
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name.split(" ")[0]
    return user?.email?.split("@")[0] || "there"
  }

  const getDaysLeft = (deadline: string) => {
    if (!deadline) return null
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : null
  }

  const getFlag = (country: string) => {
    const flags: Record<string, string> = {
      "United Kingdom": "🇬🇧", "Germany": "🇩🇪", "Turkey": "🇹🇷", "China": "🇨🇳",
      "USA": "🇺🇸", "Canada": "🇨🇦", "Australia": "🇦🇺", "Japan": "🇯🇵",
      "South Korea": "🇰🇷", "France": "🇫🇷", "Netherlands": "🇳🇱", "Sweden": "🇸🇪",
      "Italy": "🇮🇹", "Spain": "🇪🇸", "Europe": "🇪🇺", "Malaysia": "🇲🇾",
    }
    return flags[country] || "🌍"
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
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Good morning, {getFirstName()}! 👋</h1>
          <p className="mt-1 text-muted-foreground">You have {savedCount} scholarships saved</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Bookmark} value={savedCount} label="Saved" glow="oklch(0.7 0.18 300)" />
        <StatCard icon={Send} value={appCount} label="Applications" glow="oklch(0.7 0.16 155)" />
        <StatCard icon={Sparkles} value={getCompletion()} suffix="%" label="Profile Complete" glow="oklch(0.78 0.15 75)" />
        <StatCard icon={Clock} value={upcomingDeadlines.length} label="Deadlines Soon" glow="oklch(0.65 0.2 25)" />
      </div>

      {/* AI Match Banner */}
      <div
        className="glass relative mt-6 overflow-hidden rounded-2xl p-6"
        style={{ background: "rgba(26,26,46,0.55)", borderLeft: "3px solid oklch(0.62 0.21 280)", boxShadow: "inset 12px 0 30px -20px oklch(0.62 0.21 280)" }}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_20px_rgba(139,92,246,0.5)]">
              <Sparkles className="size-6 text-white" />
            </span>
            <div>
              <p className="text-lg font-bold text-foreground">Your Profile: {getCompletion()}% Complete</p>
              <p className="text-sm text-muted-foreground">Complete your profile to find better scholarship matches</p>
              <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10 sm:w-64">
                <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2 transition-all duration-500" style={{ width: `${getCompletion()}%` }} />
              </div>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="shrink-0 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
          >
            Complete Profile
          </Link>
        </div>
      </div>

      {/* Recently Saved */}
      <SectionHeader title="Recently Saved" href="/saved" />
      {savedScholarships.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedScholarships.map((s: any) => (
            <div key={s.id} className="glass rounded-2xl p-4" style={{ background: "rgba(26,26,46,0.55)" }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getFlag(s.country)}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">{s.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{s.university_name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-muted-foreground">{s.degree_level}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-muted-foreground">{s.funding_type}</span>
                  </div>
                  {s.deadline && (
                    <p className="mt-2 text-xs text-muted-foreground">Deadline: {s.deadline}</p>
                  )}
                </div>
              </div>
              <Link href={`/scholarship/${s.id}`} className="mt-3 block rounded-lg border border-white/15 py-2 text-center text-xs font-semibold text-foreground hover:bg-white/5">
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center" style={{ background: "rgba(26,26,46,0.55)" }}>
          <Bookmark className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No saved scholarships yet</p>
          <Link href="/#scholarships" className="mt-3 inline-block rounded-lg bg-gradient-to-r from-brand to-brand-2 px-4 py-2 text-sm font-semibold text-white">
            Browse Scholarships
          </Link>
        </div>
      )}

      {/* Upcoming Deadlines */}
      <SectionHeader title="Upcoming Deadlines" />
      {upcomingDeadlines.length > 0 ? (
        <div className="glass overflow-hidden rounded-2xl" style={{ background: "rgba(26,26,46,0.55)" }}>
          {upcomingDeadlines.map((s: any, i: number) => {
            const days = getDaysLeft(s.deadline)
            const urgent = days !== null && days <= 7
            return (
              <div key={s.id} className={`flex items-center justify-between gap-3 p-4 ${i > 0 ? "border-t border-white/5" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getFlag(s.country)}</span>
                  <div>
                    <p className="font-semibold text-foreground">{s.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.deadline} {days !== null && `· ${days} days remaining`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {urgent && (
                    <span className="rounded-full bg-[oklch(0.62_0.2_25_/_0.18)] px-2.5 py-1 text-xs font-semibold text-[oklch(0.72_0.18_25)]">
                      Urgent
                    </span>
                  )}
                  <Link href={`/scholarship/${s.id}`} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-white/5">
                    View
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center" style={{ background: "rgba(26,26,46,0.55)" }}>
          <Clock className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No upcoming deadlines found</p>
        </div>
      )}
    </DashboardShell>
  )
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 mt-8 flex items-center justify-between">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-medium text-[oklch(0.72_0.18_300)] hover:underline">
          View All <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}
