"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { User, Save, Camera, CheckCircle2, Loader2, Search, ChevronDown, X } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Field } from "@/components/form-fields"
import { cn } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const sections = ["Personal", "Education", "Preferences", "Account"]

const allCountries = [
  { name: "Afghanistan", flag: "🇦🇫" },
  { name: "Albania", flag: "🇦🇱" },
  { name: "Algeria", flag: "🇩🇿" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Azerbaijan", flag: "🇦🇿" },
  { name: "Bahrain", flag: "🇧🇭" },
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Benin", flag: "🇧🇯" },
  { name: "Bolivia", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Brunei", flag: "🇧🇳" },
  { name: "Bulgaria", flag: "🇧🇬" },
  { name: "Burkina Faso", flag: "🇧🇫" },
  { name: "Cambodia", flag: "🇰🇭" },
  { name: "Cameroon", flag: "🇨🇲" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Chad", flag: "🇹🇩" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "China", flag: "🇨🇳" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Congo", flag: "🇨🇬" },
  { name: "Costa Rica", flag: "🇨🇷" },
  { name: "Croatia", flag: "🇭🇷" },
  { name: "Cuba", flag: "🇨🇺" },
  { name: "Cyprus", flag: "🇨🇾" },
  { name: "Czech Republic", flag: "🇨🇿" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Ecuador", flag: "🇪🇨" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "Ethiopia", flag: "🇪🇹" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "France", flag: "🇫🇷" },
  { name: "Gambia", flag: "🇬🇲" },
  { name: "Georgia", flag: "🇬🇪" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "Guatemala", flag: "🇬🇹" },
  { name: "Guinea", flag: "🇬🇳" },
  { name: "Hungary", flag: "🇭🇺" },
  { name: "India", flag: "🇮🇳" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Israel", flag: "🇮🇱" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Ivory Coast", flag: "🇨🇮" },
  { name: "Jamaica", flag: "🇯🇲" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "Kazakhstan", flag: "🇰🇿" },
  { name: "Kenya", flag: "🇰🇪" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Kyrgyzstan", flag: "🇰🇬" },
  { name: "Laos", flag: "🇱🇦" },
  { name: "Lebanon", flag: "🇱🇧" },
  { name: "Liberia", flag: "🇱🇷" },
  { name: "Libya", flag: "🇱🇾" },
  { name: "Madagascar", flag: "🇲🇬" },
  { name: "Malawi", flag: "🇲🇼" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Mali", flag: "🇲🇱" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Mongolia", flag: "🇲🇳" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Mozambique", flag: "🇲🇿" },
  { name: "Myanmar", flag: "🇲🇲" },
  { name: "Nepal", flag: "🇳🇵" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Niger", flag: "🇳🇪" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "North Macedonia", flag: "🇲🇰" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Palestine", flag: "🇵🇸" },
  { name: "Panama", flag: "🇵🇦" },
  { name: "Peru", flag: "🇵🇪" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Romania", flag: "🇷🇴" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "Rwanda", flag: "🇷🇼" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "Serbia", flag: "🇷🇸" },
  { name: "Sierra Leone", flag: "🇸🇱" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Slovakia", flag: "🇸🇰" },
  { name: "Slovenia", flag: "🇸🇮" },
  { name: "Somalia", flag: "🇸🇴" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Sri Lanka", flag: "🇱🇰" },
  { name: "Sudan", flag: "🇸🇩" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Syria", flag: "🇸🇾" },
  { name: "Taiwan", flag: "🇹🇼" },
  { name: "Tajikistan", flag: "🇹🇯" },
  { name: "Tanzania", flag: "🇹🇿" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Togo", flag: "🇹🇬" },
  { name: "Tunisia", flag: "🇹🇳" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Turkmenistan", flag: "🇹🇲" },
  { name: "Uganda", flag: "🇺🇬" },
  { name: "Ukraine", flag: "🇺🇦" },
  { name: "United Arab Emirates", flag: "🇦🇪" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Uzbekistan", flag: "🇺🇿" },
  { name: "Venezuela", flag: "🇻🇪" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Yemen", flag: "🇾🇪" },
  { name: "Zambia", flag: "🇿🇲" },
  { name: "Zimbabwe", flag: "🇿🇼" },
]

const degreeOptions = [
  { value: "Bachelors", label: "Bachelor's" },
  { value: "Masters", label: "Master's" },
  { value: "PhD", label: "PhD" },
]

const fieldOptions = ["Computer Science", "Engineering", "Business", "Medicine", "Law", "Social Sciences", "Arts & Humanities", "Natural Sciences", "Education", "Agriculture", "Other"]

const fundingOptions = [
  { value: "Fully Funded", label: "Fully Funded" },
  { value: "Partially Funded", label: "Partially Funded" },
  { value: "Any", label: "Any" },
]

export default function ProfileEditPage() {
  const router = useRouter()
  const [section, setSection] = useState("Personal")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [nationality, setNationality] = useState("")
  const [degreeLevel, setDegreeLevel] = useState("")
  const [fieldOfStudy, setFieldOfStudy] = useState("")
  const [gpa, setGpa] = useState("")
  const [ieltsScore, setIeltsScore] = useState("")
  const [toeflScore, setToeflScore] = useState("")
  const [greScore, setGreScore] = useState("")
  const [preferredCountries, setPreferredCountries] = useState<string[]>([])
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
        setGpa(profile.gpa?.toString() || "")
        setIeltsScore(profile.ielts_score?.toString() || "")
        setToeflScore(profile.toefl_score?.toString() || "")
        setGreScore(profile.gre_score?.toString() || "")
        // Handle preferred_countries - could be array or string
        if (Array.isArray(profile.preferred_countries)) {
          setPreferredCountries(profile.preferred_countries)
        } else if (typeof profile.preferred_countries === "string" && profile.preferred_countries) {
          setPreferredCountries(profile.preferred_countries.split(",").map((s: string) => s.trim()).filter(Boolean))
        } else {
          setPreferredCountries([])
        }
        setFundingPreference(profile.funding_preference || "")
      } else {
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
      preferred_countries: preferredCountries.length > 0 ? preferredCountries : null,
      funding_preference: fundingPreference || null,
      updated_at: new Date().toISOString(),
    }

    const { data: existing } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    let error
    if (existing) {
      const { error: updateErr } = await supabase
        .from("user_profiles")
        .update(profileData)
        .eq("user_id", user.id)
      error = updateErr
    } else {
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

  const getCompletion = () => {
    const profileFields = [fullName, country, nationality, degreeLevel, fieldOfStudy, gpa, ieltsScore, toeflScore, greScore, preferredCountries, fundingPreference]
    const filled = profileFields.filter((f: any) => {
      if (!f) return false
      if (Array.isArray(f)) return f.length > 0
      return String(f).trim() !== ""
    }).length
    return Math.round((filled / profileFields.length) * 100)
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
                <EditSearchableCountry label="Country of citizenship" value={country} onChange={setCountry} />
                <EditSearchableCountry label="Nationality" value={nationality} onChange={setNationality} />
              </>
            )}
            {section === "Education" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Degree level</label>
                  <select value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500">
                    <option value="" className="bg-[#1a1a2e]">Select degree...</option>
                    {degreeOptions.map((d) => <option key={d.value} value={d.value} className="bg-[#1a1a2e]">{d.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Field of study</label>
                  <select value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500">
                    <option value="" className="bg-[#1a1a2e]">Select field...</option>
                    {fieldOptions.map((f) => <option key={f} value={f} className="bg-[#1a1a2e]">{f}</option>)}
                  </select>
                </div>
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
                <EditMultiCountrySelect
                  label="Preferred study destinations"
                  selected={preferredCountries}
                  onChange={setPreferredCountries}
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Funding preference</label>
                  <select value={fundingPreference} onChange={(e) => setFundingPreference(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500">
                    <option value="" className="bg-[#1a1a2e]">Select preference...</option>
                    {fundingOptions.map((f) => <option key={f.value} value={f.value} className="bg-[#1a1a2e]">{f.label}</option>)}
                  </select>
                </div>
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

// Searchable single country select for edit page
function EditSearchableCountry({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = allCountries.filter((c) => {
    if (!query) return true
    return c.name.toLowerCase().startsWith(query.toLowerCase())
  })

  const containsMatches = query
    ? allCountries.filter(
        (c) => !c.name.toLowerCase().startsWith(query.toLowerCase()) && c.name.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const allFiltered = [...filtered, ...containsMatches]
  const selected = allCountries.find((c) => c.name === value)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <button
        type="button"
        onClick={() => {
          setOpen(!open)
          setTimeout(() => inputRef.current?.focus(), 100)
        }}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-left outline-none transition-all focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
      >
        {selected ? (
          <span className="text-white">{selected.flag} {selected.name}</span>
        ) : (
          <span className="text-gray-500">Search and select...</span>
        )}
        <ChevronDown className={`size-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-[#1a1a2e] shadow-2xl">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search (e.g. 'P' for Pakistan)..."
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {allFiltered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-gray-500 text-center">No country found</p>
            ) : (
              allFiltered.map((c) => (
                <button
                  key={c.name}
                  onClick={() => { onChange(c.name); setOpen(false); setQuery("") }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${value === c.name ? "bg-purple-500/20 text-purple-300" : "text-gray-300 hover:bg-white/5"}`}
                >
                  {c.flag} {c.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Multi-select country component for edit page
function EditMultiCountrySelect({ label, selected, onChange }: { label: string; selected: string[]; onChange: (v: string[]) => void }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = allCountries.filter((c) => {
    if (!query) return !selected.includes(c.name)
    return c.name.toLowerCase().startsWith(query.toLowerCase()) && !selected.includes(c.name)
  })

  const containsMatches = query
    ? allCountries.filter(
        (c) => !c.name.toLowerCase().startsWith(query.toLowerCase()) && c.name.toLowerCase().includes(query.toLowerCase()) && !selected.includes(c.name)
      )
    : []

  const allFiltered = [...filtered, ...containsMatches]

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label} <span className="text-muted-foreground">({selected.length}/10)</span>
      </label>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selected.map((name) => {
            const c = allCountries.find((x) => x.name === name)
            return (
              <span key={name} className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 text-sm text-purple-300">
                {c?.flag} {name}
                <button onClick={() => onChange(selected.filter((x) => x !== name))} className="hover:text-white transition-colors">
                  <X className="size-3.5" />
                </button>
              </span>
            )
          })}
        </div>
      )}

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open)
          setTimeout(() => inputRef.current?.focus(), 100)
        }}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-left outline-none transition-all focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
      >
        <span className="text-gray-500">Search and add countries...</span>
        <ChevronDown className={`size-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-[#1a1a2e] shadow-2xl">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search (e.g. 'G' for Germany)..."
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {selected.length >= 10 ? (
              <p className="px-3 py-3 text-sm text-amber-400 text-center">Maximum 10 countries reached</p>
            ) : allFiltered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-gray-500 text-center">{query ? "No countries found" : "All countries selected"}</p>
            ) : (
              allFiltered.slice(0, 20).map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    if (selected.length < 10) {
                      onChange([...selected, c.name])
                    }
                    setQuery("")
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                >
                  {c.flag} {c.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}