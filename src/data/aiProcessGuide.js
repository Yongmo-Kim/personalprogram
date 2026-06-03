export const processPhases = [
  { id: 'data', title: '1. 데이터 파이프라인' },
  { id: 'train', title: '2. 사전 학습 (Pre-training)' },
  { id: 'tune', title: '3. 파인튜닝 및 정렬' },
  { id: 'deploy', title: '4. 배포 및 추론' },
  { id: 'operate', title: '5. 운영 및 보안' }
];

export const aiDevelopmentProcesses = [
  {
    phaseId: 'data',
    id: 'data-collection',
    name: '데이터 수집',
    description: '웹 크롤링, 오픈 데이터셋 다운로드, 라이선스 체결 등을 통해 원시 텍스트나 이미지를 확보하는 단계.',
    difficulty: 'beginner'
  },
  {
    phaseId: 'data',
    id: 'data-cleaning',
    name: '데이터 정제',
    description: '개인정보 비식별화, 중복 제거, 저품질 데이터 필터링을 통해 학습에 적합한 상태로 만드는 과정.',
    difficulty: 'intermediate'
  },
  {
    phaseId: 'data',
    id: 'tokenization',
    name: '토큰화 (Tokenization)',
    description: '문장을 AI가 이해할 수 있는 작은 조각(토큰)으로 분해하고 숫자로 변환하는 과정.',
    difficulty: 'intermediate'
  },
  {
    phaseId: 'train',
    id: 'pre-training',
    name: '사전 학습',
    description: 'GPU 클러스터를 이용해 수조 개의 토큰을 학습시켜 모델이 언어의 문법과 세상의 지식을 습득하게 하는 핵심 단계.',
    difficulty: 'advanced'
  },
  {
    phaseId: 'tune',
    id: 'sft',
    name: '지도 파인튜닝 (SFT)',
    description: '사람이 작성한 고품질 질의응답 예제를 학습시켜, 모델이 사용자의 질문에 대답하는 "대화형 AI"로 변모시키는 단계.',
    difficulty: 'intermediate'
  },
  {
    phaseId: 'tune',
    id: 'rlhf',
    name: '정렬 학습 (RLHF)',
    description: '인간의 피드백을 기반으로 한 강화학습으로 유해하거나 편향된 답변을 필터링하고 안전성을 확보.',
    difficulty: 'advanced'
  },
  {
    phaseId: 'tune',
    id: 'rag-build',
    name: 'RAG 인프라 구축',
    description: '거대 모델에 최신 정보나 기업의 내부 문서(지식 베이스)를 연결하여 정확한 답변을 유도.',
    difficulty: 'intermediate'
  },
  {
    phaseId: 'deploy',
    id: 'inference-deploy',
    name: '추론 서버 배포',
    description: '사용자의 요청을 실시간으로 처리할 수 있도록 모델을 클라우드나 엣지 기기에 최적화하여 배포.',
    difficulty: 'intermediate'
  },
  {
    phaseId: 'deploy',
    id: 'model-optimization',
    name: '모델 최적화 (양자화)',
    description: '모델의 파라미터 정밀도를 낮춰(예: 8비트) 성능 저하를 최소화하면서 메모리 사용량과 속도를 개선.',
    difficulty: 'advanced'
  },
  {
    phaseId: 'operate',
    id: 'monitoring',
    name: '성능 모니터링',
    description: '배포된 모델의 응답 지연 시간, 자원 사용량, 답변의 품질 변화(Drift)를 실시간으로 추적.',
    difficulty: 'intermediate'
  },
  {
    phaseId: 'operate',
    id: 'security-gov',
    name: '보안/규제 대응',
    description: '프롬프트 인젝션 공격 방어, PII(개인식별정보) 필터링, 주요 국가의 AI 법적 규제 준수.',
    difficulty: 'advanced'
  }
];
