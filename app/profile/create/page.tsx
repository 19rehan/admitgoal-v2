"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, ArrowRight, ArrowLeft, GraduationCap, X, Sparkles, CheckCircle2 } from "lucide-react"
import { GradientOrbs } from "@/components/gradient-orbs"

const steps = ["Basic Info", "Education", "Test Scores", "Preferences"]
const countries = [
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "India", flag: "🇮🇳" },
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Kenya", flag: "🇰🇪" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "United States", flag: "🇺🇸" },
]
const degrees = ["Bachelor", "Masters", "PhD"]
const fundingOpts = ["Fully Funded", "Partial", "Both"]

export default function ProfileCreatePage() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  // form state
  const [degree, setDegree] = useState("Masters")
  const [funding, setFunding] = useState("Fully Funded")
  const [noTests, setNoTests] = useState(false)
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["Pakistan"])
  const [countryQuery, setCountryQuery] = useState("")

  const next = () => (step < 3 ? setStep((s) => s + 1) : setDone(true))
  const back = () => setStep((s) => Math.max(0, s - 1))

  const filteredCountries = countries.filter(
    (c) => c.name.toLowerCase().includes(countryQuery.toLowerCase()) && !selectedCountries.includes(c.name),
  )

  if (done) {
    return (
      <main className="relative flex min-h-screen items-center justify-center p-6">
        <GradientOrbs />
        <div className="glass animate-slide-in-br w-full max-w-md rounded-2xl p-8 text-center" style={{ background: "rgba(26,26,46,0.6)" }}>
          <div className="relative mx-auto flex size-20 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand/30" />
            <span className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_30px_rgba(139,92,246,0.6)]">
              <CheckCircle2 className="size-10 text-white" />
            </span>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Profile Complete! 🎉</h1>
          <p className="mt-2 text-muted-foreground">We found 47 scholarships matching your profile</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
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
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_18px_rgba(139,92,246,0.5)]">
            <GraduationCap className="size-5 text-white" />
          </span>
          <span className="text-lg font-bold text-gradient-brand">AdmitGoal</span>
        </Link>

        {/* Progress steps */}
        <div className="mb-8 flex items-center">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                    i < step
                      ? "bg-[oklch(0.6_0.16_150)] text-white"
                      : i === step
                        ? "bg-gradient-to-br from-brand to-brand-2 text-white shadow-[0_0_16px_rgba(139,92,246,0.5)]"
                        : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="size-4" /> : i + 1}
                </span>
                <span className={`hidden text-xs sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <span className={`mx-2 h-0.5 flex-1 rounded ${i < step ? "bg-[oklch(0.6_0.16_150)]" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 sm:p-8" style={{ background: "rgba(26,26,46,0.6)" }}>
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold text-foreground">Tell us about yourself</h2>
              <div className="mt-6 flex flex-col gap-4">
                <Input label="Full Name" placeholder="Ahmed Khan" />
                <Select label="Country of residence" options={countries.map((c) => `${c.flag} ${c.name}`)} />
                <Select label="Nationality" options={countries.map((c) => `${c.flag} ${c.name}`)} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-foreground">Your education background</h2>
              <div className="mt-6 flex flex-col gap-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Degree level</p>
                  <div className="grid grid-cols-3 gap-3">
                    {degrees.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDegree(d)}
                        className={`rounded-xl border py-3 text-sm font-semibold transition-all duration-300 ${
                          degree === d
                            ? "border-brand bg-brand/15 text-foreground shadow-[0_0_16px_rgba(139,92,246,0.3)]"
                            : "border-white/10 text-muted-foreground hover:bg-white/5"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <Select label="Field of study" options={["Computer Science", "Engineering", "Business", "Medicine", "Social Sciences"]} />
                <Input label="Current / Last University" placeholder="NUST Islamabad" />
                <Input label="GPA (0.0 - 4.0)" type="number" placeholder="3.4" />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-foreground">Your test scores</h2>
              <div className="mt-6 flex flex-col gap-4">
                <Input label="IELTS score (0-9)" type="number" placeholder="7.0" disabled={noTests} />
                <Input label="TOEFL score (optional)" type="number" placeholder="100" disabled={noTests} />
                <Input label="GRE score (optional)" type="number" placeholder="320" disabled={noTests} />
                <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <input type="checkbox" checked={noTests} onChange={(e) => setNoTests(e.target.checked)} className="size-4 accent-[oklch(0.62_0.21_280)]" />
                  I haven&apos;t taken any English tests yet
                </label>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-foreground">Your scholarship preferences</h2>
              <div className="mt-6 flex flex-col gap-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Preferred countries</p>
                  {selectedCountries.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {selectedCountries.map((name) => {
                        const c = countries.find((x) => x.name === name)
                        return (
                          <span key={name} className="inline-flex items-center gap-1.5 rounded-full bg-brand/20 px-3 py-1 text-sm text-[oklch(0.8_0.14_300)]">
                            {c?.flag} {name}
                            <button onClick={() => setSelectedCountries((p) => p.filter((x) => x !== name))} aria-label={`Remove ${name}`}>
                              <X className="size-3.5" />
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  )}
                  <input
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
                  />
                  {countryQuery && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {filteredCountries.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setSelectedCountries((p) => [...p, c.name])
                            setCountryQuery("")
                          }}
                          className="rounded-full border border-white/10 px-3 py-1 text-sm text-muted-foreground hover:bg-white/5"
                        >
                          {c.flag} {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Funding preference</p>
                  <div className="grid grid-cols-3 gap-3">
                    {fundingOpts.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFunding(f)}
                        className={`rounded-xl border py-3 text-sm font-semibold transition-all duration-300 ${
                          funding === f
                            ? "border-brand bg-brand/15 text-foreground shadow-[0_0_16px_rgba(139,92,246,0.3)]"
                            : "border-white/10 text-muted-foreground hover:bg-white/5"
                        }`}
                      >
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
              <button
                onClick={back}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
            )}
            <button
              onClick={next}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.01]"
            >
              {step === 3 ? (
                <>
                  Complete Profile <Sparkles className="size-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function Input({
  label,
  placeholder,
  type = "text",
  disabled,
}: {
  label: string
  placeholder: string
  type?: string
  disabled?: boolean
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)] disabled:opacity-40"
      />
    </div>
  )
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-brand">
        {options.map((o) => (
          <option key={o} className="bg-[#1a1a2e]">
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
