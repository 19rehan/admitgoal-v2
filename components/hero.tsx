import { Rocket, ArrowRight } from "lucide-react"

function GradientOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-orb-a absolute -left-20 top-10 size-[420px] rounded-full bg-[oklch(0.55_0.22_280)] opacity-25 blur-[120px]" />
      <div className="animate-orb-b absolute right-0 top-1/4 size-[380px] rounded-full bg-[oklch(0.58_0.2_310)] opacity-20 blur-[120px]" />
      <div className="animate-orb-c absolute bottom-0 left-1/3 size-[440px] rounded-full bg-[oklch(0.5_0.2_265)] opacity-20 blur-[130px]" />
    </div>
  )
}

const floatingCards = [
  { name: "Chevening Scholarship", flag: "🇬🇧", deadline: "Nov 2025" },
  { name: "DAAD Germany", flag: "🇩🇪", deadline: "Oct 2025" },
  { name: "Erasmus Mundus", flag: "🇪🇺", deadline: "Jan 2026" },
]

function MiniCard({
  name,
  flag,
  deadline,
  className,
  delay,
}: {
  name: string
  flag: string
  deadline: string
  className?: string
  delay: string
}) {
  return (
    <div
      className={`glass animate-gentle-float w-60 rounded-2xl p-4 ${className ?? ""}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{flag}</span>
        <span className="rounded-full bg-[oklch(0.55_0.16_150)]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[oklch(0.8_0.16_155)]">
          Fully Funded
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{name}</p>
      <p className="mt-1 text-xs text-muted-foreground">Deadline: {deadline}</p>
    </div>
  )
}

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16">
      <GradientOrbs />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="text-center lg:text-left">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Rocket className="size-3.5 text-accent" />
            AI-powered scholarship matching
          </span>
          <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Find Scholarships
            <br />
            <span className="text-4xl sm:text-5xl lg:text-6xl">Worth Millions.</span>
            <br />
            <span className="text-gradient">For Free.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            AI-powered scholarship matching for students from Pakistan, India, Bangladesh and Africa.
            250+ scholarships. Zero cost.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start">
            <a
              href="#scholarships"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-7 py-3.5 text-base font-semibold text-white shadow-[0_8px_30px_rgba(139,92,246,0.5)] transition-transform hover:scale-[1.03] sm:w-auto"
            >
              Find My Scholarship
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-white/5 sm:w-auto"
            >
              How It Works
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
            {["250+ Scholarships", "50+ Countries", "100% Free Forever"].map((b) => (
              <span
                key={b}
                className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
              >
                <span className="text-accent">✓</span> {b}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block">
          <MiniCard {...floatingCards[0]} delay="0s" className="absolute left-0 top-4" />
          <MiniCard {...floatingCards[1]} delay="1.2s" className="absolute right-0 top-32" />
          <MiniCard {...floatingCards[2]} delay="2.1s" className="absolute bottom-2 left-10" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 lg:hidden">
          <MiniCard {...floatingCards[0]} delay="0s" />
          <MiniCard {...floatingCards[1]} delay="1.2s" />
        </div>
      </div>
    </section>
  )
}
