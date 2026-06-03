export const JOB_INDUSTRIES = [
  {
    id: 'all',
    label: '전체',
    keywords: '',
  },
  {
    id: 'semiconductor',
    label: '반도체',
    keywords: '반도체 공정 설계 장비 HBM DRAM NAND 파운드리 OSAT 테스트 패키징',
  },
  {
    id: 'defense',
    label: '방위산업 / 항공우주',
    keywords: '방산 항공우주 레이더 유도무기 항공전자 위성 국방 임베디드',
  },
  {
    id: 'ai',
    label: '인공지능 / AI',
    keywords: '인공지능 AI 머신러닝 딥러닝 데이터 LLM 생성형AI 컴퓨터비전 NLP 자연어처리 데이터사이언스 MLOps',
  },
  {
    id: 'electronics',
    label: '전자 / 하드웨어',
    keywords: '전자회로 회로설계 PCB 하드웨어 전장 펌웨어 전력전자',
  },
  {
    id: 'mobility',
    label: '자동차 / 모빌리티',
    keywords: '자동차 전장 BMS 자율주행 전력변환 인버터 모터 제어',
  },
  {
    id: 'battery',
    label: '배터리 / 에너지',
    keywords: '배터리 이차전지 BMS 전력전자 ESS 충전기 에너지',
  },
  {
    id: 'communications',
    label: '통신 / RF',
    keywords: '통신 RF 안테나 5G 6G 무선통신 신호처리',
  },
  {
    id: 'robotics',
    label: '로봇 / 자동화',
    keywords: '로봇 자동화 제어 PLC 센서 모션 제어 스마트팩토리',
  },
  {
    id: 'embedded',
    label: '임베디드 / SW',
    keywords: '임베디드 펌웨어 C C++ RTOS MCU Linux 제어 소프트웨어',
  },
  {
    id: 'rnd',
    label: '연구개발 / R&D',
    keywords: '연구개발 R&D 전자공학 회로 알고리즘 신호처리 시스템',
  },
];

export const JOB_TYPES = [
  { id: 'all', label: '전체', keywords: '' },
  { id: 'intern', label: '인턴', keywords: '인턴 채용연계형 인턴십' },
  { id: 'newgrad', label: '신입', keywords: '신입 대졸신입 junior' },
  { id: 'entry', label: '신입/인턴', keywords: '신입 인턴 채용연계형' },
  { id: 'experienced', label: '경력', keywords: '경력' },
];

export const JOB_STATUS_OPTIONS = [
  { value: 'interested', label: '관심' },
  { value: 'saved', label: '저장' },
  { value: 'applied', label: '지원 예정' },
  { value: 'done', label: '지원 완료' },
  { value: 'rejected', label: '보류' },
];

export const getJobIndustry = (id) => JOB_INDUSTRIES.find((item) => item.id === id) || JOB_INDUSTRIES[0];
export const getJobType = (id) => JOB_TYPES.find((item) => item.id === id) || JOB_TYPES[0];

export const fetchJobs = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.industry) params.set('industry', filters.industry);
  if (filters.type) params.set('type', filters.type);
  if (filters.keyword) params.set('keyword', filters.keyword);

  const response = await fetch(`/api/jobs?${params.toString()}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || '실제 채용 공고를 불러오지 못했습니다.');
  }

  return {
    jobs: data.jobs || [],
    meta: data.meta || {},
  };
};
