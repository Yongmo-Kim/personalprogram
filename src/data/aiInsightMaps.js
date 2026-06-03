export const valueChainStages = [
  {
    id: 'mlops-data',
    label: '1. 데이터 파이프라인 (Data)',
    headline: 'AI 학습의 원재료 수집 및 정제',
    description: '고품질의 학습 데이터를 확보, 정제, 라벨링하고 저장소(레이크하우스)를 구축하는 단계입니다.',
    companyIds: ['databricks', 'snowflake', 'scale-ai', 'selectstar', 'crowdworks'],
    techIds: ['data-pipeline', 'data-lakehouse', 'synthetic-data'],
    watchPoints: ['고품질 데이터 고갈 이슈', '저작권 및 개인정보 이슈', '합성 데이터의 발전속도'],
  },
  {
    id: 'hardware',
    label: '2. 컴퓨팅 인프라 (Computing)',
    headline: 'AI 모델 학습과 추론을 위한 거대한 연산력',
    description: '방대한 데이터를 처리할 수 있는 GPU/TPU 등의 가속기와 이를 뒷받침하는 메모리, 데이터센터 인프라입니다.',
    companyIds: ['nvidia', 'amd', 'broadcom', 'tsmc', 'samsung', 'sk-hynix', 'rebellions', 'furiosa'],
    techIds: ['gpu', 'tpu', 'npu', 'hbm', 'nvlink', 'advanced-packaging'],
    watchPoints: ['H100/B200 등 핵심 칩 공급망', '전력 효율성 및 발열 관리', '맞춤형 AI 반도체(ASIC) 부상'],
  },
  {
    id: 'foundation-models',
    label: '3. 모델 개발 (Foundation Models)',
    headline: '거대한 지능을 가진 범용 AI 모델 훈련',
    description: '수십조 개의 파라미터를 가진 초거대 언어 모델(LLM)과 멀티모달 모델을 막대한 비용을 들여 사전 학습(Pre-training)합니다.',
    companyIds: ['openai', 'anthropic', 'alphabet', 'meta', 'xai', 'mistral', 'naver', 'lg-ai'],
    techIds: ['llm', 'transformer', 'moe', 'diffusion', 'multimodal'],
    watchPoints: ['모델 성능 벤치마크 (AGI 근접성)', '오픈소스 진영(Meta 등) vs 폐쇄형 진영의 경쟁', '학습 비용 증가율'],
  },
  {
    id: 'cloud-bigtech',
    label: '4. 플랫폼 & API (Platform/API)',
    headline: 'AI 모델을 서비스로 배포하고 접근성을 제공',
    description: '개발자와 기업이 자체 인프라 없이도 클라우드를 통해 최고 수준의 AI 모델을 호출(API)하여 사용할 수 있게 합니다.',
    companyIds: ['microsoft', 'amazon', 'alphabet', 'oracle', 'huggingface'],
    techIds: ['gpu-orchestration', 'api-gateway', 'model-registry'],
    watchPoints: ['클라우드 인프라(CAPEX) 투자 경쟁', '빅테크 생태계 종속 심화', '추론 비용(Inference Cost) 인하 경쟁'],
  },
  {
    id: 'applications',
    label: '5. 애플리케이션 (Applications)',
    headline: '최종 사용자와 기업의 문제를 해결하는 AI 서비스',
    description: 'B2B/B2C 영역에서 생산성을 혁신하는 코파일럿, 검색 엔진, 생성형 AI 도구와 로보틱스, 자율주행 등 실생활 응용 분야입니다.',
    companyIds: ['palantir', 'salesforce', 'perplexity', 'github', 'tesla', 'upstage', 'wrtn'],
    techIds: ['rag', 'ai-agent', 'copilot', 'autonomous-driving', 'ai-vision'],
    watchPoints: ['실제 수익 창출(Monetization) 여부', '기존 소프트웨어(SaaS) 시장 대체율', '환각 완화 및 신뢰성 확보'],
  },
  {
    id: 'security-gov',
    label: '6. 운영 및 보안 (Operation & Security)',
    headline: '안전하고 지속 가능한 AI 활용 체계 구축',
    description: '개발된 모델의 환각을 교정하고, 성능을 모니터링하며(MLOps), 프롬프트 인젝션 등 보안 위협과 윤리 규제에 대응하는 단계입니다.',
    companyIds: ['crowdstrike', 'palo-alto', 'weights-biases', 's2w', 'ibm'],
    techIds: ['ai-security', 'mlops', 'model-monitoring', 'ai-governance', 'explainable-ai'],
    watchPoints: ['환각(Hallucination) 관리', '글로벌 AI 규제(EU AI Act 등)', '기업 데이터 유출 방지'],
  }
];

export const technologyRoadmaps = [
  {
    id: 'llm-roadmap',
    title: '생성형 AI (언어/멀티모달) 진화 로드맵',
    summary: '단순 텍스트 생성을 넘어 이미지를 이해하고 자율적으로 행동하는 인공일반지능(AGI)으로 진화 중입니다.',
    color: 'emerald',
    steps: [
      { label: '텍스트 LLM', techId: 'llm', stage: '지식 기반', note: '초거대 파라미터를 통한 자연어 이해 및 생성 혁신' },
      { label: '검색 증강 (RAG)', techId: 'rag', stage: '신뢰성 확보', note: '외부 데이터를 실시간 참조하여 환각 현상 극복' },
      { label: '멀티모달 AI', techId: 'multimodal', stage: '감각 확장', note: '텍스트뿐만 아니라 이미지, 영상, 오디오를 통합 이해' },
      { label: '자율형 AI 에이전트', techId: 'ai-agent', stage: '행동 주체', note: '스스로 목표를 설정하고 도구를 사용하여 작업 수행' },
      { label: '인공일반지능 (AGI)', techId: 'llm', stage: '인간 능가', note: '대부분의 경제적 작업에서 인간 전문가를 뛰어넘는 지능' },
    ],
  },
  {
    id: 'hardware-roadmap',
    title: 'AI 컴퓨팅 인프라 진화 로드맵',
    summary: '모델이 커짐에 따라 단일 칩의 성능을 넘어, 패키징과 연결(Interconnect) 기술이 핵심 경쟁력이 되었습니다.',
    color: 'blue',
    steps: [
      { label: 'GPU 병렬 처리', techId: 'gpu', stage: '가속 시작', note: '수천 개의 코어로 행렬 연산 극대화' },
      { label: 'HBM 탑재', techId: 'hbm', stage: '메모리 장벽 돌파', note: '초고대역폭 메모리로 데이터 병목 해소' },
      { label: '첨단 패키징 (CoWoS)', techId: 'advanced-packaging', stage: '이종 집적', note: '가속기와 메모리를 하나의 기판에 초고밀도 포장' },
      { label: '칩 간 초고속 연결', techId: 'nvlink', stage: '스케일 아웃', note: '수만 개의 GPU를 하나의 거대 두뇌처럼 연결 (NVLink 등)' },
      { label: '맞춤형 AI 반도체 (NPU)', techId: 'npu', stage: '추론 최적화', note: '비용과 전력 소모를 극단적으로 줄인 엣지/특화 가속기' },
    ],
  }
];

export const comparePresets = [
  { label: 'OpenAI vs Anthropic', left: 'openai', right: 'anthropic' },
  { label: 'NVIDIA vs AMD', left: 'nvidia', right: 'amd' },
  { label: 'Microsoft vs Alphabet', left: 'microsoft', right: 'alphabet' },
  { label: 'Databricks vs Snowflake', left: 'databricks', right: 'snowflake' },
  { label: 'Palantir vs Salesforce', left: 'palantir', right: 'salesforce' },
  { label: 'Samsung vs SK hynix', left: 'samsung', right: 'sk-hynix' }
];
