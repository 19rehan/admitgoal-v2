"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Save, Camera, CheckCircle2, Loader2 } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Field, SelectField } from "@/components/form-fields"
import { countries } from "@/lib/data"
import { cn } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const sections = ["Personal", "Education", "Preferences", "Account"]

const degreeOptions = [
  { value: "bachelor", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "phd", label: "PhD" },
]

const fundingOptions = [
  { value: "Fully Funded", label: "Fully Funded only" },
  { value: "Any", label: "Any funding" },
]

export default function ProfileEditPage() {
  const router = useRouter()
  const [section, setSection] = useState("Personal")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Profile form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [nationality, setNationality] = useState("")
  const [phone, setPhone] = useState("")
  const [degreeLevel, setDegreeLevel] = useState("")
  const [fieldOfStudy, setFieldOfStudy] = useState("")
  const [gpa, setGpa] = useState("")
  const [ieltsScore, setIeltsScore] = useState("")
  const [toeflScore, setToeflScore] = useState("")
  const [greScore, setGreScore] = useState("")
  const [preferredCountries, setPreferredCountries] = useState("")
  const [fundingPreference, setFundingPreference] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }

      setUser(session.user)
      setEmail(session.user.email || "")

      // Load profile from user_profiles table
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || "")
        setCountry(profile.country || "")
        setNationality(profile.nationality || "")
        setDegreeLevel(profile.degree_level || "")
        setFieldOfStudy(profile.field_of_study || "")
        setGpa(profile.gpa || "")
        setIeltsScore(profile.ielts_score || "")
        setToeflScore(profile.toefl_score || "")
        setGreScore(profile.gre_score || "")
        setPreferredCountries(profile.preferred_countries || "")
        setFundingPreference(profile.funding_preference || "")
      } else {
        // Use Google data if available
        setFullName(session.user.user_metadata?.full_name || "")
      }

      setLoading(false)
    }
    loadProfile()
  }, [router])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    const profileData = {
      user_id: user.id,
      full_name: fullName || null,
      email: email || null,
      country: country || null,
      nationality: nationality || null,
      degree_level: degreeLevel || null,
      field_of_study: fieldOfStudy || null,
      gpa: gpa ? parseFloat(gpa) : null,
      ielts_score: ieltsScore ? parseFloat(ieltsScore) : null,
      toefl_score: toeflScore ? parseFloat(toeflScore) : null,
      gre_score: greScore ? parseFloat(greScore) : null,
      preferred_countries: preferredCountries || null,
      funding_preference: fundingPreference || null,
      updated_at: new Date().toISOString(),
    }

    // First check if profile exists
    const { data: existing } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    let error
    if (existing) {
      // Update existing profile
      const { error: updateErr } = await supabase
        .from("user_profiles")
        .update(profileData)
        .eq("user_id", user.id)
      error = updateErr
    } else {
      // Insert new profile
      const { error: insertErr } = await supabase
        .from("user_profiles")
        .insert({ ...profileData, created_at: new Date().toISOString() })
      error = insertErr
    }

    setSaving(false)

    if (error) {
      console.error("Save error:", error)
      alert(`Failed to save: ${error.message}`)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }


  // Calculate profile completion
  const getCompletion = () => {
    const filled = fields.filter((f: any) => {
      if (!f) return false
      if (Array.isArray(f)) return f.length > 0
      return String(f).trim() !== ""
    }).length
    return Math.round((filled / fields.length) * 100)
  }

  const getUserInitials = () => {
    if (fullName) {
      const parts = fullName.split(" ")
      return (parts[0]?.[0] || "") + (parts[1]?.[0] || "")
    }
    return email?.[0]?.toUpperCase() || "U"
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
      <div className="mx-auto max-w-4xl">
        <div className="fade-in flex flex-col gap-2">
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <User className="h-7 w-7 text-primary" />
            My Profile
          </h1>
          <p className="text-muted-foreground">Keep your details up to date for the best scholarship matches.</p>
        </div>

        {/* Avatar header */}
        <div className="glass mt-6 flex flex-col items-center gap-4 rounded-3xl p-6 sm:flex-row">
          <div className="relative">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-20 w-20 rounded-full" />
            ) : (
              <div className="gradient-primary flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-primary-foreground">
                {getUserInitials()}
              </div>
            )}
            <button
              aria-label="Change photo"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-card transition-all hover:bg-white/10"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{fullName || "Complete your profile"}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
            <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                <div className="gradient-primary h-full rounded-full transition-all duration-500" style={{ width: `${getCompletion()}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{getCompletion()}% complete</span>
            </div>
          </div>
        </div>

        {/* Section tabs */}
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                section === s ? "gradient-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="glass-strong mt-4 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-5">
            {section === "Personal" && (
              <>
                <Field label="Full name" value={fullName} onChange={setFullName} />
                <Field label="Email" type="email" value={email} onChange={setEmail} />
                <SelectField
                  label="Country of citizenship"
                  options={countries.map((c) => ({ value: c.name, label: `${c.flag} ${c.name}` }))}
                  value={country}
                  onChange={setCountry}
                  placeholder="Select country"
                />
                <SelectField
                  label="Nationality"
                  options={countries.map((c) => ({ value: c.name, label: `${c.flag} ${c.name}` }))}
                  value={nationality}
                  onChange={setNationality}
                  placeholder="Select nationality"
                />
              </>
            )}
            {section === "Education" && (
              <>
                <SelectField label="Degree level" options={degreeOptions} value={degreeLevel} onChange={setDegreeLevel} placeholder="Select degree" />
                <Field label="Field of study" value={fieldOfStudy} onChange={setFieldOfStudy} placeholder="e.g. Computer Science" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="GPA" value={gpa} onChange={setGpa} placeholder="e.g. 3.5" />
                  <Field label="IELTS Score" value={ieltsScore} onChange={setIeltsScore} placeholder="e.g. 7.0" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="TOEFL Score" value={toeflScore} onChange={setToeflScore} placeholder="e.g. 100" />
                  <Field label="GRE Score" value={greScore} onChange={setGreScore} placeholder="e.g. 320" />
                </div>
              </>
            )}
            {section === "Preferences" && (
              <>
                <Field label="Preferred countries" value={preferredCountries} onChange={setPreferredCountries} placeholder="e.g. UK, Germany, Canada" />
                <SelectField
                  label="Funding preference"
                  options={fundingOptions}
                  value={fundingPreference}
                  onChange={setFundingPreference}
                  placeholder="Select preference"
                />
              </>
            )}
            {section === "Account" && (
              <>
                <Field label="Current password" type="password" placeholder="••••••••" />
                <Field label="New password" type="password" placeholder="••••••••" />
                <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm">Email me new scholarship matches</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm">Deadline reminder emails</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                </label>
              </>
            )}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="gradient-primary glow-primary flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && (
              <span className="slide-in-right flex items-center gap-1.5 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                Saved!
              </span>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}