import https from 'node:https'
import { NextRequest, NextResponse } from 'next/server'
import { jobs } from '@/lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs/za/search'
const DEFAULT_PAGE_SIZE = 6

type AdzunaJob = {
  id?: string
  title?: string
  company?: {
    display_name?: string
  }
  location?: {
    display_name?: string
    area?: string[]
  }
  salary_min?: number
  salary_max?: number
  description?: string
  redirect_url?: string
  category?: {
    label?: string
  }
  contract_time?: string
  contract_type?: string
}

type AdzunaResponse = {
  count?: number
  results?: AdzunaJob[]
}

function requestJson(url: string) {
  return new Promise<AdzunaResponse>((resolve, reject) => {
    const req = https.get(
      url,
      {
        family: 4,
        headers: {
          Accept: 'application/json',
        },
      },
      (response) => {
        let body = ''

        response.on('data', (chunk) => {
          body += chunk
        })

        response.on('end', () => {
          if (!response.statusCode || response.statusCode >= 400) {
            reject(new Error(body || `Adzuna returned status ${response.statusCode ?? 'unknown'}`))
            return
          }

          try {
            resolve(JSON.parse(body) as AdzunaResponse)
          } catch (error) {
            reject(error)
          }
        })
      },
    )

    req.on('error', reject)
  })
}

function formatSalary(min?: number, max?: number) {
  if (!min && !max) return undefined

  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  })

  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`
  return formatter.format(min ?? max ?? 0)
}

function inferTags(job: AdzunaJob, beginner: boolean) {
  const description = job.description?.toLowerCase() ?? ''
  const title = job.title?.toLowerCase() ?? ''
  const tags = new Set<string>()

  if (description.includes('remote') || title.includes('remote')) {
    tags.add('Remote')
  }

  if (job.category?.label) {
    tags.add(job.category.label)
  }

  if (job.contract_time === 'full_time') {
    tags.add('Full-time')
  } else if (job.contract_time === 'part_time') {
    tags.add('Part-time')
  }

  if (job.contract_type === 'permanent') {
    tags.add('Permanent')
  } else if (job.contract_type === 'contract') {
    tags.add('Contract')
  }

  const beginnerSignals = ['entry level', 'junior', 'graduate', 'intern', 'trainee', 'assistant', 'no experience']
  if (beginner || beginnerSignals.some((signal) => description.includes(signal) || title.includes(signal))) {
    tags.add('Beginner Friendly')
  }

  return Array.from(tags)
}

function extractRequirements(description?: string) {
  if (!description) return undefined

  const bullets = description
    .split(/\r?\n|[.;]\s+/)
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter((line) => line.length > 30)

  return bullets.slice(0, 4)
}

function mapAdzunaJob(job: AdzunaJob, beginner: boolean) {
  const tags = inferTags(job, beginner)

  return {
    id: job.id ?? `${job.title ?? 'job'}-${job.redirect_url ?? Math.random().toString(36).slice(2)}`,
    title: job.title ?? 'Untitled role',
    company: job.company?.display_name ?? 'Unknown company',
    location: job.location?.display_name ?? job.location?.area?.join(', ') ?? 'Location not listed',
    isRemote: tags.includes('Remote'),
    salary: formatSalary(job.salary_min, job.salary_max),
    tags,
    description: job.description,
    requirements: extractRequirements(job.description),
    applyUrl: job.redirect_url,
  }
}

function getMockJobs(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')?.trim().toLowerCase() || ''
  const remote = searchParams.get('remote') === 'true'
  const beginner = searchParams.get('beginner') === 'true'

  const filteredJobs = jobs.filter((job) => {
    const matchesQuery = query
      ? [job.title, job.company, job.location, job.salary || '', ...job.tags]
          .join(' ')
          .toLowerCase()
          .includes(query)
      : true
    const matchesRemote = remote ? job.isRemote : true
    const matchesBeginner = beginner
      ? job.tags.some((tag) => ['beginner friendly', 'no experience'].includes(tag.toLowerCase()))
      : true

    return matchesQuery && matchesRemote && matchesBeginner
  })

  return NextResponse.json({
    jobs: filteredJobs,
    count: filteredJobs.length,
    page: 1,
    pageSize: filteredJobs.length,
    totalPages: 1,
    source: 'mock',
    notice: 'Showing fallback curated jobs because Adzuna is not configured.',
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')?.trim() || ''
  const remote = searchParams.get('remote') === 'true'
  const beginner = searchParams.get('beginner') === 'true'
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const pageSize = Math.min(
    50,
    Math.max(1, Number.parseInt(searchParams.get('pageSize') ?? `${DEFAULT_PAGE_SIZE}`, 10) || DEFAULT_PAGE_SIZE),
  )

  const appId = process.env.ADZUNA_APP_ID
  const apiKey = process.env.ADZUNA_API_KEY

  if (!appId || !apiKey) {
    return getMockJobs(request)
  }

  const adzunaParams = new URLSearchParams({
    app_id: appId,
    app_key: apiKey,
    'content-type': 'application/json',
    results_per_page: String(pageSize),
    what: query || (beginner ? 'entry level OR junior OR trainee OR assistant' : ''),
  })

  if (remote) {
    adzunaParams.set('what', [adzunaParams.get('what'), 'remote'].filter(Boolean).join(' '))
  }

  const where = searchParams.get('location')?.trim()
  if (where) {
    adzunaParams.set('where', where)
  } else {
    adzunaParams.set('where', 'South Africa')
  }

  try {
    const data = await requestJson(`${ADZUNA_BASE_URL}/${page}?${adzunaParams.toString()}`)
    const mappedJobs = (data.results ?? []).map((job) => mapAdzunaJob(job, beginner))
    const filteredJobs = mappedJobs.filter((job) => {
      const matchesRemote = remote ? job.isRemote : true
      const matchesBeginner = beginner
        ? job.tags.some((tag) => tag.toLowerCase() === 'beginner friendly')
        : true

      return matchesRemote && matchesBeginner
    })

    return NextResponse.json({
      jobs: filteredJobs,
      count: data.count ?? filteredJobs.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((data.count ?? filteredJobs.length) / pageSize)),
      source: 'adzuna',
      notice: `Showing live Adzuna results for South Africa on page ${page}.`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        jobs: [],
        count: 0,
        page,
        pageSize,
        totalPages: 0,
        source: 'error',
        notice: 'Adzuna fetch failed, so no live jobs could be loaded.',
        error: message,
      },
      { status: 502 },
    )
  }
}
