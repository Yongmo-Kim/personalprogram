import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Bot,
  ExternalLink,
  Globe,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Bookmark,
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { summarizeNewsArticle } from '../services/aiNewsService';
import { fetchWorldCategoryNews, WORLD_NEWS_CATEGORIES } from '../services/newsService';

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;
const CATEGORY_ARTICLE_LIMIT = 50;
const ALL_ARTICLE_LIMIT = 300;

const toneClass = {
  red: 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-200',
  blue: 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-200',
  sky: 'border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-200',
  violet: 'border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-200',
  emerald: 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-200',
  amber: 'border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-200',
  cyan: 'border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-200',
  rose: 'border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-200',
  indigo: 'border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-200',
  orange: 'border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-200',
  teal: 'border-teal-200 dark:border-teal-500/30 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-200',
  primary: 'border-primary/20 dark:border-primary/40 bg-primary/5 dark:bg-primary/15 text-primary',
  slate: 'border-slate-200 dark:border-slate-500/30 bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-200',
};

const importanceClass = {
  긴급: 'border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-200',
  중요: 'border-amber-200 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-200',
  참고: 'border-slate-200 dark:border-slate-500/40 bg-slate-100 dark:bg-slate-500/15 text-slate-600 dark:text-slate-200',
};

const importanceRank = { 긴급: 3, 중요: 2, 참고: 1 };

const getTimeValue = (item) => Number(item.publishedAtMs || 0);

const formatTime = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const WorldNews = () => {
  const [news, setNews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [importanceFilter, setImportanceFilter] = useState('all');
  const [sortMode, setSortMode] = useState('latest');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [aiQuestion, setAiQuestion] = useState('이 기사 무슨 내용이야? 쉽게 설명해줘.');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiError, setAiError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const intervalRef = useRef(null);

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('newsBookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (article) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.url === article.url || b.title === article.title);
      let updated;
      if (exists) {
        updated = prev.filter((b) => b.url !== article.url && b.title !== article.title);
      } else {
        updated = [...prev, { ...article, bookmarkedAt: Date.now() }];
      }
      localStorage.setItem('newsBookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError('');

    if (activeCategory === 'bookmarks') {
      try {
        const saved = localStorage.getItem('newsBookmarks');
        setNews(saved ? JSON.parse(saved) : []);
        setLastUpdated(new Date());
      } catch (err) {
        setNews([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const data = await fetchWorldCategoryNews(activeCategory, {
        strict: true,
        limit: activeCategory === 'all' ? ALL_ARTICLE_LIMIT : CATEGORY_ARTICLE_LIMIT,
      });
      setNews(data);
      setLastUpdated(new Date());
    } catch (err) {
      setNews([]);
      setError(err.message || '실제 세계뉴스 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    if (autoRefresh && activeCategory !== 'bookmarks') {
      intervalRef.current = setInterval(loadNews, AUTO_REFRESH_INTERVAL);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, loadNews, activeCategory]);

  const filteredNews = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return news
      .filter((item) => (importanceFilter === 'all' ? true : item.importance === importanceFilter))
      .filter((item) => {
        if (!query) return true;
        return `${item.title || ''} ${item.summary || ''} ${item.source || ''} ${item.region || ''}`.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        if (sortMode === 'importance') {
          const rankGap = (importanceRank[b.importance] || 0) - (importanceRank[a.importance] || 0);
          return rankGap || getTimeValue(b) - getTimeValue(a);
        }
        return getTimeValue(b) - getTimeValue(a);
      });
  }, [importanceFilter, news, searchText, sortMode]);

  const urgentNews = filteredNews.filter((item) => item.importance === '긴급');
  const importantNews = filteredNews.filter((item) => item.importance === '중요');
  const coreIssues = filteredNews.filter((item) => item.importance !== '참고').slice(0, 5);

  const runAiSummary = async (article, question = aiQuestion) => {
    setSelectedArticle(article);
    setAiLoading(true);
    setAiError('');
    setAiAnswer('');
    try {
      const answer = await summarizeNewsArticle({ article, question });
      setAiAnswer(answer);
    } catch (err) {
      setAiError(err.message || 'AI 요약을 사용할 수 없습니다. API 연결을 확인해주세요.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-primary/15 dark:border-primary/25 bg-primary/5 dark:bg-primary/10 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Globe size={26} />
              <span className="text-sm font-semibold">Global Intelligence</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-text">세계 뉴스</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textMuted">
              Google News RSS에서 2026년 최신 실제 기사만 가져오고, 각 분류는 최대 50개 기사까지 표시합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {lastUpdated && <span className="text-sm text-textMuted">마지막 업데이트: {formatTime(lastUpdated)}</span>}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-textMuted">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-surface accent-primary"
              />
              5분 자동 갱신
            </label>
            <button
              onClick={loadNews}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:bg-border disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            { icon: Globe, label: '표시 기사', value: `${filteredNews.length}개` },
            { icon: ShieldAlert, label: '긴급 속보', value: `${urgentNews.length}개` },
            { icon: TrendingUp, label: '중요 뉴스', value: `${importantNews.length}개` },
            { icon: Sparkles, label: '관심 연결', value: `${filteredNews.filter((item) => item.interestTags?.length).length}개` },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border/70 bg-background/70 p-3">
              <div className="flex items-center gap-2 text-textMuted">
                <item.icon size={16} />
                <span className="text-xs">{item.label}</span>
              </div>
              <p className="mt-1 text-xl font-bold text-text">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('bookmarks')}
          className={`shrink-0 rounded-lg border px-3 py-2 text-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeCategory === 'bookmarks'
              ? 'border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-200 font-semibold'
              : 'border-border bg-surface text-textMuted hover:border-primary/50 hover:text-text'
          }`}
        >
          <Bookmark size={14} className={activeCategory === 'bookmarks' ? 'text-amber-500 fill-amber-500' : 'text-textMuted'} />
          북마크 ({bookmarks.length})
        </button>

        {WORLD_NEWS_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-sm transition-colors cursor-pointer ${
              activeCategory === category.id
                ? toneClass[category.tone] || toneClass.slate
                : 'border-border bg-surface text-textMuted hover:border-primary/50 hover:text-text'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-text"
              placeholder="검색어 입력: Nvidia, oil, defense, Korea..."
            />
          </label>
          <select
            value={importanceFilter}
            onChange={(e) => setImportanceFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-text"
          >
            <option value="all">전체 중요도</option>
            <option value="긴급">긴급</option>
            <option value="중요">중요</option>
            <option value="참고">참고</option>
          </select>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-text"
          >
            <option value="latest">최신순</option>
            <option value="importance">중요도순</option>
          </select>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        {coreIssues.length > 0 && (
          <Card>
            <h2 className="mb-3 text-lg font-bold text-text">오늘의 핵심 이슈 5개</h2>
            <div className="grid gap-3 lg:grid-cols-5">
              {coreIssues.map((item) => (
                <a
                  key={`core-${item.id}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/50"
                >
                  <span className={`rounded border px-2 py-0.5 text-[11px] ${importanceClass[item.importance] || importanceClass.참고}`}>
                    {item.importance}
                  </span>
                  <p className="mt-2 line-clamp-3 text-sm font-bold text-text">{item.title}</p>
                  <p className="mt-2 text-xs text-textMuted">{item.source}</p>
                </a>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Bot size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-text">AI 기사 요약</h2>
          </div>
          {selectedArticle ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="line-clamp-2 text-sm font-bold text-text">{selectedArticle.title}</p>
                <p className="mt-1 text-xs text-textMuted">{selectedArticle.source} · {selectedArticle.date}</p>
              </div>
              <textarea
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                placeholder="예: 이 기사 반도체에 영향 있어?"
              />
              <button
                onClick={() => runAiSummary(selectedArticle)}
                disabled={aiLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                <MessageSquare size={15} />
                {aiLoading ? 'AI 분석 중' : '질문하기'}
              </button>
              {aiError && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
                  {aiError}
                </div>
              )}
              {aiAnswer && (
                <div className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm leading-relaxed text-textMuted">
                  {aiAnswer}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-textMuted">
              기사 카드의 AI 요약 버튼을 누르면 이곳에서 질문할 수 있습니다. API가 연결되어 있지 않으면 가짜 답변을 만들지 않고 연결 필요 메시지를 보여줍니다.
            </p>
          )}
        </Card>
      </section>

      {loading && news.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
          <RefreshCw className="mb-3 h-8 w-8 animate-spin" />
          <p>실제 세계뉴스를 불러오는 중입니다.</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-6 w-6 text-red-300" />
            <div>
              <p className="font-bold text-red-200">외부 뉴스 연결 실패</p>
              <p className="mt-1 text-sm text-red-100/80">{error}</p>
              <p className="mt-2 text-xs text-red-100/70">
                이 페이지는 실제 기사만 표시하도록 설정되어 있어 연결 실패 시 샘플 뉴스를 보여주지 않습니다.
              </p>
              <button
                onClick={loadNews}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && filteredNews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
          <Globe className="mb-3 h-8 w-8" />
          <p>현재 필터 조건에 맞는 실제 기사가 없습니다.</p>
        </div>
      )}

      {!error && filteredNews.length > 0 && (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredNews.map((item, index) => (
            <Card key={item.id ?? index}>
              <div className="flex h-full flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded border px-2 py-0.5 text-xs ${importanceClass[item.importance] || importanceClass.참고}`}>
                      {item.importance}
                    </span>
                    <span className={`rounded border px-2 py-0.5 text-xs ${toneClass[item.tone] || toneClass.slate}`}>
                      {item.category}
                    </span>
                    {item.region && (
                      <span className="rounded border border-border bg-background px-2 py-0.5 text-xs text-textMuted">
                        {item.region}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(item)}
                      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs transition-colors cursor-pointer ${
                        bookmarks.some((b) => b.url === item.url || b.title === item.title)
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20'
                          : 'border-border bg-background text-textMuted hover:text-text hover:bg-surface'
                      }`}
                      title="북마크"
                    >
                      <Bookmark size={13} fill={bookmarks.some((b) => b.url === item.url || b.title === item.title) ? 'currentColor' : 'none'} className={bookmarks.some((b) => b.url === item.url || b.title === item.title) ? 'text-amber-500' : ''} />
                      저장
                    </button>
                    <button
                      onClick={() => runAiSummary(item)}
                      className="inline-flex items-center gap-1 rounded border border-primary/40 bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/15 cursor-pointer"
                    >
                      <Bot size={13} />
                      AI 요약
                    </button>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        원문
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>

                <h2 className="text-lg font-bold leading-snug text-text">{item.title}</h2>

                <div className="flex flex-wrap items-center gap-2 text-sm text-textMuted">
                  {item.source && <span>{item.source}</span>}
                  {item.source && item.date && <span>·</span>}
                  {item.date && <span>{item.date}</span>}
                </div>

                {item.summary && <p className="line-clamp-3 leading-relaxed text-textMuted">{item.summary}</p>}

                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  {(item.interestTags?.length ? item.interestTags : item.keywords || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorldNews;
