import { UserPlus, Cpu, Send, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    desc: "Fill in your country, degree, GPA and IELTS score. It takes under 2 minutes.",
  },
  {
    icon: Cpu,
    title: "AI Matches You",
    desc: "Our AI finds scholarships that match your profile from 250+ live options.",
  },
  {
    icon: Send,
    title: "Apply with Confidence",
    desc: "Get complete guides, deadlines, and direct application links for every match.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-y border-white/5 bg-[oklch(0.15_0.035_283)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">How AdmitGoal Works</h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            Three simple steps between you and a fully funded education.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="glass flex h-full flex-col items-center rounded-2xl p-8 text-center">
                <span className="text-5xl font-extrabold text-gradient-brand">{i + 1}</span>
                <span className="mt-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_18px_rgba(139,92,246,0.45)]">
                  <step.icon className="size-6 text-white" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-6 top-1/2 hidden size-8 -translate-y-1/2 text-brand/50 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
