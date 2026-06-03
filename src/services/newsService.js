import { mockSemiNews } from '../data/mockNews';

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';
const GOOGLE_NEWS_PROXY_SEARCH_BASE = '/google-news/rss/search?hl=ko&gl=KR&ceid=KR:ko&q=';
const GOOGLE_NEWS_SEARCH_BASE = 'https://news.google.com/rss/search?hl=ko&gl=KR&ceid=KR:ko&q=';
const WORLD_NEWS_MIN_YEAR = 2026;
const WORLD_NEWS_MIN_DATE = `${WORLD_NEWS_MIN_YEAR}-01-01`;
const WORLD_NEWS_MIN_TIMESTAMP = new Date(`${WORLD_NEWS_MIN_DATE}T00:00:00+09:00`).getTime();

const getDateMs = (dateText) => {
  if (!dateText) return 0;
  const date = new Date(dateText);
  const time = date.getTime();
  return Number.isNaN(time) ? 0 : time;
};

const formatDate = (dateText) => {
  if (!dateText) return '';
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const stripHtml = (value = '') => value
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

const normalizeGoogleTitle = (title, source) => {
  if (!title || !source) return title || '';
  const suffix = ` - ${source}`;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
};

const mapGoogleRssItem = (item, index, metaData = {}) => {
  const source = item.querySelector('source')?.textContent || 'Google News';
  const rawTitle = item.querySelector('title')?.textContent || '';
  const link = item.querySelector('link')?.textContent || '';
  const pubDate = item.querySelector('pubDate')?.textContent || '';
  const description = item.querySelector('description')?.textContent || '';
  const guid = item.querySelector('guid')?.textContent || link || `google-rss-${Date.now()}-${index}`;
  const publishedAtMs = getDateMs(pubDate);

  return {
    id: guid,
    title: normalizeGoogleTitle(rawTitle, source),
    source,
    publishedAt: formatDate(pubDate),
    date: formatDate(pubDate),
    rawPublishedAt: pubDate,
    publishedAtMs,
    summary: stripHtml(description),
    url: link,
    isFallback: false,
    ...metaData,
  };
};

const fetchGoogleRssDirect = async (query, metaData = {}) => {
  const url = `${GOOGLE_NEWS_PROXY_SEARCH_BASE}${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google News RSS proxy failed: ${response.status}`);
  }

  const xmlText = await response.text();
  const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
  const parseError = xml.querySelector('parsererror');
  if (parseError) {
    throw new Error('Google News RSS XML parse failed');
  }

  return Array.from(xml.querySelectorAll('item')).map((item, index) => mapGoogleRssItem(item, index, metaData));
};

const fetchGoogleRssViaJson = async (query, metaData = {}) => {
  const url = `${RSS2JSON_BASE}${encodeURIComponent(GOOGLE_NEWS_SEARCH_BASE + encodeURIComponent(query))}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`rss2json failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.status !== 'ok') {
    throw new Error(data.message || 'RSS conversion failed');
  }

  return data.items.map((item, index) => {
    const pubDate = item.pubDate?.replace(' ', 'T') || '';
    const publishedAtMs = getDateMs(pubDate);
    return {
      id: item.guid || `news-${Date.now()}-${index}`,
      title: item.title,
      source: item.author || 'Google News',
      publishedAt: formatDate(pubDate),
      date: formatDate(pubDate),
      rawPublishedAt: pubDate,
      publishedAtMs,
      summary: stripHtml(item.description || ''),
      url: item.link,
      isFallback: false,
      ...metaData,
    };
  });
};

export const fetchRssNews = async (query, metaData = {}) => {
  try {
    return await fetchGoogleRssDirect(query, metaData);
  } catch (directError) {
    try {
      return await fetchGoogleRssViaJson(query, metaData);
    } catch (jsonError) {
      throw new Error('실제 뉴스 데이터를 불러오지 못했습니다.', { cause: jsonError || directError });
    }
  }
};

export const toFallbackNews = (items, metaData = {}) =>
  items.map((item, index) => ({
    id: `fallback-${item.id || index}`,
    title: item.title,
    source: item.source || 'Sample',
    publishedAt: item.publishedAt || item.date || '',
    date: item.date || item.publishedAt || '',
    summary: item.summary || '',
    url: item.url?.includes('example.com') ? '' : item.url,
    isFallback: true,
    ...metaData,
  }));

export const removeDuplicates = (newsList) => {
  const seenUrls = new Set();
  const seenTitles = new Set();

  return newsList.filter((item) => {
    if (item.url && seenUrls.has(item.url)) return false;
    if (item.title && seenTitles.has(item.title)) return false;

    if (item.url) seenUrls.add(item.url);
    if (item.title) seenTitles.add(item.title);
    return true;
  });
};

const sortNewestFirst = (newsList) =>
  [...newsList].sort((a, b) => Number(b.publishedAtMs || 0) - Number(a.publishedAtMs || 0));

const keepOnlyCurrentWorldNews = (newsList) =>
  newsList.filter((item) => Number(item.publishedAtMs || 0) >= WORLD_NEWS_MIN_TIMESTAMP);

const withWorldFreshnessQuery = (query) => `${query} after:${WORLD_NEWS_MIN_DATE}`;

export const WORLD_NEWS_CATEGORIES = [
  { id: 'all', label: '전체', query: '', region: 'Global', tone: 'slate' },
  { id: 'breaking', label: '긴급 속보', query: 'breaking news global OR world crisis OR geopolitical risk OR natural disaster OR war update', region: 'Global', tone: 'red' },
  { id: 'politics', label: '국제정치 / 외교', query: 'US China relations OR Russia Ukraine war OR Middle East conflict OR NATO OR UN Security Council OR South Korea diplomacy', region: 'Global', tone: 'blue' },
  { id: 'economy', label: '경제 / 금융', query: 'global economy OR interest rate OR inflation OR stock market OR exchange rate OR oil price OR trade war', region: 'Global', tone: 'sky' },
  { id: 'tech', label: '기술 / AI / 반도체', query: 'artificial intelligence OR semiconductor OR Nvidia OR TSMC OR Samsung Electronics OR SK hynix OR ASML OR data center OR chip export control', region: 'Global', tone: 'violet' },
  { id: 'defense', label: '방위산업 / 안보', query: 'defense industry OR missile defense OR fighter jet OR drone warfare OR military technology OR defense export OR Hanwha Aerospace OR LIG Nex1 OR Lockheed Martin OR Raytheon', region: 'Global', tone: 'emerald' },
  { id: 'energy', label: '에너지 / 원자재', query: 'oil price OR LNG OR uranium OR rare earth OR lithium OR battery materials OR energy security', region: 'Global', tone: 'amber' },
  { id: 'science', label: '과학 / 우주 / 의료', query: 'space industry OR NASA OR SpaceX OR biotechnology OR vaccine OR medical technology', region: 'Global', tone: 'cyan' },
  { id: 'us', label: '미국', query: 'United States politics economy technology defense latest news', region: 'United States', tone: 'blue' },
  { id: 'china', label: '중국', query: 'China economy technology military diplomacy latest news', region: 'China', tone: 'red' },
  { id: 'japan', label: '일본', query: 'Japan economy technology defense diplomacy latest news', region: 'Japan', tone: 'rose' },
  { id: 'europe', label: '유럽', query: 'Europe economy defense diplomacy technology latest news', region: 'Europe', tone: 'indigo' },
  { id: 'middle-east', label: '중동', query: 'Middle East conflict oil defense diplomacy latest news', region: 'Middle East', tone: 'orange' },
  { id: 'korea-related', label: '한국 관련 해외뉴스', query: 'South Korea economy OR South Korea defense OR South Korea semiconductor OR Korea export OR Korean companies global', region: 'South Korea', tone: 'teal' },
  { id: 'important', label: '나에게 중요한 뉴스', query: 'semiconductor OR chip OR AI OR Nvidia OR TSMC OR Samsung OR SK hynix OR ASML OR defense OR missile OR drone OR aerospace OR Hanwha OR LIG Nex1 OR Lockheed Martin OR job market OR economy OR export OR interest rate OR dollar OR oil', region: 'Global', tone: 'primary' },
];

const WORLD_NEWS_OVERVIEW_CATEGORY_IDS = WORLD_NEWS_CATEGORIES
  .filter((category) => category.id !== 'all')
  .map((category) => category.id);

const INTEREST_KEYWORDS = [
  { tag: '반도체 영향', words: ['semiconductor', 'chip', 'nvidia', 'tsmc', 'samsung', 'sk hynix', 'asml', 'hbm', 'memory'] },
  { tag: '방산 영향', words: ['defense', 'missile', 'drone', 'aerospace', 'hanwha', 'lig nex1', 'lockheed', 'raytheon', 'military'] },
  { tag: '경제 영향', words: ['economy', 'export', 'interest rate', 'dollar', 'oil', 'inflation', 'stock market', 'exchange rate'] },
  { tag: '취업 영향', words: ['job market', 'hiring', 'layoff', 'employment', 'recruitment'] },
  { tag: '기술 영향', words: ['ai', 'artificial intelligence', 'data center', 'technology', 'space', 'biotechnology'] },
];

const URGENT_WORDS = ['breaking', 'war', 'attack', 'crisis', 'earthquake', 'missile', 'emergency', 'conflict', 'sanction'];

const getWorldCategory = (categoryId) =>
  WORLD_NEWS_CATEGORIES.find((category) => category.id === categoryId) || WORLD_NEWS_CATEGORIES[0];

const findInterestTags = (item) => {
  const text = `${item.title || ''} ${item.summary || ''}`.toLowerCase();
  return INTEREST_KEYWORDS
    .filter((group) => group.words.some((word) => text.includes(word.toLowerCase())))
    .map((group) => group.tag);
};

const inferImportance = (item, category) => {
  const text = `${item.title || ''} ${item.summary || ''}`.toLowerCase();
  if (category.id === 'breaking' || URGENT_WORDS.some((word) => text.includes(word))) return '긴급';
  if (findInterestTags(item).length > 0 || ['economy', 'tech', 'defense', 'korea-related', 'important'].includes(category.id)) return '중요';
  return '참고';
};

const enrichWorldNews = (item, category) => {
  const interestTags = findInterestTags(item);
  return {
    ...item,
    category: category.label,
    categoryId: category.id,
    region: category.region,
    tone: category.tone,
    importance: inferImportance(item, category),
    interestTags,
    keywords: interestTags.length ? interestTags : [category.label],
  };
};

export const fetchWorldCategoryNews = async (categoryId = 'all', options = {}) => {
  const { limit = 40, strict = true } = options;
  const category = getWorldCategory(categoryId);

  const fetchOneCategory = async (targetCategory, perCategoryLimit = limit) => {
    const news = await fetchRssNews(withWorldFreshnessQuery(targetCategory.query), {
      category: targetCategory.label,
      categoryId: targetCategory.id,
      region: targetCategory.region,
      tone: targetCategory.tone,
    });
    return sortNewestFirst(keepOnlyCurrentWorldNews(removeDuplicates(news).map((item) => enrichWorldNews(item, targetCategory))))
      .slice(0, perCategoryLimit);
  };

  if (category.id !== 'all') {
    try {
      return await fetchOneCategory(category, limit);
    } catch (error) {
      if (strict) throw error;
      return [];
    }
  }

  const overviewCategories = WORLD_NEWS_OVERVIEW_CATEGORY_IDS.map(getWorldCategory);
  const perCategoryLimit = Math.max(10, Math.ceil(limit / overviewCategories.length) + 4);
  const results = await Promise.allSettled(overviewCategories.map((targetCategory) => fetchOneCategory(targetCategory, perCategoryLimit)));
  const news = sortNewestFirst(removeDuplicates(results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []))))
    .slice(0, limit);

  if (!news.length && strict) {
    throw new Error('실제 세계뉴스 데이터를 불러오지 못했습니다. 네트워크 또는 Google News RSS 연결 상태를 확인해주세요.');
  }

  return news;
};

export const fetchSemiconductorNews = async () => {
  const query = '반도체 OR semiconductor';
  try {
    const news = await fetchRssNews(query, { segment: 'general' });
    return removeDuplicates(news).slice(0, 20);
  } catch {
    return toFallbackNews(mockSemiNews, { segment: 'general' }).slice(0, 20);
  }
};

export const fetchCompanyNews = async (company) => {
  if (!company) return [];
  const keywords = company.newsKeywords ? company.newsKeywords.join(' OR ') : `${company.nameKo} OR ${company.name}`;
  const metaData = {
    companyId: company.id,
    companyName: company.nameKo || company.name,
    region: company.region,
    segment: company.segments?.[0],
  };
  try {
    const news = await fetchRssNews(keywords, metaData);
    return removeDuplicates(news).slice(0, 15);
  } catch {
    return toFallbackNews(mockSemiNews, metaData).slice(0, 15);
  }
};

export const fetchSegmentNews = async (region, segment) => {
  const segmentKeywords = {
    idm: 'IDM semiconductor Samsung SK hynix Intel Micron Texas Instruments Infineon',
    fabless: 'fabless semiconductor NVIDIA AMD Qualcomm Broadcom MediaTek Marvell',
    chipless: 'semiconductor IP EDA Synopsys Cadence Arm Rambus chip design',
    'design-house': 'semiconductor design house ASIC turnkey physical design Samsung Foundry',
    foundry: 'semiconductor foundry TSMC Samsung Intel',
    osat: 'semiconductor packaging OSAT ASE Amkor advanced packaging',
    'supply-chain': 'semiconductor equipment materials ASML Applied Materials Lam Research photoresist wafer gas',
  };

  let query = segmentKeywords[segment] || segment;
  if (region === 'korea') query += ' (국내 OR 한국 OR Samsung OR SK)';

  try {
    const news = await fetchRssNews(query, { region, segment });
    return removeDuplicates(news).slice(0, 15);
  } catch {
    return toFallbackNews(mockSemiNews, { region, segment }).slice(0, 15);
  }
};

export const fetchTechnologyNews = async (technology) => {
  if (!technology) return [];
  const keywords = technology.keywords ? technology.keywords.join(' OR ') : technology.name;
  try {
    const news = await fetchRssNews(keywords, { technologies: [technology.id], segment: technology.category });
    return removeDuplicates(news).slice(0, 15);
  } catch {
    return toFallbackNews(mockSemiNews, { technologies: [technology.id], segment: technology.category }).slice(0, 15);
  }
};

export const fetchDefenseNews = async () => {
  const query = '방위산업 OR 방산 OR defense industry OR military technology';
  try {
    const news = await fetchRssNews(query, { domain: 'defense' });
    return removeDuplicates(news).slice(0, 20);
  } catch {
    return toFallbackNews(mockSemiNews, { domain: 'defense' }).slice(0, 20);
  }
};

export const fetchDefenseCompanyNews = async (company) => {
  if (!company) return [];
  const keywords = company.newsKeywords ? company.newsKeywords.join(' OR ') : `${company.nameKo} OR ${company.name} defense`;
  try {
    const news = await fetchRssNews(keywords, {
      domain: 'defense',
      companyId: company.id,
      companyName: company.nameKo || company.name,
      segment: company.segments?.[0],
    });
    return removeDuplicates(news).slice(0, 15);
  } catch {
    return toFallbackNews(mockSemiNews, { domain: 'defense', companyId: company.id }).slice(0, 15);
  }
};

export const fetchDefenseTechnologyNews = async (technology) => {
  if (!technology) return [];
  const keywords = technology.keywords ? technology.keywords.join(' OR ') : `${technology.name} defense`;
  try {
    const news = await fetchRssNews(keywords, {
      domain: 'defense',
      technologies: [technology.id],
      segment: technology.category,
    });
    return removeDuplicates(news).slice(0, 15);
  } catch {
    return toFallbackNews(mockSemiNews, { domain: 'defense', technologies: [technology.id] }).slice(0, 15);
  }
};

export const fetchWorldNews = async (options = {}) => {
  const { strict = false, categoryId = 'all', limit = 40 } = options;
  return fetchWorldCategoryNews(categoryId, { strict, limit });
};

export const fetchSemiNews = fetchSemiconductorNews;
