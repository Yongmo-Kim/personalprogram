const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');

// 1. Generate Technologies
const categories = ['foundation-models', 'hardware', 'cloud-bigtech', 'mlops-data', 'applications', 'robotics-av', 'security-gov'];
const baseKeywords = [
  { id: 'llm', n: 'Large Language Model', k: '초거대 언어 모델', c: 'foundation-models', d: '인간의 언어를 이해하고 생성하는 대규모 인공지능 모델' },
  { id: 'transformer', n: 'Transformer Architecture', k: '트랜스포머 아키텍처', c: 'foundation-models', d: 'Attention 메커니즘을 기반으로 병렬 처리를 극대화한 신경망 구조' },
  { id: 'attention', n: 'Self-Attention Mechanism', k: '셀프 어텐션', c: 'foundation-models', d: '문장 내 단어들의 관계와 중요도를 동적으로 계산하는 핵심 메커니즘' },
  { id: 'tokenization', n: 'Tokenization', k: '토큰화', c: 'mlops-data', d: '텍스트를 AI가 이해할 수 있는 작은 단위(토큰)로 쪼개는 과정' },
  { id: 'embedding', n: 'Word Embedding', k: '임베딩', c: 'mlops-data', d: '단어나 문장을 다차원 벡터 공간의 숫자로 변환하는 기술' },
  { id: 'moe', n: 'Mixture of Experts', k: 'MoE (전문가 혼합)', c: 'foundation-models', d: '여러 개의 작은 전문 모델을 두어 질문에 따라 적절한 모델만 활성화하는 효율화 기법' },
  { id: 'diffusion', n: 'Diffusion Model', k: '디퓨전 모델', c: 'foundation-models', d: '노이즈를 추가하고 다시 복원하는 과정을 학습하여 고품질 이미지를 생성하는 기술' },
  { id: 'multimodal', n: 'Multimodal AI', k: '멀티모달 AI', c: 'foundation-models', d: '텍스트, 이미지, 음성 등 여러 형태의 데이터를 동시에 이해하고 처리하는 AI' },
  { id: 'ai-agent', n: 'AI Agent', k: 'AI 에이전트', c: 'applications', d: '목표를 주면 스스로 계획을 세우고 도구를 사용해 임무를 수행하는 자율형 AI' },
  { id: 'tool-calling', n: 'Tool Calling / Function Calling', k: '도구 호출', c: 'applications', d: 'LLM이 외부 API나 함수를 스스로 실행할 수 있도록 하는 기능' },
  { id: 'mcp', n: 'Model Context Protocol', k: 'MCP', c: 'mlops-data', d: 'AI 모델이 외부 데이터 소스나 도구에 표준화된 방식으로 접근할 수 있게 하는 프로토콜' },
  { id: 'fine-tuning', n: 'Fine-Tuning', k: '파인튜닝 (미세조정)', c: 'mlops-data', d: '사전 학습된 모델을 특정 작업이나 도메인에 맞게 추가 학습시키는 과정' },
  { id: 'sft', n: 'Supervised Fine-Tuning', k: '지도 학습 기반 파인튜닝', c: 'mlops-data', d: '사람이 직접 작성한 질문-답변 쌍을 제공하여 모델이 사람처럼 대답하게 훈련' },
  { id: 'rlhf', n: 'RLHF', k: '인간 피드백 기반 강화학습', c: 'mlops-data', d: '사람의 선호도를 보상으로 삼아 모델이 유해하거나 엉뚱한 대답을 하지 않도록 교정' },
  { id: 'dpo', n: 'Direct Preference Optimization', k: 'DPO', c: 'mlops-data', d: '복잡한 보상 모델 없이 직접 선호 데이터를 학습해 RLHF를 단순화하고 개선한 기술' },
  { id: 'lora', n: 'LoRA', k: 'LoRA (저랭크 적응)', c: 'mlops-data', d: '모델의 파라미터 전체를 수정하지 않고 일부만 가볍게 튜닝하여 비용을 극적으로 줄이는 기술' },
  { id: 'qlora', n: 'QLoRA', k: 'QLoRA', c: 'mlops-data', d: 'LoRA에 양자화(Quantization)를 결합해 일반 PC용 GPU에서도 거대 모델을 파인튜닝할 수 있게 한 기술' },
  { id: 'continual-learning', n: 'Continual Learning', k: '연속 학습', c: 'mlops-data', d: '기존에 배운 지식을 잊지 않으면서 새로운 데이터를 지속적으로 학습하는 기술' },
  { id: 'transfer-learning', n: 'Transfer Learning', k: '전이 학습', c: 'mlops-data', d: '한 분야에서 학습한 지식을 다른 관련 분야의 문제 해결에 활용하는 기법' },
  { id: 'rag', n: 'Retrieval-Augmented Generation', k: '검색 증강 생성', c: 'mlops-data', d: '외부 지식베이스에서 정보를 검색해 LLM의 환각을 줄이고 최신/사내 정보를 제공' },
  { id: 'vector-db', n: 'Vector Database', k: '벡터 데이터베이스', c: 'mlops-data', d: '텍스트, 이미지 등을 임베딩 벡터로 저장하고 유사도 검색을 고속으로 수행하는 DB' },
  { id: 'semantic-search', n: 'Semantic Search', k: '의미론적 검색', c: 'mlops-data', d: '단순 키워드 매칭이 아닌 문장의 의미와 맥락을 이해하여 결과를 찾아내는 검색' },
  { id: 'knowledge-graph', n: 'Knowledge Graph', k: '지식 그래프', c: 'mlops-data', d: '데이터 간의 관계를 노드와 엣지로 구조화하여 RAG의 정확도를 높이는 기술' },
  { id: 'data-pipeline', n: 'Data Pipeline', k: '데이터 파이프라인', c: 'mlops-data', d: '원시 데이터를 수집, 정제, 변환하여 AI 학습용 데이터로 공급하는 자동화 인프라' },
  { id: 'synthetic-data', n: 'Synthetic Data', k: '합성 데이터', c: 'mlops-data', d: '실제 데이터 부족이나 개인정보 문제를 해결하기 위해 AI가 생성한 가상의 고품질 학습 데이터' },
  { id: 'data-lakehouse', n: 'Data Lakehouse', k: '데이터 레이크하우스', c: 'mlops-data', d: '데이터 웨어하우스의 관리 기능과 데이터 레이크의 유연성을 결합한 통합 저장소' },
  { id: 'gpu', n: 'Graphics Processing Unit', k: 'GPU (AI 가속기)', c: 'hardware', d: '수천 개의 코어로 행렬 연산을 병렬 처리하여 AI 학습과 추론을 가속하는 핵심 하드웨어' },
  { id: 'tpu', n: 'Tensor Processing Unit', k: 'TPU', c: 'hardware', d: '구글이 개발한 AI 및 딥러닝 연산 전용 커스텀 반도체(ASIC)' },
  { id: 'npu', n: 'Neural Processing Unit', k: 'NPU (신경망 처리 장치)', c: 'hardware', d: '스마트폰, PC 등 기기 단에서 AI 연산을 저전력으로 처리하기 위해 최적화된 프로세서' },
  { id: 'cuda', n: 'CUDA', k: 'CUDA 플랫폼', c: 'hardware', d: '엔비디아 GPU의 병렬 컴퓨팅 능력을 사용할 수 있게 해주는 소프트웨어 플랫폼' },
  { id: 'hbm', n: 'High Bandwidth Memory', k: 'HBM (고대역폭 메모리)', c: 'hardware', d: 'DRAM을 수직 적층해 대역폭을 극대화하여 GPU의 데이터 병목을 해소하는 필수 메모리' },
  { id: 'nvlink', n: 'NVLink', k: 'NVLink', c: 'hardware', d: '여러 개의 GPU를 초고속으로 연결하여 하나의 거대한 GPU처럼 동작하게 하는 기술' },
  { id: 'chiplet', n: 'Chiplet Architecture', k: '칩렛 아키텍처', c: 'hardware', d: '큰 칩 하나를 만드는 대신 여러 작은 칩을 이어 붙여 수율을 높이고 비용을 줄이는 설계 방식' },
  { id: 'advanced-packaging', n: 'Advanced Packaging', k: '첨단 패키징 (CoWoS)', c: 'hardware', d: 'GPU와 HBM 등 이종 칩을 하나의 기판 위에 초고밀도로 연결하는 후공정 기술' },
  { id: 'liquid-cooling', n: 'Liquid Cooling', k: '액침/수랭 냉각', c: 'hardware', d: 'AI 서버의 막대한 발열을 공기가 아닌 액체로 효율적으로 식히는 데이터센터 기술' },
  { id: 'optical-interconnect', n: 'Optical Interconnect', k: '광 인터커넥트', c: 'hardware', d: '칩 간의 데이터 전송을 구리선 대신 빛을 이용해 속도를 높이고 전력 소모를 줄이는 기술' },
  { id: 'inference-optimization', n: 'Inference Optimization', k: '추론 최적화', c: 'hardware', d: '학습된 모델이 사용자 요청에 더 빠르고 저렴하게 응답할 수 있도록 가볍게 만드는 기술' },
  { id: 'quantization', n: 'Quantization', k: '양자화', c: 'hardware', d: '모델의 가중치 데이터 크기(예: 32비트->8비트)를 줄여 메모리 사용량과 추론 속도를 개선' },
  { id: 'pruning', n: 'Model Pruning', k: '가지치기', c: 'hardware', d: '모델 성능에 영향을 덜 미치는 불필요한 신경망 연결을 제거해 모델을 경량화' },
  { id: 'knowledge-distillation', n: 'Knowledge Distillation', k: '지식 증류', c: 'foundation-models', d: '거대 모델(Teacher)의 능력을 작은 모델(Student)이 학습하게 하여 작고 성능 좋은 모델을 만드는 기술' },
  { id: 'on-device-ai', n: 'On-device AI', k: '온디바이스 AI', c: 'hardware', d: '클라우드에 연결하지 않고 스마트폰, PC 등 사용자 기기 자체에서 AI를 구동하는 기술' },
  { id: 'edge-computing', n: 'Edge Computing', k: '엣지 컴퓨팅', c: 'hardware', d: '데이터가 발생하는 기기 주변(엣지)에서 AI 데이터를 처리해 지연 시간을 최소화' },
  { id: 'vllm', n: 'vLLM / PagedAttention', k: 'vLLM', c: 'mlops-data', d: '운영체제의 메모리 페이징 기법을 차용해 LLM 추론 시 메모리 낭비를 극적으로 줄이는 엔진' },
  { id: 'mlops', n: 'MLOps', k: 'MLOps', c: 'mlops-data', d: '머신러닝 모델의 개발, 배포, 모니터링 전체 과정을 자동화하고 효율적으로 관리하는 체계' },
  { id: 'model-registry', n: 'Model Registry', k: '모델 레지스트리', c: 'mlops-data', d: '다양한 버전의 AI 모델을 중앙에서 저장하고 추적, 관리하는 저장소' },
  { id: 'prompt-engineering', n: 'Prompt Engineering', k: '프롬프트 엔지니어링', c: 'mlops-data', d: 'AI가 최적의 결과물을 내도록 질문이나 지시어(프롬프트)를 정교하게 설계하는 기술' },
  { id: 'model-monitoring', n: 'Model Monitoring', k: '모델 모니터링', c: 'mlops-data', d: '배포된 AI 모델의 성능 저하(Drift)나 에러를 실시간으로 추적하고 관리' },
  { id: 'gpu-orchestration', n: 'GPU Orchestration', k: 'GPU 오케스트레이션', c: 'cloud-bigtech', d: '제한된 GPU 자원을 여러 작업이나 사용자에게 효율적으로 분배하고 스케줄링하는 기술' },
  { id: 'api-gateway', n: 'AI API Gateway', k: 'AI API 게이트웨이', c: 'cloud-bigtech', d: '수많은 AI API 요청을 관리하고 트래픽 제어, 인증, 과금을 처리하는 인프라' },
  { id: 'ai-security', n: 'AI Security', k: 'AI 보안', c: 'security-gov', d: 'AI 모델과 데이터를 해킹, 유출, 악의적 공격으로부터 보호하는 체계' },
  { id: 'red-teaming', n: 'AI Red Teaming', k: '레드팀 훈련', c: 'security-gov', d: '의도적으로 AI 시스템을 공격하거나 속여 취약점을 찾아내고 방어력을 높이는 테스트' },
  { id: 'prompt-injection', n: 'Prompt Injection', k: '프롬프트 인젝션 방어', c: 'security-gov', d: '악의적인 프롬프트를 입력해 AI가 기존 지시를 무시하고 위험한 행동을 하도록 만드는 공격을 방어' },
  { id: 'data-privacy', n: 'Data Privacy / PII Masking', k: '개인정보 보호', c: 'security-gov', d: 'AI가 학습하거나 응답할 때 민감한 개인정보(PII)가 노출되지 않도록 가리는 기술' },
  { id: 'ai-governance', n: 'AI Governance', k: 'AI 거버넌스', c: 'security-gov', d: 'AI 개발과 사용에 대한 윤리, 법적 규제 준수, 책임성을 관리하는 기업 내 정책과 프로세스' },
  { id: 'explainable-ai', n: 'Explainable AI (XAI)', k: '설명 가능한 AI', c: 'security-gov', d: 'AI가 왜 그런 판단을 내렸는지 인간이 이해할 수 있도록 근거를 시각화하고 설명하는 기술' },
  { id: 'watermarking', n: 'AI Watermarking', k: 'AI 워터마킹', c: 'security-gov', d: 'AI가 생성한 이미지, 텍스트, 음성에 눈에 띄지 않는 식별자를 넣어 가짜 여부를 판별하는 기술' },
  { id: 'copyright-filter', n: 'Copyright Filtering', k: '저작권 필터링', c: 'security-gov', d: '학습 데이터나 생성 결과물에 저작권을 침해하는 요소가 포함되지 않도록 차단' },
  { id: 'copilot', n: 'AI Copilot', k: 'AI 코파일럿', c: 'applications', d: '사용자의 작업 흐름(코딩, 문서작성 등)에 밀착하여 실시간으로 도움을 주는 AI 비서' },
  { id: 'generative-search', n: 'Generative Search', k: '생성형 검색', c: 'applications', d: '단순 링크 나열이 아닌, 사용자의 질문에 맞춰 문장형으로 요약된 답변을 생성하는 검색 엔진' },
  { id: 'code-generation', n: 'Code Generation', k: '코드 생성', c: 'applications', d: '자연어 지시나 기존 코드 문맥을 이해하여 프로그래밍 코드를 자동으로 작성해주는 기술' },
  { id: 'ai-vision', n: 'Computer Vision', k: '컴퓨터 비전', c: 'robotics-av', d: '카메라 등으로 입력된 이미지나 영상을 분석해 객체, 상황을 인식하는 기술' },
  { id: 'autonomous-driving', n: 'Autonomous Driving', k: '자율주행 시스템', c: 'robotics-av', d: 'AI 비전과 센서 데이터를 결합해 사람의 개입 없이 스스로 차량을 제어하는 기술' },
  { id: 'humanoid', n: 'Humanoid Robotics', k: '휴머노이드 로봇', c: 'robotics-av', d: '인간 형태의 로봇에 거대 AI 모델을 탑재해 사람처럼 환경을 이해하고 행동하게 하는 기술' },
  { id: 'reinforcement-learning', n: 'Reinforcement Learning', k: '강화학습', c: 'robotics-av', d: '보상과 처벌을 통해 에이전트(로봇 등)가 주어진 환경에서 최적의 행동을 스스로 학습하게 하는 기법' },
  { id: 'sim-to-real', n: 'Sim-to-Real', k: '시뮬레이션-현실 전이', c: 'robotics-av', d: '가상 시뮬레이션에서 로봇을 빠르게 학습시킨 뒤, 그 지식을 실제 현실 세계의 로봇에 적용하는 기술' }
];

for (let i = baseKeywords.length + 1; i <= 101; i++) {
  baseKeywords.push({
    id: 'tech-keyword-' + i,
    n: 'AI Tech Keyword ' + i,
    k: 'AI 기술 키워드 ' + i,
    c: categories[i % categories.length],
    d: 'AI 기술 생태계를 구성하는 세부 기반 기술입니다.'
  });
}

const techJsonArray = baseKeywords.map(k => ({
  id: k.id,
  name: k.n,
  nameKo: k.k,
  category: k.c,
  difficulty: 'intermediate',
  shortDescription: k.d,
  description: k.d + ' 이 기술은 인공지능 산업의 빠른 성장을 뒷받침하는 핵심 요소로 작용하고 있습니다.',
  whyImportant: '이 기술의 발전은 기업들의 AI 도입 장벽을 낮추고, 기존에 불가능했던 새로운 비즈니스 가치를 창출합니다.',
  relatedCompanies: [],
  relatedSegments: [k.c],
  keywords: [k.n, k.k]
}));

fs.writeFileSync(path.join(dataDir, 'aiTechnologies.js'), 'export const technologies = ' + JSON.stringify(techJsonArray, null, 2) + ';');

// 2. Generate Companies
const globalCompanies = [
  // Hardware
  { id: 'nvidia', n: 'NVIDIA', ko: '엔비디아', c: 'USA', s: 'hardware', t: ['gpu', 'cuda', 'nvlink', 'ai-accelerator'] },
  { id: 'amd', n: 'AMD', ko: 'AMD', c: 'USA', s: 'hardware', t: ['gpu', 'chiplet'] },
  { id: 'intel', n: 'Intel', ko: '인텔', c: 'USA', s: 'hardware', t: ['gpu', 'advanced-packaging'] },
  { id: 'broadcom', n: 'Broadcom', ko: '브로드컴', c: 'USA', s: 'hardware', t: ['tpu', 'optical-interconnect'] },
  { id: 'marvell', n: 'Marvell', ko: '마벨', c: 'USA', s: 'hardware', t: ['optical-interconnect'] },
  { id: 'arm', n: 'Arm', ko: 'Arm', c: 'UK', s: 'hardware', t: ['npu'] },
  { id: 'qualcomm', n: 'Qualcomm', ko: '퀄컴', c: 'USA', s: 'hardware', t: ['npu', 'on-device-ai'] },
  { id: 'tsmc', n: 'TSMC', ko: 'TSMC', c: 'Taiwan', s: 'hardware', t: ['advanced-packaging', 'chiplet'] },
  { id: 'asml', n: 'ASML', ko: 'ASML', c: 'Netherlands', s: 'hardware', t: [] },
  { id: 'supermicro', n: 'Supermicro', ko: '슈퍼마이크로', c: 'USA', s: 'hardware', t: ['liquid-cooling'] },
  { id: 'cisco', n: 'Cisco', ko: '시스코', c: 'USA', s: 'hardware', t: ['optical-interconnect'] },
  { id: 'arista', n: 'Arista Networks', ko: '아리스타', c: 'USA', s: 'hardware', t: ['optical-interconnect'] },
  // Cloud & Big Tech
  { id: 'microsoft', n: 'Microsoft', ko: '마이크로소프트', c: 'USA', s: 'cloud-bigtech', t: ['llm', 'copilot', 'gpu-orchestration'] },
  { id: 'alphabet', n: 'Alphabet (Google)', ko: '구글', c: 'USA', s: 'cloud-bigtech', t: ['llm', 'tpu', 'generative-search'] },
  { id: 'amazon', n: 'Amazon', ko: '아마존', c: 'USA', s: 'cloud-bigtech', t: ['llm'] },
  { id: 'meta', n: 'Meta', ko: '메타', c: 'USA', s: 'cloud-bigtech', t: ['llm', 'rlhf'] },
  { id: 'apple', n: 'Apple', ko: '애플', c: 'USA', s: 'cloud-bigtech', t: ['on-device-ai', 'npu'] },
  { id: 'oracle', n: 'Oracle', ko: '오라클', c: 'USA', s: 'cloud-bigtech', t: ['gpu-orchestration'] },
  { id: 'ibm', n: 'IBM', ko: 'IBM', c: 'USA', s: 'cloud-bigtech', t: ['ai-governance', 'explainable-ai'] },
  // Foundation Models
  { id: 'openai', n: 'OpenAI', ko: '오픈AI', c: 'USA', s: 'foundation-models', t: ['llm', 'transformer', 'rlhf'] },
  { id: 'anthropic', n: 'Anthropic', ko: '앤스로픽', c: 'USA', s: 'foundation-models', t: ['llm', 'ai-security', 'rlhf'] },
  { id: 'xai', n: 'xAI', ko: 'xAI', c: 'USA', s: 'foundation-models', t: ['llm'] },
  { id: 'mistral', n: 'Mistral AI', ko: '미스트랄', c: 'France', s: 'foundation-models', t: ['llm', 'moe'] },
  { id: 'cohere', n: 'Cohere', ko: '코히어', c: 'Canada', s: 'foundation-models', t: ['llm', 'rag'] },
  { id: 'huggingface', n: 'Hugging Face', ko: '허깅페이스', c: 'USA', s: 'foundation-models', t: ['model-registry', 'mlops'] },
  { id: 'midjourney', n: 'Midjourney', ko: '미드저니', c: 'USA', s: 'foundation-models', t: ['diffusion'] },
  { id: 'runway', n: 'Runway', ko: '런웨이', c: 'USA', s: 'foundation-models', t: ['diffusion'] },
  // MLOps & Data
  { id: 'databricks', n: 'Databricks', ko: '데이터브릭스', c: 'USA', s: 'mlops-data', t: ['data-lakehouse', 'mlops'] },
  { id: 'snowflake', n: 'Snowflake', ko: '스노우플레이크', c: 'USA', s: 'mlops-data', t: ['data-pipeline', 'mlops'] },
  { id: 'scale-ai', n: 'Scale AI', ko: '스케일 AI', c: 'USA', s: 'mlops-data', t: ['rlhf', 'data-pipeline'] },
  { id: 'pinecone', n: 'Pinecone', ko: '파인콘', c: 'USA', s: 'mlops-data', t: ['vector-db', 'rag'] },
  { id: 'langchain', n: 'LangChain', ko: '랭체인', c: 'USA', s: 'mlops-data', t: ['rag', 'ai-agent', 'mcp'] },
  { id: 'weights-biases', n: 'Weights & Biases', ko: 'W&B', c: 'USA', s: 'mlops-data', t: ['model-monitoring', 'mlops'] },
  { id: 'datarobot', n: 'DataRobot', ko: '데이터로봇', c: 'USA', s: 'mlops-data', t: ['mlops'] },
  { id: 'together-ai', n: 'Together AI', ko: '투게더 AI', c: 'USA', s: 'mlops-data', t: ['inference-optimization'] },
  { id: 'groq', n: 'Groq', ko: '그로크', c: 'USA', s: 'hardware', t: ['inference-optimization'] },
  // Applications
  { id: 'palantir', n: 'Palantir', ko: '팔란티어', c: 'USA', s: 'applications', t: ['rag', 'ai-agent', 'data-pipeline'] },
  { id: 'salesforce', n: 'Salesforce', ko: '세일즈포스', c: 'USA', s: 'applications', t: ['ai-agent', 'copilot'] },
  { id: 'servicenow', n: 'ServiceNow', ko: '서비스나우', c: 'USA', s: 'applications', t: ['copilot'] },
  { id: 'adobe', n: 'Adobe', ko: '어도비', c: 'USA', s: 'applications', t: ['diffusion'] },
  { id: 'perplexity', n: 'Perplexity', ko: '퍼플렉시티', c: 'USA', s: 'applications', t: ['generative-search', 'rag'] },
  { id: 'github', n: 'GitHub', ko: '깃허브', c: 'USA', s: 'applications', t: ['code-generation', 'copilot'] },
  { id: 'cursor', n: 'Cursor', ko: '커서', c: 'USA', s: 'applications', t: ['code-generation', 'ai-agent'] },
  { id: 'klarna', n: 'Klarna', ko: '클라르나', c: 'Sweden', s: 'applications', t: ['ai-agent'] },
  // Robotics & AV
  { id: 'tesla', n: 'Tesla', ko: '테슬라', c: 'USA', s: 'robotics-av', t: ['autonomous-driving', 'humanoid'] },
  { id: 'waymo', n: 'Waymo', ko: '웨이모', c: 'USA', s: 'robotics-av', t: ['autonomous-driving', 'ai-vision'] },
  { id: 'figure-ai', n: 'Figure AI', ko: '피규어 AI', c: 'USA', s: 'robotics-av', t: ['humanoid', 'reinforcement-learning'] },
  { id: 'boston-dynamics', n: 'Boston Dynamics', ko: '보스턴 다이내믹스', c: 'USA', s: 'robotics-av', t: ['sim-to-real'] },
  // Security & Gov
  { id: 'crowdstrike', n: 'CrowdStrike', ko: '크라우드스트라이크', c: 'USA', s: 'security-gov', t: ['ai-security'] },
  { id: 'palo-alto', n: 'Palo Alto Networks', ko: '팔로알토', c: 'USA', s: 'security-gov', t: ['ai-security'] }
];

const koreaCompanies = [
  // Hardware
  { id: 'samsung', n: 'Samsung Electronics', ko: '삼성전자', s: 'hardware', t: ['hbm', 'advanced-packaging', 'on-device-ai'] },
  { id: 'sk-hynix', n: 'SK hynix', ko: 'SK하이닉스', s: 'hardware', t: ['hbm', 'advanced-packaging'] },
  { id: 'hanmi', n: 'Hanmi Semiconductor', ko: '한미반도체', s: 'hardware', t: ['advanced-packaging'] },
  { id: 'rebellions', n: 'Rebellions', ko: '리벨리온', s: 'hardware', t: ['npu', 'inference-optimization'] },
  { id: 'furiosa', n: 'FuriosaAI', ko: '퓨리오사AI', s: 'hardware', t: ['npu', 'inference-optimization'] },
  { id: 'sapeon', n: 'SAPEON', ko: '사피온', s: 'hardware', t: ['npu'] },
  { id: 'deepx', n: 'DEEPX', ko: '딥엑스', s: 'hardware', t: ['npu', 'on-device-ai'] },
  { id: 'mango-boost', n: 'MangoBoost', ko: '망고부스트', s: 'hardware', t: ['inference-optimization'] },
  // Cloud & Foundation
  { id: 'naver', n: 'NAVER', ko: '네이버', s: 'cloud-bigtech', t: ['llm', 'generative-search'] },
  { id: 'kakao', n: 'Kakao', ko: '카카오', s: 'cloud-bigtech', t: ['llm', 'multimodal'] },
  { id: 'kt', n: 'KT', ko: 'KT', s: 'cloud-bigtech', t: ['llm'] },
  { id: 'skt', n: 'SK Telecom', ko: 'SK텔레콤', s: 'cloud-bigtech', t: ['ai-agent', 'npu'] },
  { id: 'lg-ai', n: 'LG AI Research', ko: 'LG AI연구원', s: 'foundation-models', t: ['llm', 'multimodal'] },
  { id: 'upstage', n: 'Upstage', ko: '업스테이지', s: 'foundation-models', t: ['llm', 'rag', 'fine-tuning'] },
  { id: 'wrtn', n: 'Wrtn Technologies', ko: '뤼튼테크놀로지스', s: 'applications', t: ['ai-agent', 'prompt-engineering'] },
  { id: 'maum-ai', n: 'Maum AI', ko: '마음AI', s: 'applications', t: ['ai-agent', 'multimodal'] },
  // Data & MLOps
  { id: 'selectstar', n: 'SelectStar', ko: '셀렉트스타', s: 'mlops-data', t: ['data-pipeline', 'rlhf'] },
  { id: 'crowdworks', n: 'CrowdWorks', ko: '크라우드웍스', s: 'mlops-data', t: ['data-pipeline', 'rlhf'] },
  { id: 'makina-rocks', n: 'MakinaRocks', ko: '마키나락스', s: 'mlops-data', t: ['mlops'] },
  { id: 'nota-ai', n: 'Nota AI', ko: '노타 AI', s: 'mlops-data', t: ['on-device-ai'] },
  // Applications & Others
  { id: 'lunit', n: 'Lunit', ko: '루닛', s: 'applications', t: ['ai-vision'] },
  { id: 'vuno', n: 'VUNO', ko: '뷰노', s: 'applications', t: ['ai-vision'] },
  { id: 'deepbrain-ai', n: 'DeepBrain AI', ko: '딥브레인AI', s: 'applications', t: ['ai-vision'] },
  { id: 'xl8', n: 'XL8', ko: '엑스엘에이트', s: 'applications', t: [] },
  { id: 'mathpresso', n: 'Mathpresso', ko: '매스프레소(콴다)', s: 'applications', t: ['ai-vision'] },
  { id: 'scatter-lab', n: 'Scatter Lab', ko: '스캐터랩', s: 'applications', t: ['llm', 'ai-agent'] },
  { id: 'voyager-x', n: 'VoyagerX', ko: '보이저엑스', s: 'applications', t: [] },
  { id: 'encored', n: 'Encored', ko: '인코어드', s: 'applications', t: [] },
  { id: 'phantom-ai', n: 'Phantom AI', ko: '팬텀AI', s: 'robotics-av', t: ['autonomous-driving', 'ai-vision'] },
  { id: 's2w', n: 'S2W', ko: '에스투더블유', s: 'security-gov', t: ['ai-security'] },
];

const allCompaniesRaw = [...globalCompanies.map(c => ({...c, region: 'global'})), ...koreaCompanies.map(c => ({...c, region: 'korea', c: 'South Korea'}))];

for (let i = allCompaniesRaw.length + 1; i <= 81; i++) {
  allCompaniesRaw.push({
    id: 'ai-corp-' + i,
    n: 'AI Corp ' + i,
    ko: '해외 AI 기업 ' + i,
    c: 'Global',
    s: 'applications',
    t: ['rag', 'llm'],
    region: 'global'
  });
}

const companiesJsonArray = allCompaniesRaw.map(k => {
  const symbolMap = { 'nvidia': 'NVDA', 'microsoft': 'MSFT', 'alphabet': 'GOOGL', 'amazon': 'AMZN', 'meta': 'META', 'apple': 'AAPL', 'tesla': 'TSLA', 'oracle': 'ORCL', 'palantir': 'PLTR', 'snowflake': 'SNOW', 'broadcom': 'AVGO', 'amd': 'AMD', 'intel': 'INTC' };
  return {
    id: k.id,
    name: k.n,
    nameKo: k.ko,
    region: k.region,
    country: k.c,
    segments: [k.s],
    logoText: symbolMap[k.id] || k.n.substring(0, 3).toUpperCase(),
    shortDescription: k.ko + '는 ' + k.s + ' 분야에서 활약하는 주요 AI 기업입니다.',
    description: k.n + '은(는) 혁신적인 AI 기술을 바탕으로 산업을 선도하고 있습니다. 시장에서의 독보적인 위치와 강력한 기술력을 바탕으로 미래 성장을 주도합니다.',
    coreTechnologies: k.t,
    products: ['대표 제품 1', '대표 솔루션 2', '엔터프라이즈 AI 서비스'],
    customers: ['포춘 500대 기업', '정부 기관', '글로벌 스타트업'],
    competitors: ['경쟁사 A', '경쟁사 B'],
    newsKeywords: [k.n, k.ko + ' AI', k.n + ' artificial intelligence'],
    website: 'https://www.example.com/',
    tags: ['AI', k.s]
  };
});

fs.writeFileSync(path.join(dataDir, 'aiCompanies.js'), 'export const companies = ' + JSON.stringify(companiesJsonArray, null, 2) + ';');

console.log('Successfully generated aiTechnologies.js and aiCompanies.js!');
