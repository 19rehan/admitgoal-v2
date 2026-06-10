// AdmitGoal Scholarship Matching Algorithm
// Scores scholarships 0-100 based on how well user meets scholarship REQUIREMENTS

interface UserProfile {
  country?: string | null
  nationality?: string | null
  degree_level?: string | null
  field_of_study?: string | null
  gpa?: number | null
  ielts_score?: number | null
  toefl_score?: number | null
  gre_score?: number | null
  preferred_countries?: string | string[] | null
  funding_preference?: string | null
}

interface Scholarship {
  id: string
  title: string
  country?: string | null
  degree_level?: string | null
  funding_type?: string | null
  eligible_countries?: string | null
  ielts_score?: string | null
  gpa_required?: string | null
  deadline?: string | null
  [key: string]: any
}

function toSearchString(value: any): string {
  if (!value) return ""
  if (Array.isArray(value)) return value.join(",").toLowerCase()
  return String(value).toLowerCase()
}

export function calculateMatchScore(profile: UserProfile, scholarship: Scholarship): number {
  let score = 0
  let totalWeight = 0

  // Determine what THIS scholarship requires and weight accordingly
  const hasCountryReq = !!scholarship.eligible_countries
  const hasDegreeReq = !!scholarship.degree_level
  const hasIeltsReq = !!scholarship.ielts_score && scholarship.ielts_score !== "—"
  const hasGpaReq = !!scholarship.gpa_required && scholarship.gpa_required !== "—"
  const hasFundingType = !!scholarship.funding_type

  // ============================================
  // 1. ELIGIBILITY BY NATIONALITY/COUNTRY (Critical)
  // If scholarship specifies eligible countries, user MUST be from there
  // ============================================
  const eligibilityWeight = hasCountryReq ? 35 : 15
  totalWeight += eligibilityWeight

  if (hasCountryReq) {
    const eligible = scholarship.eligible_countries!.toLowerCase()
    const userCountry = toSearchString(profile.country || profile.nationality)

    if (
      eligible.includes("all") ||
      eligible.includes("international") ||
      eligible.includes("developing") ||
      eligible.includes("worldwide") ||
      eligible.includes("open")
    ) {
      score += eligibilityWeight // Open to everyone
    } else if (userCountry) {
      // Direct country match
      const userCountries = userCountry.split(",").map(c => c.trim())
      let matched = false

      for (const uc of userCountries) {
        if (uc && eligible.includes(uc)) {
          matched = true
          break
        }
      }

      // Region-based match
      if (!matched) {
        if (
          (userCountry.includes("pakistan") && (eligible.includes("asia") || eligible.includes("south asia") || eligible.includes("muslim") || eligible.includes("commonwealth"))) ||
          (userCountry.includes("india") && (eligible.includes("asia") || eligible.includes("south asia") || eligible.includes("commonwealth"))) ||
          (userCountry.includes("bangladesh") && (eligible.includes("asia") || eligible.includes("south asia") || eligible.includes("commonwealth") || eligible.includes("muslim"))) ||
          (userCountry.includes("nigeria") && (eligible.includes("africa") || eligible.includes("sub-saharan") || eligible.includes("commonwealth"))) ||
          (userCountry.includes("kenya") && (eligible.includes("africa") || eligible.includes("commonwealth"))) ||
          (userCountry.includes("ghana") && (eligible.includes("africa") || eligible.includes("commonwealth")))
        ) {
          matched = true
        }
      }

      if (matched) {
        score += eligibilityWeight
      } else {
        score += 0 // Not eligible — big penalty
      }
    } else {
      score += eligibilityWeight * 0.3 // No country in profile, give partial
    }
  } else {
    // No eligibility restriction = open to all
    score += eligibilityWeight
  }

  // ============================================
  // 2. DEGREE LEVEL MATCH
  // ============================================
  const degreeWeight = hasDegreeReq ? 25 : 10
  totalWeight += degreeWeight

  if (hasDegreeReq && profile.degree_level) {
    const userDegree = profile.degree_level.toLowerCase()
    const schlDegree = scholarship.degree_level!.toLowerCase()

    if (
      schlDegree.includes(userDegree) ||
      userDegree.includes(schlDegree) ||
      schlDegree.includes("all") ||
      schlDegree.includes("any")
    ) {
      score += degreeWeight
    } else if (
      (userDegree.includes("master") && (schlDegree.includes("postgraduate") || schlDegree.includes("graduate"))) ||
      (userDegree.includes("phd") && (schlDegree.includes("doctoral") || schlDegree.includes("postgraduate") || schlDegree.includes("research"))) ||
      (userDegree.includes("bachelor") && (schlDegree.includes("undergraduate") || schlDegree.includes("bachelors"))) ||
      (schlDegree.includes("master") && userDegree.includes("postgraduate")) ||
      (schlDegree.includes("undergraduate") && userDegree.includes("bachelor"))
    ) {
      score += degreeWeight
    } else {
      score += 0 // Wrong degree level
    }
  } else if (!hasDegreeReq) {
    score += degreeWeight // No requirement = matches all
  } else {
    score += degreeWeight * 0.4 // User hasn't set degree
  }

  // ============================================
  // 3. IELTS/ENGLISH REQUIREMENT
  // Scholarship needs good English? Check if user meets it
  // ============================================
  const ieltsWeight = hasIeltsReq ? 20 : 5
  totalWeight += ieltsWeight

  if (hasIeltsReq) {
    const required = parseFloat(scholarship.ielts_score!)
    if (!isNaN(required) && profile.ielts_score) {
      if (profile.ielts_score >= required) {
        score += ieltsWeight // Meets requirement
      } else if (profile.ielts_score >= required - 0.5) {
        score += ieltsWeight * 0.6 // Close enough (some accept lower with condition)
      } else {
        score += ieltsWeight * 0.1 // Doesn't meet
      }
    } else if (!profile.ielts_score) {
      score += ieltsWeight * 0.3 // User hasn't added score
    }
  } else {
    // No IELTS requirement — great for user
    score += ieltsWeight
  }

  // ============================================
  // 4. GPA REQUIREMENT
  // ============================================
  const gpaWeight = hasGpaReq ? 15 : 5
  totalWeight += gpaWeight

  if (hasGpaReq) {
    const required = parseFloat(scholarship.gpa_required!)
    if (!isNaN(required) && profile.gpa) {
      if (profile.gpa >= required) {
        score += gpaWeight // Meets requirement
      } else if (profile.gpa >= required - 0.3) {
        score += gpaWeight * 0.5 // Close
      } else {
        score += gpaWeight * 0.1 // Doesn't meet
      }
    } else if (!profile.gpa) {
      score += gpaWeight * 0.3 // User hasn't added GPA
    }
  } else {
    // No GPA requirement — matches everyone
    score += gpaWeight
  }

  // ============================================
  // 5. PREFERRED COUNTRY (User wants to study here?)
  // ============================================
  const prefWeight = 10
  totalWeight += prefWeight

  const preferredStr = toSearchString(profile.preferred_countries)
  if (preferredStr && scholarship.country) {
    const schlCountry = scholarship.country.toLowerCase()
    const preferredList = preferredStr.split(",").map(c => c.trim())

    let matched = false
    for (const pc of preferredList) {
      if (pc && (schlCountry.includes(pc) || pc.includes(schlCountry))) {
        matched = true
        break
      }
    }

    if (matched) {
      score += prefWeight
    } else {
      score += prefWeight * 0.3 // Different country but still a scholarship
    }
  } else {
    score += prefWeight * 0.5 // No preference set
  }

  // ============================================
  // 6. FUNDING TYPE BONUS
  // ============================================
  const fundingWeight = 5
  totalWeight += fundingWeight

  if (hasFundingType) {
    const schlFunding = scholarship.funding_type!.toLowerCase()
    const userFunding = (profile.funding_preference || "").toLowerCase()

    if (schlFunding.includes("fully funded") || schlFunding.includes("full")) {
      score += fundingWeight // Fully funded is always best
    } else if (userFunding && (schlFunding.includes(userFunding) || userFunding.includes(schlFunding))) {
      score += fundingWeight
    } else if (schlFunding.includes("partial") && (!userFunding || userFunding.includes("any") || userFunding.includes("partial"))) {
      score += fundingWeight * 0.7
    } else {
      score += fundingWeight * 0.4
    }
  } else {
    score += fundingWeight * 0.5
  }

  // ============================================
  // BONUS: Deadline still open
  // ============================================
  if (scholarship.deadline) {
    const daysLeft = Math.ceil((new Date(scholarship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 0) {
      // Expired — reduce score heavily
      score = score * 0.3
    }
  }

  // Calculate final percentage
  const percentage = Math.min(Math.round((score / totalWeight) * 100), 99)
  return Math.max(percentage, 5) // Minimum 5%
}

export function rankScholarships(profile: UserProfile, scholarships: Scholarship[]): (Scholarship & { matchScore: number })[] {
  const scored = scholarships.map(s => ({
    ...s,
    matchScore: calculateMatchScore(profile, s)
  }))

  // Sort by match score (highest first), then by deadline (soonest first)
  scored.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
    const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Infinity
    const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Infinity
    return aDeadline - bDeadline
  })

  return scored
}