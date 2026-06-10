"use client"

import { useEffect, useState } from "react"
import { X, GraduationCap } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function ProfilePopup() {
  const [show, setShow] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (closed) return

    const checkAndShow = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      // Only show popup if user is NOT logged in
      if (!session) {
        const timer = setTimeout(() => setShow(true), 8000)
        return () => clearTimeout(timer)
      }
    }
    checkAndShow()
  }, [closed])

  if (!show || closed) return null

  return (
    <div
      className="animate-slide-in-br glass fixed bottom-4 right-4 z-[60] w-[calc(100%-2rem)] max-w-sm rounded-2xl p-5 sm:bottom-6 sm:right-6"
      style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.4), 0 20px 50px rgba(139,92,246,0.25)" }}
      role="dialog"
      aria-label="Create a free profile"
    >
      <button
        onClick={() => setClosed(true)}
        aria-label="Close"
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
      >
        <X className="size-4" />
      </button>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-2 shadow-[0_0_18px_rgba(139,92,246,0.45)]">
          <GraduationCap className="size-5 text-white" />
        </span>
        <div className="pr-4">
          <p className="text-sm font-bold text-foreground">Find scholarships matching YOUR profile</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Create a free profile and get AI-matched in 2 minutes.
          </p>
        </div>
      </div>
      <a href="/signup" className="mt-4 block w-full rounded-xl bg-gradient-to-r from-brand to-brand-2 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.4)] transition-transform hover:scale-[1.02]">
        Create Free Profile
      </a>
    </div>
  )
}