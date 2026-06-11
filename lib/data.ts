export type Funding = 'Fully Funded' | 'Partial'

export interface Scholarship {
  id: string
  name: string
  university: string
  country: string
  flag: string
  funding: Funding
  degree: string
  deadline: string
  deadlineDate: string
  match: number
  isNew?: boolean
  tags: string[]
  description: string
}

export const scholarships: Scholarship[] = [
  {
    id: 'chevening',
    name: 'Chevening Scholarship',
    university: 'Any UK University',
    country: 'United Kingdom',
    flag: '🇬🇧',
    funding: 'Fully Funded',
    degree: 'Masters',
    deadline: 'Nov 2026',
    deadlineDate: '2026-11-01',
    match: 92,
    isNew: true,
    tags: ['Fully Funded', 'Masters', 'UK', 'No IELTS'],
    description:
      'The UK government’s global scholarship programme, funded by the Foreign, Commonwealth & Development Office. Covers full tuition, monthly stipend, travel costs and more.',
  },
  {
    id: 'daad',
    name: 'DAAD Scholarship',
    university: 'German Universities',
    country: 'Germany',
    flag: '🇩🇪',
    funding: 'Fully Funded',
    degree: 'Masters/PhD',
    deadline: 'Oct 2026',
    deadlineDate: '2026-10-15',
    match: 88,
    isNew: true,
    tags: ['Fully Funded', 'Masters', 'PhD', 'Germany', 'Europe'],
    description:
      'The German Academic Exchange Service offers fully funded scholarships for international students pursuing Masters and PhD degrees in Germany.',
  },
  {
    id: 'turkiye-burslari',
    name: 'Türkiye Bursları',
    university: 'Turkish Universities',
    country: 'Turkey',
    flag: '🇹🇷',
    funding: 'Fully Funded',
    degree: 'Bachelor/Masters/PhD',
    deadline: 'Feb 2027',
    deadlineDate: '2027-02-20',
    match: 81,
    isNew: true,
    tags: ['Fully Funded', 'Bachelor', 'Masters', 'PhD', 'No IELTS'],
    description:
      'A government-funded scholarship awarded to outstanding international students for full degree programmes in Turkey, including tuition, accommodation and stipend.',
  },
  {
    id: 'csc-china',
    name: 'CSC China Scholarship',
    university: 'Chinese Universities',
    country: 'China',
    flag: '🇨🇳',
    funding: 'Fully Funded',
    degree: 'Masters/PhD',
    deadline: 'Mar 2027',
    deadlineDate: '2027-03-31',
    match: 76,
    tags: ['Fully Funded', 'Masters', 'PhD', 'No IELTS'],
    description:
      'The Chinese Government Scholarship managed by the China Scholarship Council supports international students for graduate study at top Chinese universities.',
  },
  {
    id: 'erasmus-mundus',
    name: 'Erasmus Mundus',
    university: 'Various European Universities',
    country: 'Europe',
    flag: '🇪🇺',
    funding: 'Fully Funded',
    degree: 'Masters',
    deadline: 'Jan 2027',
    deadlineDate: '2027-01-15',
    match: 84,
    tags: ['Fully Funded', 'Masters', 'Europe'],
    description:
      'Prestigious EU-funded joint Masters programmes delivered across multiple European universities, covering full tuition, travel and a generous monthly allowance.',
  },
  {
    id: 'commonwealth',
    name: 'Commonwealth Scholarship',
    university: 'UK Universities',
    country: 'United Kingdom',
    flag: '🇬🇧',
    funding: 'Fully Funded',
    degree: 'Masters/PhD',
    deadline: 'Dec 2026',
    deadlineDate: '2026-12-10',
    match: 79,
    tags: ['Fully Funded', 'Masters', 'PhD', 'UK'],
    description:
      'Funded by the UK Department for International Development for students from Commonwealth countries to pursue Masters and PhD study in the UK.',
  },
]

export const notifications = [
  { id: 1, color: 'red', text: 'Chevening deadline in 7 days' },
  { id: 2, color: 'green', text: 'New: 5 scholarships match your profile' },
  { id: 3, color: 'amber', text: 'DAAD reminder is tomorrow' },
]

export interface Application {
  id: string
  name: string
  university: string
  flag: string
  status: 'Planning' | 'Applying' | 'Submitted' | 'Accepted' | 'Rejected'
  deadline: string
  daysLeft: number
  notes: string
}

export const applications: Application[] = [
  {
    id: 'a1',
    name: 'Chevening Scholarship',
    university: 'University of Oxford',
    flag: '🇬🇧',
    status: 'Planning',
    deadline: 'Nov 2026',
    daysLeft: 142,
    notes: 'Drafting personal statement and gathering references.',
  },
  {
    id: 'a2',
    name: 'DAAD Scholarship',
    university: 'TU Munich',
    flag: '🇩🇪',
    status: 'Applying',
    deadline: 'Oct 2026',
    daysLeft: 95,
    notes: 'Completing online application form.',
  },
  {
    id: 'a3',
    name: 'Erasmus Mundus',
    university: 'Various Universities',
    flag: '🇪🇺',
    status: 'Submitted',
    deadline: 'Jan 2027',
    daysLeft: 5,
    notes: 'Submitted, awaiting confirmation email.',
  },
  {
    id: 'a4',
    name: 'CSC China Scholarship',
    university: 'Tsinghua University',
    flag: '🇨🇳',
    status: 'Accepted',
    deadline: 'Mar 2027',
    daysLeft: 0,
    notes: 'Accepted! Preparing visa documents.',
  },
]

export interface Reminder {
  id: string
  name: string
  university: string
  flag: string
  timing: string
  deadline: string
  status: 'Active' | 'Sent'
}

export const reminders: Reminder[] = [
  {
    id: 'r1',
    name: 'Chevening Scholarship',
    university: 'University of Oxford',
    flag: '🇬🇧',
    timing: '1 week before deadline',
    deadline: 'Nov 2026',
    status: 'Active',
  },
  {
    id: 'r2',
    name: 'DAAD Scholarship',
    university: 'TU Munich',
    flag: '🇩🇪',
    timing: '2 weeks before deadline',
    deadline: 'Oct 2026',
    status: 'Active',
  },
  {
    id: 'r3',
    name: 'Erasmus Mundus',
    university: 'Various Universities',
    flag: '🇪🇺',
    timing: '1 month before deadline',
    deadline: 'Jan 2026',
    status: 'Sent',
  },
  {
    id: 'r4',
    name: 'Commonwealth Scholarship',
    university: 'Various Universities',
    flag: '🇬🇧',
    timing: '1 week before deadline',
    deadline: 'Dec 2026',
    status: 'Active',
  },
]

export interface Testimonial {
  name: string
  role: string
  quote: string
}

export const testimonials: Testimonial[] = [
  {
    name: "Ayesha Khan",
    role: "Chevening Scholar, University of Edinburgh",
    quote:
      "AdmitGoal matched me with scholarships I never knew existed. The deadline reminders meant I submitted everything on time — and I got fully funded!",
  },
  {
    name: "David Mensah",
    role: "DAAD Scholar, TU Berlin",
    quote:
      "The match scores were spot on. I focused only on the scholarships I had a real shot at and saved weeks of research.",
  },
  {
    name: "Priya Sharma",
    role: "Erasmus Mundus Scholar",
    quote:
      "From building my profile to tracking applications, everything lives in one place. It made the whole process feel manageable.",
  },
]

export const countries = [
  { name: "Afghanistan", flag: "🇦🇫" },
  { name: "Albania", flag: "🇦🇱" },
  { name: "Algeria", flag: "🇩🇿" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Azerbaijan", flag: "🇦🇿" },
  { name: "Bahrain", flag: "🇧🇭" },
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Benin", flag: "🇧🇯" },
  { name: "Bolivia", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Brunei", flag: "🇧🇳" },
  { name: "Bulgaria", flag: "🇧🇬" },
  { name: "Burkina Faso", flag: "🇧🇫" },
  { name: "Cambodia", flag: "🇰🇭" },
  { name: "Cameroon", flag: "🇨🇲" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Chad", flag: "🇹🇩" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "China", flag: "🇨🇳" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Congo", flag: "🇨🇬" },
  { name: "Costa Rica", flag: "🇨🇷" },
  { name: "Croatia", flag: "🇭🇷" },
  { name: "Cuba", flag: "🇨🇺" },
  { name: "Cyprus", flag: "🇨🇾" },
  { name: "Czech Republic", flag: "🇨🇿" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Ecuador", flag: "🇪🇨" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "Ethiopia", flag: "🇪🇹" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "France", flag: "🇫🇷" },
  { name: "Gambia", flag: "🇬🇲" },
  { name: "Georgia", flag: "🇬🇪" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "Guatemala", flag: "🇬🇹" },
  { name: "Guinea", flag: "🇬🇳" },
  { name: "Hungary", flag: "🇭🇺" },
  { name: "India", flag: "🇮🇳" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Israel", flag: "🇮🇱" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Ivory Coast", flag: "🇨🇮" },
  { name: "Jamaica", flag: "🇯🇲" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "Kazakhstan", flag: "🇰🇿" },
  { name: "Kenya", flag: "🇰🇪" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Kyrgyzstan", flag: "🇰🇬" },
  { name: "Laos", flag: "🇱🇦" },
  { name: "Lebanon", flag: "🇱🇧" },
  { name: "Liberia", flag: "🇱🇷" },
  { name: "Libya", flag: "🇱🇾" },
  { name: "Madagascar", flag: "🇲🇬" },
  { name: "Malawi", flag: "🇲🇼" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Mali", flag: "🇲🇱" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Mongolia", flag: "🇲🇳" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Mozambique", flag: "🇲🇿" },
  { name: "Myanmar", flag: "🇲🇲" },
  { name: "Nepal", flag: "🇳🇵" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Niger", flag: "🇳🇪" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "North Macedonia", flag: "🇲🇰" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Palestine", flag: "🇵🇸" },
  { name: "Panama", flag: "🇵🇦" },
  { name: "Peru", flag: "🇵🇪" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Romania", flag: "🇷🇴" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "Rwanda", flag: "🇷🇼" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "Serbia", flag: "🇷🇸" },
  { name: "Sierra Leone", flag: "🇸🇱" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Slovakia", flag: "🇸🇰" },
  { name: "Slovenia", flag: "🇸🇮" },
  { name: "Somalia", flag: "🇸🇴" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Sri Lanka", flag: "🇱🇰" },
  { name: "Sudan", flag: "🇸🇩" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Syria", flag: "🇸🇾" },
  { name: "Taiwan", flag: "🇹🇼" },
  { name: "Tajikistan", flag: "🇹🇯" },
  { name: "Tanzania", flag: "🇹🇿" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Togo", flag: "🇹🇬" },
  { name: "Tunisia", flag: "🇹🇳" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Turkmenistan", flag: "🇹🇲" },
  { name: "Uganda", flag: "🇺🇬" },
  { name: "Ukraine", flag: "🇺🇦" },
  { name: "United Arab Emirates", flag: "🇦🇪" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Uzbekistan", flag: "🇺🇿" },
  { name: "Venezuela", flag: "🇻🇪" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Yemen", flag: "🇾🇪" },
  { name: "Zambia", flag: "🇿🇲" },
  { name: "Zimbabwe", flag: "🇿🇼" },
]

export function matchColor(match: number) {
  if (match >= 80) return 'text-success border-success/40 bg-success/10'
  if (match >= 65) return 'text-accent border-accent/40 bg-accent/10'
  return 'text-destructive border-destructive/40 bg-destructive/10'
}
