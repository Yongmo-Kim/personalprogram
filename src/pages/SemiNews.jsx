import { useState, useEffect, useCallback, useRef } from 'react';
import { Cpu, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { fetchSemiNews } from '../services/newsService';
import { Card } from '../components/UI/Card';

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

export const SemiNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef(null);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSemiNews();
      setNews(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || '뉴스를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(loadNews, AUTO_REFRESH_INTERVAL);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, loadNews]);

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-text">반도체 뉴스</h1>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-textMuted">
              마지막 업데이트: {formatTime(lastUpdated)}
            </span>
          )}

          <label className="flex cursor-pointer items-center gap-2 text-sm text-textMuted">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-surface accent-primary"
            />
            자동 새로고침
          </label>

          <button
            onClick={loadNews}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:bg-border disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && news.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
          <RefreshCw className="mb-3 h-8 w-8 animate-spin" />
          <p>뉴스를 불러오는 중...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 py-12">
          <AlertCircle className="mb-3 h-8 w-8 text-red-400" />
          <p className="mb-4 text-red-300">{error}</p>
          <button
            onClick={loadNews}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && news.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
          <Cpu className="mb-3 h-8 w-8" />
          <p>뉴스가 없습니다</p>
        </div>
      )}

      {/* News List */}
      {!error && news.length > 0 && (
        <div className="grid gap-4">
          {news.map((item, index) => (
            <Card key={item.id ?? index}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-text">{item.title}</h2>
                  {item.category && (
                    <span className="shrink-0 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                      {item.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-textMuted">
                  {item.source && <span>{item.source}</span>}
                  {item.source && item.date && <span>·</span>}
                  {item.date && <span>{item.date}</span>}
                </div>

                {item.summary && (
                  <p className="leading-relaxed text-textMuted">{item.summary}</p>
                )}

                {item.url && (
                  <div className="pt-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      원문 보기
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SemiNews;
