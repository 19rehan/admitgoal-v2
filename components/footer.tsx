import { GraduationCap, Send, Globe, Mail, MessageCircle } from "lucide-react"

const columns = [
  {
    title: "Quick Links",
    links: ["Home", "Scholarships", "About", "Contact"],
  },
  {
    title: "Resources",
    links: ["Blog", "Application Tips", "IELTS Guide", "SOP Guide"],
  },
]

const socials = [Send, MessageCircle, Mail, Globe]

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative bg-[oklch(0.1_0.03_283)]"
      style={{ borderTop: "1px solid rgba(139,92,246,0.25)" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#home" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2">
                <GraduationCap className="size-5 text-white" />
              </span>
              <span className="text-lg font-bold text-gradient-brand">AdmitGoal</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Find Your Scholarship. Change Your Life. Built for students who deserve world-class education.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
            <p className="mt-4 text-sm text-muted-foreground">Follow us for daily scholarship updates</p>
            <div className="mt-4 flex gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AdmitGoal. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Free forever. No ads. No spam.</p>
        </div>
      </div>
    </footer>
  )
}
