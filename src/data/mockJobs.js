export const mockJobs = [
  {
    id: 'j1',
    company: '삼성전자',
    industry: '반도체',
    title: '반도체 공정 엔지니어 (신입)',
    type: '신입',
    location: '경기도 화성',
    deadline: '2026-06-30',
    url: 'https://example.com/jobs/1',
    keywords: ['반도체', '공정', 'FAB'],
    status: 'saved',
    description: '반도체 FAB 내 공정 최적화 및 수율 관리 업무를 담당합니다.'
  },
  {
    id: 'j2',
    company: 'SK하이닉스',
    industry: '반도체',
    title: 'HBM 설계 엔지니어',
    type: '경력',
    location: '경기도 이천',
    deadline: '2026-07-15',
    url: 'https://example.com/jobs/2',
    keywords: ['HBM', '메모리', '설계'],
    status: 'interested',
    description: 'HBM(High Bandwidth Memory) 제품 설계 및 검증 업무를 담당합니다.'
  },
  {
    id: 'j3',
    company: '한화에어로스페이스',
    industry: '방산',
    title: '전자전 시스템 개발자 (신입/경력)',
    type: '신입',
    location: '경기도 성남',
    deadline: '2026-06-20',
    url: 'https://example.com/jobs/3',
    keywords: ['방산', '전자전', '임베디드'],
    status: 'saved',
    description: '전자전 시스템의 소프트웨어 개발 및 통합 시험 업무를 수행합니다.'
  },
  {
    id: 'j4',
    company: 'LIG넥스원',
    industry: '방산',
    title: '유도무기 SW 개발자',
    type: '경력',
    location: '경기도 판교',
    deadline: '2026-07-01',
    url: 'https://example.com/jobs/4',
    keywords: ['방산', '유도무기', 'C/C++'],
    status: 'interested',
    description: '유도무기 시스템의 실시간 소프트웨어 개발을 담당합니다.'
  },
  {
    id: 'j5',
    company: 'DB하이텍',
    industry: '반도체',
    title: '아날로그 반도체 공정 엔지니어',
    type: '신입',
    location: '경기도 부천',
    deadline: '2026-06-25',
    url: 'https://example.com/jobs/5',
    keywords: ['아날로그', '파운드리', '공정'],
    status: 'saved',
    description: '아날로그 반도체 파운드리 공정 개발 및 관리를 수행합니다.'
  },
  {
    id: 'j6',
    company: '현대로템',
    industry: '방산',
    title: '전차 전장시스템 엔지니어',
    type: '신입',
    location: '경기도 의왕',
    deadline: '2026-07-10',
    url: 'https://example.com/jobs/6',
    keywords: ['방산', '전장시스템', '통신'],
    status: 'interested',
    description: '전차 전장시스템의 설계 및 통합 검증 업무를 담당합니다.'
  }
];

export const INDUSTRY_FILTERS = ['전체', '반도체', '방산'];
export const TYPE_FILTERS = ['전체', '신입', '경력'];
