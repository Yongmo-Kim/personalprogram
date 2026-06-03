import { defenseMarketCompanies } from '../data/defenseMarketCompanies';
import { marketValueCompanies } from '../data/marketValueCompanies';
import { fetchRssNews, removeDuplicates } from './newsService';

const CURRENT_NEWS_FROM = '2026-01-01';

const SEMICONDUCTOR_SEGMENTS = new Set(['idm', 'fabless', 'chipless', 'foundry', 'osat', 'supply-chain']);
const AI_SEGMENTS = new Set(['cloud-bigtech', 'applications', 'mlops-data', 'security-gov', 'robotics-av']);

const segmentLabels = {
  idm: 'IDM',
  fabless: '팹리스',
  chipless: '칩리스/IP/EDA',
  foundry: '파운드리',
  osat: 'OSAT',
  'supply-chain': '소부장',
  prime: '종합 방산',
  missile: '유도무기',
  aerospace: '항공우주',
  land: '지상무기',
  electronics: '방산전자',
  'cloud-bigtech': 'AI 플랫폼',
  applications: 'AI 응용',
  'mlops-data': 'MLOps/데이터',
  'security-gov': 'AI 보안',
  'robotics-av': '로보틱스/자율주행',
};

const koreanNameOverrides = {
  'sk-hynix': 'SK하이닉스',
  'samsung-electronics': '삼성전자',
  'hanmi-semiconductor': '한미반도체',
  'leeno-industrial': '리노공업',
  'wonik-ips': '원익IPS',
  'db-hitek': 'DB하이텍',
  'lx-semicon': 'LX세미콘',
  'jusung-engineering': '주성엔지니어링',
  soulbrain: '솔브레인',
  'dongjin-semichem': '동진쎄미켐',
  simmtech: '심텍',
  'eugene-technology': '유진테크',
  tck: '티씨케이',
  snstech: '에스앤에스텍',
  'hansol-chemical': '한솔케미칼',
  'hana-micron': '하나마이크론',
  techwing: '테크윙',
  nextin: '넥스틴',
  'park-systems': '파크시스템스',
  tes: '테스',
  tse: '티에스이',
  dnf: '디엔에프',
  'daeduck-electronics': '대덕전자',
  'enf-tech': '이엔에프테크놀로지',
  'kc-tech': '케이씨텍',
  komico: '코미코',
  naver: '네이버',
  kakao: '카카오',
  'lockheed-martin': 'Lockheed Martin',
  rtx: 'RTX',
  'northrop-grumman': 'Northrop Grumman',
  'general-dynamics': 'General Dynamics',
  'bae-systems': 'BAE Systems',
  rheinmetall: 'Rheinmetall',
  thales: 'Thales',
  'hanwha-aerospace': '한화에어로스페이스',
  'lig-nex1': 'LIG넥스원',
  kai: '한국항공우주',
  'hyundai-rotem': '현대로템',
  'hanwha-systems': '한화시스템',
};

const careerUrlOverrides = {
  'samsung-electronics': 'https://www.samsungcareers.com/',
  'sk-hynix': 'https://recruit.skhynix.com/',
  nvidia: 'https://www.nvidia.com/en-us/about-nvidia/careers/',
  tsmc: 'https://www.tsmc.com/english/careers',
  broadcom: 'https://www.broadcom.com/company/careers',
  asml: 'https://www.asml.com/en/careers',
  micron: 'https://www.micron.com/careers',
  amd: 'https://www.amd.com/en/corporate/careers.html',
  qualcomm: 'https://www.qualcomm.com/company/careers',
  'applied-materials': 'https://www.appliedmaterials.com/us/en/careers.html',
  'lam-research': 'https://www.lamresearch.com/careers/',
  kla: 'https://www.kla.com/careers',
  arm: 'https://careers.arm.com/',
  intel: 'https://jobs.intel.com/',
  synopsys: 'https://www.synopsys.com/company/careers.html',
  cadence: 'https://www.cadence.com/en_US/home/company/careers.html',
  marvell: 'https://www.marvell.com/company/careers.html',
  nxp: 'https://www.nxp.com/company/about-nxp/careers:CAREERS',
  mediatek: 'https://corp.mediatek.com/careers',
  'tokyo-electron': 'https://www.tel.com/careers/',
  renesas: 'https://www.renesas.com/us/en/about/careers',
  stmicroelectronics: 'https://www.st.com/content/st_com/en/about/careers.html',
  infineon: 'https://www.infineon.com/cms/en/careers/',
  onsemi: 'https://www.onsemi.com/careers',
  globalfoundries: 'https://gf.com/careers/',
  microchip: 'https://www.microchip.com/en-us/about/careers',
  teradyne: 'https://www.teradyne.com/careers/',
  'ase-technology': 'https://www.aseglobal.com/en/careers',
  amkor: 'https://amkor.com/careers/',
  microsoft: 'https://careers.microsoft.com/',
  alphabet: 'https://www.google.com/about/careers/applications/',
  amazon: 'https://www.amazon.jobs/',
  meta: 'https://www.metacareers.com/',
  oracle: 'https://www.oracle.com/careers/',
  palantir: 'https://www.palantir.com/careers/',
  snowflake: 'https://careers.snowflake.com/',
  crowdstrike: 'https://www.crowdstrike.com/careers/',
  tesla: 'https://www.tesla.com/careers',
  naver: 'https://recruit.navercorp.com/',
  kakao: 'https://careers.kakao.com/',
  'lockheed-martin': 'https://www.lockheedmartinjobs.com/',
  rtx: 'https://careers.rtx.com/global/en',
  'northrop-grumman': 'https://www.northropgrumman.com/careers',
  'general-dynamics': 'https://www.gd.com/careers',
  'bae-systems': 'https://jobs.baesystems.com/',
  rheinmetall: 'https://www.rheinmetall.com/en/career',
  thales: 'https://www.thalesgroup.com/en/career',
  'hanwha-aerospace': 'https://www.hanwhain.com/',
  'lig-nex1': 'https://www.lignex1.com/web/kor/careers/recruitment.do',
  kai: 'https://www.koreaaero.com/KO/Careers/Recruit.aspx',
  'hyundai-rotem': 'https://www.hyundai-rotem.co.kr/Recruit/RecruitList',
  'hanwha-systems': 'https://www.hanwhain.com/',
};

const buildGoogleSearchUrl = (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`;
const buildGoogleNewsUrl = (query) => `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR%3Ako`;
const buildSaraminUrl = (query) => `https://www.saramin.co.kr/zf_user/search?searchword=${encodeURIComponent(query)}`;
const buildJobkoreaUrl = (query) => `https://www.jobkorea.co.kr/Search/?stext=${encodeURIComponent(query)}`;

const getDisplayName = (company) => koreanNameOverrides[company.companyId] || company.nameKo || company.name || company.companyId;

const normalizeMarketCompany = (company, industry) => {
  const displayName = getDisplayName(company);
  const searchName = `${displayName} ${company.name || ''}`.trim();
  return {
    id: `${industry}-${company.companyId}`,
    companyId: company.companyId,
    industry,
    name: company.name || displayName,
    displayName,
    country: company.country || (company.region === 'korea' ? 'South Korea' : 'Global'),
    region: company.region,
    segment: company.segment,
    segmentLabel: segmentLabels[company.segment] || company.segment,
    searchName,
    careerUrl: careerUrlOverrides[company.companyId] || '',
    officialSearchUrl: buildGoogleSearchUrl(`${searchName} official careers 채용`),
    saraminUrl: buildSaraminUrl(searchName),
    jobkoreaUrl: buildJobkoreaUrl(searchName),
    newsUrl: buildGoogleNewsUrl(`${searchName} 채용 신입 인턴`),
  };
};

const normalizeDefenseCompany = (company) => {
  const displayName = getDisplayName(company);
  const searchName = `${displayName} ${company.symbol || ''}`.trim();
  return {
    id: `defense-${company.companyId}`,
    companyId: company.companyId,
    industry: 'defense',
    name: displayName,
    displayName,
    country: company.region === 'korea' ? 'South Korea' : 'Global',
    region: company.region,
    segment: company.segment,
    segmentLabel: segmentLabels[company.segment] || company.segment,
    searchName,
    careerUrl: careerUrlOverrides[company.companyId] || '',
    officialSearchUrl: buildGoogleSearchUrl(`${searchName} official careers 채용`),
    saraminUrl: buildSaraminUrl(searchName),
    jobkoreaUrl: buildJobkoreaUrl(searchName),
    newsUrl: buildGoogleNewsUrl(`${searchName} 채용 신입 인턴`),
  };
};

const semiconductorCompanies = marketValueCompanies
  .filter((company) => SEMICONDUCTOR_SEGMENTS.has(company.segment))
  .map((company) => normalizeMarketCompany(company, 'semiconductor'));

const aiCompanies = marketValueCompanies
  .filter((company) => AI_SEGMENTS.has(company.segment))
  .map((company) => normalizeMarketCompany(company, 'ai'));

const defenseCompanies = defenseMarketCompanies.map(normalizeDefenseCompany);

export const HIRING_COMPANIES = [
  ...semiconductorCompanies,
  ...defenseCompanies,
  ...aiCompanies,
];

const typeQueryMap = {
  all: '채용 OR careers',
  intern: '인턴 OR internship',
  newgrad: '신입 OR graduate',
  entry: '신입 OR 인턴 OR graduate OR internship',
  experienced: '경력 OR experienced',
};

export const getHiringCompanies = ({ industry = 'semiconductor', keyword = '', limit } = {}) => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const list = HIRING_COMPANIES
    .filter((company) => industry === 'all' || company.industry === industry)
    .filter((company) => {
      if (!normalizedKeyword) return true;
      const haystack = [
        company.displayName,
        company.name,
        company.segmentLabel,
        company.country,
        company.searchName,
      ].join(' ').toLowerCase();
      return haystack.includes(normalizedKeyword);
    });

  return typeof limit === 'number' ? list.slice(0, limit) : list;
};

export const fetchHiringNews = async ({ company, type = 'entry', limit = 8 }) => {
  if (!company) return [];

  const typeQuery = typeQueryMap[type] || typeQueryMap.entry;
  const query = `${company.searchName} (${typeQuery}) 채용 after:${CURRENT_NEWS_FROM}`;
  const news = await fetchRssNews(query, {
    category: '채용 소식',
    categoryId: 'hiring',
    company: company.displayName,
    industry: company.industry,
  });

  return removeDuplicates(news)
    .sort((a, b) => Number(b.publishedAtMs || 0) - Number(a.publishedAtMs || 0))
    .slice(0, limit);
};
