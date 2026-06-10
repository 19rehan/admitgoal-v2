"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ScholarshipsSection } from "@/components/scholarships-section"
import { HowItWorks } from "@/components/how-it-works"
import { Stats } from "@/components/stats"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { CtaBanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer"
import { ProfilePopup } from "@/components/profile-popup"

export default function Page() {
  const [savedIds, setSavedIds] = useState<string[]>([])

  const toggleSave = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <Hero />
      <ScholarshipsSection savedIds={savedIds} onToggleSave={toggleSave} />
      <HowItWorks />
      <Stats />
      <Features />
      <Testimonials />
      <CtaBanner />
      <Footer />
      <ProfilePopup />
    </main>
  )
}