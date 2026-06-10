"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import { Bell, BellRing, Calendar, Plus, Trash2, Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

const reminderTypes = [
  { value: "1_week", label: "1 week before deadline" },
  { value: "2_weeks", label: "2 weeks before deadline" },
  { value: "1_month", label: "1 month before deadline" },
  { value: "3_days", label: "3 days before deadline" },
]

export default function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [savedScholarships, setSavedScholarships] = useState<any[]>([])
  const [selectedScholarship, setSelectedScholarship] = useState("")
  const [selectedType, setSelectedType] = useState("1_week")
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data } = await supabase
      .from("user_reminders")
      .select("*, scholarship_details(id, title, university_name, country, deadline)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    setReminders(data || [])
    setLoading(false)
  }

  const loadSavedForAdd = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Get saved scholarships
    const { data: savedData } = await supabase
      .from("user_saved_scholarships")
      .select("scholarship_id")
      .eq("user_id", session.user.id)

    if (savedData && savedData.length > 0) {
      const ids = savedData.map((s: any) => s.scholarship_id)
      const { data: schData } = await supabase
        .from("scholarship_details")
        .select("id, title, university_name, country, deadline")
        .in("id", ids)

      setSavedScholarships(schData || [])
    }

    setShowAdd(true)
  }

  const handleAddReminder = async () => {
    if (!selectedScholarship) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    setAdding(true)

    const { error } = await supabase
      .from("user_reminders")
      .insert({
        user_id: session.user.id,
        scholarship_id: parseInt(selectedScholarship),
        reminder_type: selectedType,
      })

    if (!error) {
      setShowAdd(false)
      setSelectedScholarship("")
      setSelectedType("1_week")
      await fetchReminders()
    } else {
      alert(`Error: ${error.message}`)
    }

    setAdding(false)
  }

  const deleteReminder = async (reminderId: number) => {
    const { error } = await supabase
      .from("user_reminders")
      .delete()
      .eq("id", reminderId)

    if (!error) {
      setReminders((prev) => prev.filter((r) => r.id !== reminderId))
    }
  }

  const active = reminders.filter((r) => !r.reminded_at).length

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
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Deadline Reminders</h1>
          <p className="mt-2 text-muted-foreground">
            You have <span className="font-semibold text-foreground">{active}</span> active reminder{active === 1 ? "" : "s"} keeping you on track.
          </p>
        </div>
        <button
          onClick={loadSavedForAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          New Reminder
        </button>
      </div>

      {/* Add Reminder Modal */}
      {showAdd && (
        <div className="glass mb-8 rounded-2xl p-6" style={{ background: "rgba(26,26,46,0.8)" }}>
          <h3 className="text-lg font-bold text-foreground">Set New Reminder</h3>
          <p className="mt-1 text-sm text-muted-foreground">Choose a scholarship and when to be reminded</p>

          <div className="mt-4 flex flex-col gap-4">
            <select
              value={selectedScholarship}
              onChange={(e) => setSelectedScholarship(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none focus:border-brand"
            >
              <option value="" className="bg-[#1a1a2e]">Select a scholarship...</option>
              {savedScholarships.map((s: any) => (
                <option key={s.id} value={s.id} className="bg-[#1a1a2e]">
                  {s.title} — {s.deadline || "No deadline"}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none focus:border-brand"
            >
              {reminderTypes.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#1a1a2e]">
                  {t.label}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleAddReminder}
                disabled={!selectedScholarship || adding}
                className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {adding ? "Adding..." : "Set Reminder"}
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
                No saved scholarships. <Link href="/scholarships" className="text-[oklch(0.72_0.18_300)] hover:underline">Save some first</Link>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Reminders Grid */}
      {reminders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reminders.map((r) => {
            const sch = r.scholarship_details
            const flag = getFlag(sch?.country || "")
            const isActive = !r.reminded_at
            const daysLeft = getDaysLeft(sch?.deadline)
            const typeLabel = reminderTypes.find((t) => t.value === r.reminder_type)?.label || r.reminder_type

            return (
              <div key={r.id} className="glass flex items-start gap-4 rounded-2xl p-5" style={{ background: "rgba(26,26,46,0.55)" }}>
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isActive
                      ? "bg-gradient-to-br from-brand to-brand-2 text-white"
                      : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {isActive ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{flag}</span>
                    <h3 className="truncate text-sm font-semibold text-foreground">{sch?.title || "Unknown"}</h3>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{sch?.university_name || ""}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 font-medium text-muted-foreground">
                      <Bell className="h-3 w-3" />
                      {typeLabel}
                    </span>
                    {sch?.deadline && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 font-medium text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {sch.deadline}
                        {daysLeft !== null && ` (${daysLeft}d left)`}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isActive
                          ? "bg-[oklch(0.55_0.16_150_/_0.18)] text-[oklch(0.8_0.16_155)]"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {isActive ? "Active" : "Sent"}
                    </span>
                    <button
                      onClick={() => deleteReminder(r.id)}
                      aria-label="Delete reminder"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-[oklch(0.72_0.18_25)]/40 hover:bg-[oklch(0.72_0.18_25)]/10 hover:text-[oklch(0.72_0.18_25)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      href={`/scholarship/${sch?.id}`}
                      className="ml-auto text-xs text-[oklch(0.72_0.18_300)] hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass mt-4 rounded-2xl p-12 text-center" style={{ background: "rgba(26,26,46,0.55)" }}>
          <Bell className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No reminders set</h3>
          <p className="mt-1 text-sm text-muted-foreground">Add a reminder so you never miss a deadline.</p>
          <button
            onClick={loadSavedForAdd}
            className="mt-5 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
          >
            Set Your First Reminder
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[oklch(0.72_0.18_300)] hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    </DashboardShell>
  )
}