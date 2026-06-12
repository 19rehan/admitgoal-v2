"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Check, ArrowRight, ArrowLeft, GraduationCap, X, Sparkles, CheckCircle2, Search, ChevronDown } from "lucide-react"
import { GradientOrbs } from "@/components/gradient-orbs"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const steps = ["Basic Info", "Education", "Test Scores", "Preferences"]

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

const degrees = ["Bachelors", "Masters", "PhD"]
const fields = ["Computer Science", "Engineering", "Business", "Medicine", "Law", "Social Sciences", "Arts & Humanities", "Natural Sciences", "Education", "Agriculture", "Other"]
const fundingOpts = ["Fully Funded", "Partially Funded", "Any"]

export default function ProfileCreatePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [fullName, setFullName] = useState("")
  const [country, setCountry] = useState("")
  const [nationality, setNationality] = useState("")
  const [degree, setDegree] = useState("Masters")
  const [fieldOfStudy, setFieldOfStudy] = useState("")
  const [university, setUniversity] = useState("")
  const [gpa, setGpa] = useState("")
  const [ielts, setIelts] = useState("")
  const [toefl, setToefl] = useState("")
  const [gre, setGre] = useState("")
  const [noTests, setNoTests] = useState(false)
  const [funding, setFunding] = useState("Fully Funded")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [countryQuery, setCountryQuery] = useState("")

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      setUser(session.user)
      setFullName(session.user.user_metadata?.full_name || "")
    }
    checkUser()
  }, [router])

  const handleComplete = async () => {
    if (!user) return
    setSaving(true)

    const profileData = {
      user_id: user.id,
      full_name: fullName || null,
      email: user.email || null,
      country: country || null,
      nationality: nationality || null,
      degree_level: degree || null,
      field_of_study: fieldOfStudy || null,
      gpa: gpa ? parseFloat(gpa) : null,
      ielts_score: ielts ? parseFloat(ielts) : null,
      toefl_score: toefl ? parseFloat(toefl) : null,
      gre_score: gre ? parseFloat(gre) : null,
      preferred_countries: selectedCountries.length > 0 ? selectedCountries : null,
      funding_preference: funding || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("user_profiles")
      .upsert(profileData, { onConflict: "user_id" })

    setSaving(false)

    if (error) {
      console.error("Save error:", error)
      alert("Failed to save profile: " + error.message)
    } else {
      setDone(true)
    }
  }

  const next = () => {
    if (step < 3) {
      setStep((s) => s + 1)
    } else {
      handleComplete()
    }
  }
  const back = () => setStep((s) => Math.max(0, s - 1))

  const filteredPrefCountries = allCountries.filter(
    (c) => c.name.toLowerCase().startsWith(countryQuery.toLowerCase()) && !selectedCountries.includes(c.name),
  )

  if (done) {
    return (
      <main className="relative flex min-h-screen items-center justify-center p-6">
        <GradientOrbs />
        <div className="w-full max-w-md rounded-2xl border border-white/10 p-8 text-center" style={{ background: "rgba(26,26,46,0.6)", backdropFilter: "blur(12px)" }}>
          <div className="relative mx-auto flex size-20 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-purple-500/30" />
            <span className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-violet-600 shadow-[0_0_30px_rgba(139,92,246,0.6)]">
              <CheckCircle2 className="size-10 text-white" />
            </span>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">Profile Complete! 🎉</h1>
          <p className="mt-2 text-gray-400">Your personalized scholarship matches are ready</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
          >
            View My Matches <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen px-4 py-10 sm:px-6">
      <GradientOrbs />
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 shadow-[0_0_18px_rgba(139,92,246,0.5)]">
            <GraduationCap className="size-5 text-white" />
          </span>
          <span className="text-lg font-bold text-purple-300">AdmitGoal</span>
        </Link>

        {/* Progress steps */}
        <div className="mb-8 flex items-center">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${i < step ? "bg-green-600 text-white" : i === step ? "bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.5)]" : "bg-white/10 text-gray-500"}`}>
                  {i < step ? <Check className="size-4" /> : i + 1}
                </span>
                <span className={`hidden text-xs sm:block ${i === step ? "text-white" : "text-gray-500"}`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <span className={`mx-2 h-0.5 flex-1 rounded ${i < step ? "bg-green-600" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 p-6 sm:p-8" style={{ background: "rgba(26,26,46,0.6)", backdropFilter: "blur(12px)" }}>
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold text-white">Tell us about yourself</h2>
              <div className="mt-6 flex flex-col gap-4">
                <InputField label="Full Name" value={fullName} onChange={setFullName} placeholder="Your full name" />
                <SearchableCountry label="Country of residence" value={country} onChange={setCountry} />
                <SearchableCountry label="Nationality" value={nationality} onChange={setNationality} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-white">Your education background</h2>
              <div className="mt-6 flex flex-col gap-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-white">Degree level you want to pursue</p>
                  <div className="grid grid-cols-3 gap-3">
                    {degrees.map((d) => (
                      <button key={d} onClick={() => setDegree(d)} className={`rounded-xl border py-3 text-sm font-semibold transition-all duration-300 ${degree === d ? "border-purple-500 bg-purple-500/15 text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white">Field of study</label>
                  <select value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500">
                    <option value="" className="bg-[#1a1a2e]">Select field...</option>
                    {fields.map((f) => <option key={f} value={f} className="bg-[#1a1a2e]">{f}</option>)}
                  </select>
                </div>
                <InputField label="Current / Last University" value={university} onChange={setUniversity} placeholder="e.g. NUST Islamabad" />
                <InputField label="GPA (0.0 - 4.0)" value={gpa} onChange={setGpa} placeholder="e.g. 3.5" type="number" />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-white">Your test scores</h2>
              <p className="mt-1 text-sm text-gray-400">Leave blank if you haven&apos;t taken any tests yet</p>
              <div className="mt-6 flex flex-col gap-4">
                <InputField label="IELTS score (0-9)" value={ielts} onChange={setIelts} placeholder="e.g. 7.0" type="number" disabled={noTests} />
                <InputField label="TOEFL score (optional)" value={toefl} onChange={setToefl} placeholder="e.g. 100" type="number" disabled={noTests} />
                <InputField label="GRE score (optional)" value={gre} onChange={setGre} placeholder="e.g. 320" type="number" disabled={noTests} />
                <label className="flex items-center gap-2.5 text-sm text-gray-400">
                  <input type="checkbox" checked={noTests} onChange={(e) => setNoTests(e.target.checked)} className="size-4 accent-purple-500" />
                  I haven&apos;t taken any English tests yet
                </label>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-white">Your scholarship preferences</h2>
              <div className="mt-6 flex flex-col gap-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-white">Preferred study destinations <span className="text-gray-500">({selectedCountries.length}/10)</span></p>
                  {selectedCountries.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {selectedCountries.map((name) => {
                        const c = allCountries.find((x) => x.name === name)
                        return (
                          <span key={name} className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 text-sm text-purple-300">
                            {c?.flag} {name}
                            <button onClick={() => setSelectedCountries((p) => p.filter((x) => x !== name))} className="hover:text-white transition-colors"><X className="size-3.5" /></button>
                          </span>
                        )
                      })}
                    </div>
                  )}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                    <input
                      value={countryQuery}
                      onChange={(e) => setCountryQuery(e.target.value)}
                      placeholder="Type country name (e.g. 'P' for Pakistan)..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
                    />
                  </div>
                  {countryQuery && (
                    <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-[#1a1a2e] p-2">
                      {filteredPrefCountries.length > 0 ? (
                        filteredPrefCountries.slice(0, 15).map((c) => (
                          <button
                            key={c.name}
                            onClick={() => {
                              if (selectedCountries.length < 10) {
                                setSelectedCountries((p) => [...p, c.name])
                              }
                              setCountryQuery("")
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                          >
                            {c.flag} {c.name}
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm text-gray-500">No countries found</p>
                      )}
                    </div>
                  )}
                  {selectedCountries.length >= 10 && (
                    <p className="mt-2 text-xs text-amber-400">Maximum 10 countries reached</p>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-white">Funding preference</p>
                  <div className="grid grid-cols-3 gap-3">
                    {fundingOpts.map((f) => (
                      <button key={f} onClick={() => setFunding(f)} className={`rounded-xl border py-3 text-sm font-semibold transition-all duration-300 ${funding === f ? "border-purple-500 bg-purple-500/15 text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Nav buttons */}
          <div className="mt-8 flex items-center gap-3">
            {step > 0 && (
              <button onClick={back} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5">
                <ArrowLeft className="size-4" /> Back
              </button>
            )}
            <button
              onClick={next}
              disabled={saving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              {saving ? "Saving..." : step === 3 ? (<>Complete Profile <Sparkles className="size-4" /></>) : (<>Next <ArrowRight className="size-4" /></>)}
            </button>
          </div>

          {/* Skip option */}
          {step === 0 && (
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Skip for now — I&apos;ll complete this later
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

function InputField({ label, value, onChange, placeholder, type = "text", disabled }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-white">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition-all focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)] disabled:opacity-40" />
    </div>
  )
}

function SearchableCountry({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Smart filtering: startsWith first, then includes
  const filtered = allCountries.filter((c) => {
    if (!query) return true
    return c.name.toLowerCase().startsWith(query.toLowerCase())
  })

  // Also show "contains" matches after startsWith matches
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
      <label className="mb-1.5 block text-sm font-medium text-white">{label}</label>
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
