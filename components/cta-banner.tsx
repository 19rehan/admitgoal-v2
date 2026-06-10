"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function Particles() {
  const dots = Array.from({ length: 18 })
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => (
        <span
          key={i}
          className="absolute size-1.5 rounded-full bg-white/40"
          style={{
            left: `${(i * 53) % 100}%`,
            bottom: "-10px",
            animation: `drift ${6 + (i % 5)}s linear ${i * 0.4}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export function CtaBanner() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkAuth()
  }, [])

  return (
    <section className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 120%, oklch(0.5 0.22 285 / 0.55), transparent 60%), radial-gradient(ellipse at 50% -20%, oklch(0.55 0.2 305 / 0.35), transparent 55%)",
        }}
      />
      <Particles />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-5xl">
          Your Dream Scholarship is <span className="text-gradient">Listed Here</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground">
          Join thousands of students from Pakistan, India, Bangladesh and Africa finding fully funded opportunities.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#scholarships"
            className="w-full rounded-xl bg-gradient-to-r from-brand to-brand-2 px-8 py-3.5 text-base font-semibold text-white shadow-[0_8px_30px_rgba(139,92,246,0.5)] transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Browse Scholarships
          </a>
          {!isLoggedIn && (
            <button
              onClick={() => router.push("/signup")}
              className="w-full rounded-xl border border-white/20 px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-white/5 sm:w-auto"
            >
              Create Free Profile
            </button>
          )}
        </div>
      </div>
    </section>
  )
}