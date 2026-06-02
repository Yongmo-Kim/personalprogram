export const SEGMENT_PLAYBOOKS = {
  idm: {
    position: '설계와 제조를 함께 보유한 종합 반도체 축',
    moat: ['공정 내재화', '대규모 CAPEX', '수율 학습곡선', '고객 신뢰성 인증'],
    watch: ['메모리 가격 사이클', '선단 공정 수율', 'CAPEX 계획', 'AI 서버 수요'],
    risks: ['투자 부담', '다운사이클 재고', '파운드리 고객 확보 실패', '수율 지연'],
  },
  fabless: {
    position: '제품 아키텍처와 소프트웨어 생태계로 가치를 만드는 설계 중심 축',
    moat: ['아키텍처 경쟁력', '소프트웨어 생태계', '고객 설계 채택', 'IP 재사용 능력'],
    watch: ['AI 가속기 수요', '클라우드 CAPEX', '파운드리 생산능력', '제품 로드맵'],
    risks: ['파운드리 의존도', '제품 세대 전환 실패', '가격 경쟁', '수출 규제'],
  },
  chipless: {
    position: 'EDA, IP, 설계 자산으로 반도체 생태계의 생산성을 높이는 축',
    moat: ['락인 효과', '검증된 IP 포트폴리오', '설계 툴 체인', '고객 전환 비용'],
    watch: ['선단 공정 설계 복잡도', 'AI 설계 자동화', 'Arm/RISC-V 채택', 'EDA 구독 성장'],
    risks: ['라이선스 규제', '대형 고객 협상력', '오픈소스 IP 확산', '설계 자동화 경쟁'],
  },
  'design-house': {
    position: '팹리스 설계를 실제 파운드리 생산 가능한 GDS로 연결하는 구현 축',
    moat: ['파운드리 PDK 경험', '물리설계 인력', '턴키 수행 이력', '고객 프로젝트 레퍼런스'],
    watch: ['ASIC 수요', '국내 시스템반도체 투자', '파운드리 파트너십', '선단 노드 설계 수요'],
    risks: ['프로젝트성 매출 변동', '인력 의존도', '고객 테이프아웃 지연', '파운드리 종속성'],
  },
  foundry: {
    position: '고객 설계를 웨이퍼 위의 실제 칩으로 제조하는 생산 플랫폼 축',
    moat: ['공정 노드', '수율 데이터', '고객 포트폴리오', '패키징 연계'],
    watch: ['2nm/3nm 수율', 'AI/HPC 고객 수주', '패키징 캐파', '장비 반입 속도'],
    risks: ['대규모 투자 회수', '고객 집중도', '공정 지연', '지정학 리스크'],
  },
  osat: {
    position: '칩을 실제 제품으로 연결하고 테스트하는 후공정 축',
    moat: ['첨단 패키징 노하우', '테스트 처리량', '고객 인증', '수율 관리'],
    watch: ['HBM/AI 패키징 수요', 'CoWoS/FOWLP 캐파', '테스트 시간 증가', '기판 공급'],
    risks: ['단가 압박', '고객 내재화', '장비 병목', '패키징 수율 이슈'],
  },
  'supply-chain': {
    position: '장비, 소재, 부품으로 공정 성능과 수율을 좌우하는 공급망 축',
    moat: ['공정 레시피 축적', '고객 퀄 인증', '소재 순도 관리', '장비 설치 기반'],
    watch: ['EUV/High-NA 투자', '소재 국산화', '신규 팹 착공', '공정 미세화'],
    risks: ['고객 투자 사이클', '재고 조정', '품질 사고', '대체 공급사 진입'],
  },
};

export const PROCESS_TECH_LINKS = {
  'product-planning': ['ai-accelerator', 'gpu', 'npu', 'hbm', 'chiplet'],
  'rtl-design': ['chipless', 'ip-core', 'ai-accelerator', 'gpu', 'npu'],
  verification: ['chipless', 'ip-core', 'foundry-pdk'],
  'logic-synthesis': ['chipless', 'ip-core', 'foundry-pdk'],
  'physical-design': ['foundry-pdk', '2nm-process', '3nm-process', 'gaa', 'finfet'],
  'tapeout-mask': ['euv', 'duv', 'lithography', 'foundry-pdk'],
  'wafer-prep': ['yield'],
  oxidation: ['gaa', 'finfet', 'yield'],
  photolithography: ['euv', 'duv', 'lithography'],
  etch: ['etching', 'gaa', 'finfet'],
  'deposition-implant': ['deposition', 'gaa', 'finfet'],
  cmp: ['yield', '2nm-process', '3nm-process'],
  metallization: ['2nm-process', '3nm-process', 'interposer'],
  'clean-inspection': ['yield', '2nm-process', '3nm-process'],
  eds: ['yield'],
  dicing: ['advanced-packaging'],
  packaging: ['hbm', 'cowos', 'fowlp', 'advanced-packaging', 'chiplet', 'interposer', 'tsv'],
  'final-test': ['yield', 'hbm', 'advanced-packaging'],
};

export const TECH_PROCESS_LINKS = Object.entries(PROCESS_TECH_LINKS).reduce((acc, [processId, techIds]) => {
  techIds.forEach((techId) => {
    acc[techId] = [...(acc[techId] || []), processId];
  });
  return acc;
}, {});

const PROCESS_LABELS = {
  'product-planning': '제품 기획',
  'rtl-design': 'RTL 설계',
  verification: '기능 검증',
  'logic-synthesis': '논리 합성/DFT',
  'physical-design': '물리 설계',
  'tapeout-mask': 'Tape-out/마스크',
  'wafer-prep': '웨이퍼 준비',
  oxidation: '산화',
  photolithography: '포토/노광',
  etch: '식각',
  'deposition-implant': '증착/이온주입',
  cmp: 'CMP',
  metallization: '금속 배선',
  'clean-inspection': '세정/검사',
  eds: 'EDS',
  dicing: '다이싱',
  packaging: '패키징',
  'final-test': '최종 테스트',
};

const STAGE_LABELS = {
  'product-planning': '설계 전',
  'rtl-design': '설계',
  verification: '설계',
  'logic-synthesis': '설계',
  'physical-design': '설계',
  'tapeout-mask': '제조 이관',
  'wafer-prep': '전공정',
  oxidation: '전공정',
  photolithography: '전공정',
  etch: '전공정',
  'deposition-implant': '전공정',
  cmp: '전공정',
  metallization: '전공정',
  'clean-inspection': '전공정',
  eds: '후공정',
  dicing: '후공정',
  packaging: '후공정',
  'final-test': '후공정',
};

const IMPACT_RULES = [
  { label: 'AI 수요', words: ['ai', 'gpu', 'npu', 'accelerator', 'data center', 'hbm', 'server'] },
  { label: 'HBM/메모리', words: ['hbm', 'dram', 'nand', 'memory', 'ddr', 'ssd'] },
  { label: '공정/수율', words: ['yield', '2nm', '3nm', 'gaa', 'finfet', 'process', 'node'] },
  { label: '패키징', words: ['cowos', 'packaging', 'chiplet', 'interposer', 'tsv', 'osat'] },
  { label: '장비/소재', words: ['asml', 'euv', 'duv', 'photoresist', 'equipment', 'materials', 'wafer', 'etch'] },
  { label: '실적/투자', words: ['earnings', 'revenue', 'profit', 'capex', 'guidance', 'investment'] },
  { label: '규제/지정학', words: ['export control', 'china', 'us', 'taiwan', 'sanction', 'restriction'] },
];

const unique = (items) => [...new Set(items.filter(Boolean))];

export const getSegmentPlaybook = (segment) => SEGMENT_PLAYBOOKS[segment] || SEGMENT_PLAYBOOKS.idm;

export const getProcessLabel = (processId) => PROCESS_LABELS[processId] || processId;

export const getProcessStage = (processId) => STAGE_LABELS[processId] || '가치사슬';

export const getTechnologyProcessLinks = (tech) => {
  const processIds = unique([...(TECH_PROCESS_LINKS[tech?.id] || []), ...(TECH_PROCESS_LINKS[tech?.category] || [])]);
  return processIds.map((processId) => ({
    id: processId,
    label: getProcessLabel(processId),
    stage: getProcessStage(processId),
  }));
};

export const getProcessIntelligence = (processId, technologies, companies) => {
  const techIds = PROCESS_TECH_LINKS[processId] || [];
  const linkedTechs = techIds.map((id) => technologies.find((tech) => tech.id === id)).filter(Boolean);
  const linkedCompanies = companies
    .filter((company) => company.coreTechnologies?.some((techId) => techIds.includes(techId)))
    .slice(0, 8);

  return {
    techs: linkedTechs,
    companies: linkedCompanies,
  };
};

export const getCompanyIntelligence = (company, companyTechs = []) => {
  const primarySegment = company?.segments?.[0] || 'idm';
  const playbook = getSegmentPlaybook(primarySegment);
  const processLinks = unique(
    companyTechs.flatMap((tech) => getTechnologyProcessLinks(tech).map((link) => link.id))
  ).map((processId) => ({
    id: processId,
    label: getProcessLabel(processId),
    stage: getProcessStage(processId),
  }));

  return {
    position: playbook.position,
    moat: unique([...playbook.moat, ...(company?.tags || []).slice(0, 3)]).slice(0, 6),
    watch: playbook.watch.slice(0, 5),
    risks: playbook.risks.slice(0, 4),
    processLinks: processLinks.slice(0, 8),
    dataProfile: [
      { label: '기업 기본정보', status: '로컬 큐레이션', tone: 'border-blue-500/30 bg-blue-500/10 text-blue-200' },
      { label: '뉴스', status: 'Google News RSS 실시간', tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' },
      { label: '시장가치', status: '실시간 가격 + 추정 시총', tone: 'border-amber-500/30 bg-amber-500/10 text-amber-200' },
      { label: '로고', status: company?.logo || company?.logoUrl ? '이미지 사용' : '텍스트 대체', tone: 'border-slate-500/30 bg-slate-500/10 text-slate-200' },
    ],
  };
};

export const getNewsImpactTags = (item, extraWords = []) => {
  const text = `${item?.title || ''} ${item?.summary || ''} ${extraWords.join(' ')}`.toLowerCase();
  const tags = IMPACT_RULES.filter((rule) => rule.words.some((word) => text.includes(word.toLowerCase()))).map((rule) => rule.label);
  return unique(tags).slice(0, 3);
};
