export const getProcessIntelligence = () => {
  return [
    {
      id: 'data-collection',
      title: '데이터 수집',
      summary: '웹크롤링 및 공공 데이터 확보',
      impact: '데이터의 질과 양이 곧 모델의 지능 한계를 결정합니다. 고품질 데이터의 고갈(Data Wall)이 가장 큰 위협입니다.'
    },
    {
      id: 'data-cleaning',
      title: '데이터 정제 (Cleaning)',
      summary: '중복 제거, 비식별화, 필터링',
      impact: '유해 정보나 오류를 제거하여 모델의 독성(Toxicity)을 낮춥니다. Scale AI 같은 데이터 가공 전문 기업이 주도합니다.'
    },
    {
      id: 'tokenization',
      title: '토큰화 (Tokenization)',
      summary: '텍스트를 조각으로 분해',
      impact: '단어를 AI가 처리할 수 있는 숫자로 바꾸는 첫 관문입니다. 다국어 처리 능력(한글 등)의 효율을 좌우합니다.'
    },
    {
      id: 'pre-training',
      title: '사전 학습 (Pre-training)',
      summary: '거대 모델에 세상의 지식을 압축',
      impact: '가장 많은 시간, 전력, GPU(H100 등) 자본이 투입되는 단계입니다. 수천 억 개의 파라미터가 여기서 생성됩니다.'
    },
    {
      id: 'sft',
      title: '지도 학습 파인튜닝 (SFT)',
      summary: '질의응답 형태로 대화법 학습',
      impact: '사람처럼 자연스럽게 대답하는 형식을 익히는 단계로, 고품질의 전문가 답변 데이터셋이 필수적입니다.'
    },
    {
      id: 'rlhf',
      title: '정렬 학습 (RLHF / DPO)',
      summary: '인간의 가치관과 선호도 반영',
      impact: '모델이 위험한 답변을 피하고 인간에게 유용한 답변을 하도록 유도하는 AI 정렬(Alignment)의 핵심 단계입니다.'
    },
    {
      id: 'rag-build',
      title: 'RAG 인프라 구축',
      summary: '기업 내부 데이터를 연동',
      impact: '사전 학습된 모델이 모르는 최신 정보나 비공개 사내 문서를 벡터 DB에 넣어 환각을 차단하는 기업용 AI 필수 과정입니다.'
    },
    {
      id: 'inference-deploy',
      title: '추론 서버 배포',
      summary: '사용자 요청에 응답할 서비스 구축',
      impact: 'vLLM 등 추론 최적화 엔진을 통해 응답 지연 시간(Latency)을 줄이고 서버 호스팅 비용을 최소화해야 합니다.'
    },
    {
      id: 'model-optimization',
      title: '모델 최적화 및 경량화',
      summary: '양자화(Quantization), 가지치기',
      impact: '거대한 모델을 스마트폰(온디바이스 AI)이나 저사양 하드웨어에서도 돌아가게 압축하여 대중화를 이끕니다.'
    },
    {
      id: 'monitoring',
      title: '실시간 모니터링 (MLOps)',
      summary: '서비스 품질 유지보수',
      impact: '시간이 지남에 따라 모델 답변 품질이 떨어지는 현상(Drift)을 추적하고 재학습 주기를 결정합니다.'
    },
    {
      id: 'security-compliance',
      title: '보안 및 규제 대응',
      summary: '레드팀 훈련 및 PII 마스킹',
      impact: '프롬프트 인젝션 공격을 막고, 생성물의 저작권 침해를 방지하여 기업 리스크를 차단합니다.'
    }
  ];
};

export const getNewsImpactTags = () => {
  return [
    { id: 'gpu-demand', label: 'GPU 수요/공급', color: 'bg-rose-500/20 text-rose-300' },
    { id: 'new-model', label: '차세대 모델 출시', color: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'regulation', label: '글로벌 AI 규제', color: 'bg-amber-500/20 text-amber-300' },
    { id: 'enterprise-adoption', label: '엔터프라이즈 B2B', color: 'bg-blue-500/20 text-blue-300' },
    { id: 'ai-agent', label: 'AI 에이전트/자동화', color: 'bg-fuchsia-500/20 text-fuchsia-300' }
  ];
};

export const getSegmentPlaybook = () => {
  return [
    { title: 'AI 인프라/하드웨어', guide: 'AI 모델 학습을 위해서는 엔비디아의 GPU가 병목입니다. TSMC, HBM 제조사(SK하이닉스/삼성) 등 물리적 부품 생태계의 패권을 장악한 진영이 가장 확실한 수익을 냅니다.' },
    { title: '클라우드 & 파운데이션 모델', guide: '막대한 설비 투자(CAPEX)가 필요한 과점 시장입니다. 마이크로소프트-OpenAI 연합, 구글, 아마존, 메타 등 빅테크 간의 인프라와 자체 거대 모델 확보 경쟁이 치열합니다.' },
    { title: '데이터/MLOps & 애플리케이션', guide: '인프라 구축이 완료되면, 실제로 기업 내부 데이터를 정제하고(Databricks 등), B2B/B2C의 실생활 업무를 자동화하는 서비스(Palantir 등) 영역에서 폭발적인 부가가치가 창출됩니다.' }
  ];
};

export const getTechnologyProcessLinks = () => {
  return {
    llm: ['pre-training', 'inference-deploy'],
    gpu: ['pre-training', 'sft', 'inference-deploy'],
    rag: ['rag-build', 'inference-deploy'],
    rlhf: ['rlhf'],
    tokenization: ['tokenization']
  };
};
