"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Eye, EyeOff, Check, Loader2, AlertCircle, X } from "lucide-react"
import { GradientOrbs } from "@/components/gradient-orbs"
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase-auth"

const trustBadges = ["250+ Scholarships Updated Daily", "AI-Powered Matching", "100% Free Forever"]

const miniCards = [
  { flag: "🇬🇧", title: "Chevening Scholarship", tag: "Fully Funded", match: "94%" },
  { flag: "🇩🇪", title: "DAAD Scholarship", tag: "Masters / PhD", match: "88%" },
]

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [showReset, setShowReset] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [toast, setToast] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please enter both your email and password.")
      return
    }
    setLoading(true)
    const { error } = await signInWithEmail(email, password)
    if (error) {
      setError(error.message)
      setToast(true)
      setTimeout(() => setToast(false), 4000)
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError("")
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen lg:grid lg:grid-cols-2">
      <GradientOrbs />

      {/* Toast */}
      {toast && (
        <div className="animate-slide-in-br fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-950/80 px-4 py-3 text-sm shadow-lg">
          <AlertCircle className="size-5 text-red-400" />
          <span className="text-foreground">{error}</span>
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
              className="glass w-72 rounded-2xl p-4 animate-gentle-float"
              style={{ animationDelay: `${i * 1.5}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{c.flag}</span>
                <span className="text-xs font-semibold text-green-400">{c.match} Match</span>
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

          {!showReset ? (
            <>
              <h2 className="text-2xl font-bold text-foreground">Sign in to AdmitGoal</h2>
              <p className="mt-1 text-sm text-muted-foreground">Find scholarships matched to your profile</p>

              {/* Google Button */}
              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 text-sm font-semibold text-[#1f1f1f] transition-transform hover:scale-[1.01] disabled:opacity-70"
              >
                {googleLoading ? (
                  <Loader2 className="size-4 animate-spin text-gray-600" />
                ) : (
                  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
                    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"/>
                  </svg>
                )}
                {googleLoading ? "Connecting..." : "Continue with Google"}
              </button>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-muted-foreground">or continue with email</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)] ${
                      error ? "border-red-500/60" : "border-white/10 focus:border-brand"
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-xl border bg-white/5 px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)] ${
                        error ? "border-red-500/60" : "border-white/10 focus:border-brand"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && !toast && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="size-3.5" />
                    {error}
                  </p>
                )}

                <div className="-mt-1 text-right">
                  <button
                    type="button"
                    onClick={() => setShowReset(true)}
                    className="text-sm font-medium text-brand hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.01] disabled:opacity-70"
                >
                  {loading ? <><Loader2 className="size-4 animate-spin" /> Signing in...</> : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-brand hover:underline">Sign up free</Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
              <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send a reset link</p>

              {resetSent ? (
                <div className="mt-6 rounded-xl border border-green-500/30 bg-green-950/40 px-4 py-3 text-sm text-green-400">
                  ✓ Reset email sent! Check your inbox.
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  setLoading(true)
                  const { sendPasswordResetEmail } = await import("@/lib/supabase-auth")
                  const { error } = await sendPasswordResetEmail(email)
                  setLoading(false)
                  if (error) setError(error.message)
                  else setResetSent(true)
                }} className="mt-6 flex flex-col gap-4">
                  {error && (
                    <p className="flex items-center gap-1.5 text-xs text-red-400">
                      <AlertCircle className="size-3.5" />{error}
                    </p>
                  )}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-sm font-semibold text-white disabled:opacity-70"
                  >
                    {loading ? <><Loader2 className="size-4 animate-spin" /> Sending...</> : "Send Reset Link"}
                  </button>
                </form>
              )}

              <button
                onClick={() => { setShowReset(false); setResetSent(false); setError("") }}
                className="mt-4 text-sm text-brand hover:underline"
              >
                ← Back to Login
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  )
}