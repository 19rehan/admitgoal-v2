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

export function getScholarship(id: string) {
  return scholarships.find((s) => s.id === id)
}

export const currentUser = {
  name: "Ahmed Khan",
  firstName: "Ahmed",
  initials: "AK",
  email: "ahmed.khan@email.com",
  memberSince: "March 2025",
  country: "Pakistan",
  nationality: "Pakistani",
  degreeLevel: "Masters",
  field: "Computer Science",
  university: "NUST Islamabad",
  gpa: "3.4",
  ielts: "7.0",
  toefl: "—",
  gre: "—",
  preferredCountries: [
    { country: "United Kingdom", flag: "🇬🇧" },
    { country: "Germany", flag: "🇩🇪" },
    { country: "Canada", flag: "🇨🇦" },
  ],
  funding: "Fully Funded",
  completion: 72,
}

export type AppStatus = "Planning" | "Applying" | "Submitted" | "Accepted" | "Rejected"

export type Application = {
  id: string
  scholarshipId: string
  title: string
  university: string
  flag: string
  status: AppStatus
  deadline: string
  daysLeft: number
  notes?: string
}

export const applications: Application[] = [
  {
    id: "a1",
    scholarshipId: "chevening",
    title: "Chevening Scholarship",
    university: "UK Government",
    flag: "🇬🇧",
    status: "Applying",
    deadline: "Nov 5, 2025",
    daysLeft: 6,
    notes: "Drafting leadership essay, need 2 referees.",
  },
  {
    id: "a2",
    scholarshipId: "daad",
    title: "DAAD Scholarship",
    university: "German Universities",
    flag: "🇩🇪",
    status: "Submitted",
    deadline: "Oct 20, 2025",
    daysLeft: 21,
    notes: "Submitted via portal, awaiting confirmation.",
  },
  {
    id: "a3",
    scholarshipId: "erasmus",
    title: "Erasmus Mundus",
    university: "EU Universities",
    flag: "🇪🇺",
    status: "Planning",
    deadline: "Jan 15, 2026",
    daysLeft: 78,
    notes: "Shortlisting 3 joint programmes.",
  },
  {
    id: "a4",
    scholarshipId: "commonwealth",
    title: "Commonwealth Scholarship",
    university: "UK Universities",
    flag: "🇬🇧",
    status: "Accepted",
    deadline: "Dec 1, 2025",
    daysLeft: 33,
    notes: "Conditional offer received.",
  },
]

export type Reminder = {
  id: string
  scholarshipId: string
  title: string
  university: string
  flag: string
  rule: string
  deadline: string
  status: "Active" | "Sent"
}

export const reminders: Reminder[] = [
  {
    id: "r1",
    scholarshipId: "chevening",
    title: "Chevening Scholarship",
    university: "UK Government",
    flag: "🇬🇧",
    rule: "1 week before deadline",
    deadline: "Nov 5, 2025",
    status: "Active",
  },
  {
    id: "r2",
    scholarshipId: "daad",
    title: "DAAD Scholarship",
    university: "German Universities",
    flag: "🇩🇪",
    rule: "2 weeks before deadline",
    deadline: "Oct 20, 2025",
    status: "Active",
  },
  {
    id: "r3",
    scholarshipId: "erasmus",
    title: "Erasmus Mundus",
    university: "EU Universities",
    flag: "🇪🇺",
    rule: "1 month before deadline",
    deadline: "Jan 15, 2026",
    status: "Sent",
  },
]

export type Notification = {
  id: string
  icon: "deadline" | "match" | "reminder"
  text: string
  time: string
  unread: boolean
}

export const notifications: Notification[] = [
  { id: "n1", icon: "deadline", text: "Chevening deadline in 7 days", time: "2h ago", unread: true },
  { id: "n2", icon: "match", text: "New: 5 scholarships match your profile", time: "5h ago", unread: true },
  { id: "n3", icon: "reminder", text: "DAAD reminder is tomorrow", time: "1d ago", unread: true },
]

export const detailContent: Record<string, { eligible: string; ielts: string; gpa: string; timeLeft: number; body: { heading: string; text: string }[]; faqs: { q: string; a: string }[] }> = {
  default: {
    eligible: "Pakistan, India, Bangladesh + more",
    ielts: "6.5 minimum",
    gpa: "3.0 minimum",
    timeLeft: 142,
    body: [
      {
        heading: "About the Scholarship",
        text: "This prestigious award is one of the most sought-after fully funded opportunities for international students from developing countries. It covers complete tuition, a generous monthly living stipend, return airfare, and comprehensive health insurance — removing every financial barrier so you can focus entirely on your studies.",
      },
      {
        heading: "Who Can Apply",
        text: "Applicants must hold a strong undergraduate degree, demonstrate leadership potential, and show a clear commitment to returning home to drive positive change. Candidates from Pakistan, India, Bangladesh, Nigeria, Kenya, and dozens of other eligible nations are strongly encouraged to apply.",
      },
      {
        heading: "What It Covers",
        text: "Full tuition fees, a monthly living allowance, one-time settling-in payment, economy class return flights, and an arrival allowance. Many recipients also gain access to an exclusive global alumni network spanning more than 150 countries.",
      },
      {
        heading: "How to Apply",
        text: "Create an account on the official portal, complete the online application, upload your academic transcripts and references, and submit your personal statement before the deadline. Shortlisted candidates are invited to interview.",
      },
    ],
    faqs: [
      { q: "Is IELTS mandatory to apply?", a: "Most programmes require proof of English proficiency. A minimum IELTS of 6.5 is typically expected, though some universities accept TOEFL or a medium-of-instruction letter." },
      { q: "Can I apply for more than one course?", a: "Yes — you may usually list up to three eligible courses in your application to maximise your chances of selection." },
      { q: "Does it cover my family?", a: "The core award covers the recipient only. Some schemes offer limited family or dependent allowances, which vary by host country." },
      { q: "When will I hear back?", a: "Outcomes are typically communicated 2–4 months after the deadline, followed by an interview stage for shortlisted candidates." },
    ],
  },
}
