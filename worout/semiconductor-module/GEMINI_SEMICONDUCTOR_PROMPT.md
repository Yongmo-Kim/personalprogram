# Gemini 작업 지시문: 반도체 모듈 고도화

## 핵심 목표

현재 앱의 `반도체` 메뉴는 단순 뉴스 목록이 아니라, 사용자가 반도체 산업을 회사별/지역별/산업분류별/기술별로 탐색할 수 있는 전문 정보 모듈이 되어야 한다.

뉴스는 가짜 데이터가 아니라 실제 Google News RSS 또는 실제 뉴스 API에서 가져온 데이터를 사용해야 한다.

Mock 데이터는 개발용 fallback으로만 허용한다. 네트워크 실패로 mock 데이터를 보여줘야 한다면 화면에 반드시 `샘플 데이터` 또는 `오프라인 예시 데이터`라고 명확히 표시해야 한다.

## 현재 문제

현재 `src/pages/SemiNews.jsx`는 반도체 뉴스를 단순 리스트로 보여주는 수준이다.

개선해야 할 점:

- 국내/해외 구분이 없다.
- Fabless, OSAT, IDM, Foundry 같은 산업 분류가 없다.
- 회사별 탐색이 없다.
- 회사 상세 설명이 없다.
- 회사별 핵심 기술 설명이 없다.
- 기술별 뉴스 탐색이 없다.
- 뉴스가 회사/기술/분류와 연결되어 있지 않다.
- 디자인이 일반 뉴스 목록 느낌이라 반도체 산업 분석 도구처럼 보이지 않는다.

## 원하는 최종 형태

`반도체` 메뉴는 다음 기능을 가진다.

1. 반도체 메인 대시보드
2. 국내/해외 선택
3. 산업 분류 선택
4. 회사 목록
5. 회사 상세 페이지
6. 회사별 실제 뉴스
7. 기술 설명
8. 기술별 실제 뉴스
9. 관심 기업 watchlist
10. 마지막 업데이트 시간
11. 자동 새로고침

## 라우팅 구조

기존 `/semi-news` 경로는 깨지면 안 된다.

가능하면 다음 구조로 바꿔라.

- `/semi-news`: 기존 링크 호환용. `/semiconductor`로 redirect하거나 같은 화면을 보여준다.
- `/semiconductor`: 반도체 메인 대시보드
- `/semiconductor/:region`: 국내/해외 기업 목록
- `/semiconductor/:region/:segment`: 지역 + 산업분류별 회사 목록
- `/semiconductor/:region/:segment/:companyId`: 회사 상세 페이지
- `/semiconductor/technology/:technologyId`: 기술 상세 페이지

## 지역 분류

region 값:

- `korea`: 국내
- `global`: 해외

## 산업 분류

segment 값:

- `fabless`: 설계 전문 기업
- `foundry`: 위탁생산/파운드리
- `idm`: 설계와 제조를 함께 하는 종합 반도체 기업
- `memory`: 메모리 반도체
- `osat`: 패키징/테스트
- `equipment`: 반도체 장비
- `materials`: 소재
- `eda`: 설계 자동화 소프트웨어
- `ip`: 반도체 IP
- `ai-chip`: AI 반도체

## 회사 데이터 구조

`src/data/semiconductorCompanies.js` 파일을 만들어라.

회사 데이터는 다음 형태로 관리한다.

```js
{
  id: 'samsung-electronics',
  name: 'Samsung Electronics',
  nameKo: '삼성전자',
  region: 'korea',
  country: 'South Korea',
  segments: ['memory', 'foundry', 'idm'],
  logoText: 'SEC',
  shortDescription: '메모리와 파운드리 사업을 모두 가진 종합 반도체 기업',
  description: '삼성전자는 DRAM, NAND, HBM 등 메모리 반도체와 첨단 파운드리 공정을 함께 운영하는 글로벌 종합 반도체 기업이다.',
  coreTechnologies: ['hbm', 'dram', 'nand', 'gaa', 'euv', 'advanced-packaging'],
  products: ['DRAM', 'NAND Flash', 'HBM', 'Mobile SoC', 'Foundry Services'],
  customers: ['AI 서버', '모바일', '데이터센터', 'PC', '자동차'],
  competitors: ['SK hynix', 'Micron', 'TSMC', 'Intel'],
  newsKeywords: ['삼성전자 반도체', 'Samsung semiconductor', 'Samsung HBM', 'Samsung foundry'],
  website: 'https://www.samsung.com/semiconductor/',
  tags: ['HBM', 'DRAM', 'NAND', 'Foundry', 'GAA']
}
```

## 넣어야 할 국내 기업

최소한 다음 기업을 넣어라.

- 삼성전자: `memory`, `foundry`, `idm`
- SK하이닉스: `memory`
- DB하이텍: `foundry`
- LX세미콘: `fabless`
- 한미반도체: `equipment`
- 리노공업: `equipment`
- 하나마이크론: `osat`
- SFA반도체: `osat`
- 원익IPS: `equipment`
- 솔브레인: `materials`

## 넣어야 할 해외 기업

최소한 다음 기업을 넣어라.

- NVIDIA: `fabless`, `ai-chip`
- AMD: `fabless`
- Qualcomm: `fabless`
- Broadcom: `fabless`
- TSMC: `foundry`
- Intel: `idm`, `foundry`
- Micron: `memory`
- ASML: `equipment`
- Applied Materials: `equipment`
- Lam Research: `equipment`
- KLA: `equipment`
- Synopsys: `eda`
- Cadence: `eda`
- Arm: `ip`
- ASE Technology: `osat`
- Amkor: `osat`

## 기술 데이터 구조

`src/data/semiconductorTechnologies.js` 파일을 만들어라.

기술 데이터는 다음 형태로 관리한다.

```js
{
  id: 'hbm',
  name: 'HBM',
  nameKo: '고대역폭 메모리',
  category: 'memory',
  difficulty: 'intermediate',
  shortDescription: 'AI GPU와 고성능 컴퓨팅에 필요한 고대역폭 메모리',
  description: 'HBM은 여러 DRAM die를 수직으로 적층하고 TSV로 연결하여 기존 메모리보다 훨씬 높은 대역폭을 제공하는 메모리 기술이다.',
  whyImportant: 'AI 학습/추론 서버에서 GPU 성능을 제대로 활용하기 위한 핵심 부품이다.',
  relatedCompanies: ['samsung-electronics', 'sk-hynix', 'micron', 'nvidia'],
  relatedSegments: ['memory', 'ai-chip', 'osat'],
  keywords: ['HBM', 'HBM3E', 'HBM4', 'high bandwidth memory']
}
```

## 넣어야 할 기술

최소한 다음 기술을 넣어라.

- HBM
- DRAM
- NAND
- EUV
- DUV
- GAA
- FinFET
- 2nm process
- 3nm process
- CoWoS
- FOWLP
- Advanced Packaging
- Chiplet
- Interposer
- TSV
- EDA
- IP Core
- AI Accelerator
- GPU
- NPU
- Foundry PDK
- Yield
- Lithography
- Etching
- Deposition

## 회사 상세 페이지

회사 상세 페이지에는 다음 탭을 만들어라.

1. 개요
2. 핵심 기술
3. 제품/사업
4. 경쟁사
5. 관련 뉴스
6. 개인 메모

### 개요 탭

보여줄 내용:

- 회사명
- 국가
- 국내/해외
- 산업 분류
- 짧은 설명
- 상세 설명
- 공식 웹사이트
- 핵심 태그

### 핵심 기술 탭

회사의 `coreTechnologies`를 기반으로 기술 카드를 보여줘라.

각 기술 카드는 다음을 보여준다.

- 기술명
- 한글명
- 짧은 설명
- 왜 중요한지
- 관련 회사
- 관련 뉴스 보기 버튼

### 관련 뉴스 탭

회사별 실제 뉴스를 보여줘라.

뉴스 항목에는 다음 정보가 있어야 한다.

- 제목
- 출처
- 발행 시간
- 요약
- 원문 링크
- 관련 회사
- 관련 기술 태그

## 실제 뉴스 통신 요구사항

뉴스는 fake/example 데이터가 아니라 실제 외부 뉴스 소스에서 가져와야 한다.

우선순위:

1. Google News RSS
2. 실제 뉴스 API
3. 백엔드 프록시
4. 개발용 mock fallback

프론트엔드에 API 키를 직접 넣지 마라.

API 키가 필요한 서비스는 나중에 백엔드 프록시나 서버리스 함수에서 처리할 수 있게 구조를 분리해라.

## 뉴스 서비스 함수

`src/services/newsService.js`를 다음 구조로 확장해라.

```js
export async function fetchSemiconductorNews(options)
export async function fetchCompanyNews(company)
export async function fetchSegmentNews(region, segment)
export async function fetchTechnologyNews(technology)
```

각 함수는 실제 Google News RSS 검색 쿼리를 생성해서 뉴스를 가져와야 한다.

## Google News RSS 쿼리 예시

회사별 검색:

- 삼성전자: `삼성전자 반도체 OR Samsung semiconductor OR Samsung HBM`
- SK하이닉스: `SK하이닉스 HBM OR SK hynix memory OR SK hynix semiconductor`
- TSMC: `TSMC foundry OR TSMC 2nm OR TSMC CoWoS`
- NVIDIA: `NVIDIA GPU OR NVIDIA AI chip OR NVIDIA Blackwell`
- ASML: `ASML EUV OR ASML lithography`
- Intel: `Intel foundry OR Intel 18A OR Intel semiconductor`
- AMD: `AMD GPU OR AMD AI chip OR AMD semiconductor`
- Qualcomm: `Qualcomm Snapdragon OR Qualcomm semiconductor`
- Micron: `Micron HBM OR Micron memory`

산업 분류별 검색:

- Fabless: `fabless semiconductor NVIDIA AMD Qualcomm Broadcom`
- Foundry: `semiconductor foundry TSMC Samsung Intel`
- Memory: `HBM DRAM NAND Samsung SK hynix Micron`
- OSAT: `semiconductor packaging OSAT ASE Amkor advanced packaging`
- IDM: `IDM semiconductor Intel Samsung Micron`
- Equipment: `ASML Applied Materials Lam Research KLA semiconductor equipment`
- Materials: `semiconductor materials photoresist wafer gas`
- EDA: `Synopsys Cadence EDA semiconductor design`
- IP: `Arm semiconductor IP core`
- AI Chip: `AI chip GPU NPU accelerator NVIDIA AMD`

기술별 검색:

- HBM: `HBM HBM3E HBM4 memory AI GPU`
- EUV: `EUV lithography ASML semiconductor`
- GAA: `GAA transistor Samsung Intel 2nm`
- CoWoS: `CoWoS TSMC advanced packaging`
- Chiplet: `chiplet advanced packaging semiconductor`

## 뉴스 데이터 구조

모든 뉴스 데이터는 다음 형태로 통일해라.

```js
{
  id,
  title,
  source,
  publishedAt,
  summary,
  url,
  companyId,
  companyName,
  region,
  segment,
  technologies,
  isFallback
}
```

`isFallback`이 true인 경우 실제 뉴스가 아니라는 표시를 UI에 보여줘야 한다.

## 중복 제거

같은 뉴스가 회사별/기술별/분류별 검색에서 중복으로 나올 수 있다.

다음 기준으로 중복 제거해라.

1. url이 같으면 중복
2. url이 없으면 title이 같으면 중복
3. 제목이 매우 비슷한 경우도 가능하면 하나로 합쳐라

## 자동 갱신

뉴스는 실시간 push가 아니라 polling 방식으로 구현해도 된다.

필수:

- 페이지 진입 시 즉시 fetch
- 새로고침 버튼
- 자동 갱신 토글
- 기본 갱신 간격 5분
- 마지막 업데이트 시간 표시
- 로딩 상태 표시
- 실패 상태 표시

## CORS와 백엔드 프록시

Google News RSS를 프론트엔드에서 직접 호출할 때 CORS 문제가 생길 수 있다.

따라서 구조는 다음 중 하나로 준비해라.

1. 임시: rss2json 같은 RSS 변환 API 사용
2. 권장: `/api/news` 같은 백엔드 프록시 endpoint를 준비

백엔드가 아직 없다면 코멘트와 서비스 구조로 확장 가능하게 만들어라.

프론트엔드 코드에 민감한 API 키를 넣으면 안 된다.

## 디자인 방향

반도체 페이지는 일반 뉴스 목록처럼 보이면 안 된다.

목표는 `반도체 산업 지도 + 기업 탐색기 + 기술 사전 + 실시간 뉴스` 느낌이다.

### 반도체 메인 화면

구성:

- 상단: 반도체 인텔리전스 대시보드 제목, 마지막 업데이트 시간
- 왼쪽 또는 상단: 국내/해외 선택
- 산업 분류 카드: Fabless, Foundry, IDM, Memory, OSAT, Equipment, Materials, EDA, IP, AI Chip
- 관심 기업
- 최신 반도체 뉴스
- 오늘의 기술 키워드

### 회사 목록 화면

회사 카드는 다음을 보여줘라.

- 로고 텍스트
- 회사명
- 국가
- 산업 분류
- 핵심 기술 태그
- 짧은 설명
- 관련 뉴스 개수 또는 최신 뉴스 시간

### 회사 상세 화면

회사 상세 화면은 단순 카드 나열이 아니라 정보 구조가 명확해야 한다.

권장 레이아웃:

- 상단: 회사명, 국가, 산업 분류, 공식 사이트
- 왼쪽/상단 탭: 개요/기술/제품/경쟁사/뉴스/메모
- 중앙: 선택 탭 콘텐츠
- 오른쪽 또는 하단: 관련 뉴스, 관련 기술, 경쟁사

모바일에서는 탭과 필터가 상단에 접히도록 해라.

## 색상 방향

현재 앱의 어두운 톤은 유지하되, 분류별 색을 다르게 줘라.

- Foundry: blue
- Fabless: violet
- Memory: emerald
- OSAT: amber
- Equipment: cyan
- Materials: orange
- EDA: rose
- IP: indigo
- AI Chip: fuchsia
- IDM: slate 또는 zinc

## 중요한 디자인 원칙

1. 카드 안에 카드를 중첩하지 마라.
2. 너무 둥근 UI를 줄이고 8px~12px 정도의 절제된 radius를 사용해라.
3. 정보 밀도는 높이되 복잡해 보이지 않게 해라.
4. 뉴스 제목은 목록에서는 1~2줄로 줄이고 상세에서는 전체를 보여줘라.
5. 버튼과 필터는 hover/focus 상태가 명확해야 한다.
6. 모바일 하단 네비게이션은 메뉴가 너무 많으면 더보기 구조로 정리해라.

## 기존 기능 보호

기존 운동, 취업, 학업, 일정표, 세계뉴스 기능은 망가뜨리지 마라.

기존 `/semi-news` 링크도 깨뜨리지 마라.

기존 localStorage key는 가능한 유지해라.

## 코드 품질

작업 후 반드시 다음을 만족해야 한다.

- `npm run lint` 통과
- 사용하지 않는 import 제거
- React 19 기준에서 불필요한 `import React` 제거
- 반복되는 뉴스 UI는 가능하면 공통 컴포넌트로 분리
- 뉴스 service와 반도체 데이터는 역할을 분리
- 실제 외부 뉴스 호출 실패 시 사용자에게 명확한 에러 메시지 표시

## 한 문장 요약

`반도체 뉴스` 페이지를 회사/지역/산업분류/기술 기반으로 탐색하고, 회사별 실제 Google News RSS 뉴스를 실시간 갱신하는 `반도체 인텔리전스 모듈`로 재구성해줘.
