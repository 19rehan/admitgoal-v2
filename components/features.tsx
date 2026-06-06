import { Bot, Bookmark, BarChart3, Bell, FileText, Globe } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "AI Matching",
    desc: "Get personalized scholarship matches based on your profile, GPA, and preferences.",
  },
  {
    icon: Bookmark,
    title: "Save Scholarships",
    desc: "Bookmark scholarships and access your saved list anytime, from any device.",
  },
  {
    icon: BarChart3,
    title: "Application Tracker",
    desc: "Track your applications from planning to accepted.",
    soon: true,
  },
  {
    icon: Bell,
    title: "Deadline Reminders",
    desc: "Never miss a deadline with smart, timely reminders.",
    soon: true,
  },
  {
    icon: FileText,
    title: "Blog Guides",
    desc: "Detailed guides for every scholarship to help you write winning applications.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    desc: "Scholarships from USA, UK, Europe, Asia, and more — all in one place.",
  },
]

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
          Everything You Need to Win a Scholarship
        </h2>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="glass group relative rounded-2xl p-6 transition-all hover:-translate-y-1">
            {f.soon && (
              <span className="absolute right-4 top-4 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                Coming soon
              </span>
            )}
            <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_18px_rgba(139,92,246,0.4)]">
              <f.icon className="size-6 text-white" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
