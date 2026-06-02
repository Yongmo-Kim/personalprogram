import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const JOB_CACHE_TTL_MS = 10 * 60 * 1000
const jobCache = new Map()

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
  })

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

const extractPrompt = (body) => body.prompt || body.question || ''

const callOpenAi = async (env, prompt) => {
  const apiKey = env.OPENAI_API_KEY
  if (!apiKey) return null

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You summarize and analyze news in Korean. Do not invent facts outside the provided article data.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`OpenAI API failed: ${response.status} ${detail}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

const callGemini = async (env, prompt) => {
  const apiKey = env.GEMINI_API_KEY
  if (!apiKey) return null

  const model = env.GEMINI_MODEL || 'gemini-1.5-flash'
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 },
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Gemini API failed: ${response.status} ${detail}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || ''
}

const newsAiSummaryPlugin = (env) => ({
  name: 'news-ai-summary-api',
  configureServer(server) {
    server.middlewares.use('/api/news-ai-summary', async (req, res) => {
      if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' })
        return
      }

      try {
        const body = await readJsonBody(req)
        const prompt = extractPrompt(body)
        if (!prompt) {
          sendJson(res, 400, { error: 'Prompt is required' })
          return
        }

        const answer = await callOpenAi(env, prompt) || await callGemini(env, prompt)
        if (!answer) {
          sendJson(res, 503, { error: 'AI API key is not configured. Set OPENAI_API_KEY or GEMINI_API_KEY in .env.' })
          return
        }

        sendJson(res, 200, { answer })
      } catch (error) {
        sendJson(res, 500, { error: error.message || 'AI summary failed' })
      }
    })
  },
})

const jobIndustryQueries = {
  all: '',
  semiconductor: '반도체 공정 설계 장비 HBM DRAM NAND 파운드리 OSAT 테스트 패키징',
  defense: '방산 항공우주 레이더 유도무기 항공전자 위성 국방 임베디드',
  electronics: '전자회로 회로설계 PCB 하드웨어 전장 펌웨어 전력전자',
  mobility: '자동차 전장 BMS 자율주행 전력변환 인버터 모터 제어',
  battery: '배터리 이차전지 BMS 전력전자 ESS 충전기 에너지',
  communications: '통신 RF 안테나 5G 6G 무선통신 신호처리',
  robotics: '로봇 자동화 제어 PLC 센서 모션 제어 스마트팩토리',
  embedded: '임베디드 펌웨어 C C++ RTOS MCU Linux 제어 소프트웨어',
  rnd: '연구개발 R&D 전자공학 회로 알고리즘 신호처리 시스템',
}

const jobIndustryLabels = {
  all: '전체',
  semiconductor: '반도체',
  defense: '방위산업 / 항공우주',
  electronics: '전자 / 하드웨어',
  mobility: '자동차 / 모빌리티',
  battery: '배터리 / 에너지',
  communications: '통신 / RF',
  robotics: '로봇 / 자동화',
  embedded: '임베디드 / SW',
  rnd: '연구개발 / R&D',
}

const jobTypeQueries = {
  all: '',
  intern: '인턴 채용연계형 인턴십',
  newgrad: '신입 대졸신입 junior',
  entry: '신입 인턴 채용연계형',
  experienced: '경력',
}

const jobTypeLabels = {
  all: '전체',
  intern: '인턴',
  newgrad: '신입',
  entry: '신입/인턴',
  experienced: '경력',
}

const compactText = (value = '') => String(value).replace(/\s+/g, ' ').trim()
const joinKeywords = (...values) => values.map(compactText).filter(Boolean).join(' ')

const firstValue = (object, keys) => {
  for (const key of keys) {
    const value = object?.[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return ''
}

const normalizeList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.response?.body?.items)) return data.response.body.items
  if (Array.isArray(data?.response?.body?.items?.item)) return data.response.body.items.item
  if (data?.response?.body?.items?.item) return [data.response.body.items.item]
  if (Array.isArray(data?.result)) return data.result
  return []
}

const formatUnixDate = (timestamp) => {
  const value = Number(timestamp)
  if (!value) return ''
  return new Date(value * 1000).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const normalizeDateText = (value) => {
  const text = compactText(value)
  if (!text) return ''
  if (/^\d{8}$/.test(text)) return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`
  return text
}

const inferIndustryId = (text, fallback) => {
  const value = text.toLowerCase()
  if (value.includes('반도체') || value.includes('hbm') || value.includes('foundry') || value.includes('메모리')) return 'semiconductor'
  if (value.includes('방산') || value.includes('국방') || value.includes('항공') || value.includes('우주') || value.includes('레이더')) return 'defense'
  if (value.includes('자동차') || value.includes('전장') || value.includes('모빌리티') || value.includes('bms')) return 'mobility'
  if (value.includes('배터리') || value.includes('이차전지') || value.includes('에너지')) return 'battery'
  if (value.includes('통신') || value.includes('rf') || value.includes('안테나')) return 'communications'
  if (value.includes('로봇') || value.includes('자동화') || value.includes('plc')) return 'robotics'
  if (value.includes('임베디드') || value.includes('펌웨어') || value.includes('mcu')) return 'embedded'
  if (value.includes('연구') || value.includes('r&d')) return 'rnd'
  if (value.includes('전자') || value.includes('회로') || value.includes('하드웨어')) return 'electronics'
  return fallback === 'all' ? 'electronics' : fallback
}

const inferTypeId = (text, fallback) => {
  const value = text.toLowerCase()
  if (value.includes('인턴') || value.includes('intern')) return 'intern'
  if (value.includes('신입') || value.includes('junior')) return 'newgrad'
  if (value.includes('경력')) return 'experienced'
  return fallback === 'all' ? 'entry' : fallback
}

const normalizeSaraminJob = (job, filters) => {
  const title = compactText(job.position?.title || '')
  const company = compactText(job.company?.detail?.name || '')
  const industryName = compactText(job.position?.industry?.name || '')
  const location = compactText(job.position?.location?.name || job.position?.location || '')
  const experience = compactText(job.position?.['experience-level']?.name || '')
  const jobType = compactText(job.position?.['job-type']?.name || '')
  const text = `${title} ${company} ${industryName} ${experience} ${jobType}`
  const industryId = inferIndustryId(text, filters.industry)
  const typeId = inferTypeId(text, filters.type)
  const keywordNames = job.keyword?.split(',').map(compactText).filter(Boolean) || []

  return {
    id: `saramin-${job.id}`,
    source: 'Saramin API',
    company,
    title,
    industryId,
    industry: jobIndustryLabels[industryId] || jobIndustryLabels.electronics,
    typeId,
    type: jobTypeLabels[typeId] || jobTypeLabels.entry,
    location,
    deadline: formatUnixDate(job['expiration-timestamp']),
    postingDate: formatUnixDate(job['posting-timestamp']),
    url: job.url,
    keywords: [industryName, experience, jobType, ...keywordNames].filter(Boolean),
    description: [industryName, experience, jobType].filter(Boolean).join(' · '),
  }
}

const normalizePublicJob = (job, filters, index) => {
  const title = compactText(firstValue(job, ['recrutPbancTtl', 'title', 'recruitTitle', 'pbancTtl', '채용제목', '공고명', 'recrutTitle']))
  const company = compactText(firstValue(job, ['instNm', '기관명', 'company', 'orgName', 'recrutInstNm', '기관명_']))
  const location = compactText(firstValue(job, ['workRgnNm', '근무지', 'workRegion', 'workplcNm', 'region', 'area']))
  const deadline = normalizeDateText(firstValue(job, ['pbancEndYmd', '접수마감일', 'recrutEndYmd', 'endDate', 'deadline', 'clsgYmd']))
  const postingDate = normalizeDateText(firstValue(job, ['pbancBgngYmd', '등록일', 'recrutBgngYmd', 'startDate', 'postingDate', 'regYmd']))
  const detailUrl = compactText(firstValue(job, ['recrutPbancUrl', 'url', 'detailUrl', '원문URL', 'homepageUrl']))
  const seq = firstValue(job, ['recrutPblntSn', 'seq', 'sn', 'id'])
  const ncs = compactText(firstValue(job, ['ncsCdNmLst', 'ncsNm', 'jobField', '채용분야', 'recrutNcsNm']))
  const hireType = compactText(firstValue(job, ['hireTypeNm', '채용구분', 'recrutSeNm', 'jobType', 'employmentType']))
  const text = `${title} ${company} ${location} ${ncs} ${hireType}`
  const industryId = inferIndustryId(text, filters.industry)
  const typeId = inferTypeId(text, filters.type)

  return {
    id: `public-${seq || index}-${title}`,
    source: '공공데이터 API',
    company: company || '공공기관',
    title: title || '공공기관 채용공고',
    industryId,
    industry: jobIndustryLabels[industryId] || jobIndustryLabels.electronics,
    typeId,
    type: jobTypeLabels[typeId] || jobTypeLabels.entry,
    location,
    deadline,
    postingDate,
    url: detailUrl || (seq ? `https://job.alio.go.kr/recruitView.do?idx=${seq}` : 'https://job.alio.go.kr'),
    keywords: [ncs, hireType, company].filter(Boolean),
    description: [ncs, hireType].filter(Boolean).join(' · '),
  }
}

const filterJobs = (jobs, filters) =>
  jobs.filter((job) => {
    if (filters.industry !== 'all' && job.industryId !== filters.industry) return false
    if (filters.type === 'intern') return job.typeId === 'intern'
    if (filters.type === 'newgrad') return job.typeId === 'newgrad'
    if (filters.type === 'entry') return ['intern', 'newgrad', 'entry'].includes(job.typeId)
    if (filters.type === 'experienced') return job.typeId === 'experienced'
    return true
  })

const fetchPublicJobs = async (env, filters) => {
  const serviceKey = env.PUBLIC_RECRUITMENT_SERVICE_KEY || env.PUBLIC_DATA_SERVICE_KEY || env.DATA_GO_KR_SERVICE_KEY
  if (!serviceKey) return { jobs: [], enabled: false, total: 0 }

  const endpoint = env.PUBLIC_RECRUITMENT_API_URL || 'https://apis.data.go.kr/1051000/recruitment/list'
  const keywords = joinKeywords(jobIndustryQueries[filters.industry], jobTypeQueries[filters.type], filters.keyword)
  const params = new URLSearchParams({
    serviceKey,
    pageNo: '1',
    numOfRows: '100',
    resultType: 'json',
    type: 'json',
  })
  if (keywords) params.set('keyword', keywords)

  const response = await fetch(`${endpoint}?${params.toString()}`, { headers: { Accept: 'application/json' } })
  const text = await response.text()
  if (!response.ok) throw new Error(`Public Data API failed: ${response.status} ${text}`)

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('공공데이터 API가 JSON이 아닌 응답을 반환했습니다. API URL과 인증키를 확인해주세요.')
  }

  const rawJobs = normalizeList(data)
  const jobs = filterJobs(rawJobs.map((job, index) => normalizePublicJob(job, filters, index)), filters)
  const total = data.totalCount || data.response?.body?.totalCount || data.jobs?.total || jobs.length
  return { jobs, enabled: true, total }
}

const fetchSaraminJobs = async (env, filters) => {
  const accessKey = env.SARAMIN_ACCESS_KEY
  if (!accessKey) return { jobs: [], enabled: false, total: 0 }

  const keywords = joinKeywords(jobIndustryQueries[filters.industry], jobTypeQueries[filters.type], filters.keyword)
  const params = new URLSearchParams({
    'access-key': accessKey,
    keywords,
    count: '110',
    start: '0',
    sort: 'pd',
    fields: 'posting-date,expiration-date,keyword-code',
  })

  const response = await fetch(`https://oapi.saramin.co.kr/job-search?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Saramin API failed: ${response.status} ${detail}`)
  }

  const data = await response.json()
  const rawJobs = data.jobs?.job ? (Array.isArray(data.jobs.job) ? data.jobs.job : [data.jobs.job]) : []
  const jobs = filterJobs(
    rawJobs
      .filter((job) => String(job.active) === '1')
      .map((job) => normalizeSaraminJob(job, filters)),
    filters,
  )

  return { jobs, enabled: true, total: data.jobs?.total || jobs.length }
}

const jobsApiPlugin = (env) => ({
  name: 'jobs-api',
  configureServer(server) {
    server.middlewares.use('/api/jobs', async (req, res) => {
      if (req.method !== 'GET') {
        sendJson(res, 405, { error: 'Method not allowed' })
        return
      }

      try {
        const requestUrl = new URL(req.url, 'http://localhost')
        const filters = {
          industry: requestUrl.searchParams.get('industry') || 'all',
          type: requestUrl.searchParams.get('type') || 'all',
          keyword: requestUrl.searchParams.get('keyword') || '',
        }
        const cacheKey = JSON.stringify(filters)
        const cached = jobCache.get(cacheKey)
        if (cached && Date.now() - cached.cachedAt < JOB_CACHE_TTL_MS) {
          sendJson(res, 200, { ...cached.payload, meta: { ...cached.payload.meta, cached: true } })
          return
        }

        const results = await Promise.allSettled([
          fetchPublicJobs(env, filters),
          fetchSaraminJobs(env, filters),
        ])
        const successful = results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
        const enabledSources = successful.filter((result) => result.enabled)
        const errors = results.filter((result) => result.status === 'rejected').map((result) => result.reason?.message).filter(Boolean)

        if (!enabledSources.length) {
          sendJson(res, 503, {
            error: '채용 API 키가 설정되어 있지 않습니다. 공공데이터는 PUBLIC_RECRUITMENT_SERVICE_KEY 또는 PUBLIC_DATA_SERVICE_KEY, 사람인은 SARAMIN_ACCESS_KEY를 .env에 추가해주세요.',
          })
          return
        }

        const seen = new Set()
        const jobs = enabledSources
          .flatMap((result) => result.jobs)
          .filter((job) => {
            const key = `${job.source}-${job.company}-${job.title}-${job.deadline}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })

        const payload = {
          jobs,
          meta: {
            source: enabledSources.map((result) => result.enabled && (result.jobs[0]?.source || '채용 API')).filter(Boolean).join(' + ') || '채용 API',
            total: enabledSources.reduce((sum, result) => sum + Number(result.total || 0), 0),
            returned: jobs.length,
            cacheTtlMinutes: 10,
            errors,
            lastUpdated: new Date().toLocaleString('ko-KR'),
          },
        }
        jobCache.set(cacheKey, { cachedAt: Date.now(), payload })
        sendJson(res, 200, payload)
      } catch (error) {
        sendJson(res, 500, { error: error.message || '실제 채용 공고를 불러오지 못했습니다.' })
      }
    })
  },
})

const proxy = {
  '/google-news': {
    target: 'https://news.google.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/google-news/, ''),
  },
  '/yahoo-finance': {
    target: 'https://query1.finance.yahoo.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/yahoo-finance/, ''),
  },
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      newsAiSummaryPlugin(env),
      jobsApiPlugin(env),
    ],
    server: { proxy },
    preview: { proxy },
  }
})
