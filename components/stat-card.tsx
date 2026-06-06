"use client"

import type { LucideIcon } from "lucide-react"
import { useCountUp } from "@/hooks/use-count-up"

export function StatCard({
  icon: Icon,
  value,
  suffix = "",
  label,
  glow,
}: {
  icon: LucideIcon
  value: number
  suffix?: string
  label: string
  glow: string
}) {
  const { value: count, ref } = useCountUp(value)
  return (
    <div className="glass group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1" style={{ background: "rgba(26,26,46,0.55)" }}>
      <span
        className="flex size-11 items-center justify-center rounded-xl"
        style={{ background: `color-mix(in oklch, ${glow} 22%, transparent)`, boxShadow: `0 0 18px color-mix(in oklch, ${glow} 35%, transparent)` }}
      >
        <Icon className="size-5" style={{ color: glow }} />
      </span>
      <p className="mt-4 text-3xl font-bold text-foreground">
        <span ref={ref}>{count}</span>
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
