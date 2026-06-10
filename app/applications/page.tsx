"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import { Plus, Calendar, StickyNote, Loader2, Trash2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type AppStatus = "planning" | "applying" | "submitted" | "accepted" | "rejected"

const STATUSES: AppStatus[] = ["planning", "applying", "submitted", "accepted", "rejected"]

const statusLabels: Record<AppStatus, string> = {
  planning: "Planning",
  applying: "Applying",
  submitted: "Submitted",
  accepted: "Accepted",
  rejected: "Rejected",
}

const statusStyle: Record<AppStatus, string> = {
  planning: "text-muted-foreground border-white/20 bg-white/5",
  applying: "text-[oklch(0.78_0.15_75)] border-[oklch(0.78_0.15_75)]/40 bg-[oklch(0.78_0.15_75)]/10",
  submitted: "text-[oklch(0.72_0.18_300)] border-[oklch(0.72_0.18_300)]/40 bg-[oklch(0.72_0.18_300)]/10",
  accepted: "text-[oklch(0.8_0.16_155)] border-[oklch(0.8_0.16_155)]/40 bg-[oklch(0.8_0.16_155)]/10",
  rejected: "text-[oklch(0.72_0.18_25)] border-[oklch(0.72_0.18_25)]/40 bg-[oklch(0.72_0.18_25)]/10",
}

const countryFlags: Record<string, string> = {
  "United Kingdom": "🇬🇧", "UK": "🇬🇧", "Germany": "🇩🇪", "Turkey": "🇹🇷",
  "China": "🇨🇳", "USA": "🇺🇸", "United States": "🇺🇸", "Canada": "🇨🇦",
  "Australia": "🇦🇺", "Japan": "🇯🇵", "South Korea": "🇰🇷", "France": "🇫🇷",
  "Netherlands": "🇳🇱", "Sweden": "🇸🇪", "Europe": "🇪🇺", "Malaysia": "🇲🇾",
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
  return diff > 0 ? diff : 0
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [savedScholarships, setSavedScholarships] = useState<any[]>([])
  const [selectedScholarship, setSelectedScholarship] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data } = await supabase
      .from("user_applications")
      .select("*, scholarship_details(id, title, university_name, country, deadline)")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false })

    setApps(data || [])
    setLoading(false)
  }

  const loadSavedForAdd = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Get saved scholarships that aren't already in applications
    const appIds = apps.map((a) => a.scholarship_id)

    const { data: savedData } = await supabase
      .from("user_saved_scholarships")
      .select("scholarship_id")
      .eq("user_id", session.user.id)

    if (savedData) {
      const ids = savedData
        .map((s: any) => s.scholarship_id)
        .filter((id: any) => !appIds.includes(id))

      if (ids.length > 0) {
        const { data: schData } = await supabase
          .from("scholarship_details")
          .select("id, title, university_name, country")
          .in("id", ids)

        setSavedScholarships(schData || [])
      }
    }

    setShowAdd(true)
  }

  const handleAddApplication = async () => {
    if (!selectedScholarship) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    setAdding(true)

    const { error } = await supabase
      .from("user_applications")
      .insert({
        user_id: session.user.id,
        scholarship_id: parseInt(selectedScholarship),
        status: "planning",
        notes: newNotes || null,
      })

    if (!error) {
      setShowAdd(false)
      setSelectedScholarship("")
      setNewNotes("")
      await fetchApplications()
    } else {
      alert(`Error: ${error.message}`)
    }

    setAdding(false)
  }

  const cycleStatus = async (appId: number, currentStatus: AppStatus) => {
    const nextIndex = (STATUSES.indexOf(currentStatus) + 1) % STATUSES.length
    const nextStatus = STATUSES[nextIndex]

    const { error } = await supabase
      .from("user_applications")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", appId)

    if (!error) {
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: nextStatus } : a))
      )
    }
  }

  const deleteApp = async (appId: number) => {
    const { error } = await supabase
      .from("user_applications")
      .delete()
      .eq("id", appId)

    if (!error) {
      setApps((prev) => prev.filter((a) => a.id !== appId))
    }
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">My Applications</h1>
          <p className="mt-2 text-muted-foreground">Track every scholarship you are working on in one place.</p>
        </div>
        <button
          onClick={loadSavedForAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </div>

      {/* Add Application Modal */}
      {showAdd && (
        <div className="glass mb-8 rounded-2xl p-6" style={{ background: "rgba(26,26,46,0.8)" }}>
          <h3 className="text-lg font-bold text-foreground">Add New Application</h3>
          <p className="mt-1 text-sm text-muted-foreground">Select from your saved scholarships</p>

          <div className="mt-4 flex flex-col gap-4">
            <select
              value={selectedScholarship}
              onChange={(e) => setSelectedScholarship(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none focus:border-brand"
            >
              <option value="" className="bg-[#1a1a2e]">Select a scholarship...</option>
              {savedScholarships.map((s: any) => (
                <option key={s.id} value={s.id} className="bg-[#1a1a2e]">
                  {s.title} — {s.university_name || s.country}
                </option>
              ))}
            </select>

            <input
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Add notes (optional)..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-brand"
            />

            <div className="flex gap-3">
              <button
                onClick={handleAddApplication}
                disabled={!selectedScholarship || adding}
                className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add"}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/5"
              >
                Cancel
              </button>
            </div>

            {savedScholarships.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No saved scholarships available. <Link href="/scholarships" className="text-[oklch(0.72_0.18_300)] hover:underline">Save some scholarships first</Link>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {apps.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {STATUSES.map((status) => {
            const list = apps.filter((a) => a.status === status)
            return (
              <div key={status} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-foreground">{statusLabels[status]}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {list.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {list.map((app) => {
                    const sch = app.scholarship_details
                    const flag = getFlag(sch?.country || "")
                    const daysLeft = getDaysLeft(sch?.deadline)

                    return (
                      <div key={app.id} className="glass rounded-2xl p-4" style={{ background: "rgba(26,26,46,0.55)" }}>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-2xl leading-none">{flag}</span>
                          <button
                            onClick={() => cycleStatus(app.id, app.status)}
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyle[app.status as AppStatus]}`}
                          >
                            {statusLabels[app.status as AppStatus]}
                          </button>
                        </div>
                        <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground">
                          {sch?.title || "Unknown Scholarship"}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">{sch?.university_name || ""}</p>

                        {sch?.deadline && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{sch.deadline}</span>
                            {daysLeft !== null && daysLeft > 0 && (
                              <span className="ml-auto font-medium text-foreground">{daysLeft}d left</span>
                            )}
                          </div>
                        )}

                        {app.notes && (
                          <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-white/5 p-2 text-xs text-muted-foreground">
                            <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span className="leading-relaxed">{app.notes}</span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <Link
                            href={`/scholarship/${sch?.id}`}
                            className="text-xs text-[oklch(0.72_0.18_300)] hover:underline"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => deleteApp(app.id)}
                            className="rounded p-1 text-muted-foreground hover:text-[oklch(0.72_0.18_25)]"
                            aria-label="Delete application"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  {list.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-xs text-muted-foreground">
                      Nothing here yet
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_24px_rgba(139,92,246,0.45)]">
            <Calendar className="size-8 text-white" />
          </span>
          <p className="mt-5 text-lg font-bold text-foreground">No applications yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Save scholarships first, then add them to your application tracker.</p>
          <Link
            href="/scholarships"
            className="mt-5 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
          >
            Browse Scholarships
          </Link>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Tip: click a status badge to move an application along your pipeline.
      </p>
    </DashboardShell>
  )
}