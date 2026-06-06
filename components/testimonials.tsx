const testimonials = [
  {
    name: "Ayesha K.",
    flag: "🇵🇰",
    location: "Lahore, Pakistan",
    quote:
      "I had no idea where to even start. AdmitGoal matched me with three fully funded options I qualified for in minutes.",
  },
  {
    name: "Rahul S.",
    flag: "🇮🇳",
    location: "Bengaluru, India",
    quote:
      "The deadline tracking and application guides made the whole process feel manageable instead of overwhelming.",
  },
  {
    name: "Chidi O.",
    flag: "🇳🇬",
    location: "Lagos, Nigeria",
    quote:
      "Everything in one place, and it is genuinely free. The match percentage helped me focus on scholarships I could actually win.",
  },
]

const flags = ["🇬🇧", "🇩🇪", "🇹🇷", "🇨🇳", "🇪🇺", "🇺🇸", "🇦🇺", "🇨🇦", "🇯🇵", "🇰🇷"]

export function Testimonials() {
  return (
    <section className="border-y border-white/5 bg-[oklch(0.15_0.035_283)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-balance text-3xl font-bold text-foreground sm:text-4xl">
          Students Trust AdmitGoal
        </h2>

        <div className="no-scrollbar mt-12 flex gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="glass min-w-[280px] flex-1 rounded-2xl p-6 md:min-w-0"
            >
              <blockquote className="text-sm leading-relaxed text-foreground/90">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-white/5 text-lg">
                  {t.flag}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.location}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {flags.map((f, i) => (
            <span
              key={i}
              className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
