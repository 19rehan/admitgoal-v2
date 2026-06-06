export function GradientOrbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="animate-orb-a absolute -left-32 -top-24 size-[420px] rounded-full opacity-50 blur-[110px]"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 280 / 0.85), transparent 70%)" }}
      />
      <div
        className="animate-orb-b absolute -right-24 top-1/4 size-[460px] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, oklch(0.6 0.2 305 / 0.8), transparent 70%)" }}
      />
      <div
        className="animate-orb-c absolute bottom-0 left-1/3 size-[380px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, oklch(0.6 0.18 250 / 0.7), transparent 70%)" }}
      />
    </div>
  )
}
