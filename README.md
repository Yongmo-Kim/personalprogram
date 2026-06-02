# Personal Program

React/Vite 기반 개인 생활 대시보드입니다.

## 주요 기능

- 일정표
- 취업 공고
- 세계 뉴스
- 반도체 인텔리전스
- 방위산업 인텔리전스

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:5173
```

## 친구 PC에서 실행

```bash
git clone https://github.com/Yongmo-Kim/personalprogram.git
cd personalprogram
npm install
npm run dev
```

## 환경 변수

실제 채용 API, AI 요약 기능을 사용하려면 `.env.example`을 복사해서 `.env`를 만들고 키를 입력합니다.

```bash
cp .env.example .env
```

Windows PowerShell에서는:

```powershell
Copy-Item .env.example .env
```

사용 가능한 환경 변수:

```env
SARAMIN_ACCESS_KEY=
PUBLIC_RECRUITMENT_SERVICE_KEY=
PUBLIC_DATA_SERVICE_KEY=
DATA_GO_KR_SERVICE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

## 빌드

```bash
npm run build
```

## 주의

`.env`, `node_modules`, `dist`는 GitHub에 올리지 않습니다.
