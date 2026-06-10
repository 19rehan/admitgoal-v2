"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase auto-detects the hash fragment and sets the session
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        // Wait a moment for Supabase to process the hash
        await new Promise(resolve => setTimeout(resolve, 1000))
        const { data: { session: retrySession } } = await supabase.auth.getSession()
        
        if (!retrySession) {
          router.push("/login?error=auth_failed")
          return
        }
      }

      const currentSession = session || (await supabase.auth.getSession()).data.session

      if (currentSession?.user) {
        // Check if user has a profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("user_id", currentSession.user.id)
          .single()

        if (profile) {
          router.push("/")
        } else {
          router.push("/profile/create")
        }
      } else {
        router.push("/login?error=no_session")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
        <p className="mt-4 text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  )
}