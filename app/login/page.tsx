"use client"

import Link from "next/link"
import { useState } from "react"
import { GraduationCap, Eye, EyeOff, Check, Loader2, AlertCircle, X } from "lucide-react"
import { GradientOrbs } from "@/components/gradient-orbs"
import { GoogleButton } from "@/components/google-button"

const trustBadges = ["250+ Scholarships Updated Daily", "AI-Powered Matching", "100% Free Forever"]

const miniCards = [
  { flag: "🇬🇧", title: "Chevening Scholarship", tag: "Fully Funded", match: "94%" },
  { flag: "🇩🇪", title: "DAAD Scholarship", tag: "Masters / PhD", match: "88%" },
]

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please enter both your email and password.")
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setToast(true)
      setTimeout(() => setToast(false), 4000)
    }, 1400)
  }

  return (
    <main className="relative min-h-screen lg:grid lg:grid-cols-2">
      <GradientOrbs />

      {/* Toast */}
      {toast && (
        <div className="animate-slide-in-br fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl border border-[oklch(0.62_0.22_25_/_0.4)] bg-[oklch(0.2_0.06_25)] px-4 py-3 text-sm shadow-lg">
          <AlertCircle className="size-5 text-[oklch(0.7_0.2_25)]" />
          <span className="text-foreground">Invalid credentials. Please try again.</span>
          <button onClick={() => setToast(false)} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Left panel */}
      <section className="relative hidden flex-col justify-center overflow-hidden p-12 lg:flex">
        <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground">Welcome Back</h1>
        <p className="mt-3 text-lg text-muted-foreground">Continue your scholarship journey</p>

        <ul className="mt-10 flex flex-col gap-4">
          {trustBadges.map((b) => (
            <li key={b} className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2">
                <Check className="size-3.5 text-white" />
              </span>
              <span className="text-sm font-medium text-foreground">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-4">
          {miniCards.map((c, i) => (
            <div
              key={c.title}
              className="glass w-72 rounded-2xl p-4"
              style={{ background: "rgba(26,26,46,0.55)", animation: `gentle-float 6s ease-in-out ${i * 1.5}s infinite` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{c.flag}</span>
                <span className="text-xs font-semibold text-[oklch(0.8_0.16_155)]">{c.match} Match</span>
              </div>
              <p className="mt-2 font-semibold text-foreground">{c.title}</p>
              <p className="text-xs text-muted-foreground">{c.tag}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Right panel */}
      <section className="flex min-h-screen items-center justify-center p-6 lg:min-h-0">
        <div className="glass w-full max-w-md rounded-2xl p-8" style={{ background: "rgba(26,26,46,0.6)" }}>
          <Link href="/" className="mb-6 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_18px_rgba(139,92,246,0.5)]">
              <GraduationCap className="size-5 text-white" />
            </span>
            <span className="text-lg font-bold text-gradient-brand">AdmitGoal</span>
          </Link>

          <h2 className="text-2xl font-bold text-foreground">Sign in to AdmitGoal</h2>
          <p className="mt-1 text-sm text-muted-foreground">Find scholarships matched to your profile</p>

          <div className="mt-6">
            <GoogleButton label="Continue with Google" />
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)] ${
                  error ? "border-[oklch(0.62_0.22_25)]" : "border-white/10 focus:border-brand"
                }`}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)] ${
                    error ? "border-[oklch(0.62_0.22_25)]" : "border-white/10 focus:border-brand"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-xs text-[oklch(0.7_0.2_25)]">
                <AlertCircle className="size-3.5" />
                {error}
              </p>
            )}

            <div className="-mt-1 text-right">
              <button type="button" className="text-sm font-medium text-[oklch(0.72_0.18_300)] hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.01] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[oklch(0.72_0.18_300)] hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
