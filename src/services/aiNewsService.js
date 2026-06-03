import { fetchRssNews, removeDuplicates } from './newsService';

const DEFAULT_AI_NEWS_ENDPOINT = '/api/news-ai-summary';

export const fetchAiNews = async () => {
  const query = 'artificial intelligence OR AI OR LLM OR OpenAI OR NVIDIA OR Anthropic OR Google DeepMind';
  const news = await fetchRssNews(query, { domain: 'ai' });
  return removeDuplicates(news).slice(0, 20);
};

export const fetchAiCompanyNews = async (company) => {
  if (!company) return [];
  const keywords = company.newsKeywords?.length
    ? company.newsKeywords.join(' OR ')
    : `${company.nameKo || company.name} OR ${company.name} AI`;

  const news = await fetchRssNews(keywords, {
    domain: 'ai',
    companyId: company.id,
    companyName: company.nameKo || company.name,
    segment: company.segments?.[0],
  });
  return removeDuplicates(news).slice(0, 15);
};

export const fetchAiTechnologyNews = async (technology) => {
  if (!technology) return [];
  const keywords = technology.keywords?.length
    ? technology.keywords.join(' OR ')
    : `${technology.name} artificial intelligence`;

  const news = await fetchRssNews(keywords, {
    domain: 'ai',
    technologies: [technology.id],
    segment: technology.category,
  });
  return removeDuplicates(news).slice(0, 15);
};

const buildPrompt = (article, question) => `
너는 세계뉴스를 한국어로 분석하는 개인 인텔리전스 보조원이다.
아래 기사 정보 안에서만 판단하고, 기사 정보만으로 알 수 없는 내용은 추측하지 말고 "기사 정보만으로는 판단하기 어렵다"고 말해라.

[기사 정보]
제목: ${article.title || ''}
언론사: ${article.source || ''}
발행 시간: ${article.date || article.publishedAt || ''}
카테고리: ${article.category || ''}
지역: ${article.region || ''}
중요도: ${article.importance || ''}
요약 원문: ${article.summary || ''}
원문 URL: ${article.url || ''}

[사용자 질문]
${question || '이 기사 무슨 내용인지 쉽게 설명해줘.'}

[답변 형식]
1. 한 줄 요약
2. 핵심 내용 3줄
3. 왜 중요한가
4. 반도체 영향
5. 방위산업 영향
6. 경제 영향
7. 한국에 미칠 수 있는 영향
8. 내가 지금 알아야 할 포인트
`;

export const summarizeNewsArticle = async ({ article, question }) => {
  const endpoint = import.meta.env.VITE_AI_NEWS_SUMMARY_ENDPOINT || DEFAULT_AI_NEWS_ENDPOINT;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      article,
      question,
      prompt: buildPrompt(article, question),
    }),
  });

  if (!response.ok) {
    throw new Error('AI 요약 API가 연결되어 있지 않습니다. 서버 API 또는 VITE_AI_NEWS_SUMMARY_ENDPOINT 설정이 필요합니다.');
  }

  const data = await response.json();
  const answer = data.answer || data.summary || data.text || data.result;
  if (!answer) {
    throw new Error('AI 요약 API 응답에서 답변을 찾지 못했습니다.');
  }

  return answer;
};
