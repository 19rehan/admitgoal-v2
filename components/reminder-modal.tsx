"use client"

import { useEffect, useState } from "react"
import { X, Bell, Mail } from "lucide-react"
import { currentUser } from "@/lib/scholarships"

const options = ["1 week before deadline", "2 weeks before deadline", "1 month before deadline", "Custom date"]

export function ReminderModal({
  open,
  scholarshipTitle,
  onClose,
}: {
  open: boolean
  scholarshipTitle: string
  onClose: () => void
}) {
  const [selected, setSelected] = useState(options[0])
  const [customDate, setCustomDate] = useState("")

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="glass animate-slide-in-br relative w-full max-w-md rounded-2xl p-6" style={{ background: "rgba(26,26,46,0.9)" }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_18px_rgba(139,92,246,0.4)]">
              <Bell className="size-5 text-white" />
            </span>
            <h2 className="text-lg font-bold text-foreground">Set Deadline Reminder</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          For <span className="font-semibold text-[oklch(0.78_0.14_300)]">{scholarshipTitle}</span>
        </p>

        <div className="mt-5 flex flex-col gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
                selected === opt
                  ? "border-brand bg-brand/15 text-foreground"
                  : "border-white/10 text-muted-foreground hover:bg-white/5"
              }`}
            >
              <span
                className={`flex size-4 items-center justify-center rounded-full border ${
                  selected === opt ? "border-brand" : "border-white/30"
                }`}
              >
                {selected === opt && <span className="size-2 rounded-full bg-gradient-to-br from-brand to-brand-2" />}
              </span>
              {opt}
            </button>
          ))}
        </div>

        {selected === "Custom date" && (
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(139,92,246,0.25)]"
          />
        )}

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-xs text-muted-foreground">
          <Mail className="size-4 shrink-0 text-[oklch(0.72_0.18_300)]" />
          Reminder will be sent to: <span className="font-medium text-foreground">{currentUser.email}</span>
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/15 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/5">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-gradient-to-r from-brand to-brand-2 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] transition-transform hover:scale-[1.02]"
          >
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  )
}
