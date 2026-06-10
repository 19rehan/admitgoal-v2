"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { GradientOrbs } from "@/components/gradient-orbs"
import { signUpWithEmail, signInWithGoogle } from "@/lib/supabase-auth"

const students = [
  { initials: "AK", flag: "🇵🇰", name: "Ayesha K.", country: "Pakistan" },
  { initials: "RS", flag: "🇮🇳", name: "Rahul S.", country: "India" },
  { initials: "CO", flag: "🇳🇬", name: "Chidi O.", country: "Nigeria" },
]

function strength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (pw.length === 0) return { level: 0, label: "", color: "" }
  if (score <= 1) return { level: 1, label: "Weak", color: "oklch(0.62 0.22 25)" }
  if (score <= 3) return { level: 2, label: "Medium", color: "oklch(0.78 0.15 75)" }
  return { level: 3, label: "Strong", color: "oklch(0.7 0.16 155)" }
}

export default function SignupPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const s = strength(password)
  const mismatch = confirm.length > 0 && confirm !== password

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (!agree) {
      setError("Please agree to terms and conditions.")
      return
    }

    setLoading(true)
    const { data, error: signUpError } = await signUpWithEmail(name, email, password)
    setLoading(false)

    if (signUpError) {
      if (
        signUpError.message.toLowerCase().includes("already registered") ||
        signUpError.message.toLowerCase().includes("already been registered")
      ) {
        setError("This email is already registered. Please log in instead.")
      } else {
        setError(signUpError.message)
      }
      return
    }

    // Supabase returns empty identities array if email already exists
    if (data?.user && data.user.identities && data.user.identities.length === 0) {
      setError("This email is already in use. Please log in instead.")
      return
    }

    setSuccess(true)
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

      {/* Left panel */}
      <section className="relative hidden flex-col justify-center overflow-hidden p-12 lg:flex">
        <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground">Join Thousands of Students</h1>
        <p className="mt-3 text-lg text-muted-foreground">Finding fully funded scholarships worldwide</p>

        <div className="mt-12 flex flex-col gap-4">
          {students.map((st, i) => (
            <div
              key={st.name}
              className="glass flex w-72 items-center gap-3 rounded-2xl p-4 animate-gentle-float"
              style={{ animationDelay: `${i * 1.2}s` }}
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-sm font-semibold text-white">
                {st.initials}
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  {st.name} <span className="ml-1">{st.flag}</span>
                </p>
                <p className="text-xs text-muted-foreground">{st.country}</p>
              </div>
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

          {success ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-green-500/20 text-4xl">✓</span>
              <h2 className="text-2xl font-bold text-foreground">Account Created!</h2>
              <p className="text-sm text-muted-foreground">
                Check your email to confirm your account, then sign in.
              </p>
              <Link
                href="/login"
                className="mt-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-6 py-3 text-sm font-semibold text-white"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground">Create Free Account</h2>
              <p className="mt-1 text-sm text-muted-foreground">Takes less than 2 minutes</p>

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
                {googleLoading ? "Connecting..." : "Sign up with Google"}
              </button>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-muted-foreground">or sign up with email</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="size-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <Field id="name" label="Full Name" value={name} onChange={setName} placeholder="Ahmed Khan" />
                <Field id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {s.level > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3].map((n) => (
                          <span key={n} className="h-1.5 flex-1 rounded-full transition-colors"
                            style={{ background: n <= s.level ? s.color : "rgba(255,255,255,0.1)" }} />
                        ))}
                      </div>
                      <span className="text-xs font-medium" style={{ color: s.color }}>{s.label}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-foreground">Confirm Password</label>
                  <input
                    id="confirm"
                    type={showPw ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)] ${
                      mismatch ? "border-red-500/60" : "border-white/10 focus:border-brand"
                    }`}
                  />
                  {mismatch && <p className="mt-1 text-xs text-red-400">Passwords do not match.</p>}
                </div>

                <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-[oklch(0.62_0.21_280)]"
                  />
                  <span>
                    I agree to the{" "}
                    <span className="text-brand">Terms of Service</span> and{" "}
                    <span className="text-brand">Privacy Policy</span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading || !agree || mismatch}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.01] disabled:opacity-50"
                >
                  {loading ? <><Loader2 className="size-4 animate-spin" /> Creating account...</> : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-brand hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

function Field({ id, label, value, onChange, placeholder, type = "text" }: {
  id: string; label: string; value: string
  onChange: (v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
      />
    </div>
  )
}