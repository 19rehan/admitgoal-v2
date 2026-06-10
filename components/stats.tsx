"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const duration = 1400
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="text-4xl font-extrabold text-gradient-brand sm:text-5xl">
      {value}
      {suffix}
    </span>
  )
}

export function Stats() {
  const [scholarshipCount, setScholarshipCount] = useState(250)
  const [countryCount, setCountryCount] = useState(50)

  useEffect(() => {
    const getCounts = async () => {
      // Total scholarships
      const { count } = await supabase
        .from("scholarship_details")
        .select("*", { count: "exact", head: true })
      if (count) setScholarshipCount(count)

      // Unique countries
      const { data } = await supabase
        .from("scholarship_details")
        .select("country")
      if (data) {
        const unique = new Set(data.map((d: any) => d.country).filter(Boolean))
        setCountryCount(unique.size)
      }
    }
    getCounts()
  }, [])

  const stats = [
    { value: scholarshipCount, suffix: "+", label: "Scholarships Listed" },
    { value: countryCount, suffix: "+", label: "Countries Covered" },
    { value: 6, suffix: "hrs", label: "Update Frequency" },
    { value: 100, suffix: "%", label: "Free Forever" },
  ]

  return (
    <section className="relative overflow-hidden py-16">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.45 0.18 285 / 0.35), transparent 65%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center">
            <CountUp target={s.value} suffix={s.suffix} />
            <span className="mt-2 text-sm text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}