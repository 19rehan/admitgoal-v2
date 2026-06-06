export type Scholarship = {
  id: string
  title: string
  university_name: string
  country: string
  flag: string
  degree_level: string
  funding_type: "Fully Funded" | "Partial"
  deadline: string
  benefits: string
  match_percentage: number
  is_new?: boolean
}

export const scholarships: Scholarship[] = [
  {
    id: "chevening",
    title: "Chevening Scholarship",
    university_name: "UK Government — Any UK University",
    country: "United Kingdom",
    flag: "🇬🇧",
    degree_level: "Masters",
    funding_type: "Fully Funded",
    deadline: "Nov 2025",
    benefits: "Full tuition, living stipend, flights",
    match_percentage: 94,
    is_new: true,
  },
  {
    id: "daad",
    title: "DAAD Scholarship",
    university_name: "German Universities",
    country: "Germany",
    flag: "🇩🇪",
    degree_level: "Masters / PhD",
    funding_type: "Fully Funded",
    deadline: "Oct 2025",
    benefits: "Monthly stipend, tuition, insurance",
    match_percentage: 88,
    is_new: true,
  },
  {
    id: "turkiye",
    title: "Türkiye Bursları",
    university_name: "Turkish Universities",
    country: "Turkey",
    flag: "🇹🇷",
    degree_level: "Bachelor / Masters / PhD",
    funding_type: "Fully Funded",
    deadline: "Feb 2026",
    benefits: "Tuition, stipend, accommodation, flights",
    match_percentage: 81,
  },
  {
    id: "csc",
    title: "CSC China Scholarship",
    university_name: "Chinese Universities",
    country: "China",
    flag: "🇨🇳",
    degree_level: "Masters / PhD",
    funding_type: "Fully Funded",
    deadline: "Mar 2026",
    benefits: "Tuition waiver, monthly stipend, housing",
    match_percentage: 76,
  },
  {
    id: "erasmus",
    title: "Erasmus Mundus",
    university_name: "Multiple European Universities",
    country: "Europe",
    flag: "🇪🇺",
    degree_level: "Masters",
    funding_type: "Fully Funded",
    deadline: "Jan 2026",
    benefits: "Tuition, travel, monthly allowance",
    match_percentage: 90,
    is_new: true,
  },
  {
    id: "commonwealth",
    title: "Commonwealth Scholarship",
    university_name: "UK Universities",
    country: "United Kingdom",
    flag: "🇬🇧",
    degree_level: "Masters / PhD",
    funding_type: "Fully Funded",
    deadline: "Dec 2025",
    benefits: "Full tuition, airfare, living expenses",
    match_percentage: 85,
  },
]

export const filterChips = [
  "All",
  "Fully Funded",
  "Masters",
  "PhD",
  "Bachelor",
  "No IELTS",
  "Pakistan",
  "India",
  "Africa",
  "Europe",
  "USA",
  "UK",
  "Germany",
  "Australia",
]
