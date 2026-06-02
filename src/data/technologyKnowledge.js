const CATEGORY_KNOWLEDGE = {
  memory: {
    visualType: 'memory-cell',
    coreIdea: '데이터를 전하, 셀 상태, 적층 구조 같은 물리적 상태로 저장하고 빠르게 읽고 쓰는 기술군이다.',
    analogy: '도서관 책장처럼 많은 정보를 작은 공간에 넣되, 필요한 책을 빠르게 꺼낼 수 있게 주소 체계를 촘촘히 만든 것과 비슷하다.',
    howItWorks: [
      '셀 배열에 데이터를 저장한다.',
      '워드라인과 비트라인으로 원하는 위치를 선택한다.',
      '센스 앰프나 컨트롤러가 미세한 전기적 차이를 읽어 0과 1로 해석한다.',
      '성능은 대역폭, 지연시간, 전력, 저장 밀도의 균형으로 결정된다.',
    ],
    keyMetrics: ['대역폭', '지연시간', '용량', '전력 효율', '수율'],
    whereUsed: ['AI 서버', '스마트폰', 'PC', 'SSD', '데이터센터'],
  },
  foundry: {
    visualType: 'transistor',
    coreIdea: '회로 설계를 실제 실리콘 위에 트랜지스터와 배선 구조로 만들어내는 제조 공정 기술군이다.',
    analogy: '설계도만 있는 건물을 실제 도시 위에 짓는 과정과 비슷하다. 미세 공정일수록 도로와 건물 사이 간격이 극도로 좁아진다.',
    howItWorks: [
      '웨이퍼 위에 산화막, 금속막, 절연막 등을 얇게 형성한다.',
      '노광과 식각으로 회로 패턴을 반복해서 새긴다.',
      '트랜지스터와 배선을 여러 층으로 연결한다.',
      '검사와 수율 개선을 거쳐 칩을 생산한다.',
    ],
    keyMetrics: ['공정 노드', '트랜지스터 밀도', '전력 효율', '성능', '수율'],
    whereUsed: ['모바일 AP', 'GPU', 'CPU', 'AI 가속기', '자동차 반도체'],
  },
  equipment: {
    visualType: 'wafer-process',
    coreIdea: '웨이퍼에 회로를 새기고, 막을 입히고, 깎고, 검사하는 데 필요한 장비와 공정 기술이다.',
    analogy: '초미세 공장을 움직이는 정밀 기계 세트다. 각 장비는 그림 그리기, 깎기, 코팅, 검사 같은 역할을 맡는다.',
    howItWorks: [
      '웨이퍼를 장비 안으로 투입한다.',
      '공정 조건을 나노미터 단위로 제어한다.',
      '막 형성, 패턴 전사, 식각, 세정, 검사 단계를 반복한다.',
      '결과 데이터를 분석해 공정 편차를 줄인다.',
    ],
    keyMetrics: ['처리량', '균일도', '결함률', '정렬 정확도', '가동률'],
    whereUsed: ['전공정 FAB', '후공정 라인', '검사 공정', '소재 공정'],
  },
  osat: {
    visualType: 'packaging',
    coreIdea: '완성된 칩을 외부와 연결하고 보호하며, 여러 칩을 하나의 시스템처럼 묶는 후공정 기술군이다.',
    analogy: '엔진 자체가 칩이라면 패키징은 엔진을 차체, 배선, 냉각 구조와 연결해 실제로 달릴 수 있게 만드는 작업이다.',
    howItWorks: [
      '웨이퍼에서 칩을 분리한다.',
      '칩을 기판이나 인터포저 위에 올린다.',
      '범프, 와이어, TSV 등으로 전기적 연결을 만든다.',
      '봉지, 테스트, 신뢰성 검사를 거쳐 제품화한다.',
    ],
    keyMetrics: ['I/O 밀도', '열 저항', '패키지 두께', '대역폭', '테스트 수율'],
    whereUsed: ['HBM', 'GPU 패키지', '모바일 AP', '전장용 반도체', 'SiP'],
  },
  fabless: {
    visualType: 'design-flow',
    coreIdea: '칩을 직접 제조하지 않고 구조, 회로, 아키텍처를 설계해 파운드리에 생산을 맡기는 설계 중심 기술군이다.',
    analogy: '공장을 직접 운영하지 않는 건축 설계사무소와 비슷하다. 설계 품질과 생태계 활용 능력이 경쟁력이다.',
    howItWorks: [
      '시장 요구에 맞는 칩 아키텍처를 정의한다.',
      'RTL, 회로, 물리 설계를 진행한다.',
      '시뮬레이션과 검증으로 오류를 줄인다.',
      '파운드리 PDK에 맞춰 테이프아웃한다.',
    ],
    keyMetrics: ['성능/전력/면적', '검증 완성도', '테이프아웃 성공률', '생태계 호환성'],
    whereUsed: ['GPU', '모바일 AP', '통신칩', '차량용 SoC', 'AI 칩'],
  },
  eda: {
    visualType: 'design-flow',
    coreIdea: '반도체 설계, 검증, 배치배선, 전력 분석을 자동화하는 소프트웨어 기술군이다.',
    analogy: '수십억 개 부품이 들어간 도시를 자동으로 설계하고 교통 체증, 전력, 안전 문제까지 검사하는 도구다.',
    howItWorks: [
      '설계자가 기능 요구사항을 RTL이나 회로로 표현한다.',
      '합성, 배치, 배선, 타이밍 분석을 수행한다.',
      '검증 도구가 논리 오류와 물리 규칙 위반을 찾는다.',
      '제조 가능한 데이터로 변환해 파운드리로 넘긴다.',
    ],
    keyMetrics: ['타이밍 수렴', '전력 분석', '검증 커버리지', '설계 생산성'],
    whereUsed: ['팹리스 설계', '파운드리 PDK', 'IP 검증', '첨단 노드 설계'],
  },
  ip: {
    visualType: 'ip-block',
    coreIdea: '이미 검증된 회로 블록을 재사용해 칩 개발 시간을 줄이는 설계 자산 기술군이다.',
    analogy: '건물을 지을 때 엘리베이터, 배관, 전기 설비를 매번 새로 발명하지 않고 검증된 모듈을 사서 쓰는 것과 비슷하다.',
    howItWorks: [
      'IP 업체가 특정 기능 회로를 설계하고 검증한다.',
      '칩 설계사는 라이선스를 받아 SoC 안에 통합한다.',
      '인터페이스, 클럭, 전력 조건을 맞춘다.',
      '검증 후 파운드리 공정에 맞게 구현한다.',
    ],
    keyMetrics: ['성능', '면적', '전력', '호환성', '검증 이력'],
    whereUsed: ['CPU 코어', 'GPU 코어', '메모리 컨트롤러', 'SerDes', 'PCIe/USB'],
  },
  'ai-chip': {
    visualType: 'ai-accelerator',
    coreIdea: '행렬 연산과 병렬 처리를 빠르게 수행해 AI 학습과 추론을 가속하는 반도체 기술군이다.',
    analogy: '일반 계산기가 한 명의 계산원이라면 AI 가속기는 같은 계산을 동시에 처리하는 수천 명의 계산원 집단이다.',
    howItWorks: [
      'AI 모델의 행렬 곱셈과 벡터 연산을 병렬화한다.',
      '고대역폭 메모리에서 데이터를 빠르게 공급받는다.',
      '연산 유닛과 메모리 사이 병목을 줄인다.',
      '소프트웨어 스택이 하드웨어를 효율적으로 사용하도록 스케줄링한다.',
    ],
    keyMetrics: ['TOPS/FLOPS', '메모리 대역폭', '전력 효율', '소프트웨어 생태계', '인터커넥트'],
    whereUsed: ['생성형 AI', '데이터센터', '온디바이스 AI', '자율주행', '엣지 추론'],
  },
  materials: {
    visualType: 'materials',
    coreIdea: '웨이퍼, 감광액, 전구체, 식각액, 가스처럼 공정 결과를 좌우하는 핵심 소재 기술군이다.',
    analogy: '반도체 공정의 잉크와 종이, 세정제, 접착제에 해당한다. 같은 장비라도 소재 품질이 다르면 결과가 달라진다.',
    howItWorks: [
      '공정 목적에 맞는 화학적/물리적 특성을 설계한다.',
      '초고순도 상태로 공급해 오염을 줄인다.',
      '노광, 식각, 증착, 세정 공정에서 반응을 제어한다.',
      '미세화될수록 불순물과 입자 관리를 더 엄격하게 한다.',
    ],
    keyMetrics: ['순도', '입자 수', '반응성', '막 품질', '공급 안정성'],
    whereUsed: ['노광', '식각', '증착', '세정', '패키지 기판'],
  },
  semiconductor: {
    visualType: 'system-map',
    coreIdea: '반도체 제품, 공정, 설계, 소재, 장비 생태계를 이해하기 위한 핵심 기술 키워드다.',
    analogy: '반도체 산업 지도를 읽을 때 필요한 좌표다. 특정 회사가 어디서 강한지 판단하는 기준점이 된다.',
    howItWorks: [
      '기술이 속한 가치사슬 위치를 확인한다.',
      '관련 기업과 제품을 연결한다.',
      '뉴스에서 반복되는 키워드와 비교한다.',
      '성능, 원가, 수율, 공급망 중 무엇에 영향을 주는지 본다.',
    ],
    keyMetrics: ['성능 영향', '원가 영향', '수율 영향', '공급망 중요도'],
    whereUsed: ['기업 분석', '뉴스 해석', '기술 로드맵', '투자 아이디어 정리'],
  },
};

CATEGORY_KNOWLEDGE.idm = CATEGORY_KNOWLEDGE.memory;
CATEGORY_KNOWLEDGE.chipless = CATEGORY_KNOWLEDGE.eda;
CATEGORY_KNOWLEDGE['supply-chain'] = CATEGORY_KNOWLEDGE.equipment;

const TECH_KNOWLEDGE_OVERRIDES = {
  dram: {
    visualType: 'dram-cell',
    coreIdea: 'DRAM은 한 비트를 작은 축전기(capacitor)에 전하가 있느냐 없느냐로 저장하고, 접근 트랜지스터가 그 전하를 읽고 쓰게 해주는 메모리다.',
    analogy: '아주 작은 물컵에 물이 차 있으면 1, 비어 있으면 0으로 보는 방식과 비슷하다. 물이 조금씩 새기 때문에 계속 다시 채워줘야 한다.',
    howItWorks: [
      '워드라인이 켜지면 선택 트랜지스터가 열린다.',
      '축전기에 저장된 전하가 비트라인으로 흘러 미세한 전압 차이를 만든다.',
      '센스 앰프가 그 차이를 증폭해 0 또는 1로 판정한다.',
      '읽는 과정에서 전하가 흐트러지므로 값을 다시 써 넣는다.',
      '전하가 자연스럽게 새기 때문에 주기적인 refresh가 필요하다.',
    ],
    keyMetrics: ['DDR 세대', '동작 속도', '지연시간', '셀 면적', 'refresh 전력'],
    commonMisunderstandings: [
      'DRAM은 전원이 꺼지면 데이터가 사라지는 휘발성 메모리다.',
      '읽기만 해도 셀 상태가 흐트러질 수 있어 재기록이 필요하다.',
      '용량 경쟁은 단순히 칩을 크게 만드는 문제가 아니라 셀을 더 작게 만들고 수율을 유지하는 문제다.',
    ],
    whereUsed: ['PC 메인 메모리', '서버 메모리', '모바일 LPDDR', '그래픽 메모리', 'HBM의 기본 die'],
    learningOrder: ['1T1C 셀', '워드라인/비트라인', '센스 앰프', 'refresh', 'DDR/LPDDR/HBM'],
  },
  hbm: {
    visualType: 'hbm-stack',
    coreIdea: 'HBM은 여러 장의 DRAM die를 수직으로 쌓고 TSV로 관통 연결해 GPU 옆에서 초고속으로 데이터를 공급하는 메모리다.',
    analogy: '넓은 도로 하나 대신 고층 건물 안에 엘리베이터를 수백 개 뚫어 각 층 데이터를 바로 이동시키는 구조다.',
    howItWorks: [
      'DRAM die 여러 장을 얇게 만든다.',
      '각 die에 TSV 수직 배선을 만든다.',
      'die를 적층하고 마이크로 범프로 연결한다.',
      '로직 베이스 die가 신호를 정리한다.',
      'GPU와 인터포저를 통해 넓은 버스로 연결된다.',
    ],
    keyMetrics: ['대역폭', 'stack 높이', '전력/bit', '열 관리', '패키징 수율'],
    commonMisunderstandings: [
      'HBM은 단순히 빠른 DRAM이 아니라 패키징과 TSV 기술이 결합된 시스템이다.',
      'GPU 성능은 연산 유닛뿐 아니라 HBM 공급량과 대역폭에도 크게 좌우된다.',
    ],
    whereUsed: ['NVIDIA AI GPU', 'AMD MI 시리즈', 'AI 서버', 'HPC', '데이터센터 가속기'],
    learningOrder: ['DRAM', 'TSV', '마이크로 범프', '인터포저', 'CoWoS/첨단 패키징'],
  },
  nand: {
    visualType: 'nand-stack',
    coreIdea: 'NAND는 전원이 꺼져도 전하 상태를 유지하는 비휘발성 메모리로, SSD와 스마트폰 저장장치의 핵심이다.',
    analogy: 'DRAM이 임시 메모장이라면 NAND는 책장이다. 속도는 느릴 수 있지만 전원을 꺼도 내용이 남는다.',
    howItWorks: [
      '플로팅 게이트 또는 charge trap에 전하를 저장한다.',
      '셀의 문턱전압 차이로 0과 1 또는 여러 bit 상태를 구분한다.',
      '페이지 단위로 읽고 쓰며 블록 단위로 지운다.',
      '3D NAND는 셀을 수직으로 쌓아 저장 밀도를 높인다.',
    ],
    keyMetrics: ['단수', 'bit/cell', '쓰기 내구성', '읽기 지연시간', '컨트롤러 성능'],
    commonMisunderstandings: [
      'NAND는 DRAM처럼 바이트 단위로 자유롭게 덮어쓰기 어렵다.',
      'TLC/QLC는 용량은 크지만 셀 상태 구분이 어려워 컨트롤러와 오류정정이 중요하다.',
    ],
    whereUsed: ['SSD', '스마트폰 저장장치', 'USB', '메모리카드', '데이터센터 스토리지'],
    learningOrder: ['비휘발성', '셀 문턱전압', '페이지/블록', '3D 적층', 'ECC/컨트롤러'],
  },
  euv: {
    visualType: 'lithography',
    coreIdea: 'EUV는 13.5nm 극자외선으로 웨이퍼에 초미세 회로 패턴을 새기는 노광 기술이다.',
    analogy: '아주 얇은 펜으로 회로 그림을 그리는 작업이다. 펜이 가늘수록 더 촘촘한 회로를 그릴 수 있다.',
    howItWorks: [
      '주석 방울에 레이저를 쏴 EUV 빛을 만든다.',
      'EUV는 렌즈를 통과하기 어려워 거울 반사 광학계를 사용한다.',
      '마스크 패턴을 웨이퍼 위 감광액에 전사한다.',
      '현상과 식각을 거쳐 실제 회로 패턴으로 만든다.',
    ],
    keyMetrics: ['NA', 'overlay', 'throughput', 'defectivity', 'photoresist 성능'],
    commonMisunderstandings: [
      'EUV 장비만 있으면 끝나는 것이 아니라 마스크, 레지스트, 계측, 수율이 함께 따라와야 한다.',
      '모든 공정에 EUV를 쓰는 것이 아니라 비용과 난이도에 따라 DUV와 함께 쓴다.',
    ],
    whereUsed: ['최선단 로직', 'DRAM 미세화', '파운드리 7nm 이하', 'High-NA EUV 로드맵'],
    learningOrder: ['노광', '감광액', '마스크', 'overlay', 'High-NA'],
  },
  gaa: {
    visualType: 'transistor',
    coreIdea: 'GAA는 게이트가 채널을 사방에서 감싸 전류 흐름을 더 강하게 제어하는 차세대 트랜지스터 구조다.',
    analogy: '한쪽에서만 수도꼭지를 조이는 것이 아니라 파이프를 사방에서 감싸 조절하는 구조다.',
    howItWorks: [
      '나노시트 또는 나노와이어 채널을 만든다.',
      '게이트 물질이 채널 주변을 둘러싼다.',
      '누설전류를 줄이고 구동전류를 높인다.',
      '초미세 공정에서 전력 효율과 성능을 개선한다.',
    ],
    keyMetrics: ['게이트 제어력', '누설전류', '구동전류', '전력 효율', '공정 난이도'],
  },
  cowos: {
    visualType: 'packaging',
    coreIdea: 'CoWoS는 GPU와 HBM을 실리콘 인터포저 위에 올려 넓은 배선으로 연결하는 TSMC의 대표적인 2.5D 패키징 기술이다.',
    analogy: '멀리 떨어진 건물들을 좁은 골목이 아니라 거대한 고속도로 기판 위에 붙여 데이터가 막히지 않게 하는 방식이다.',
    howItWorks: [
      '실리콘 인터포저 위에 GPU와 HBM stack을 배치한다.',
      '미세 배선이 GPU와 HBM을 넓은 폭으로 연결한다.',
      '기판과 패키지로 외부 전원/신호를 연결한다.',
      '열과 휨, 수율을 관리하며 최종 테스트한다.',
    ],
    keyMetrics: ['패키지 크기', 'HBM 연결 대역폭', '인터포저 수율', '열 관리', '생산 캐파'],
  },
};

const inferCategory = (tech) => tech?.category || 'semiconductor';

export const getTechnologyKnowledge = (tech) => {
  const base = CATEGORY_KNOWLEDGE[inferCategory(tech)] || CATEGORY_KNOWLEDGE.semiconductor;
  const override = TECH_KNOWLEDGE_OVERRIDES[tech?.id] || {};
  const name = tech?.nameKo || tech?.name || '이 기술';

  return {
    ...base,
    ...override,
    coreIdea: override.coreIdea || `${name}은 ${base.coreIdea}`,
    analogy: override.analogy || base.analogy,
    howItWorks: override.howItWorks || base.howItWorks,
    keyMetrics: override.keyMetrics || base.keyMetrics,
    commonMisunderstandings: override.commonMisunderstandings || [
      '이 기술은 단독으로 쓰이기보다 공정, 설계, 소재, 장비 생태계와 함께 작동한다.',
      '뉴스에서 같은 키워드가 반복되더라도 실제 영향은 관련 기업의 양산 능력과 수율에 따라 달라진다.',
    ],
    whereUsed: override.whereUsed || base.whereUsed,
    learningOrder: override.learningOrder || [
      `${tech?.name || name}의 기본 정의`,
      '관련 공정/제품',
      '주요 기업',
      '성능 지표',
      '최근 뉴스와 로드맵',
    ],
  };
};
