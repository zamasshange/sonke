export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type Guide = {
  title: string
  slug: string
  overview: string
  steps: string[]
  paymentMethods: string[]
  earnings: {
    min: number
    max: number
  }
  difficulty: Difficulty
  timeToFirstEarning: string
  mistakes: string[]
}

export type Job = {
  id: string
  title: string
  company: string
  location: string
  isRemote: boolean
  salary?: string
  tags: string[]
  requirements?: string[]
  description?: string
  applyUrl?: string
}

export type Path = {
  title: string
  description: string
  steps: {
    title: string
    description: string
    link?: string
  }[]
}

export interface EarningMethod {
  id: string
  name: string
  description: string
  icon: string
  difficulty: Difficulty
  potentialEarning: string
}

export const guides: Guide[] = [
  {
    title: 'Fiverr in South Africa',
    slug: 'fiverr-south-africa',
    overview:
      'Fiverr works well for South Africans who can package a small service into a clear offer. The fastest beginner categories are Canva design, CV writing, transcription cleanup, product descriptions, short-form video edits, and simple admin tasks. Your first goal is not a perfect business, it is one focused gig with proof that you can deliver.',
    steps: [
      'Choose one narrow service you can deliver in 24 to 72 hours, such as CV revamps, Canva social posts, or podcast show notes.',
      'Create a Fiverr profile with a clear photo, South Africa time zone, and a short bio focused on the buyer outcome.',
      'Build one starter gig with three packages: basic, standard, and premium. Keep the first package simple and affordable.',
      'Create 3 portfolio samples before you get clients. Use mock brands or your own documents, but make them look like real deliverables.',
      'Set realistic delivery time and add buyer requirements so clients give you the information you need upfront.',
      'Apply buyer-request style thinking in your gig title and description: mention the exact problem, not just your skill.',
      'After each order, ask for specific feedback and use it to improve the gig images, FAQs, and package wording.',
    ],
    paymentMethods: ['PayPal via FNB withdrawal', 'Payoneer', 'Fiverr Revenue Card'],
    earnings: {
      min: 1500,
      max: 18000,
    },
    difficulty: 'Easy',
    timeToFirstEarning: '2 to 6 weeks',
    mistakes: [
      'Offering too many unrelated services on one profile.',
      'Pricing so low that revisions take more time than the job is worth.',
      'Using copied gig descriptions or stock portfolio images.',
      'Ignoring buyer requirements and then needing long back-and-forth messages.',
      'Withdrawing money before checking fees, exchange rate, and tax records.',
    ],
  },
  {
    title: 'Upwork for beginners SA',
    slug: 'upwork-beginners-sa',
    overview:
      'Upwork is harder than Fiverr at the start, but it can lead to better long-term clients. Beginners in South Africa should avoid broad job titles like “virtual assistant” and instead target a specific problem: inbox cleanup, spreadsheet formatting, Shopify product uploads, customer support replies, or blog editing.',
    steps: [
      'Pick one service lane and write your profile around that lane only.',
      'Create two short portfolio samples that show before-and-after results, even if they are self-made examples.',
      'Set your first hourly rate in a realistic beginner range, then raise it after 2 to 3 successful contracts.',
      'Search for jobs with clear scope, verified payment, and low-to-medium proposal counts.',
      'Write proposals that mention the client problem in the first sentence and explain the first step you would take.',
      'Avoid unpaid test work. Offer a small paid trial instead if the client is unsure.',
      'Track hours, messages, files, and payment records for tax and client-management purposes.',
    ],
    paymentMethods: ['Direct to local bank', 'PayPal', 'Payoneer', 'Wise where available'],
    earnings: {
      min: 2500,
      max: 35000,
    },
    difficulty: 'Medium',
    timeToFirstEarning: '3 to 8 weeks',
    mistakes: [
      'Sending the same proposal to every job.',
      'Competing only on the lowest price.',
      'Applying to vague jobs with no budget, no history, and no verified payment.',
      'Listing every skill instead of positioning around one outcome.',
      'Accepting work outside the platform payment flow.',
    ],
  },
  {
    title: 'Affiliate marketing SA',
    slug: 'affiliate-marketing-sa',
    overview:
      'Affiliate marketing is best for people who can create useful content consistently. In South Africa, strong niches include budgeting, telecom deals, education tools, beauty, tech accessories, online learning, and small-business software. It usually starts slowly, so treat it as a content asset rather than quick cash.',
    steps: [
      'Choose one niche where people already compare products or ask buying questions.',
      'Pick 2 to 3 affiliate programs that accept South African creators and pay through PayPal, bank transfer, or international payout partners.',
      'Create a simple content plan with comparison posts, tutorials, reviews, and problem-solving guides.',
      'Publish on one main channel first: TikTok, YouTube Shorts, blog, newsletter, or Instagram.',
      'Disclose affiliate links clearly and recommend products only when they match the audience problem.',
      'Track clicks, conversion rates, and payouts monthly so you know which content is working.',
      'Reinvest early earnings into better content assets, such as a domain, email tool, or product testing.',
    ],
    paymentMethods: ['PayPal', 'Bank transfer', 'Payoneer', 'Partner-specific payout platforms'],
    earnings: {
      min: 500,
      max: 25000,
    },
    difficulty: 'Medium',
    timeToFirstEarning: '6 to 16 weeks',
    mistakes: [
      'Promoting random products without a clear audience.',
      'Expecting income before creating enough helpful content.',
      'Hiding affiliate relationships from readers or viewers.',
      'Joining programs without checking payout minimums and South African availability.',
      'Relying on one social platform without collecting email or repeat visitors.',
    ],
  },
  {
    title: 'Content services in South Africa',
    slug: 'content-services-sa',
    overview:
      'Content services are a practical starting point if you can help small businesses, creators, or online shops publish clearer posts, captions, scripts, articles, or short-form videos. The fastest route is to offer one simple outcome, create proof samples, and pitch clients who already need consistent content.',
    steps: [
      'Choose one service lane such as blog writing, social captions, short-form video scripts, Canva posts, or content cleanup.',
      'Create three sample deliverables that show your style, turnaround time, and the type of business you can help.',
      'Package the service into a clear starter offer with scope, delivery time, revision limits, and price.',
      'Build a simple portfolio using a PDF, Notion page, Google Drive folder, or personal website.',
      'Pitch small businesses, creators, and agencies with a specific idea instead of a vague “I can help with content” message.',
      'Use feedback from each pitch to tighten your offer, examples, and pricing.',
      'Track time spent per deliverable so you can raise prices without guessing.',
    ],
    paymentMethods: ['Bank transfer', 'PayPal', 'Payoneer', 'Wise where available'],
    earnings: {
      min: 3000,
      max: 20000,
    },
    difficulty: 'Easy',
    timeToFirstEarning: '1 to 4 weeks',
    mistakes: [
      'Offering every type of content instead of one clear service.',
      'Pitching without examples that prove what the client will receive.',
      'Accepting unlimited revisions on small starter jobs.',
      'Pricing per hour before you understand how long each deliverable takes.',
      'Writing generic outreach messages that do not mention the client’s actual content.',
    ],
  },
]

export const jobs: Job[] = [
  {
    id: 'job-virtual-assistant-001',
    title: 'Entry-Level Virtual Assistant',
    company: 'Remote Admin Studio',
    location: 'South Africa',
    isRemote: true,
    salary: 'R6,000 - R12,000/month',
    tags: ['Beginner Friendly', 'No Experience', 'Remote', 'Admin'],
  },
  {
    id: 'job-customer-support-002',
    title: 'Remote Customer Support Agent',
    company: 'Support Desk Africa',
    location: 'Cape Town or Remote',
    isRemote: true,
    salary: 'R8,000 - R16,000/month',
    tags: ['Beginner Friendly', 'Remote', 'Training Provided'],
  },
  {
    id: 'job-content-writer-003',
    title: 'Junior Blog Content Writer',
    company: 'Content Crew',
    location: 'Remote',
    isRemote: true,
    salary: 'R250 - R600/article',
    tags: ['Beginner Friendly', 'Remote', 'Writing'],
  },
  {
    id: 'job-data-entry-004',
    title: 'Data Entry Assistant',
    company: 'OpsFlow',
    location: 'Johannesburg Hybrid',
    isRemote: false,
    salary: 'R5,500 - R9,500/month',
    tags: ['No Experience', 'Beginner Friendly', 'Spreadsheets'],
  },
  {
    id: 'job-social-media-005',
    title: 'Social Media Scheduling Assistant',
    company: 'Creator Desk',
    location: 'Remote',
    isRemote: true,
    salary: 'R4,000 - R10,000/month',
    tags: ['Remote', 'Beginner Friendly', 'Canva'],
  },
  {
    id: 'job-transcription-006',
    title: 'Freelance Transcriptionist',
    company: 'AudioText Hub',
    location: 'Remote',
    isRemote: true,
    salary: 'R80 - R180/audio hour',
    tags: ['No Experience', 'Remote', 'Flexible'],
  },
]

export const paths: Path[] = [
  {
    title: 'Earn your first R1000 online',
    description:
      'A beginner path for getting from idea overload to one small, realistic online earning target.',
    steps: [
      {
        title: 'Pick one simple service',
        description: 'Start with a service you can deliver quickly, such as CV editing, Canva posts, data cleanup, or transcription.',
        link: '/guides/fiverr-south-africa',
      },
      {
        title: 'Check the numbers',
        description: 'Use the calculator to estimate how many small jobs you need to reach R1000 after fees.',
        link: '/calculator',
      },
      {
        title: 'Apply to beginner-friendly work',
        description: 'Look for remote, no-experience, or training-provided listings while your first gig is being built.',
        link: '/jobs?beginner=true',
      },
      {
        title: 'Ask for a 7-day plan',
        description: 'Use the AI Money Coach with your skills, available time, and R1000 goal to choose the next action.',
        link: '/guides',
      },
    ],
  },
  {
    title: 'Start freelancing with no experience',
    description:
      'A practical path for building proof, choosing a platform, and landing a first small client without pretending to be advanced.',
    steps: [
      {
        title: 'Choose a beginner service lane',
        description: 'Pick one outcome: admin support, writing, Canva design, customer support, or product uploads.',
        link: '/guides/upwork-beginners-sa',
      },
      {
        title: 'Create two proof samples',
        description: 'Make before-and-after examples so clients can see what they will get even before you have paid work.',
      },
      {
        title: 'Publish your first profile',
        description: 'Use Fiverr for packaged services or Upwork for proposal-based work, but keep the profile focused.',
        link: '/guides/fiverr-south-africa',
      },
      {
        title: 'Find beginner opportunities',
        description: 'Use remote and beginner filters to find roles that match your current proof level.',
        link: '/jobs?remote=true&beginner=true',
      },
    ],
  },
]

export const earningMethods: EarningMethod[] = [
  {
    id: 'fiverr',
    name: 'Fiverr',
    description: 'Package a small service like writing, Canva design, transcription, or video editing.',
    icon: 'Palette',
    difficulty: 'Easy',
    potentialEarning: 'R1,500 - R18,000/month',
  },
  {
    id: 'upwork',
    name: 'Upwork',
    description: 'Win client projects through focused proposals and a specific service profile.',
    icon: 'Briefcase',
    difficulty: 'Medium',
    potentialEarning: 'R2,500 - R35,000/month',
  },
  {
    id: 'affiliate-marketing',
    name: 'Affiliate Marketing',
    description: 'Create helpful content that earns commission when people buy through your links.',
    icon: 'ShoppingCart',
    difficulty: 'Medium',
    potentialEarning: 'R500 - R25,000/month',
  },
  {
    id: 'content-services',
    name: 'Content Services',
    description: 'Help businesses with writing, short-form video, social scheduling, and content cleanup.',
    icon: 'Video',
    difficulty: 'Easy',
    potentialEarning: 'R3,000 - R20,000/month',
  },
]

export const platforms = [
  {
    name: 'Fiverr',
    baseRate: 150,
    multipliers: { Beginner: 1, Intermediate: 2.5, Advanced: 5 },
    feeRate: 0.2,
    payoutMethods: ['PayPal', 'Payoneer', 'Bank card'],
    notes: 'Fiverr takes a meaningful platform fee, so gross earnings can feel higher than what lands in your account.',
  },
  {
    name: 'Upwork',
    baseRate: 200,
    multipliers: { Beginner: 1, Intermediate: 3, Advanced: 6 },
    feeRate: 0.1,
    payoutMethods: ['PayPal', 'Payoneer', 'Bank Transfer'],
    notes: 'Upwork rewards strong profiles and niche positioning, but competition is high when you are new.',
  },
  {
    name: 'Affiliate Marketing',
    baseRate: 80,
    multipliers: { Beginner: 0.5, Intermediate: 2, Advanced: 6 },
    feeRate: 0,
    payoutMethods: ['PayPal', 'Bank Transfer', 'Payoneer'],
    notes: 'Affiliate income usually starts slowly and depends on trust, traffic, and consistent content.',
  },
  {
    name: 'Remote Jobs',
    baseRate: 220,
    multipliers: { Beginner: 1, Intermediate: 2.5, Advanced: 5 },
    feeRate: 0,
    payoutMethods: ['Direct employer payroll', 'Bank Transfer'],
    notes: 'Remote job boards can lead to stronger long-term roles, but hiring cycles are slower than gig platforms.',
  },
]

export const saAvailability: Record<string, { available: boolean; paymentMethods: string[]; requirements: string[] }> = {
  Fiverr: {
    available: true,
    paymentMethods: ['PayPal via FNB', 'Payoneer', 'Fiverr Revenue Card'],
    requirements: ['Marketable service', 'Portfolio samples', 'Verified payout method'],
  },
  Upwork: {
    available: true,
    paymentMethods: ['Local bank transfer', 'PayPal', 'Payoneer'],
    requirements: ['Focused profile', 'Proposal credits', 'Client-ready samples'],
  },
  'Affiliate Marketing': {
    available: true,
    paymentMethods: ['PayPal', 'Bank Transfer', 'Payoneer'],
    requirements: ['Audience or content channel', 'Affiliate approval', 'Tracking links'],
  },
  'Remote Jobs': {
    available: true,
    paymentMethods: ['Bank Transfer', 'Employer payroll', 'Wise where supported'],
    requirements: ['CV', 'Reliable internet', 'Interview availability'],
  },
}

export function formatZar(amount: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug)
}

export function getRelatedJobsForGuide(guide: Guide) {
  const guideText = `${guide.title} ${guide.overview}`.toLowerCase()

  return jobs.filter((job) => {
    const jobText = `${job.title} ${job.company} ${job.tags.join(' ')}`.toLowerCase()
    return (
      job.tags.some((tag) => guideText.includes(tag.toLowerCase())) ||
      guideText.includes('fiverr') && jobText.includes('freelance') ||
      guideText.includes('upwork') && (jobText.includes('remote') || jobText.includes('assistant')) ||
      guideText.includes('affiliate') && (jobText.includes('content') || jobText.includes('social'))
    )
  }).slice(0, 3)
}
